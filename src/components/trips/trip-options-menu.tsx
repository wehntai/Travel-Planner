"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { EditTripDialog } from "@/components/trips/edit-trip-dialog";
import { deleteTrip } from "@/app/actions/trips";
import type { getTrip } from "@/lib/data/trips";

type Trip = NonNullable<Awaited<ReturnType<typeof getTrip>>>;

export function TripOptionsMenu({ trip }: { trip: Trip }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-white/40 bg-white/10 text-white hover:bg-white/20"
            aria-label="Trip options"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setEditOpen(true); }}>
            <Pencil className="h-3.5 w-3.5" /> Edit trip
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => { e.preventDefault(); setDeleteOpen(true); }}
            className="text-danger data-[highlighted]:bg-danger-light"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete trip
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditTripDialog trip={trip} open={editOpen} onOpenChange={setEditOpen} />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this trip?"
        description={`"${trip.name}" and everything in it — itinerary, bucket list, flights, expenses, all of it — will be permanently deleted. This can't be undone.`}
        successMessage="Trip deleted"
        onConfirm={() => deleteTrip(trip.id)}
      />
    </>
  );
}
