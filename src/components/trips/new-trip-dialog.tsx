"use client";

import { Plus } from "lucide-react";
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
import { createTrip, type CreateTripState } from "@/app/actions/trips";
import { useSubmitAction, useControllableOpen } from "@/hooks/use-dialog-form";

const initialState: CreateTripState = {};

export function NewTripDialog({
  needsIdentity,
  trigger,
}: {
  needsIdentity: boolean;
  trigger?: React.ReactNode;
}) {
  const { open, setOpen } = useControllableOpen();
  // createTrip redirects to the new trip on success instead of returning
  // { success: true }, so there's no onSuccess close/toast to run here —
  // the navigation away is the success signal.
  const { state, isPending, handleSubmit } = useSubmitAction(createTrip, initialState, () => {});

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button>
            <Plus className="h-4 w-4" />
            New Trip
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plan a new trip</DialogTitle>
          <DialogDescription>
            Give it a name and destination — you can fill in the rest later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {needsIdentity && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="yourName">Your name</Label>
              <Input id="yourName" name="yourName" placeholder="e.g. Alex Morgan" required />
              {state.fieldErrors?.yourName && (
                <p className="text-xs text-danger">{state.fieldErrors.yourName}</p>
              )}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Trip name</Label>
            <Input id="name" name="name" placeholder="e.g. Japan 2027" required autoFocus />
            {state.fieldErrors?.name && (
              <p className="text-xs text-danger">{state.fieldErrors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              name="destination"
              placeholder="e.g. Tokyo → Kyoto → Osaka"
              required
            />
            {state.fieldErrors?.destination && (
              <p className="text-xs text-danger">{state.fieldErrors.destination}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="startDate">Start date</Label>
              <Input id="startDate" name="startDate" type="date" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="endDate">End date</Label>
              <Input id="endDate" name="endDate" type="date" />
              {state.fieldErrors?.endDate && (
                <p className="text-xs text-danger">{state.fieldErrors.endDate}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="coverImage">Cover image URL (optional)</Label>
            <Input id="coverImage" name="coverImage" placeholder="https://…" />
            {state.fieldErrors?.coverImage && (
              <p className="text-xs text-danger">{state.fieldErrors.coverImage}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="What's this trip about?"
              rows={3}
            />
          </div>

          {state.error && <p className="text-sm text-danger">{state.error}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating…" : "Create Trip"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
