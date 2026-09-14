import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { TripBanner } from "@/components/trips/trip-banner";
import { TripTabs } from "@/components/trips/trip-tabs";
import { getTrip } from "@/lib/data/trips";

export default async function TripLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);

  if (!trip) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <TripBanner trip={trip} />
      <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <Container>
          <TripTabs tripId={trip.id} />
        </Container>
      </div>
      <Container className="flex-1 py-8">{children}</Container>
    </div>
  );
}
