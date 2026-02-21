import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type BenefitsProps = {
  title?: string;
  items?: Array<{
    title: string;
    desc: string;
  }>;
};

export function Benefits({ title = "Benefícios", items = [] }: BenefitsProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold text-center mb-12">{title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{item.title || "Benefício"}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.desc || ""}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
