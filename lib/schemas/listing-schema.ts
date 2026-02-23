import { z } from "zod";

export const createListingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(120),
  description: z.string().max(2000).optional(),
  room_type: z.enum(["single", "shared", "studio", "entire_apartment"]),
  price_per_month: z
    .number({ coerce: true })
    .positive("Price must be positive"),
  available_from: z.string().min(1, "Required"),
  min_stay_months: z.number({ coerce: true }).int().positive().default(1),
  max_occupants: z.number({ coerce: true }).int().positive().default(1),
  address_line: z.string().min(3, "Address required"),
  city: z.string().min(1, "City required"),
  country: z.string().default("United Kingdom"),
  postcode: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  gender_preference: z
    .enum(["male_only", "female_only", "mixed", "no_preference"])
    .default("no_preference"),
  university_name: z.string().optional(),
  wifi: z.boolean().default(false),
  parking: z.boolean().default(false),
  laundry: z.boolean().default(false),
  gym: z.boolean().default(false),
  bills_included: z.boolean().default(false),
  furnished: z.boolean().default(true),
});

export type CreateListingValues = z.infer<typeof createListingSchema>;
