import { z } from "zod";

export const onboardingSchema = z.object({
  role: z.enum(["LINGUIST", "LEARNER"], {
    required_error: "Please select your role",
  }),

  name: z.string({
    required_error: "Please enter your name",
  }),

  bio: z.string().max(500).optional(),

  nativeLanguage: z.string({
    required_error: "Please select your native language",
  }),
  subdialect: z.string({
    required_error: "Please select your sub-dialect for your native language",
  }),

  preferredLanguages: z
    .string()
    .transform((str) => str.split(",").map((s) => s.trim()))
    .refine((arr) => arr.length > 0, "Select at least one language"),

  expertiseLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "NATIVE"], {
    required_error: "Please select your expertise level",
  }),

  learningGoals: z.string().max(500).optional(),

  timeZone: z.string({
    required_error: "Please select your time zone",
  }),

  // availability: z.record(z.string(), z.array(z.string())).optional(),
});

export const languageSchema = z.object({
  name: z.string().min(1, "Language name is required"),
  description: z.string().optional(),
  region: z.string().optional(),
});

export const lessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required"),
  content: z.string().min(1, "Lesson content is required"),
  lessonType: z.enum(["flashcard", "pronunciation-drill", "story-based"]),
  flashcards: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      hint: z.string().optional(),
    })
  ),
});

export const progressSchema = z.object({
  lessonId: z.string(),
  progress: z.number().min(0).max(100),
});

export const communityMatchSchema = z.object({
  matchedUserId: z.string(),
  matchReason: z.string().optional(),
});

export const audioSampleSchema = z.object({
  url: z.string().url("Invalid audio URL"),
  transcription: z.string().optional(),
  languageId: z.string(),
});

export const grammarRuleSchema = z.object({
  rule: z.string().min(1, "Grammar rule is required"),
  examples: z.array(z.string()).optional(),
  languageId: z.string(),
});

export const wordListSchema = z.object({
  words: z.array(
    z.object({
      word: z.string(),
      definition: z.string(),
      example: z.string().optional(),
    })
  ),
  languageId: z.string(),
});

export const contactSchema = z.object({
  email: z.string().email("Invalid email address"),
  mobile: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

export const entrySchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    description: z.string().min(1, "Description is required"),
    current: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) {
        return false;
      }
      return true;
    },
    {
      message: "End date is required unless this is your current position",
      path: ["endDate"],
    }
  );

export const resumeSchema = z.object({
  contactInfo: contactSchema,
  summary: z.string().min(1, "Professional summary is required"),
  skills: z.string().min(1, "Skills are required"),
  experience: z.array(entrySchema),
  education: z.array(entrySchema),
  projects: z.array(entrySchema),
});

export const coverLetterSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  jobDescription: z.string().min(1, "Job description is required"),
});
