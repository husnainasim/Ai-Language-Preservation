"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIInsights = async (languageName) => {
  if (!languageName) {
    throw new Error("Language name is required");
  }

  const prompt = `
    Analyze the endangered language "${languageName}" and provide insights in ONLY the following JSON format without any additional text:
    {
      "learningDifficulty": "High" | "Medium" | "Low",
      "preservationStatus": "Critical" | "Endangered" | "Vulnerable" | "Stable",
      "availableResources": ["string", ...],
      "activeLearnersCount": integer,         // give me an integer, e.g. 1200
      "nativeSpeakersCount": integer,         // give me an integer, e.g. 800
      "regionalMetrics": [
        {
          "region": "string",
          "speakerCount": number,
          "avgAge": number,
          "youthSpeakerPercentage": number,
          "communitySupport": "High" | "Medium" | "Low"
        }
      ],
      "vitalityTrends": {
        "growthRate": number,
        "topThreats": ["string", "string", "string"],
        "recommendedActions": ["string", "string", "string"],
        "outlook": "Improving" | "Stable" | "Declining"
      }
    }

    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 3 regions in regionalMetrics.
    Growth rate should be a percentage (positive or negative).
    Include exactly 3 threats and 3 recommended actions.
  `;
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
  return JSON.parse(cleanedText);
};

export async function getLanguageInsights() {

    const { userId } = await auth();
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        languageInsight: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // if (!user.nativeLanguage) {
    //   return null; // No native language set yet
    // }

    // If we already have insights and they're not expired, return them
    // if (user.languageInsight && user.languageInsight.nextUpdate > new Date()) {
    //   // Ensure JSON fields are parsed
    //   const insight = {
    //     ...user.languageInsight,
    //     availableResources: Array.isArray(
    //       user.languageInsight.availableResources
    //     )
    //       ? user.languageInsight.availableResources
    //       : JSON.parse(user.languageInsight.availableResources),
    //     regionalMetrics: Array.isArray(user.languageInsight.regionalMetrics)
    //       ? user.languageInsight.regionalMetrics
    //       : JSON.parse(user.languageInsight.regionalMetrics),
    //     vitalityTrends:
    //       typeof user.languageInsight.vitalityTrends === "object"
    //         ? user.languageInsight.vitalityTrends
    //         : JSON.parse(user.languageInsight.vitalityTrends),
    //   };
    //   return insight;
    // }
    if (!user.languageInsight) {
 // Generate new insights
    const insights = await generateAIInsights(user.nativeLanguage);
    // if (!insights) {
    //   throw new Error("Failed to generate insights");
    // }

    // Create new language insight
    const languageInsight = await db.languageInsight.create({
      data: {
        languageId: user.nativeLanguage,
        ...insights,
         nextUpdate: new Date(Date.now() + 7 * 86400000),}
         
        // languageId: user.nativeLanguage,
        // learningDifficulty: insights.learningDifficulty,
        // preservationStatus: insights.preservationStatus,
        // availableResources: insights.availableResources,
        // activeLearnersCount: insights.activeLearnersCount,
      
      // where: { languageId: user.nativeLanguage },
      // create: {
      //   languageId: user.nativeLanguage,
      //   learningDifficulty: insights.learningDifficulty,
      //   preservationStatus: insights.preservationStatus,
      //   availableResources: insights.availableResources,
      // create: {
      //   languageId: user.nativeLanguage,
      //   learningDifficulty: insights.learningDifficulty,
      //   preservationStatus: insights.preservationStatus,
      //   availableResources: insights.availableResources,
      //   activeLearnersCount: insights.activeLearnersCount,
      //   nativeSpeakersCount: insights.nativeSpeakersCount,
      //   regionalMetrics: insights.regionalMetrics,
      //   vitalityTrends: insights.vitalityTrends,
      //   lastUpdated: new Date(),
      //   nextUpdate: new Date(Date.now() + 7 * 86400000),
      // },
      // update: {
      //   learningDifficulty: insights.learningDifficulty,
      //   preservationStatus: insights.preservationStatus,
      //   availableResources: insights.availableResources,
      //   activeLearnersCount: insights.activeLearnersCount,
      //   nativeSpeakersCount: insights.nativeSpeakersCount,
      //   regionalMetrics: insights.regionalMetrics,
      //   vitalityTrends: insights.vitalityTrends,
      //   lastUpdated: new Date(),
      //   nextUpdate: new Date(Date.now() + 7 * 86400000),
      // },
    });
 return languageInsight;
    }
   
    // return languageInsight;
  
    return user.languageInsight;
}
