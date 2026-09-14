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
import {
  createAccommodation,
  updateAccommodation,
  type AccommodationFormState,
} from "@/app/actions/accommodations";
import { useSubmitAction, useControllableOpen } from "@/hooks/use-dialog-form";
import type { Accommodation } from "@/generated/prisma/client";

const initialState: AccommodationFormState = {};

export function AccommodationDialog({
  tripId,
  accommodation,
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: {
  tripId: string;
  accommodation?: Accommodation;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { open, setOpen } = useControllableOpen(openProp, onOpenChangeProp);
  const action = accommodation
    ? updateAccommodation.bind(null, tripId, accommodation.id)
    : createAccommodation.bind(null, tripId);

  const { state, isPending, handleSubmit } = useSubmitAction(action, initialState, () => {
    toast.success(accommodation ? "Accommodation updated" : "Accommodation added");
    setOpen(false);
  });

  const checkInDefault = accommodation ? format(new Date(accommodation.checkIn), "yyyy-MM-dd") : undefined;
  const checkOutDefault = accommodation ? format(new Date(accommodation.checkOut), "yyyy-MM-dd") : undefined;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{accommodation ? "Edit accommodation" : "Add a place to stay"}</DialogTitle>
          <DialogDescription>Hotels, Airbnbs, anywhere you&apos;re sleeping on this trip.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Shibuya Excel Hotel Tokyu"
              defaultValue={accommodation?.name}
              required
              autoFocus
            />
            {state.fieldErrors?.name && <p className="text-xs text-danger">{state.fieldErrors.name}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">Address (optional)</Label>
            <Input id="address" name="address" defaultValue={accommodation?.address ?? ""} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="checkIn">Check-in</Label>
              <Input id="checkIn" name="checkIn" type="date" defaultValue={checkInDefault} required />
              {state.fieldErrors?.checkIn && <p className="text-xs text-danger">{state.fieldErrors.checkIn}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="checkOut">Check-out</Label>
              <Input id="checkOut" name="checkOut" type="date" defaultValue={checkOutDefault} required />
              {state.fieldErrors?.checkOut && <p className="text-xs text-danger">{state.fieldErrors.checkOut}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="price">Price (optional)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={accommodation?.price ?? ""}
              />
              {state.fieldErrors?.price && <p className="text-xs text-danger">{state.fieldErrors.price}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="confirmationNumber">Confirmation # (optional)</Label>
              <Input id="confirmationNumber" name="confirmationNumber" defaultValue={accommodation?.confirmationNumber ?? ""} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bookingLink">Booking link (optional)</Label>
            <Input id="bookingLink" name="bookingLink" placeholder="https://…" defaultValue={accommodation?.bookingLink ?? ""} />
            {state.fieldErrors?.bookingLink && <p className="text-xs text-danger">{state.fieldErrors.bookingLink}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" name="notes" rows={2} defaultValue={accommodation?.notes ?? ""} />
          </div>

          {state.error && <p className="text-sm text-danger">{state.error}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : accommodation ? "Save changes" : "Add accommodation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
