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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  createItineraryEvent,
  updateItineraryEvent,
  type ItineraryFormState,
} from "@/app/actions/itinerary";
import { useSubmitAction, useControllableOpen } from "@/hooks/use-dialog-form";
import type { ItineraryEvent, BucketListItem } from "@/generated/prisma/client";

const initialState: ItineraryFormState = {};

export function ItineraryEventDialog({
  tripId,
  event,
  defaultDate,
  bucketListItems,
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: {
  tripId: string;
  event?: ItineraryEvent;
  defaultDate?: string;
  bucketListItems: BucketListItem[];
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { open, setOpen } = useControllableOpen(openProp, onOpenChangeProp);
  const action = event
    ? updateItineraryEvent.bind(null, tripId, event.id)
    : createItineraryEvent.bind(null, tripId);

  const { state, isPending, handleSubmit } = useSubmitAction(action, initialState, () => {
    toast.success(event ? "Event updated" : "Event added to itinerary");
    setOpen(false);
  });

  const dateDefault = event ? format(new Date(event.startAt), "yyyy-MM-dd") : defaultDate;
  const timeDefault = event ? format(new Date(event.startAt), "HH:mm") : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Edit event" : "Add itinerary event"}</DialogTitle>
          <DialogDescription>Plan out what&apos;s happening and when.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Lunch at Ichiran"
              defaultValue={event?.title}
              required
              autoFocus
            />
            {state.fieldErrors?.title && <p className="text-xs text-danger">{state.fieldErrors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={dateDefault} required />
              {state.fieldErrors?.date && <p className="text-xs text-danger">{state.fieldErrors.date}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" defaultValue={timeDefault} required />
              {state.fieldErrors?.time && <p className="text-xs text-danger">{state.fieldErrors.time}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">Location (optional)</Label>
            <Input id="location" name="location" placeholder="e.g. Shibuya, Tokyo" defaultValue={event?.location ?? ""} />
          </div>

          {bucketListItems.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bucketListItemId">Link a bucket list item (optional)</Label>
              <Select name="bucketListItemId" defaultValue={event?.bucketListItemId ?? "none"}>
                <SelectTrigger id="bucketListItemId">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {bucketListItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" name="notes" rows={2} defaultValue={event?.notes ?? ""} />
          </div>

          {state.error && <p className="text-sm text-danger">{state.error}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : event ? "Save changes" : "Add event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
