"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  created_at: string;
};

export default function BlueprintsPage() {
  const router = useRouter();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [filteredBlueprints, setFilteredBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [search, setSearch] = useState("");
  const [nicheFilter, setNicheFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    loadBlueprints();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, nicheFilter, typeFilter, blueprints]);

  async function loadBlueprints() {
    setLoading(true);
    const { data, error} = await supabase
      .from("blueprints")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading blueprints:", error);
    } else {
      setBlueprints(data || []);
    }
    setLoading(false);
  }

  function applyFilters() {
    let filtered = [...blueprints];

    if (search) {
      filtered = filtered.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (nicheFilter && nicheFilter !== "all") {
      filtered = filtered.filter((b) => b.niche === nicheFilter);
    }

    if (typeFilter && typeFilter !== "all") {
      filtered = filtered.filter((b) => b.type === typeFilter);
    }

    setFilteredBlueprints(filtered);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast.success("Comando copiado!");
  }

  const uniqueNiches = Array.from(new Set(blueprints.map((b) => b.niche).filter(Boolean)));
  const uniqueTypes = Array.from(new Set(blueprints.map((b) => b.type)));

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie seus templates de landing pages e sites
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button
            variant="destructive"
            size="lg"
            onClick={() => router.push("/blueprints/new")}
          >
            Novo Template
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Input
                placeholder="Buscar por nome..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <Select value={nicheFilter} onValueChange={setNicheFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos os nichos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os nichos</SelectItem>
                  {uniqueNiches.map((niche) => (
                    <SelectItem key={niche} value={niche || "unknown"}>
                      {niche}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : (
        <>
          {filteredBlueprints.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center">
                  Nenhum template encontrado.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlueprints.map((blueprint) => (
                <Card key={blueprint.id} className="hover:border-primary transition-colors flex flex-col">
                  {/* Preview Image */}
                  <div className="p-4 pb-0">
                    <div className="aspect-video w-full bg-muted rounded-lg overflow-hidden">
                      {blueprint.screenshot_url ? (
                        <img
                          src={blueprint.screenshot_url}
                          alt={blueprint.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-muted-foreground text-sm">Sem preview</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <CardHeader className="flex-1">
                    <CardTitle className="line-clamp-1">{blueprint.name}</CardTitle>
                    <CardDescription className="mt-2 line-clamp-2">
                      {blueprint.description || "Sem descrição"}
                    </CardDescription>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <Badge variant="outline">{blueprint.type}</Badge>
                      {blueprint.niche && (
                        <Badge variant="secondary">{blueprint.niche}</Badge>
                      )}
                      {blueprint.tags?.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                      {blueprint.tags && blueprint.tags.length > 2 && (
                        <Badge variant="outline">+{blueprint.tags.length - 2}</Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => window.open(blueprint.vercel_preview_url, "_blank")}
                        className="w-full"
                      >
                        Preview
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => copyToClipboard(`git clone ${blueprint.github_repo_url}`)}
                          className="flex-1"
                        >
                          Clone
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/blueprints/${blueprint.id}`)}
                          className="flex-1"
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
