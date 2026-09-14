"use client";

import { useMemo, useState } from "react";
import { Search, Plus, ListChecks } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";
import { BucketItemCard } from "@/components/trips/bucket-list/bucket-item-card";
import { BucketItemDialog } from "@/components/trips/bucket-list/bucket-item-dialog";
import { BUCKET_CATEGORIES, BUCKET_STATUSES } from "@/lib/constants";
import type { BucketListItem } from "@prisma/client";

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

type SortKey = "priority" | "name" | "newest";

export function BucketListView({ tripId, items }: { tripId: string; items: BucketListItem[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("priority");

  const filtered = useMemo(() => {
    let result = items;
    if (category !== "all") {
      result = result.filter((i) => i.category === category);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (i) => i.name.toLowerCase().includes(q) || i.location?.toLowerCase().includes(q),
      );
    }
    const sorted = [...result];
    if (sort === "priority") {
      sorted.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    } else if (sort === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    }
    return sorted;
  }, [items, category, search, sort]);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ListChecks}
        title="Nothing on the bucket list yet"
        description="Add the places and things you don't want to miss on this trip."
        action={
          <BucketItemDialog
            tripId={tripId}
            trigger={
              <Button>
                <Plus className="h-4 w-4" /> Add Item
              </Button>
            }
          />
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search bucket list…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {BUCKET_CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.emoji} {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="sm:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Sort: Priority</SelectItem>
              <SelectItem value="name">Sort: Name</SelectItem>
              <SelectItem value="newest">Sort: Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <BucketItemDialog
          tripId={tripId}
          trigger={
            <Button className="shrink-0">
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          }
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No items match your filters.
        </p>
      ) : (
        <div className="flex flex-col gap-8">
          {BUCKET_STATUSES.map((statusOption) => {
            const group = filtered.filter((i) => i.status === statusOption.value);
            if (group.length === 0) return null;
            return (
              <div key={statusOption.value} className="flex flex-col gap-3">
                <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {statusOption.label}
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-normal">
                    {group.length}
                  </span>
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.map((item) => (
                    <BucketItemCard key={item.id} tripId={tripId} item={item} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
