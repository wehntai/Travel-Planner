"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { removeMember, updateMemberRole } from "@/app/actions/sharing";
import { labelFor, MEMBER_ROLES } from "@/lib/constants";
import type { TripMember, User } from "@/generated/prisma/client";

export function TravelerRow({
  tripId,
  member,
}: {
  tripId: string;
  member: TripMember & { user: User };
}) {
  const [isPending, startTransition] = useTransition();

  function handleRoleChange(role: string) {
    startTransition(async () => {
      await updateMemberRole(tripId, member.id, role);
      toast.success(`${member.user.name} is now ${labelFor(MEMBER_ROLES, role).toLowerCase()}`);
    });
  }

  if (member.role === "owner") {
    return (
      <Card className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center gap-3">
          <Avatar name={member.user.name} color={member.user.avatarColor} size="lg" />
          <div>
            <p className="font-medium">{member.user.name}</p>
            <p className="text-sm text-muted-foreground">
              Joined {new Date(member.joinedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Badge variant="brand">Owner</Badge>
      </Card>
    );
  }

  return (
    <Card className="flex items-center justify-between gap-4 p-4">
      <div className="flex items-center gap-3">
        <Avatar name={member.user.name} color={member.user.avatarColor} size="lg" />
        <div>
          <p className="font-medium">{member.user.name}</p>
          <p className="text-sm text-muted-foreground">
            Joined {new Date(member.joinedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Select value={member.role} onValueChange={handleRoleChange} disabled={isPending}>
          <SelectTrigger className="h-8 w-28 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MEMBER_ROLES.filter((r) => r.value !== "owner").map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <ConfirmDeleteDialog
          title="Remove this traveler?"
          description={`${member.user.name} will lose access to this trip.`}
          successMessage="Traveler removed"
          onConfirm={() => removeMember(tripId, member.id)}
          trigger={
            <button
              type="button"
              className="rounded p-2 text-muted-foreground hover:bg-danger-light hover:text-danger"
              aria-label={`Remove ${member.user.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          }
        />
      </div>
    </Card>
  );
}
