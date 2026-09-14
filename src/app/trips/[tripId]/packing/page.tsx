import { Luggage } from "lucide-react";
import { ComingSoon } from "@/components/trips/coming-soon";

export default function PackingPage() {
  return (
    <ComingSoon
      icon={Luggage}
      title="Packing checklist is on its way"
      description="Soon you'll be able to build and check off your packing list for this trip."
    />
  );
}
