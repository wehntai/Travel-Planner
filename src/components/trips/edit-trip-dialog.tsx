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
import { updateTrip, type UpdateTripState } from "@/app/actions/trips";
import { useSubmitAction, useControllableOpen } from "@/hooks/use-dialog-form";
import { TRIP_STATUSES } from "@/lib/constants";
import type { getTrip } from "@/lib/data/trips";

const initialState: UpdateTripState = {};

type Trip = NonNullable<Awaited<ReturnType<typeof getTrip>>>;

export function EditTripDialog({
  trip,
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: {
  trip: Trip;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { open, setOpen } = useControllableOpen(openProp, onOpenChangeProp);
  const action = updateTrip.bind(null, trip.id);

  const { state, isPending, handleSubmit } = useSubmitAction(action, initialState, () => {
    toast.success("Trip updated");
    setOpen(false);
  });

  const startDateDefault = trip.startDate ? format(new Date(trip.startDate), "yyyy-MM-dd") : undefined;
  const endDateDefault = trip.endDate ? format(new Date(trip.endDate), "yyyy-MM-dd") : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit trip</DialogTitle>
          <DialogDescription>Update the details for {trip.name}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-name">Trip name</Label>
            <Input id="edit-name" name="name" defaultValue={trip.name} required autoFocus />
            {state.fieldErrors?.name && <p className="text-xs text-danger">{state.fieldErrors.name}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-destination">Destination</Label>
            <Input id="edit-destination" name="destination" defaultValue={trip.destination} required />
            {state.fieldErrors?.destination && (
              <p className="text-xs text-danger">{state.fieldErrors.destination}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-startDate">Start date</Label>
              <Input id="edit-startDate" name="startDate" type="date" defaultValue={startDateDefault} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-endDate">End date</Label>
              <Input id="edit-endDate" name="endDate" type="date" defaultValue={endDateDefault} />
              {state.fieldErrors?.endDate && <p className="text-xs text-danger">{state.fieldErrors.endDate}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-status">Status</Label>
            <Select name="status" defaultValue={trip.status}>
              <SelectTrigger id="edit-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRIP_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-coverImage">Cover image URL (optional)</Label>
            <Input id="edit-coverImage" name="coverImage" placeholder="https://…" defaultValue={trip.coverImage ?? ""} />
            {state.fieldErrors?.coverImage && (
              <p className="text-xs text-danger">{state.fieldErrors.coverImage}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-description">Description (optional)</Label>
            <Textarea id="edit-description" name="description" rows={3} defaultValue={trip.description ?? ""} />
          </div>

          {state.error && <p className="text-sm text-danger">{state.error}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
