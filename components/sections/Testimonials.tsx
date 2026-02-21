import { Card, CardContent } from "@/components/ui/card";

type TestimonialsProps = {
  items?: Array<{
    name: string;
    text: string;
  }>;
};

export function Testimonials({ items = [] }: TestimonialsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12">O que dizem nossos clientes</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <p className="text-lg mb-4 italic">&ldquo;{item.text || ""}&rdquo;</p>
                <p className="font-semibold">— {item.name || "Anônimo"}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
