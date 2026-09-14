import { Badge } from "@/components/ui/badge";
import { BUCKET_CATEGORIES, PRIORITIES, labelFor } from "@/lib/constants";

const PRIORITY_VARIANT: Record<string, "danger" | "accent" | "outline"> = {
  high: "danger",
  medium: "accent",
  low: "outline",
};

export function PriorityBadge({ priority }: { priority: string }) {
  return (
    <Badge variant={PRIORITY_VARIANT[priority] ?? "outline"}>
      {labelFor(PRIORITIES, priority)} priority
    </Badge>
  );
}

export function CategoryBadge({ category }: { category: string }) {
  const meta = BUCKET_CATEGORIES.find((c) => c.value === category);
  return (
    <Badge variant="default">
      {meta?.emoji} {meta?.label ?? category}
    </Badge>
  );
}
