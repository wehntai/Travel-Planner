"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { expenseSchema } from "@/lib/validations/expense";

export type ExpenseFormState = {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  success?: boolean;
};

function fieldErrorsFrom(error: ZodError) {
  const fieldErrors: Partial<Record<string, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString();
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

function parseForm(formData: FormData) {
  const paidById = formData.get("paidById")?.toString() ?? "";
  return expenseSchema.safeParse({
    name: formData.get("name")?.toString() ?? "",
    amount: formData.get("amount")?.toString() ?? "",
    category: formData.get("category")?.toString() ?? "other",
    paidById: paidById === "none" ? "" : paidById,
    date: formData.get("date")?.toString() ?? "",
    notes: formData.get("notes")?.toString() ?? "",
  });
}

export async function createExpense(
  tripId: string,
  _prevState: ExpenseFormState,
  formData: FormData,
): Promise<ExpenseFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }
  const data = parsed.data;

  await prisma.expense.create({
    data: {
      tripId,
      name: data.name,
      amount: data.amount,
      category: data.category,
      paidById: data.paidById || null,
      date: new Date(data.date),
      notes: data.notes || null,
    },
  });

  revalidatePath(`/trips/${tripId}/expenses`);
  revalidatePath(`/trips/${tripId}`);
  return { success: true };
}

export async function updateExpense(
  tripId: string,
  expenseId: string,
  _prevState: ExpenseFormState,
  formData: FormData,
): Promise<ExpenseFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }
  const data = parsed.data;

  await prisma.expense.update({
    where: { id: expenseId },
    data: {
      name: data.name,
      amount: data.amount,
      category: data.category,
      paidById: data.paidById || null,
      date: new Date(data.date),
      notes: data.notes || null,
    },
  });

  revalidatePath(`/trips/${tripId}/expenses`);
  revalidatePath(`/trips/${tripId}`);
  return { success: true };
}

export async function deleteExpense(tripId: string, expenseId: string) {
  await prisma.expense.delete({ where: { id: expenseId } });
  revalidatePath(`/trips/${tripId}/expenses`);
  revalidatePath(`/trips/${tripId}`);
}
