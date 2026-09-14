import { Hotel } from "lucide-react";
import { ComingSoon } from "@/components/trips/coming-soon";

export default function StaysPage() {
  return (
    <ComingSoon
      icon={Hotel}
      title="Places to stay is on its way"
      description="Soon you'll be able to save every hotel and Airbnb for this trip."
    />
  );
}
