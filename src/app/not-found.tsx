import Link from "next/link";
import { Compass } from "lucide-react";
import { Container } from "@/components/layout/container";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        <Compass className="h-7 w-7 text-muted-foreground" />
      </span>
      <h1 className="font-display text-2xl font-medium">Page not found</h1>
      <p className="max-w-sm text-muted-foreground">
        We couldn&apos;t find what you were looking for. It may have been moved or deleted.
      </p>
      <Link href="/" className={buttonVariants({ variant: "primary" })}>
        Back to your trips
      </Link>
    </Container>
  );
}
