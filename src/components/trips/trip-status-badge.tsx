import { Badge } from "@/components/ui/badge";
import { labelFor, TRIP_STATUSES } from "@/lib/constants";

const VARIANT_BY_STATUS: Record<string, "default" | "brand" | "accent" | "outline"> = {
  planning: "outline",
  booked: "brand",
  in_progress: "accent",
  completed: "default",
};

export function TripStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={VARIANT_BY_STATUS[status] ?? "default"}>
      {labelFor(TRIP_STATUSES, status)}
    </Badge>
  );
}
