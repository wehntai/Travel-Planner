import { NotebookText } from "lucide-react";
import { ComingSoon } from "@/components/trips/coming-soon";

export default function NotesPage() {
  return (
    <ComingSoon
      icon={NotebookText}
      title="Notes are on their way"
      description="Soon you'll have a shared space for restaurant ideas, tips, and reminders."
    />
  );
}
