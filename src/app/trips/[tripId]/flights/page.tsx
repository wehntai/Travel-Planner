import { Plane } from "lucide-react";
import { ComingSoon } from "@/components/trips/coming-soon";

export default function FlightsPage() {
  return (
    <ComingSoon
      icon={Plane}
      title="Flight tracking is on its way"
      description="Soon you'll be able to log every flight for this trip in one clean timeline."
    />
  );
}
