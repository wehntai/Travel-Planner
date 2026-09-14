"use client";

import { useState, useTransition } from "react";
import { MoreVertical, MapPin, ChevronUp, ChevronDown, Pencil, Trash2, ListChecks } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { ItineraryEventDialog } from "@/components/trips/itinerary/itinerary-event-dialog";
import { deleteItineraryEvent, moveItineraryEvent } from "@/app/actions/itinerary";
import { formatTime } from "@/lib/dates";
import type { ItineraryEvent, BucketListItem } from "@prisma/client";

export function ItineraryEventCard({
  tripId,
  event,
  linkedItem,
  bucketListItems,
  isFirst,
  isLast,
}: {
  tripId: string;
  event: ItineraryEvent;
  linkedItem?: BucketListItem;
  bucketListItems: BucketListItem[];
  isFirst: boolean;
  isLast: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [, startTransition] = useTransition();

  function move(direction: "up" | "down") {
    startTransition(() => {
      moveItineraryEvent(tripId, event.id, direction);
    });
  }

  return (
    <Card className="flex gap-3 p-4">
      <div className="flex w-16 shrink-0 flex-col items-center gap-1 pt-0.5">
        <span className="text-sm font-medium text-brand">{formatTime(event.startAt)}</span>
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => move("up")}
            disabled={isFirst}
            className="rounded p-0.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
            aria-label="Move earlier"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => move("down")}
            disabled={isLast}
            className="rounded p-0.5 text-muted-foreground hover:bg-muted disabled:opacity-30"
            aria-label="Move later"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium leading-tight">{event.title}</h3>
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
        {event.location && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" /> {event.location}
          </p>
        )}
        {event.notes && <p className="text-sm text-muted-foreground">{event.notes}</p>}
        {linkedItem && (
          <p className="mt-1 flex items-center gap-1 text-xs text-brand">
            <ListChecks className="h-3 w-3" /> {linkedItem.name}
          </p>
        )}
      </div>

      <ItineraryEventDialog
        tripId={tripId}
        event={event}
        bucketListItems={bucketListItems}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this event?"
        description={`"${event.title}" will be removed from the itinerary.`}
        successMessage="Event deleted"
        onConfirm={() => deleteItineraryEvent(tripId, event.id)}
      />
    </Card>
  );
}
