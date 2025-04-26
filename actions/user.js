"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  // Get the authenticated user's ID from Clerk
  const { userId } = await auth();
  // If no user ID exists, user is not authenticated
  if (!userId) throw new Error("Unauthorized");

  // // Input validation
  // if (!data) throw new Error("No data provided");
  // if (data.nativeLanguage && typeof data.nativeLanguage !== "string") {
  //   throw new Error("Invalid native language format");
  // }
  // if (data.preferredLanguages && !Array.isArray(data.preferredLanguages)) {
  //   throw new Error("Preferred languages must be an array");
  // }
  // if (data.role && !["LEARNER", "LINGUIST"].includes(data.role)) {
  //   throw new Error("Invalid role specified");
  // }

  // Find the user in our database using their Clerk ID
 
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    // include: {
    //   languageInsights: true,
    // },
  });

  // If user doesn't exist in our database, throw error
  if (!user) {
    console.error("User not found or database connection error");
    throw new Error(
      "User not found or database connection error. Please check your database connection."
    );
  }

  try {
    // Start a transaction to handle both operations
    const result = await db.$transaction(
      async (tx) => {
        let languageInsight;

        // // Only process language insights if native language is being updated
        // if (
        //   data.nativeLanguage &&
        //   data.nativeLanguage !== user.nativeLanguage
        // ) {
        //   // First verify the language exists
        //   const language = await tx.language.findUnique({
        //     where: {
        //       id: data.nativeLanguage,
        //     },
        //   });

        //   if (!language) {
        //     throw new Error(
        //       `Language with ID ${data.nativeLanguage} not found`
        //     );
        //   }

          // Then check if language insights exist
          languageInsight = await tx.languageInsight.findFirst({
            where: {
              languageId: data.nativeLanguage,
            },
          });

          // If language insights don't exist, generate them
          if (!languageInsight) {
            try {
              const insights = await generateAIInsights({
                id: data.nativeLanguage, // This passes the native language ID to the generateAIInsights function
              });

              if (!insights) {
                throw new Error("Failed to generate language insights");
              }

              languageInsight = await tx.languageInsight.create({
                data: {
                  // languageId: data.nativeLanguage,
                  language: data.language,
                  ...insights,
                  // userId: user.id,
                  // learningDifficulty: insights.learningDifficulty,
                  // preservationStatus: insights.preservationStatus,
                  // availableResources: insights.availableResources,
                  // activeLearnersCount:
                  //   insights.communityMetrics.activeLearnersCount,
                  // nativeSpeakersCount:
                  //   insights.communityMetrics.nativeSpeakersCount,
                  // lastUpdated: new Date(),
                  nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Update weekly
                },
              });
            } catch (insightError) {
              console.error("Error generating insights:", insightError);
              throw new Error(
                `Failed to generate insights: ${insightError.message}`
              );
            }
          }

          // // Delete old language insights if they exist
          // if (user.nativeLanguage && user.languageInsights?.length > 0) {
          //   await tx.languageInsight.deleteMany({
          //     where: {
          //       userId: user.id,
          //       languageId: user.nativeLanguage,
          //     },
          //   });
          // }
        // }

        // Prepare update data with type safety
        const updateData = {
          ...(data.role && { role: data.role }),
          ...(data.nativeLanguage && { nativeLanguage: data.nativeLanguage }),
          ...(data.preferredLanguages && {
            preferredLanguages: data.preferredLanguages,
          }),
          ...(data.learningGoals && { learningGoals: data.learningGoals }),
          ...(data.bio && { bio: data.bio }),
          ...(data.timeZone && { timeZone: data.timeZone }),
          ...(data.availability && { availability: data.availability }),
          updatedAt: new Date(),
        };

        // Now update the user
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: updateData,
          // include: {
          //   languageInsights: true,
          // },
        });

        return { updatedUser, languageInsight };
      },
      {
        timeout: 10000, // 10 seconds
        maxWait: 5000, // 5 seconds max wait for transaction
        isolationLevel: "Serializable", // Ensure data consistency
      }
    );

    revalidatePath("/");
    return result.user;
  } catch (error) {
    console.error("Error updating user:", error);
    if (error.code === "P2002") {
      throw new Error("A unique constraint would be violated.");
    }
    if (error.code === "P2025") {
      throw new Error("Record to update not found.");
    }
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}

export async function getUserOnboardingStatus() {
  // Get the authenticated user's ID from Clerk
  const { userId } = await auth();
  // If no user ID exists, user is not authenticated
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        role: true,
        nativeLanguage: true,
      },
    });
    if (!user) throw new Error("User not found");
    return {
      isOnboarded: !!(user?.role && user?.nativeLanguage), // User needs both role and native language to be considered onboarded
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error.message);
    throw new Error("Failed to check onboarding status");
  }
}

// New function to get user's language learning progress
export async function getUserProgress() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        progressRecords: {
          include: {
            lesson: {
              include: {
                language: true,
              },
            },
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    return user.progressRecords;
  } catch (error) {
    console.error("Error fetching user progress:", error.message);
    throw new Error("Failed to fetch progress");
  }
}

// New function to get user's community matches
export async function getUserMatches() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        communityMatches: {
          include: {
            matchedUser: true,
          },
        },
        communityMatchesAsMatched: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!user) throw new Error("User not found");

    return {
      matches: user.communityMatches,
      matchedBy: user.communityMatchesAsMatched,
    };
  } catch (error) {
    console.error("Error fetching user matches:", error.message);
    throw new Error("Failed to fetch matches");
  }
}

