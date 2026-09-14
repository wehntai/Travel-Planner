"use client";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createNote, updateNote, type NoteFormState } from "@/app/actions/notes";
import { useSubmitAction, useControllableOpen } from "@/hooks/use-dialog-form";
import type { Note } from "@prisma/client";

const initialState: NoteFormState = {};

export function NoteDialog({
  tripId,
  note,
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: {
  tripId: string;
  note?: Note;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { open, setOpen } = useControllableOpen(openProp, onOpenChangeProp);
  const action = note ? updateNote.bind(null, tripId, note.id) : createNote.bind(null, tripId);

  const { state, isPending, handleSubmit } = useSubmitAction(action, initialState, () => {
    toast.success(note ? "Note updated" : "Note added");
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{note ? "Edit note" : "Add a note"}</DialogTitle>
          <DialogDescription>Restaurant ideas, reservation details, tips — anything worth remembering.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title (optional)</Label>
            <Input id="title" name="title" placeholder="e.g. Restaurant ideas" defaultValue={note?.title ?? ""} autoFocus />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="content">Note</Label>
            <Textarea id="content" name="content" rows={8} defaultValue={note?.content ?? ""} required />
            {state.fieldErrors?.content && <p className="text-xs text-danger">{state.fieldErrors.content}</p>}
          </div>

          {state.error && <p className="text-sm text-danger">{state.error}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : note ? "Save changes" : "Add note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
