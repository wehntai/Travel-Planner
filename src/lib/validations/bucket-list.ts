import { z } from "zod";
import { BUCKET_CATEGORIES, BUCKET_STATUSES, PRIORITIES } from "@/lib/constants";

const categoryValues = BUCKET_CATEGORIES.map((c) => c.value) as [string, ...string[]];
const statusValues = BUCKET_STATUSES.map((s) => s.value) as [string, ...string[]];
const priorityValues = PRIORITIES.map((p) => p.value) as [string, ...string[]];

export const bucketListItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  location: z.string().trim().max(150).optional().or(z.literal("")),
  category: z.enum(categoryValues).default("other"),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  photoUrl: z.string().trim().url("Enter a valid image URL").max(500).optional().or(z.literal("")),
  website: z.string().trim().url("Enter a valid URL").max(500).optional().or(z.literal("")),
  priority: z.enum(priorityValues).default("medium"),
  estimatedCost: z
    .string()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? Number(v) : undefined))
    .refine((v) => v === undefined || (!Number.isNaN(v) && v >= 0), {
      message: "Enter a valid cost",
    }),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  status: z.enum(statusValues).default("want_to_visit"),
});

export type BucketListItemValues = z.infer<typeof bucketListItemSchema>;
