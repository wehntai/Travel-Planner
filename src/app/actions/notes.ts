"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { noteSchema } from "@/lib/validations/note";

export type NoteFormState = {
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
  return noteSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    content: formData.get("content")?.toString() ?? "",
  });
}

export async function createNote(
  tripId: string,
  _prevState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }
  const data = parsed.data;

  await prisma.note.create({
    data: { tripId, title: data.title || null, content: data.content },
  });

  revalidatePath(`/trips/${tripId}/notes`);
  return { success: true };
}

export async function updateNote(
  tripId: string,
  noteId: string,
  _prevState: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Please fix the highlighted fields.", fieldErrors: fieldErrorsFrom(parsed.error) };
  }
  const data = parsed.data;

  await prisma.note.update({
    where: { id: noteId },
    data: { title: data.title || null, content: data.content },
  });

  revalidatePath(`/trips/${tripId}/notes`);
  return { success: true };
}

export async function deleteNote(tripId: string, noteId: string) {
  await prisma.note.delete({ where: { id: noteId } });
  revalidatePath(`/trips/${tripId}/notes`);
}
