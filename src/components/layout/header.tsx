import Link from "next/link";
import { Compass } from "lucide-react";
import { Container } from "@/components/layout/container";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-brand-foreground">
            <Compass className="h-4.5 w-4.5" strokeWidth={2.25} />
          </span>
          Wayfarer
        </Link>
      </Container>
    </header>
  );
}
