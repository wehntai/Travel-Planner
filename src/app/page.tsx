import { Container } from "@/components/layout/container";

export default function Home() {
  return (
    <Container className="flex flex-1 items-center justify-center py-24 text-center">
      <p className="text-muted-foreground">Your trips will show up here.</p>
    </Container>
  );
}
