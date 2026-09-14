import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getTrip } from "@/lib/data/trips";
import { BucketListView } from "@/components/trips/bucket-list/bucket-list-view";

export default async function BucketListPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const items = await prisma.bucketListItem.findMany({
    where: { tripId },
    orderBy: { createdAt: "desc" },
  });

  return <BucketListView tripId={tripId} items={items} />;
}
