"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border bg-card transition-colors data-[state=checked]:border-brand data-[state=checked]:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="h-3.5 w-3.5 text-brand-foreground" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
