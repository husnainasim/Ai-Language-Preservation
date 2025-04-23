"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
// import { generateAIInsights } from "./dashboard";

export async function updateUser(data) {
  // Get the authenticated user's ID from Clerk
  const { userId } = await auth();
  // If no user ID exists, user is not authenticated
  if (!userId) throw new Error("Unauthorized");

  // Find the user in our database using their Clerk ID
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  // If user doesn't exist in our database, throw error
  if (!user) throw new Error("User not found");

  try {
    // Start a transaction to handle both user update and language operations
    const result = await db.$transaction(
      async (tx) => {
        // First check if the native language exists in our database
        let language = await tx.language.findFirst({
          where: {
            name: data.nativeLanguage,
          },
        });

        // If language doesn't exist, create it
        if (!language) {
          language = await tx.language.create({
            data: {
              name: data.nativeLanguage,
              // Add any additional language fields if available
              region: data.region, // if provided in data
            },
          });
        }

        // Update the user with language learning specific fields
        const updatedUser = await tx.user.update({
          where: {
            id: user.id,
          },
          data: {
            name: data.name,
            role: data.role,
            bio: data.bio,
            nativeLanguage: data.nativeLanguage,
            preferredLanguages: data.preferredLanguages,
            learningGoals: data.learningGoals,
            timeZone: data.timeZone,
          },
        });

        // // If user is a learner, create initial progress records for their preferred languages
        // if (data.role === "LEARNER") {
        //   // Get or create basic lessons for each preferred language
        //   for (const langName of data.preferredLanguages) {
        //     let prefLang = await tx.language.findFirst({
        //       where: { name: langName },
        //     });

        //     if (!prefLang) {
        //       prefLang = await tx.language.create({
        //         data: {
        //           name: langName,
        //         },
        //       });
        //     }

        //     // Create initial lesson if none exists
        //     const lesson = await tx.lesson.findFirst({
        //       where: { languageId: prefLang.id },
        //     });

        //     if (!lesson) {
        //       await tx.lesson.create({
        //         data: {
        //           languageId: prefLang.id,
        //           title: `Introduction to ${langName}`,
        //           content: `Basic introduction to ${langName}`,
        //           lessonType: "INTRODUCTION",
        //           flashcards: [],
        //         },
        //       });
        //     }
        //   }
        // }

        return { updatedUser, language };
      },
      {
        timeout: 10000, // 10 second timeout
      }
    );

    revalidatePath("/");
    return { success: true, ...result};
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw new Error("Failed to update profile" + error.message);
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
        name: true,
        bio: true,
      },
    });
    if (!user) throw new Error("User not found");
    return {
      isOnboarded: !!user?.role && !!user?.name,
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
