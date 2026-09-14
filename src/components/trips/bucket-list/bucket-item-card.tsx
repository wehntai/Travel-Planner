"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MoreVertical, MapPin, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { BucketItemDialog } from "@/components/trips/bucket-list/bucket-item-dialog";
import { PriorityBadge, CategoryBadge } from "@/components/trips/bucket-list/badges";
import { deleteBucketListItem, setBucketListItemStatus } from "@/app/actions/bucket-list";
import { BUCKET_STATUSES } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import type { BucketListItem } from "@prisma/client";

export function BucketItemCard({ tripId, item }: { tripId: string; item: BucketListItem }) {
  const [isPending, startTransition] = useTransition();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleStatusChange(status: string) {
    startTransition(async () => {
      await setBucketListItemStatus(tripId, item.id, status);
      toast.success("Status updated");
    });
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-medium leading-tight">{item.name}</h3>
          {item.location && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {item.location}
            </p>
          )}
        </div>
        {/* modal={false} + rendering Edit/Delete dialogs as siblings (not
            nested in the menu) avoids a Radix issue where pointer-events
            gets stuck disabled on <body> when a Dialog opens right as this
            menu closes. */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setEditOpen(true);
              }}
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                setDeleteOpen(true);
              }}
              className="text-danger data-[highlighted]:bg-danger-light"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <CategoryBadge category={item.category} />
        <PriorityBadge priority={item.priority} />
      </div>

      {item.description && (
        <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        {item.estimatedCost != null && <span>{formatCurrency(item.estimatedCost)}</span>}
        {item.website && (
          <a
            href={item.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-brand hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            Website
          </a>
        )}
      </div>

      <Select value={item.status} onValueChange={handleStatusChange} disabled={isPending}>
        <SelectTrigger className="h-8 text-xs">
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

      <BucketItemDialog tripId={tripId} item={item} open={editOpen} onOpenChange={setEditOpen} />
      <ConfirmDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Remove this item?"
        description={`"${item.name}" will be removed from the bucket list.`}
        successMessage="Removed from bucket list"
        onConfirm={() => deleteBucketListItem(tripId, item.id)}
      />
    </Card>
  );
}
