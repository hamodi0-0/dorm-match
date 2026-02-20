import { z } from "zod";

export const profileUpdateSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  gender: z.enum(["male", "female"]).optional(),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
  university_name: z.string().min(2).optional(),
  year_of_study: z
    .enum(["1st_year", "2nd_year", "3rd_year", "4th_year", "graduate"])
    .optional(),
  major: z.string().min(2).optional(),
  sleep_schedule: z.enum(["early_bird", "night_owl", "flexible"]).optional(),
  cleanliness: z.number().min(1).max(5).optional(),
  noise_level: z.enum(["quiet", "moderate", "social"]).optional(),
  guests_frequency: z.enum(["rarely", "sometimes", "often"]).optional(),
  study_location: z.enum(["library", "room", "both"]).optional(),
  smoking: z.boolean().optional(),
  pets: z.boolean().optional(),
  diet_preference: z
    .enum(["no_preference", "vegetarian", "vegan", "halal", "other"])
    .optional(),
  hobbies: z.array(z.string()).optional(),
});

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>;
