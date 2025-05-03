// "use server";

// import { db } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// export const generateLanguageInsights = async (languageId) => {
//   const language = await db.language.findUnique({
//     where: { id: languageId },
//     include: {
//       wordLists: true,
//       grammarRules: true,
//       audioSamples: true,
//       lessons: true,
//     },
//   });

//   if (!language) throw new Error("Language not found");

//   // Count active learners and native speakers
//   const userStats = await db.user.groupBy({
//     by: ["role"],
//     where: {
//       OR: [
//         { nativeLanguage: languageId },
//         { preferredLanguages: { has: languageId } },
//       ],
//     },
//     _count: {
//       _all: true,
//     },
//   });

//   const activeLearnersCount =
//     userStats.find((stat) => stat.role === "LEARNER")?._count._all ?? 0;
//   const nativeSpeakersCount =
//     userStats.find((stat) => stat.role === "LINGUIST")?._count._all ?? 0;

//   const prompt = `
//     Analyze the current state of the endangered language "${language.name}" with the following metrics:
//     - ${language.wordLists.length} word lists
//     - ${language.grammarRules.length} grammar rules
//     - ${language.audioSamples.length} audio samples
//     - ${language.lessons.length} lessons
//     - ${activeLearnersCount} active learners
//     - ${nativeSpeakersCount} native speakers
    
//     Provide insights in ONLY the following JSON format without any additional notes:
//     {
//       "learningDifficulty": "High" | "Medium" | "Low",
//       "preservationStatus": "Critical" | "Endangered" | "Vulnerable"
//     }
    
//     IMPORTANT: Return ONLY the JSON. Base the preservationStatus on the number of native speakers and available resources.
//   `;

//   const result = await model.generateContent(prompt);
//   const response = result.response;
//   const aiInsights = JSON.parse(
//     response
//       .text()
//       .replace(/```(?:json)?\n?/g, "")
//       .trim()
//   );

//   // Create or update language insights
//   const languageInsight = await db.languageInsight.upsert({
//     where: {
//       languageId: languageId,
//     },
//     create: {
//       languageId: languageId,
//       learningDifficulty: aiInsights.learningDifficulty,
//       preservationStatus: aiInsights.preservationStatus,
//       availableResources: {
//         audioSamples: language.audioSamples.length,
//         grammarRules: language.grammarRules.length,
//         wordLists: language.wordLists.length,
//         lessons: language.lessons.length,
//       },
//       activeLearnersCount: activeLearnersCount,
//       nativeSpeakersCount: nativeSpeakersCount,
//       nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Update weekly
//     },
//     update: {
//       learningDifficulty: aiInsights.learningDifficulty,
//       preservationStatus: aiInsights.preservationStatus,
//       availableResources: {
//         audioSamples: language.audioSamples.length,
//         grammarRules: language.grammarRules.length,
//         wordLists: language.wordLists.length,
//         lessons: language.lessons.length,
//       },
//       activeLearnersCount: activeLearnersCount,
//       nativeSpeakersCount: nativeSpeakersCount,
//       nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Update weekly
//     },
//   });

//   return languageInsight;
// };

// export async function getLanguageDashboardData(languageId) {
//   const { userId } = await auth();
//   if (!userId) throw new Error("Unauthorized");

//   const user = await db.user.findUnique({
//     where: { clerkUserId: userId },
//   });

//   if (!user) throw new Error("User not found");

//   // Get or generate language insights
//   let languageInsight = await db.languageInsight.findUnique({
//     where: { languageId },
//     include: {
//       language: true,
//     },
//   });

//   // If no insights exist or need update, generate them
//   if (!languageInsight || languageInsight.nextUpdate < new Date()) {
//     languageInsight = await generateLanguageInsights(languageId);
//   }

//   // Get user's progress for this language
//   const userProgress = await db.userProgress.findMany({
//     where: {
//       userId: user.id,
//       lesson: {
//         languageId: languageId,
//       },
//     },
//     include: {
//       lesson: true,
//     },
//   });

//   // Calculate user's personal stats
//   const completedLessons = userProgress.filter(
//     (record) => record.progress >= 1
//   ).length;
//   const totalLessons = await db.lesson.count({
//     where: { languageId },
//   });
//   const personalProgress =
//     totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

//   return {
//     languageInsight,
//     personalStats: {
//       completedLessons,
//       totalLessons,
//       overallProgress: personalProgress,
//       lastActivity: userProgress[0]?.lastActivity || null,
//     },
//     role: user.role,
//   };
// }
