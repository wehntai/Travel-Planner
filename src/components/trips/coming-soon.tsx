import type { LucideIcon } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";

export function ComingSoon({ icon, title, description }: { icon: LucideIcon; title: string; description: string }) {
  return (
    <EmptyState
      icon={icon}
      title={title}
      description={description}
      action={
        <Badge variant="accent" className="mt-1">
          Coming soon
        </Badge>
      }
    />
  );
}
