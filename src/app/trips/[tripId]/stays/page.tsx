import { notFound } from "next/navigation";
import { Hotel, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getTrip } from "@/lib/data/trips";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { AccommodationDialog } from "@/components/trips/stays/accommodation-dialog";
import { AccommodationCard } from "@/components/trips/stays/accommodation-card";

export default async function StaysPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const stays = await prisma.accommodation.findMany({
    where: { tripId },
    orderBy: { checkIn: "asc" },
  });

  if (stays.length === 0) {
    return (
      <EmptyState
        icon={Hotel}
        title="No places to stay yet"
        description="Add every hotel and Airbnb for this trip, especially if you're changing cities."
        action={
          <AccommodationDialog
            tripId={tripId}
            trigger={
              <Button>
                <Plus className="h-4 w-4" /> Add Accommodation
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
        <AccommodationDialog
          tripId={tripId}
          trigger={
            <Button>
              <Plus className="h-4 w-4" /> Add Accommodation
            </Button>
          }
        />
      </div>
      <div className="flex flex-col gap-4">
        {stays.map((stay) => (
          <AccommodationCard key={stay.id} tripId={tripId} stay={stay} />
        ))}
      </div>
    </div>
  );
}
