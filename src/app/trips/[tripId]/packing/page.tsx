import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getTrip } from "@/lib/data/trips";
import { PackingView } from "@/components/trips/packing/packing-view";

export default async function PackingPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const items = await prisma.packingItem.findMany({
    where: { tripId },
    orderBy: { createdAt: "asc" },
  });

  return <PackingView tripId={tripId} items={items} />;
}
