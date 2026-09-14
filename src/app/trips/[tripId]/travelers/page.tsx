import { notFound } from "next/navigation";
import { Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { getTrip } from "@/lib/data/trips";
import { labelFor, MEMBER_ROLES } from "@/lib/constants";

export default async function TravelersPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const trip = await getTrip(tripId);
  if (!trip) notFound();

  if (trip.members.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No travelers yet"
        description="Invite friends to this trip to start planning together."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {trip.members.map((member) => (
        <Card key={member.id} className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <Avatar name={member.user.name} color={member.user.avatarColor} size="lg" />
            <div>
              <p className="font-medium">{member.user.name}</p>
              <p className="text-sm text-muted-foreground">
                Joined {new Date(member.joinedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge variant={member.role === "owner" ? "brand" : "outline"}>
            {labelFor(MEMBER_ROLES, member.role)}
          </Badge>
        </Card>
      ))}
    </div>
  );
}
