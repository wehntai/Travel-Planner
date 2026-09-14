"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { NoteDialog } from "@/components/trips/notes/note-dialog";
import { deleteNote } from "@/app/actions/notes";
import { formatDate } from "@/lib/dates";
import type { Note } from "@prisma/client";

export function NoteCard({ tripId, note }: { tripId: string; note: Note }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Card className="flex flex-col gap-2 p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-medium leading-tight">{note.title || "Untitled note"}</h3>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setEditOpen(true); }}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => { e.preventDefault(); setDeleteOpen(true); }}
              className="text-danger data-[highlighted]:bg-danger-light"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="whitespace-pre-wrap text-sm text-foreground/90">{note.content}</p>
      <p className="mt-1 text-xs text-muted-foreground">Updated {formatDate(note.updatedAt)}</p>

      <NoteDialog tripId={tripId} note={note} open={editOpen} onOpenChange={setEditOpen} />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this note?"
        description="This can't be undone."
        successMessage="Note deleted"
        onConfirm={() => deleteNote(tripId, note.id)}
      />
    </Card>
  );
}
