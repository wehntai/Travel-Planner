import { ListChecks } from "lucide-react";
import { ComingSoon } from "@/components/trips/coming-soon";

export default function BucketListPage() {
  return (
    <ComingSoon
      icon={ListChecks}
      title="Bucket list is on its way"
      description="Soon you'll be able to save every place and thing you want to do on this trip."
    />
  );
}
