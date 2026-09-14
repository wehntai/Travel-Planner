import { notFound } from "next/navigation";
import { Plane, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getTrip } from "@/lib/data/trips";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { FlightDialog } from "@/components/trips/flights/flight-dialog";
import { FlightCard } from "@/components/trips/flights/flight-card";

export default async function FlightsPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const flights = await prisma.flight.findMany({
    where: { tripId },
    orderBy: { departureDateTime: "asc" },
  });

  if (flights.length === 0) {
    return (
      <EmptyState
        icon={Plane}
        title="No flights yet"
        description="Add your departure, return, and any connecting flights."
        action={
          <FlightDialog
            tripId={tripId}
            trigger={
              <Button>
                <Plus className="h-4 w-4" /> Add Flight
              </Button>
            }
          />
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <FlightDialog
          tripId={tripId}
          trigger={
            <Button>
              <Plus className="h-4 w-4" /> Add Flight
            </Button>
          }
        />
      </div>
      <div className="flex flex-col gap-4">
        {flights.map((flight) => (
          <FlightCard key={flight.id} tripId={tripId} flight={flight} />
        ))}
      </div>
    </div>
  );
}
