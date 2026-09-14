import { redirect } from "next/navigation";
import { MapPin, Compass } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/identity";
import { joinTripViaLink } from "@/app/actions/sharing";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CoverArt } from "@/components/trips/cover-art";
import { labelFor, MEMBER_ROLES } from "@/lib/constants";

export default async function JoinPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const { error } = await searchParams;

  const shareLink = await prisma.shareLink.findUnique({
    where: { token },
    include: { trip: { include: { members: { include: { user: true } } } } },
  });

  if (!shareLink) {
    return (
      <Container className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Compass className="h-7 w-7 text-muted-foreground" />
        </span>
        <h1 className="font-display text-2xl font-medium">This invite link isn&apos;t valid</h1>
        <p className="max-w-sm text-muted-foreground">
          It may have been regenerated. Ask whoever shared it with you for a new link.
        </p>
      </Container>
    );
  }

  const trip = shareLink.trip;
  const currentUser = await getCurrentUser();

  if (currentUser) {
    const alreadyMember = trip.members.some((m) => m.userId === currentUser.id);
    if (alreadyMember) redirect(`/trips/${trip.id}`);
  }

  return (
    <Container className="flex flex-1 items-center justify-center py-16">
      <Card className="w-full max-w-md overflow-hidden">
        <div className="relative h-32 w-full">
          <CoverArt seed={trip.id} className="h-full w-full" />
        </div>
        <div className="flex flex-col gap-4 p-6">
          <div>
            <Badge variant="brand">Invited as {labelFor(MEMBER_ROLES, shareLink.role)}</Badge>
            <h1 className="mt-2 font-display text-2xl font-medium">{trip.name}</h1>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> {trip.destination}
            </p>
          </div>

          {trip.members.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {trip.members.map((m) => m.user.name).join(", ")} {trip.members.length === 1 ? "is" : "are"} already
              planning this trip.
            </p>
          )}

          <form action={joinTripViaLink.bind(null, token)} className="flex flex-col gap-3">
            {!currentUser && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Your name</Label>
                <Input id="name" name="name" placeholder="e.g. Jordan Lee" required autoFocus />
              </div>
            )}
            {error === "name" && <p className="text-xs text-danger">Please enter your name to continue.</p>}
            <Button type="submit" size="lg">
              Join {trip.name}
            </Button>
          </form>
        </div>
      </Card>
    </Container>
  );
}
