import { z } from "zod";
import { EXPENSE_CATEGORIES } from "@/lib/constants";

const categoryValues = EXPENSE_CATEGORIES.map((c) => c.value) as [string, ...string[]];

export const expenseSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(150),
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .transform((v) => Number(v))
    .refine((v) => !Number.isNaN(v) && v > 0, { message: "Enter a valid amount" }),
  category: z.enum(categoryValues).default("other"),
  paidById: z.string().trim().optional().or(z.literal("")),
  date: z.string().trim().min(1, "Date is required"),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type ExpenseValues = z.infer<typeof expenseSchema>;
