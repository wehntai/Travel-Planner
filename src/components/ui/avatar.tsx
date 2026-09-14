import { cn } from "@/lib/utils";

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const sizeClasses = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-11 w-11 text-sm",
} as const;

export function Avatar({
  name,
  color = "#0d7d6f",
  size = "md",
  className,
  ring = false,
}: {
  name: string;
  color?: string;
  size?: keyof typeof sizeClasses;
  className?: string;
  ring?: boolean;
}) {
  return (
    <div
      title={name}
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        sizeClasses[size],
        ring && "ring-2 ring-card",
        className,
      )}
      style={{ backgroundColor: color }}
    >
      {initials(name)}
    </div>
  );
}

export function AvatarStack({
  people,
  max = 4,
  size = "md",
}: {
  people: { name: string; color?: string }[];
  max?: number;
  size?: keyof typeof sizeClasses;
}) {
  const shown = people.slice(0, max);
  const remaining = people.length - shown.length;
  return (
    <div className="flex items-center -space-x-2">
      {shown.map((p, i) => (
        <Avatar key={`${p.name}-${i}`} name={p.name} color={p.color} size={size} ring />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground font-semibold ring-2 ring-card",
            sizeClasses[size],
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
