import { notFound } from "next/navigation";
import { NotebookText, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getTrip } from "@/lib/data/trips";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { NoteDialog } from "@/components/trips/notes/note-dialog";
import { NoteCard } from "@/components/trips/notes/note-card";

export default async function NotesPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const notes = await prisma.note.findMany({
    where: { tripId },
    orderBy: { updatedAt: "desc" },
  });

  if (notes.length === 0) {
    return (
      <EmptyState
        icon={NotebookText}
        title="No notes yet"
        description="Jot down restaurant ideas, reservation details, or anything worth remembering."
        action={
          <NoteDialog
            tripId={tripId}
            trigger={
              <Button>
                <Plus className="h-4 w-4" /> Add Note
              </Button>
            }
          />
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <NoteDialog
          tripId={tripId}
          trigger={
            <Button>
              <Plus className="h-4 w-4" /> Add Note
            </Button>
          }
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {notes.map((note) => (
          <NoteCard key={note.id} tripId={tripId} note={note} />
        ))}
      </div>
    </div>
  );
}
