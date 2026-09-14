import { notFound } from "next/navigation";
import { Users } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { ShareDialog } from "@/components/trips/share-dialog";
import { TravelerRow } from "@/components/trips/traveler-row";
import { getTrip } from "@/lib/data/trips";
import { getOrCreateShareLinks } from "@/lib/data/sharing";
import { getBaseUrl } from "@/lib/base-url";

export default async function TravelersPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  const [{ editor, viewer }, baseUrl] = await Promise.all([
    getOrCreateShareLinks(tripId),
    getBaseUrl(),
  ]);

  const shareDialog = (
    <ShareDialog
      tripId={tripId}
      tripName={trip.name}
      editorUrl={`${baseUrl}/join/${editor.token}`}
      viewerUrl={`${baseUrl}/join/${viewer.token}`}
    />
  );

  if (trip.members.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No travelers yet"
        description="Invite friends to this trip to start planning together."
        action={shareDialog}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">{shareDialog}</div>
      <div className="flex flex-col gap-3">
        {trip.members.map((member) => (
          <TravelerRow key={member.id} tripId={tripId} member={member} />
        ))}
      </div>
    </div>
  );
}
