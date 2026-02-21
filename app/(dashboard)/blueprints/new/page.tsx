"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ModeToggle } from "@/components/mode-toggle";
import { toast } from "sonner";

export default function NewBlueprintPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    type: "landing",
    niche: "",
    tags: "",
    description: "",
    github_repo_url: "",
    vercel_preview_url: "",
    screenshot_url: "",
  });

  function handleChange(field: string, value: string) {
    setFormData({ ...formData, [field]: value });
  }

  function nextStep() {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }

  function prevStep() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { error } = await supabase.from("blueprints").insert({
      name: formData.name.trim(),
      type: formData.type,
      niche: formData.niche.trim() || null,
      tags: tagsArray,
      description: formData.description.trim() || null,
      github_repo_url: formData.github_repo_url.trim(),
      vercel_preview_url: formData.vercel_preview_url.trim(),
      screenshot_url: formData.screenshot_url.trim() || null,
    });

    if (error) {
      console.error("Error creating blueprint:", error);
      toast.error("Erro ao criar template");
    } else {
      toast.success("Template criado com sucesso!");
      router.push("/blueprints");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative">
      <div className="absolute top-8 right-8">
        <ModeToggle />
      </div>
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Novo Template</h1>
          <p className="text-muted-foreground mt-2">
            Passo {currentStep} de 3
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 w-20 rounded-full transition-colors ${
                step <= currentStep ? "bg-destructive" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && "Informações Básicas"}
              {currentStep === 2 && "Detalhes do Template"}
              {currentStep === 3 && "Links e Recursos"}
            </CardTitle>
            <CardDescription>
              {currentStep === 1 && "Nome, tipo e nicho do template"}
              {currentStep === 2 && "Tags e descrição"}
              {currentStep === 3 && "URLs do GitHub e Vercel"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Informações Básicas */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Template *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Landing Page Dentista"
                      autoFocus
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo *</Label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => handleChange("type", e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                      <option value="landing">Landing Page</option>
                      <option value="site">Site</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="niche">Nicho</Label>
                    <Input
                      id="niche"
                      value={formData.niche}
                      onChange={(e) => handleChange("niche", e.target.value)}
                      placeholder="dentist, lawyer, restaurant..."
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Detalhes */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleChange("tags", e.target.value)}
                      placeholder="modern, clean, responsive (separado por vírgula)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Descreva o template..."
                      className="min-h-[150px]"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Links */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="github_repo_url">GitHub Repository URL *</Label>
                    <Input
                      id="github_repo_url"
                      value={formData.github_repo_url}
                      onChange={(e) => handleChange("github_repo_url", e.target.value)}
                      placeholder="https://github.com/user/repo.git"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vercel_preview_url">Vercel Preview URL *</Label>
                    <Input
                      id="vercel_preview_url"
                      value={formData.vercel_preview_url}
                      onChange={(e) => handleChange("vercel_preview_url", e.target.value)}
                      placeholder="https://project.vercel.app"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="screenshot_url">Screenshot URL (opcional)</Label>
                    <Input
                      id="screenshot_url"
                      value={formData.screenshot_url}
                      onChange={(e) => handleChange("screenshot_url", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 justify-between pt-4">
                <div>
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                    >
                      Voltar
                    </Button>
                  )}
                  {currentStep === 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/blueprints")}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>

                <div className="flex gap-3">
                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={nextStep}
                    >
                      Próximo
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={loading}
                    >
                      {loading ? "Criando..." : "Criar Template"}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Step Labels */}
        <div className="flex justify-center gap-8 mt-6 text-sm text-muted-foreground">
          <div className={currentStep === 1 ? "text-foreground font-medium" : ""}>
            1. Básicas
          </div>
          <div className={currentStep === 2 ? "text-foreground font-medium" : ""}>
            2. Detalhes
          </div>
          <div className={currentStep === 3 ? "text-foreground font-medium" : ""}>
            3. Links
          </div>
        </div>
      </div>
    </div>
  );
}
