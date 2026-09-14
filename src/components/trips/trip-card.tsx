import Image from "next/image";
import Link from "next/link";
import { MapPin, CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AvatarStack } from "@/components/ui/avatar";
import { TripStatusBadge } from "@/components/trips/trip-status-badge";
import { CoverArt } from "@/components/trips/cover-art";
import { formatDateRange } from "@/lib/dates";
import type { getAllTrips } from "@/lib/data/trips";

type Trip = Awaited<ReturnType<typeof getAllTrips>>[number];

export function TripCard({ trip }: { trip: Trip }) {
  return (
    <Link href={`/trips/${trip.id}`} className="group block">
      <Card className="overflow-hidden transition-shadow duration-200 group-hover:shadow-md">
        <div className="relative h-44 w-full overflow-hidden">
          {trip.coverImage ? (
            <Image
              src={trip.coverImage}
              alt={trip.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <CoverArt seed={trip.id} className="h-full w-full transition-transform duration-300 group-hover:scale-105" />
          )}
          <div className="absolute left-3 top-3">
            <TripStatusBadge status={trip.status} />
          </div>
        </div>
        <div className="flex flex-col gap-3 p-5">
          <div>
            <h3 className="font-display text-xl font-medium leading-tight">{trip.name}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{trip.destination}</span>
            </p>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
            {formatDateRange(trip.startDate, trip.endDate)}
          </p>
          {trip.members.length > 0 && (
            <div className="flex items-center justify-between pt-1">
              <AvatarStack
                people={trip.members.map((m) => ({ name: m.user.name, color: m.user.avatarColor }))}
                size="sm"
              />
              <span className="text-xs text-muted-foreground">
                {trip.members.length} traveler{trip.members.length === 1 ? "" : "s"}
              </span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
