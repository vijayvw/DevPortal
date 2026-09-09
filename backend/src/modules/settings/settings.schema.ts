import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    portfolioTitle: z.string().max(200).optional(),
    tagline: z.string().max(500).optional(),
    shortDescription: z.string().max(1000).optional(),
    yearsExperience: z.string().max(20).optional(),
    cloudPlatforms: z.string().max(20).optional(),
    technologies: z.string().max(20).optional(),
    aboutGreeting: z.string().max(300).optional(),

    aboutParagraphs: z
      .array(z.string().max(3000))
      .max(20)
      .optional(),

    aboutQuote: z.string().max(1000).optional(),

    aboutGoal: z.string().max(2000).optional(),

    specializations: z
      .array(z.string().max(100))
      .max(100)
      .optional(),

    timelineTitle: z.string().max(200).optional(),

    timelineSubtitle: z.string().max(500).optional(),

    timeline: z
      .array(
        z.object({
          year: z.string().max(100),
          title: z.string().max(300),
          organization: z.string().max(300).optional(),
          description: z.string().max(2000),
          icon: z.string().max(100).optional(),
        }),
      )
      .max(30)
      .optional(),

    email: z.string().email().optional(),

    phone: z.string().max(50).optional(),

    address: z.string().max(300).optional(),

    github: z.string().url().optional(),

    linkedin: z.string().url().optional(),

    twitter: z.string().url().optional(),

    resumeUrl: z.string().url().optional(),
  }),
});
