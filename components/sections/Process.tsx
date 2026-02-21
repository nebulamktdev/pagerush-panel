type ProcessProps = {
  title?: string;
  steps?: string[];
};

export function Process({ title = "Como funciona", steps = [] }: ProcessProps) {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl font-bold text-center mb-12">{title}</h2>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-destructive text-white flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div className="flex-1 pt-2">
                <p className="text-lg">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
