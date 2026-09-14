import { notFound } from "next/navigation";
import { eachDayOfInterval, isSameDay } from "date-fns";
import { Plus, CalendarRange } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getTrip } from "@/lib/data/trips";
import { formatDay } from "@/lib/dates";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { ItineraryEventDialog } from "@/components/trips/itinerary/itinerary-event-dialog";
import { ItineraryEventCard } from "@/components/trips/itinerary/itinerary-event-card";

export default async function ItineraryPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const [events, bucketListItems] = await Promise.all([
    prisma.itineraryEvent.findMany({ where: { tripId }, orderBy: [{ startAt: "asc" }, { sortOrder: "asc" }] }),
    prisma.bucketListItem.findMany({ where: { tripId } }),
  ]);

  const bucketListById = new Map(bucketListItems.map((item) => [item.id, item]));

  const days =
    trip.startDate && trip.endDate
      ? eachDayOfInterval({ start: trip.startDate, end: trip.endDate })
      : Array.from(new Set(events.map((e) => e.startAt.toDateString()))).map((d) => new Date(d));

  if (days.length === 0) {
    return (
      <EmptyState
        icon={CalendarRange}
        title="No itinerary yet"
        description="Add your first event to start planning this trip day by day."
        action={
          <ItineraryEventDialog
            tripId={tripId}
            bucketListItems={bucketListItems}
            defaultDate={new Date().toISOString().slice(0, 10)}
            trigger={
              <Button>
                <Plus className="h-4 w-4" /> Add Event
              </Button>
            }
          />
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {days.map((day) => {
        const dayEvents = events
          .filter((e) => isSameDay(e.startAt, day))
          .sort((a, b) => a.sortOrder - b.sortOrder);
        const dateStr = day.toISOString().slice(0, 10);

        return (
          <div key={dateStr} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-medium">{formatDay(day)}</h2>
              <ItineraryEventDialog
                tripId={tripId}
                bucketListItems={bucketListItems}
                defaultDate={dateStr}
                trigger={
                  <Button variant="outline" size="sm">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </Button>
                }
              />
            </div>

            {dayEvents.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                Nothing planned yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {dayEvents.map((event, i) => (
                  <ItineraryEventCard
                    key={event.id}
                    tripId={tripId}
                    event={event}
                    linkedItem={event.bucketListItemId ? bucketListById.get(event.bucketListItemId) : undefined}
                    bucketListItems={bucketListItems}
                    isFirst={i === 0}
                    isLast={i === dayEvents.length - 1}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
