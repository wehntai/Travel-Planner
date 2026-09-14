import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getAllTrips = cache(async function getAllTrips() {
  const trips = await prisma.trip.findMany({
    include: {
      members: { include: { user: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Upcoming/in-progress/planning trips first (soonest first), completed trips last.
  return trips.sort((a, b) => {
    const aDone = a.status === "completed";
    const bDone = b.status === "completed";
    if (aDone !== bDone) return aDone ? 1 : -1;

    if (a.startDate && b.startDate) {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    }
    if (a.startDate) return -1;
    if (b.startDate) return 1;
    return 0;
  });
});

export const getTrip = cache(async function getTrip(tripId: string) {
  return prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      members: { include: { user: true } },
    },
  });
});

export const getTripOverview = cache(async function getTripOverview(tripId: string) {
  const [
    bucketListItems,
    packingItems,
    flights,
    accommodations,
    expenses,
    nextItineraryEvent,
  ] = await Promise.all([
    prisma.bucketListItem.findMany({ where: { tripId } }),
    prisma.packingItem.findMany({ where: { tripId } }),
    prisma.flight.findMany({ where: { tripId }, orderBy: { departureDateTime: "asc" } }),
    prisma.accommodation.findMany({ where: { tripId }, orderBy: { checkIn: "asc" } }),
    prisma.expense.findMany({ where: { tripId }, include: { paidBy: true } }),
    prisma.itineraryEvent.findFirst({
      where: { tripId, startAt: { gte: new Date() } },
      orderBy: { startAt: "asc" },
    }),
  ]);

  return {
    bucketListItems,
    packingItems,
    flights,
    accommodations,
    expenses,
    nextItineraryEvent,
  };
});
