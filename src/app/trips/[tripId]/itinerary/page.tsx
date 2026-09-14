import { CalendarRange } from "lucide-react";
import { ComingSoon } from "@/components/trips/coming-soon";

export default function ItineraryPage() {
  return (
    <ComingSoon
      icon={CalendarRange}
      title="Itinerary planning is on its way"
      description="Soon you'll be able to lay out your trip day by day, hour by hour."
    />
  );
}
