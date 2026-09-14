"use client";

import { toast } from "sonner";
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
  createBucketListItem,
  updateBucketListItem,
  type BucketListFormState,
} from "@/app/actions/bucket-list";
import { useSubmitAction, useControllableOpen } from "@/hooks/use-dialog-form";
import { BUCKET_CATEGORIES, BUCKET_STATUSES, PRIORITIES } from "@/lib/constants";
import type { BucketListItem } from "@prisma/client";

const initialState: BucketListFormState = {};

export function BucketItemDialog({
  tripId,
  item,
  trigger,
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: {
  tripId: string;
  item?: BucketListItem;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const { open, setOpen } = useControllableOpen(openProp, onOpenChangeProp);
  const action = item
    ? updateBucketListItem.bind(null, tripId, item.id)
    : createBucketListItem.bind(null, tripId);

  const { state, isPending, handleSubmit } = useSubmitAction(action, initialState, () => {
    toast.success(item ? "Bucket list item updated" : "Added to bucket list");
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? "Edit bucket list item" : "Add to bucket list"}</DialogTitle>
          <DialogDescription>
            Somewhere you want to go, or something you want to do on this trip.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Fushimi Inari Shrine"
              defaultValue={item?.name}
              required
              autoFocus
            />
            {state.fieldErrors?.name && <p className="text-xs text-danger">{state.fieldErrors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="e.g. Kyoto" defaultValue={item?.location ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={item?.category ?? "other"}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUCKET_CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.emoji} {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="priority">Priority</Label>
              <Select name="priority" defaultValue={item?.priority ?? "medium"}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={item?.status ?? "want_to_visit"}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUCKET_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="estimatedCost">Estimated cost (optional)</Label>
            <Input
              id="estimatedCost"
              name="estimatedCost"
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              defaultValue={item?.estimatedCost ?? ""}
            />
            {state.fieldErrors?.estimatedCost && (
              <p className="text-xs text-danger">{state.fieldErrors.estimatedCost}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="website">Website / link (optional)</Label>
            <Input id="website" name="website" placeholder="https://…" defaultValue={item?.website ?? ""} />
            {state.fieldErrors?.website && <p className="text-xs text-danger">{state.fieldErrors.website}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="photoUrl">Photo URL (optional)</Label>
            <Input id="photoUrl" name="photoUrl" placeholder="https://…" defaultValue={item?.photoUrl ?? ""} />
            {state.fieldErrors?.photoUrl && <p className="text-xs text-danger">{state.fieldErrors.photoUrl}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" name="description" rows={2} defaultValue={item?.description ?? ""} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" name="notes" rows={2} defaultValue={item?.notes ?? ""} />
          </div>

          {state.error && <p className="text-sm text-danger">{state.error}</p>}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : item ? "Save changes" : "Add item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
