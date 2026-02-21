"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ModeToggle } from "@/components/mode-toggle";
import { toast } from "sonner";

type Blueprint = {
  id: string;
  name: string;
  type: string;
  niche: string | null;
  tags: string[];
  description: string | null;
  github_repo_url: string;
  vercel_preview_url: string;
  screenshot_url: string | null;
};

export default function EditBlueprintPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
      toast.error("Erro ao carregar blueprint");
    } else {
      setBlueprint(data);
      setFormData({
        name: data.name || "",
        type: data.type || "landing",
        niche: data.niche || "",
        tags: data.tags?.join(", ") || "",
        description: data.description || "",
        github_repo_url: data.github_repo_url || "",
        vercel_preview_url: data.vercel_preview_url || "",
        screenshot_url: data.screenshot_url || "",
      });
    }
    setLoading(false);
  }

  function handleChange(field: string, value: string) {
    setFormData({ ...formData, [field]: value });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    const tagsArray = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { error } = await supabase
      .from("blueprints")
      .update({
        name: formData.name.trim(),
        type: formData.type,
        niche: formData.niche.trim() || null,
        tags: tagsArray,
        description: formData.description.trim() || null,
        github_repo_url: formData.github_repo_url.trim(),
        vercel_preview_url: formData.vercel_preview_url.trim(),
        screenshot_url: formData.screenshot_url.trim() || null,
      })
      .eq("id", id);

    if (error) {
      console.error("Error saving blueprint:", error);
      toast.error("Erro ao salvar");
    } else {
      toast.success("Salvo com sucesso!");
      router.push("/blueprints");
    }
    setSaving(false);
  }

  async function handleDelete() {
    setDeleting(true);
    setShowDeleteDialog(false);

    const { error } = await supabase
      .from("blueprints")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting blueprint:", error);
      toast.error("Erro ao deletar template");
      setDeleting(false);
    } else {
      toast.success("Template deletado com sucesso!");
      router.push("/blueprints");
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!blueprint) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Template não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Editar Template - {blueprint.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            Atualize as informações do template
          </p>
        </div>
        <ModeToggle />
      </div>

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card Esquerdo - Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Nome, tipo e detalhes do template
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
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
                  placeholder="Descrição do template..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card Direito - Links e Recursos */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Links e Recursos</CardTitle>
                <CardDescription>
                  URLs do repositório e preview
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
              </CardContent>
            </Card>

            {/* Botões de Ação */}
            <div className="flex gap-3">
              <Button
                type="submit"
                variant="destructive"
                disabled={saving || deleting}
              >
                {saving ? "Salvando..." : "Salvar"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/blueprints")}
                disabled={saving || deleting}
              >
                Voltar
              </Button>
            </div>

            {/* Zona de Perigo */}
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                <CardDescription>
                  Ações irreversíveis. Tenha cuidado ao usar esta opção.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Deletar Template</p>
                    <p className="text-sm text-muted-foreground">
                      Esta ação não pode ser desfeita.
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    disabled={saving || deleting}
                  >
                    {deleting ? "Deletando..." : "Deletar"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a deletar o template &quot;{blueprint?.name}&quot;.
              <br />
              <br />
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
