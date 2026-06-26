import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Logo = {
  id: string;
  name: string;
  url: string;
};

export function BrandLogos() {
  const { user } = useAuth();
  const [logos, setLogos] = useState<Logo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchLogos();
  }, [user]);

  const fetchLogos = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("brand_logos")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      setLogos(data || []);
    } catch (err: any) {
      console.error(err);
      toast.error(`Erro ao buscar logos: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: publicUrlData } = supabase.storage
        .from('logos')
        .getPublicUrl(filePath);

      // 3. Save to database
      const { data, error: dbError } = await supabase
        .from("brand_logos")
        .insert([{
          user_id: user.id,
          name: file.name,
          url: publicUrlData.publicUrl
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      if (data) {
        setLogos(prev => [...prev, data]);
        toast.success("Logo adicionada com sucesso!");
      }

    } catch (err: any) {
      console.error(err);
      toast.error(`Erro ao fazer upload da logo: ${err.message}`);
    } finally {
      setIsUploading(false);
      // Reset input
      if (event.target) event.target.value = '';
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (!user) return;

    try {
      // Deleta do banco
      const { error: dbError } = await supabase
        .from("brand_logos")
        .delete()
        .eq("id", id);
      if (dbError) throw dbError;

      // Deleta do Storage (extrair o path da URL)
      // O path é algo como: url/logos/user.id/filename
      const urlParts = url.split('/logos/');
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from("logos").remove([filePath]);
      }

      setLogos(prev => prev.filter(l => l.id !== id));
      toast.success("Logo removida!");
    } catch (err: any) {
      console.error(err);
      toast.error(`Erro ao remover logo: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-border/50 bg-card/50">
        <CardContent className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <ImagePlus className="h-5 w-5" /> Logos da Marca
            </CardTitle>
            <CardDescription className="mt-1.5 max-w-md">
              Faça upload das suas logotipos. Elas poderão ser selecionadas e aplicadas nos posts gerados.
            </CardDescription>
          </div>
          <div className="flex shrink-0 relative">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              onChange={handleUpload}
              disabled={isUploading}
            />
            <Button variant="outline" disabled={isUploading} className="pointer-events-none">
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImagePlus className="mr-2 h-4 w-4" />}
              {isUploading ? "Enviando..." : "Adicionar Logo"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {logos.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/30">
            <p className="text-muted-foreground font-medium">
              Nenhuma logo adicionada. Faça o upload da sua primeira logo!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {logos.map((logo) => (
              <div
                key={logo.id}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-background p-2 shadow-sm transition-all hover:shadow-md"
              >
                <div className="aspect-square w-full rounded-lg flex items-center justify-center p-2 bg-accent/20">
                  <img src={logo.url} alt={logo.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="mt-3 flex items-center justify-between px-1">
                  <span className="text-xs font-medium text-foreground/80 truncate w-full" title={logo.name}>
                    {logo.name}
                  </span>
                  <button
                    onClick={() => handleDelete(logo.id, logo.url)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md shrink-0 ml-1"
                    title="Remover Logo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
