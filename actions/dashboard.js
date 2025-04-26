"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIInsights = async (language) => {
  if (!language || !language.name) {
    throw new Error("Language name is required");
  }

  const prompt = `
    Analyze the endangered language "${language.name}" and provide insights in ONLY the following JSON format without any additional text:
    {
      "learningDifficulty": "string",
      "preservationStatus": "string",
      "availableResources": ["string", ...],
      "activeLearnersCount": number,
      "nativeSpeakersCount": number
    }
  `;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(cleanedText);
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
      include: {
        nativeLanguageRef: {
          select: {
            name: true,
            insight: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get the relevant language name
    const targetLanguage = user.nativeLanguageRef;

    // If no language is set, return null instead of throwing error
    if (!targetLanguage) {
      return null;
    }

    // If insight exists and is not due for update, return it
    if (
      targetLanguage.insight &&
      targetLanguage.insight.nextUpdate > new Date()
    ) {
      return targetLanguage.insight;
    }

    // Generate new insights
    const insights = await generateAIInsights({ name: targetLanguage.name });

    // Upsert the insights
    const languageInsight = await db.languageInsight.upsert({
      where: {
        language: targetLanguage.name,
      },
      create: {
        language: targetLanguage.name,
        userId: user.id,
        learningDifficulty: insights.learningDifficulty,
        preservationStatus: insights.preservationStatus,
        availableResources: insights.availableResources,
        activeLearnersCount: insights.activeLearnersCount,
        nativeSpeakersCount: insights.nativeSpeakersCount,
        lastUpdated: new Date(),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Update weekly
      },
      update: {
        learningDifficulty: insights.learningDifficulty,
        preservationStatus: insights.preservationStatus,
        availableResources: insights.availableResources,
        activeLearnersCount: insights.activeLearnersCount,
        nativeSpeakersCount: insights.nativeSpeakersCount,
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
