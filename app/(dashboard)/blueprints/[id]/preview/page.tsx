"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { SectionRenderer } from "@/components/SectionRenderer";

type Blueprint = {
  id: string;
  name: string;
  schema: {
    sections: any[];
  };
};

export default function PreviewPage() {
  const params = useParams();
  const id = params.id as string;

  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlueprint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadBlueprint() {
    setLoading(true);
    const { data, error } = await supabase
      .from("blueprints")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error loading blueprint:", error);
    } else {
      setBlueprint(data);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Carregando preview...</p>
      </div>
    );
  }

  if (!blueprint) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Blueprint não encontrado</p>
      </div>
    );
  }

  if (!blueprint.schema?.sections || blueprint.schema.sections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">
          Nenhuma seção configurada neste blueprint
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SectionRenderer sections={blueprint.schema.sections} />
    </div>
  );
}
