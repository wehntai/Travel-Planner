"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarRange,
  ListChecks,
  Plane,
  Luggage,
  Hotel,
  Receipt,
  NotebookText,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

function tabsFor(tripId: string) {
  const base = `/trips/${tripId}`;
  return [
    { href: base, label: "Overview", icon: LayoutDashboard },
    { href: `${base}/itinerary`, label: "Itinerary", icon: CalendarRange },
    { href: `${base}/bucket-list`, label: "Bucket List", icon: ListChecks },
    { href: `${base}/flights`, label: "Flights", icon: Plane },
    { href: `${base}/packing`, label: "Packing", icon: Luggage },
    { href: `${base}/stays`, label: "Places to Stay", icon: Hotel },
    { href: `${base}/expenses`, label: "Expenses", icon: Receipt },
    { href: `${base}/notes`, label: "Notes", icon: NotebookText },
    { href: `${base}/travelers`, label: "Travelers", icon: Users },
  ];
}

export function TripTabs({ tripId }: { tripId: string }) {
  const pathname = usePathname();
  const tabs = tabsFor(tripId);

  return (
    <nav className="scrollbar-none -mb-px flex gap-1 overflow-x-auto border-b border-border">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-3.5 py-3 text-sm font-medium transition-colors",
              active
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
