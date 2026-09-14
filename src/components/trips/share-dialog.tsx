"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Copy, Check, RefreshCw, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { regenerateShareLink } from "@/app/actions/sharing";

function LinkRow({
  tripId,
  role,
  url,
  label,
  description,
}: {
  tripId: string;
  role: "editor" | "viewer";
  url: string;
  label: string;
  description: string;
}) {
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleCopy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleRegenerate() {
    startTransition(async () => {
      await regenerateShareLink(tripId, role);
      toast.success("New link generated — the old one no longer works");
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
      <div className="flex gap-2">
        <Input readOnly value={url} className="flex-1 text-xs" onFocus={(e) => e.target.select()} />
        <Button type="button" variant="outline" size="icon" onClick={handleCopy} aria-label="Copy link">
          {copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleRegenerate}
          disabled={isPending}
          aria-label="Generate a new link"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function ShareDialog({
  tripId,
  tripName,
  editorUrl,
  viewerUrl,
  trigger,
}: {
  tripId: string;
  tripName: string;
  editorUrl: string;
  viewerUrl: string;
  trigger?: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm">
            <Share2 className="h-3.5 w-3.5" /> Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share {tripName}</DialogTitle>
          <DialogDescription>Invite friends to view or help plan this trip.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <LinkRow
            tripId={tripId}
            role="editor"
            url={editorUrl}
            label="Editor link"
            description="Anyone with this link can add and edit everything on this trip."
          />
          <LinkRow
            tripId={tripId}
            role="viewer"
            url={viewerUrl}
            label="Viewer link"
            description="Anyone with this link can view the trip's plans."
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
