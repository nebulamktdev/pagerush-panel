import { Button } from "@/components/ui/button";

type CtaProps = {
  title?: string;
  button?: string;
  link?: string;
};

export function Cta({
  title = "Pronto para começar?",
  button = "Começar agora",
  link = "#"
}: CtaProps) {
  return (
    <section className="py-20 px-4 bg-destructive text-white">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl font-bold mb-8">{title}</h2>
        <Button variant="secondary" size="lg" asChild>
          <a href={link}>{button}</a>
        </Button>
      </div>
    </section>
  );
}
