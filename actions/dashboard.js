"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIInsights = async (language) => {
  if (!language || !language.id) {
    throw new Error("Language ID is required");
  }

  try {
    // Count active learners and native speakers
    const userStats = await db.user.groupBy({
      by: ["role"],
      where: {
        OR: [
          {
            nativeLanguage: {
              equals: language.id,
            },
          },
          {
            preferredLanguages: {
              has: language.id,
            },
          },
        ],
      },
      _count: {
        _all: true,
      },
    });

    const activeLearnersCount =
      userStats.find((stat) => stat.role === "LEARNER")?._count._all ?? 0;
    const nativeSpeakersCount =
      userStats.find((stat) => stat.role === "LINGUIST")?._count._all ?? 0;

    // Create basic insights based on user statistics
    const insights = {
      learningDifficulty: "Medium", // Default value
      preservationStatus: nativeSpeakersCount === 0 ? "Critical" : "Endangered",
      availableResources: {
        audioSamples: 0,
        grammarRules: 0,
        wordLists: 0,
        lessons: 0,
      },
      communityMetrics: {
        activeLearnersCount,
        nativeSpeakersCount,
      },
    };

    return insights;
  } catch (error) {
    console.error("Error generating insights:", error);
    throw error;
  }
};

export async function getLanguageInsights() {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // First get the user with their preferred/native language info
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: {
        id: true,
        nativeLanguage: true,
        preferredLanguages: true,
        languageInsights: {
          include: {
            language: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get the relevant language - either native or first preferred
    const targetLanguageId =
      user.nativeLanguage ||
      (user.preferredLanguages && user.preferredLanguages[0]);

    // If no language is set, return null instead of throwing error
    if (!targetLanguageId) {
      return null;
    }

    // Find existing insight for this language
    const existingInsight = user.languageInsights?.find(
      (insight) => insight.languageId === targetLanguageId
    );

    // If insight exists and is not due for update, return it
    if (existingInsight && existingInsight.nextUpdate > new Date()) {
      return existingInsight;
    }

    // Generate new insights
    const insights = await generateAIInsights({ id: targetLanguageId });

    // Upsert the insights
    const languageInsight = await db.languageInsight.upsert({
      where: {
        languageId: targetLanguageId,
      },
      create: {
        languageId: targetLanguageId,
        userId: user.id,
        learningDifficulty: insights.learningDifficulty,
        preservationStatus: insights.preservationStatus,
        availableResources: insights.availableResources,
        activeLearnersCount: insights.communityMetrics.activeLearnersCount,
        nativeSpeakersCount: insights.communityMetrics.nativeSpeakersCount,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Update weekly
      },
      update: {
        learningDifficulty: insights.learningDifficulty,
        preservationStatus: insights.preservationStatus,
        availableResources: insights.availableResources,
        activeLearnersCount: insights.communityMetrics.activeLearnersCount,
        nativeSpeakersCount: insights.communityMetrics.nativeSpeakersCount,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Update weekly
      },
    });

    return languageInsight;
  } catch (error) {
    console.error("Error in getLanguageInsights:", error);
    throw error;
  }
}
