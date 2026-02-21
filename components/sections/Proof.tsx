type ProofProps = {
  items?: string[];
};

export function Proof({ items = [] }: ProofProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-white border-y">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-wrap justify-center gap-8 items-center">
          {items.map((item, index) => (
            <div key={index} className="text-muted-foreground font-medium">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
