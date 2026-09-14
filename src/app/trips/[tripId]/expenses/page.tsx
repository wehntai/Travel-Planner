import { Receipt } from "lucide-react";
import { ComingSoon } from "@/components/trips/coming-soon";

export default function ExpensesPage() {
  return (
    <ComingSoon
      icon={Receipt}
      title="Expense tracking is on its way"
      description="Soon you'll be able to log shared costs and see who paid for what."
    />
  );
}
