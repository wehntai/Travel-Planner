"use client";

import { toast } from "sonner";
import { format } from "date-fns";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { createFlight, updateFlight, type FlightFormState } from "@/app/actions/flights";
import { useSubmitAction, useControllableOpen } from "@/hooks/use-dialog-form";
import { FLIGHT_TYPES } from "@/lib/constants";
import type { Flight } from "@/generated/prisma/client";

const initialState: FlightFormState = {};

export function FlightDialog({
  tripId,
  flight,
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: {
  tripId: string;
  flight?: Flight;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { open, setOpen } = useControllableOpen(openProp, onOpenChangeProp);
  const action = flight ? updateFlight.bind(null, tripId, flight.id) : createFlight.bind(null, tripId);

  const { state, isPending, handleSubmit } = useSubmitAction(action, initialState, () => {
    toast.success(flight ? "Flight updated" : "Flight added");
    setOpen(false);
  });

  const departureDate = flight ? format(new Date(flight.departureDateTime), "yyyy-MM-dd") : undefined;
  const departureTime = flight ? format(new Date(flight.departureDateTime), "HH:mm") : undefined;
  const arrivalDate = flight ? format(new Date(flight.arrivalDateTime), "yyyy-MM-dd") : undefined;
  const arrivalTime = flight ? format(new Date(flight.arrivalDateTime), "HH:mm") : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{flight ? "Edit flight" : "Add flight"}</DialogTitle>
          <DialogDescription>Keep every leg of the trip in one place.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="type">Type</Label>
              <Select name="type" defaultValue={flight?.type ?? "departure"}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FLIGHT_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="airline">Airline</Label>
              <Input id="airline" name="airline" placeholder="e.g. ANA" defaultValue={flight?.airline} required />
              {state.fieldErrors?.airline && <p className="text-xs text-danger">{state.fieldErrors.airline}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="flightNumber">Flight number</Label>
            <Input
              id="flightNumber"
              name="flightNumber"
              placeholder="e.g. NH 106"
              defaultValue={flight?.flightNumber}
              required
            />
            {state.fieldErrors?.flightNumber && (
              <p className="text-xs text-danger">{state.fieldErrors.flightNumber}</p>
            )}
          </div>

          <div className="rounded-xl border border-border p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Departure</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="departureAirport">Airport</Label>
                <Input
                  id="departureAirport"
                  name="departureAirport"
                  placeholder="SFO"
                  maxLength={4}
                  className="uppercase"
                  defaultValue={flight?.departureAirport}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="departureDate">Date</Label>
                <Input id="departureDate" name="departureDate" type="date" defaultValue={departureDate} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="departureTime">Time</Label>
                <Input id="departureTime" name="departureTime" type="time" defaultValue={departureTime} required />
              </div>
            </div>
            {state.fieldErrors?.departureAirport && (
              <p className="mt-1 text-xs text-danger">{state.fieldErrors.departureAirport}</p>
            )}
          </div>

          <div className="rounded-xl border border-border p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Arrival</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="arrivalAirport">Airport</Label>
                <Input
                  id="arrivalAirport"
                  name="arrivalAirport"
                  placeholder="HND"
                  maxLength={4}
                  className="uppercase"
                  defaultValue={flight?.arrivalAirport}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="arrivalDate">Date</Label>
                <Input id="arrivalDate" name="arrivalDate" type="date" defaultValue={arrivalDate} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="arrivalTime">Time</Label>
                <Input id="arrivalTime" name="arrivalTime" type="time" defaultValue={arrivalTime} required />
              </div>
            </div>
            {(state.fieldErrors?.arrivalAirport || state.fieldErrors?.arrivalTime) && (
              <p className="mt-1 text-xs text-danger">
                {state.fieldErrors.arrivalAirport ?? state.fieldErrors.arrivalTime}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmationNumber">Confirmation #</Label>
              <Input id="confirmationNumber" name="confirmationNumber" defaultValue={flight?.confirmationNumber ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="terminal">Terminal</Label>
              <Input id="terminal" name="terminal" defaultValue={flight?.terminal ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="gate">Gate</Label>
              <Input id="gate" name="gate" defaultValue={flight?.gate ?? ""} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" name="notes" rows={2} defaultValue={flight?.notes ?? ""} />
          </div>

          {state.error && <p className="text-sm text-danger">{state.error}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : flight ? "Save changes" : "Add flight"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
