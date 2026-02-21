import { Button } from "@/components/ui/button";

type HeroProps = {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  ctaLink?: string;
  background?: string;
};

export function Hero({
  headline = "Título aqui",
  subheadline = "Subtítulo aqui",
  ctaText = "Clique aqui",
  ctaLink = "#",
  background
}: HeroProps) {
  return (
    <section
      className="py-20 px-4"
      style={{ backgroundColor: background || "#f9fafb" }}
    >
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">{headline}</h1>
        <p className="text-xl text-muted-foreground mb-8">{subheadline}</p>
        <Button variant="destructive" size="lg" asChild>
          <a href={ctaLink}>{ctaText}</a>
        </Button>
      </div>
    </section>
  );
}
