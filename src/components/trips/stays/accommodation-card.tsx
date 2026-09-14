"use client";

import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { MoreVertical, MapPin, ExternalLink, Pencil, Trash2, Hotel } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { AccommodationDialog } from "@/components/trips/stays/accommodation-dialog";
import { deleteAccommodation } from "@/app/actions/accommodations";
import { formatDate } from "@/lib/dates";
import { formatCurrency } from "@/lib/format";
import type { Accommodation } from "@prisma/client";

export function AccommodationCard({ tripId, stay }: { tripId: string; stay: Accommodation }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const nights = differenceInCalendarDays(new Date(stay.checkOut), new Date(stay.checkIn));

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-brand">
            <Hotel className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-medium leading-tight">{stay.name}</h3>
            {stay.address && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {stay.address}
              </p>
            )}
          </div>
        </div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
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

      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Check-in</p>
          <p className="font-medium">{formatDate(stay.checkIn)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Check-out</p>
          <p className="font-medium">{formatDate(stay.checkOut)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Nights</p>
          <p className="font-medium">{nights}</p>
        </div>
        {stay.price != null && (
          <div>
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="font-medium">{formatCurrency(stay.price)}</p>
          </div>
        )}
      </div>

      {(stay.confirmationNumber || stay.bookingLink) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
          {stay.confirmationNumber && <span>Confirmation: {stay.confirmationNumber}</span>}
          {stay.bookingLink && (
            <a
              href={stay.bookingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-brand hover:underline"
            >
              <ExternalLink className="h-3 w-3" /> Booking link
            </a>
          )}
        </div>
      )}

      {stay.notes && <p className="text-sm text-muted-foreground">{stay.notes}</p>}

      <AccommodationDialog tripId={tripId} accommodation={stay} open={editOpen} onOpenChange={setEditOpen} />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this accommodation?"
        description={`"${stay.name}" will be removed from this trip.`}
        successMessage="Accommodation deleted"
        onConfirm={() => deleteAccommodation(tripId, stay.id)}
      />
    </Card>
  );
}
