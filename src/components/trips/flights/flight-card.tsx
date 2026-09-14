"use client";

import { useState } from "react";
import { MoreVertical, Plane, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { FlightDialog } from "@/components/trips/flights/flight-dialog";
import { deleteFlight } from "@/app/actions/flights";
import { formatDate, formatTime, formatDuration } from "@/lib/dates";
import { labelFor, FLIGHT_TYPES } from "@/lib/constants";
import type { Flight } from "@prisma/client";

export function FlightCard({ tripId, flight }: { tripId: string; flight: Flight }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="brand">{labelFor(FLIGHT_TYPES, flight.type)}</Badge>
          <span className="text-sm font-medium">
            {flight.airline} {flight.flightNumber}
          </span>
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

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <p className="font-display text-2xl font-medium">{flight.departureAirport}</p>
          <p className="text-sm text-muted-foreground">{formatTime(flight.departureDateTime)}</p>
          <p className="text-xs text-muted-foreground">{formatDate(flight.departureDateTime)}</p>
        </div>
        <div className="flex flex-1 flex-col items-center gap-1 text-muted-foreground">
          <span className="text-xs">{formatDuration(flight.departureDateTime, flight.arrivalDateTime)}</span>
          <div className="flex w-full items-center gap-1">
            <span className="h-px flex-1 bg-border" />
            <Plane className="h-4 w-4 shrink-0 rotate-90" />
            <span className="h-px flex-1 bg-border" />
          </div>
        </div>
        <div className="flex-1 text-right">
          <p className="font-display text-2xl font-medium">{flight.arrivalAirport}</p>
          <p className="text-sm text-muted-foreground">{formatTime(flight.arrivalDateTime)}</p>
          <p className="text-xs text-muted-foreground">{formatDate(flight.arrivalDateTime)}</p>
        </div>
      </div>

      {(flight.confirmationNumber || flight.terminal || flight.gate) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
          {flight.confirmationNumber && <span>Confirmation: {flight.confirmationNumber}</span>}
          {flight.terminal && <span>Terminal: {flight.terminal}</span>}
          {flight.gate && <span>Gate: {flight.gate}</span>}
        </div>
      )}

      {flight.notes && <p className="text-sm text-muted-foreground">{flight.notes}</p>}

      <FlightDialog tripId={tripId} flight={flight} open={editOpen} onOpenChange={setEditOpen} />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete this flight?"
        description={`${flight.airline} ${flight.flightNumber} will be removed from this trip.`}
        successMessage="Flight deleted"
        onConfirm={() => deleteFlight(tripId, flight.id)}
      />
    </Card>
  );
}
