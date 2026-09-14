"use client";

import { useMemo, useOptimistic, useRef, useState, useTransition } from "react";
import { Plus, Trash2, Luggage } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { EmptyState } from "@/components/empty-state";
import { createPackingItem, togglePackingItem, deletePackingItem } from "@/app/actions/packing";
import { PACKING_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PackingItem } from "@/generated/prisma/client";

export function PackingView({ tripId, items }: { tripId: string; items: PackingItem[] }) {
  const [optimisticItems, setOptimisticItems] = useOptimistic(
    items,
    (state, update: { id: string; packed: boolean } | { removeId: string }) => {
      if ("removeId" in update) return state.filter((i) => i.id !== update.removeId);
      return state.map((i) => (i.id === update.id ? { ...i, packed: update.packed } : i));
    },
  );
  const [, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [category, setCategory] = useState("misc");

  const total = optimisticItems.length;
  const packed = optimisticItems.filter((i) => i.packed).length;
  const percent = total ? Math.round((packed / total) * 100) : 0;

  const grouped = useMemo(() => {
    const map = new Map<string, PackingItem[]>();
    for (const item of optimisticItems) {
      const list = map.get(item.category) ?? [];
      list.push(item);
      map.set(item.category, list);
    }
    return PACKING_CATEGORIES.map((c) => ({ category: c, items: map.get(c.value) ?? [] })).filter(
      (g) => g.items.length > 0,
    );
  }, [optimisticItems]);

  function handleToggle(item: PackingItem) {
    startTransition(async () => {
      setOptimisticItems({ id: item.id, packed: !item.packed });
      await togglePackingItem(tripId, item.id, !item.packed);
    });
  }

  function handleDelete(item: PackingItem) {
    startTransition(async () => {
      setOptimisticItems({ removeId: item.id });
      await deletePackingItem(tripId, item.id);
    });
  }

  function handleAdd(formData: FormData) {
    formRef.current?.reset();
    startTransition(async () => {
      await createPackingItem(tripId, formData);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex flex-col gap-2 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-medium">
            Packing — {packed}/{total} complete
          </h2>
          <span className="text-sm text-muted-foreground">{percent}%</span>
        </div>
        <Progress value={percent} />
      </Card>

      <form ref={formRef} action={handleAdd} className="flex flex-col gap-2 sm:flex-row">
        <Input name="name" placeholder="Add a packing item…" required className="flex-1" />
        <Select name="category" value={category} onValueChange={setCategory}>
          <SelectTrigger className="sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PACKING_CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" className="shrink-0">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </form>

      {total === 0 ? (
        <EmptyState
          icon={Luggage}
          title="Nothing on the packing list yet"
          description="Add items above — passport, chargers, whatever you don't want to forget."
        />
      ) : (
        <div className="flex flex-col gap-6">
          {grouped.map(({ category: cat, items: catItems }) => {
            const catPacked = catItems.filter((i) => i.packed).length;
            return (
              <div key={cat.value} className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {cat.label}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {catPacked}/{catItems.length}
                  </span>
                </div>
                <Card className="divide-y divide-border overflow-hidden p-0">
                  {catItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                      <Checkbox checked={item.packed} onCheckedChange={() => handleToggle(item)} />
                      <span
                        className={cn(
                          "flex-1 text-sm",
                          item.packed && "text-muted-foreground line-through",
                        )}
                      >
                        {item.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-danger"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
