import { notFound } from "next/navigation";
import {
  Hourglass,
  MapPin,
  Users,
  Sparkles,
  Plane,
  Luggage,
  ListChecks,
  Hotel,
  Receipt,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AvatarStack } from "@/components/ui/avatar";
import { StatCard } from "@/components/trips/overview/stat-card";
import { getTrip, getTripOverview } from "@/lib/data/trips";
import { formatDateRange, formatDateTime, formatDate, countdownLabel } from "@/lib/dates";
import { formatCurrency } from "@/lib/format";

export default async function TripOverviewPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const { bucketListItems, packingItems, flights, accommodations, expenses, nextItineraryEvent } =
    await getTripOverview(tripId);

  const durationDays =
    trip.startDate && trip.endDate
      ? Math.round((+new Date(trip.endDate) - +new Date(trip.startDate)) / 86_400_000) + 1
      : null;

  const packedCount = packingItems.filter((i) => i.packed).length;
  const packingPercent = packingItems.length
    ? Math.round((packedCount / packingItems.length) * 100)
    : 0;

  const bucketCompleted = bucketListItems.filter((i) => i.status === "completed").length;
  const bucketPercent = bucketListItems.length
    ? Math.round((bucketCompleted / bucketListItems.length) * 100)
    : 0;

  const now = new Date();
  const nextFlight =
    flights.find((f) => new Date(f.departureDateTime) >= now) ?? flights[0] ?? null;

  const nextStay =
    accommodations.find((a) => new Date(a.checkOut) >= now) ?? accommodations[0] ?? null;

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      {trip.description && (
        <Card className="p-5">
          <p className="text-sm leading-relaxed text-foreground/90">{trip.description}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard icon={Hourglass} label="Countdown">
          <p className="font-display text-2xl font-medium">{countdownLabel(trip.startDate, trip.endDate)}</p>
          {trip.startDate && (
            <p className="text-sm text-muted-foreground">Starts {formatDate(trip.startDate)}</p>
          )}
        </StatCard>

        <StatCard icon={MapPin} label="Trip Details">
          <p className="font-display text-lg font-medium">{trip.destination}</p>
          <p className="text-sm text-muted-foreground">{formatDateRange(trip.startDate, trip.endDate)}</p>
          {durationDays && (
            <p className="text-sm text-muted-foreground">{durationDays} days</p>
          )}
        </StatCard>

        <StatCard icon={Users} label="Travelers">
          <AvatarStack
            people={trip.members.map((m) => ({ name: m.user.name, color: m.user.avatarColor }))}
          />
          <p className="text-sm text-muted-foreground">
            {trip.members.map((m) => m.user.name).join(", ") || "No travelers yet"}
          </p>
        </StatCard>

        <StatCard icon={Sparkles} label="Next Up">
          {nextItineraryEvent ? (
            <>
              <p className="font-display text-lg font-medium">{nextItineraryEvent.title}</p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(nextItineraryEvent.startAt)}
                {nextItineraryEvent.location ? ` · ${nextItineraryEvent.location}` : ""}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No upcoming plans yet — add some in Itinerary.</p>
          )}
        </StatCard>

        <StatCard icon={Plane} label="Flights">
          {nextFlight ? (
            <>
              <p className="font-display text-lg font-medium">
                {nextFlight.departureAirport} → {nextFlight.arrivalAirport}
              </p>
              <p className="text-sm text-muted-foreground">
                {nextFlight.airline} {nextFlight.flightNumber} · {formatDate(nextFlight.departureDateTime)}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No flights added yet.</p>
          )}
        </StatCard>

        <StatCard icon={Luggage} label="Packing">
          {packingItems.length ? (
            <>
              <Progress value={packingPercent} />
              <p className="text-sm text-muted-foreground">
                {packedCount}/{packingItems.length} packed
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No packing list yet.</p>
          )}
        </StatCard>

        <StatCard icon={ListChecks} label="Bucket List">
          {bucketListItems.length ? (
            <>
              <Progress value={bucketPercent} />
              <p className="text-sm text-muted-foreground">
                {bucketCompleted}/{bucketListItems.length} completed
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No bucket list items yet.</p>
          )}
        </StatCard>

        <StatCard icon={Hotel} label="Places to Stay">
          {nextStay ? (
            <>
              <p className="font-display text-lg font-medium">{nextStay.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatDate(nextStay.checkIn)} – {formatDate(nextStay.checkOut)}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No accommodation added yet.</p>
          )}
        </StatCard>

        <StatCard icon={Receipt} label="Expenses">
          {expenses.length ? (
            <>
              <p className="font-display text-2xl font-medium">{formatCurrency(totalExpenses)}</p>
              <p className="text-sm text-muted-foreground">
                {expenses.length} expense{expenses.length === 1 ? "" : "s"} logged
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No expenses logged yet.</p>
          )}
        </StatCard>
      </div>
    </div>
  );
}
