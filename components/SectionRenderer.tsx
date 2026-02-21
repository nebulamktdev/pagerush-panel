import { Hero } from "./sections/Hero";
import { Proof } from "./sections/Proof";
import { Benefits } from "./sections/Benefits";
import { Process } from "./sections/Process";
import { Testimonials } from "./sections/Testimonials";
import { Cta } from "./sections/Cta";

type Section = {
  type: string;
  [key: string]: any;
};

type SectionRendererProps = {
  sections: Section[];
};

export function SectionRenderer({ sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section.type) {
          case "hero":
            return <Hero key={index} {...section} />;
          case "proof":
            return <Proof key={index} {...section} />;
          case "benefits":
            return <Benefits key={index} {...section} />;
          case "process":
            return <Process key={index} {...section} />;
          case "testimonials":
            return <Testimonials key={index} {...section} />;
          case "cta":
            return <Cta key={index} {...section} />;
          default:
            return (
              <div key={index} className="p-4 bg-yellow-50 border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  Tipo de seção desconhecido: {section.type}
                </p>
              </div>
            );
        }
      })}
    </>
  );
}
