import Image from "next/image";
import { MapPin, CalendarDays } from "lucide-react";
import { Container } from "@/components/layout/container";
import { AvatarStack } from "@/components/ui/avatar";
import { TripStatusBadge } from "@/components/trips/trip-status-badge";
import { Share2 } from "lucide-react";
import { CoverArt } from "@/components/trips/cover-art";
import { ShareDialog } from "@/components/trips/share-dialog";
import { Button } from "@/components/ui/button";
import { formatDateRange } from "@/lib/dates";
import { getOrCreateShareLinks } from "@/lib/data/sharing";
import { getBaseUrl } from "@/lib/base-url";
import type { getTrip } from "@/lib/data/trips";

type Trip = NonNullable<Awaited<ReturnType<typeof getTrip>>>;

export async function TripBanner({ trip }: { trip: Trip }) {
  const [{ editor, viewer }, baseUrl] = await Promise.all([
    getOrCreateShareLinks(trip.id),
    getBaseUrl(),
  ]);

  return (
    <div className="relative h-56 w-full overflow-hidden sm:h-72">
      {trip.coverImage ? (
        <Image
          src={trip.coverImage}
          alt={trip.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <CoverArt seed={trip.id} className="h-full w-full" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <Container className="absolute inset-x-0 bottom-0 pb-5">
        <div className="mb-2 flex items-center justify-between gap-3">
          <TripStatusBadge status={trip.status} />
          <div className="flex items-center gap-3">
            {trip.members.length > 0 && (
              <AvatarStack
                people={trip.members.map((m) => ({ name: m.user.name, color: m.user.avatarColor }))}
                size="sm"
              />
            )}
            <ShareDialog
              tripId={trip.id}
              tripName={trip.name}
              editorUrl={`${baseUrl}/join/${editor.token}`}
              viewerUrl={`${baseUrl}/join/${viewer.token}`}
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/40 bg-white/10 text-white hover:bg-white/20"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share
                </Button>
              }
            />
          </div>
        </div>
        <h1 className="font-display text-3xl font-medium text-white sm:text-4xl">{trip.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/90">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            {trip.destination}
          </span>
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDateRange(trip.startDate, trip.endDate)}
          </span>
        </div>
      </Container>
    </div>
  );
}
