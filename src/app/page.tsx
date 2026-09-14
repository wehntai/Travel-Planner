import { MapPinned } from "lucide-react";
import { Container } from "@/components/layout/container";
import { TripCard } from "@/components/trips/trip-card";
import { EmptyState } from "@/components/empty-state";
import { NewTripDialog } from "@/components/trips/new-trip-dialog";
import { Button } from "@/components/ui/button";
import { getAllTrips } from "@/lib/data/trips";
import { getCurrentUser } from "@/lib/identity";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [trips, currentUser] = await Promise.all([getAllTrips(), getCurrentUser()]);

  return (
    <Container className="flex-1 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-medium tracking-tight">Your Trips</h1>
        <p className="mt-1 text-muted-foreground">
          Everywhere you and your friends are headed, all in one place.
        </p>
      </div>

      {trips.length === 0 ? (
        <EmptyState
          icon={MapPinned}
          title="No trips yet"
          description="Once you create a trip, it'll show up here for you and everyone you invite."
          action={
            <NewTripDialog
              needsIdentity={!currentUser}
              trigger={<Button>Create your first trip</Button>}
            />
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </Container>
  );
}
