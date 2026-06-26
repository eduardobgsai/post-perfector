import React, { useState, useEffect } from "react";
import { searchFonts } from "@/lib/GoogleFontSyncService";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Check, Type } from "lucide-react";
import { toast } from "sonner";

interface GoogleFont {
  family: string;
  category: string;
  variants: string[];
}

export const parseVariant = (variant: string) => {
  if (!variant) return { fontWeight: '400', fontStyle: 'normal', isItalic: false };
  
  const isItalic = variant.includes('italic');
  let weight = variant.replace('italic', '');
  
  if (weight === 'regular' || weight === '') {
    weight = '400';
  }
  
  return {
    fontWeight: weight,
    fontStyle: isItalic ? 'italic' : 'normal',
    isItalic
  };
};

const loadGoogleFont = (fontFamily: string, variant?: string) => {
  if (!fontFamily) return;
  
  let href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}`;
  
  if (variant) {
    const { fontWeight, isItalic } = parseVariant(variant);
    if (isItalic) {
      href += `:ital,wght@1,${fontWeight}`;
    } else {
      href += `:wght@${fontWeight}`;
    }
  }
  
  href += `&display=swap`;
  
  const linkId = `font-${fontFamily.replace(/\s+/g, '-')}-${variant || 'default'}`;
  if (!document.getElementById(linkId)) {
    const link = document.createElement('link');
    link.id = linkId;
    link.href = href;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
};

const getFontStyle = (fontFamily: string, variant: string) => {
  if (!fontFamily) return {};
  const { fontWeight, fontStyle } = parseVariant(variant);
  return { fontFamily, fontWeight, fontStyle };
};

export function TypographySettings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [primaryFont, setPrimaryFont] = useState("");
  const [primaryFontWeight, setPrimaryFontWeight] = useState("");
  const [primaryFontVariants, setPrimaryFontVariants] = useState<string[]>([]);
  
  const [secondaryFont, setSecondaryFont] = useState("");
  const [secondaryFontWeight, setSecondaryFontWeight] = useState("");
  const [secondaryFontVariants, setSecondaryFontVariants] = useState<string[]>([]);

  const [primarySearch, setPrimarySearch] = useState("");
  const [primaryResults, setPrimaryResults] = useState<GoogleFont[]>([]);
  const [isSearchingPrimary, setIsSearchingPrimary] = useState(false);

  const [secondarySearch, setSecondarySearch] = useState("");
  const [secondaryResults, setSecondaryResults] = useState<GoogleFont[]>([]);
  const [isSearchingSecondary, setIsSearchingSecondary] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTypography();
    }
  }, [user]);

  const fetchTypography = async () => {
    try {
      const { data, error } = await supabase
        .from("brand_typography")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setPrimaryFont(data.primary_font);
        setPrimaryFontWeight(data.primary_font_weight);
        setSecondaryFont(data.secondary_font || "");
        setSecondaryFontWeight(data.secondary_font_weight || "");
        
        // Fetch variants for selected fonts to populate the dropdowns
        if (data.primary_font) {
           const fonts = await searchFonts({ data: { query: data.primary_font, limit: 1 } });
           if (fonts.length > 0) setPrimaryFontVariants(fonts[0].variants);
        }
        if (data.secondary_font) {
           const fonts = await searchFonts({ data: { query: data.secondary_font, limit: 1 } });
           if (fonts.length > 0) setSecondaryFontVariants(fonts[0].variants);
        }
      }
    } catch (err) {
      console.error("Erro ao buscar tipografia:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const searchGoogleFonts = async (query: string) => {
    try {
      const fonts = await searchFonts({ data: { query, limit: 10 } });
      return fonts;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsSearchingPrimary(true);
      const results = await searchGoogleFonts(primarySearch);
      setPrimaryResults(results);
      setIsSearchingPrimary(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [primarySearch]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsSearchingSecondary(true);
      const results = await searchGoogleFonts(secondarySearch);
      setSecondaryResults(results);
      setIsSearchingSecondary(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [secondarySearch]);

  // Load fonts for preview
  useEffect(() => {
    primaryResults.forEach(font => loadGoogleFont(font.family));
  }, [primaryResults]);

  useEffect(() => {
    secondaryResults.forEach(font => loadGoogleFont(font.family));
  }, [secondaryResults]);

  useEffect(() => {
    if (primaryFont) loadGoogleFont(primaryFont, primaryFontWeight);
  }, [primaryFont, primaryFontWeight]);

  useEffect(() => {
    if (secondaryFont) loadGoogleFont(secondaryFont, secondaryFontWeight);
  }, [secondaryFont, secondaryFontWeight]);

  const handleSave = async () => {
    if (!primaryFont) {
      toast.error("A fonte primária é obrigatória.");
      return;
    }
    if (!primaryFontWeight) {
      toast.error("O peso da fonte primária é obrigatório.");
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        user_id: user?.id,
        primary_font: primaryFont,
        primary_font_weight: primaryFontWeight,
        secondary_font: secondaryFont || null,
        secondary_font_weight: secondaryFontWeight || null,
      };

      const { data: existing } = await supabase
        .from("brand_typography")
        .select("id")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("brand_typography")
          .update(payload)
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("brand_typography")
          .insert([payload]);
        if (error) throw error;
      }

      toast.success("Tipografia salva com sucesso!");
    } catch (err: any) {
      console.error(err);
      toast.error(`Erro ao salvar tipografia: ${err.message || 'Erro desconhecido'}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="mt-8 border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Type className="h-5 w-5" /> Tipografia
        </CardTitle>
        <CardDescription>
          Defina as fontes que serão usadas como padrão nos seus posts. Buscamos diretamente do Google Fonts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Primary Font */}
        <div className="space-y-4 rounded-lg border border-border p-4 bg-background/50">
          <div>
            <h3 className="font-semibold text-sm mb-1">Fonte Primária (Obrigatório)</h3>
            <p className="text-xs text-muted-foreground mb-3">Usada para títulos e textos principais.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Buscar Família</label>
              <Input
                value={primarySearch}
                onChange={(e) => setPrimarySearch(e.target.value)}
                placeholder={primaryFont || "Ex: Montserrat"}
                onFocus={() => setPrimarySearch("")}
              />
              {primarySearch && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {isSearchingPrimary ? (
                    <div className="p-2 text-xs text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" /> Buscando...
                    </div>
                  ) : primaryResults.length > 0 ? (
                    primaryResults.map((font) => (
                      <button
                        key={font.family}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={() => {
                          setPrimaryFont(font.family);
                          setPrimaryFontVariants(font.variants);
                          setPrimaryFontWeight(font.variants.includes("regular") ? "regular" : font.variants[0]);
                          setPrimarySearch("");
                        }}
                      >
                        <span style={{ fontFamily: font.family, fontSize: '1.1em' }}>{font.family}</span> <span className="text-xs text-muted-foreground">({font.category})</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-2 text-xs text-muted-foreground">Nenhuma fonte encontrada.</div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Peso (Weight)</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={primaryFontWeight}
                onChange={(e) => setPrimaryFontWeight(e.target.value)}
                disabled={!primaryFontVariants.length}
              >
                {!primaryFontVariants.length && <option value="">Selecione uma fonte primeiro</option>}
                {primaryFontVariants.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          {primaryFont && (
             <div className="mt-4 p-4 rounded-md border border-border bg-card">
               <div className="text-sm text-muted-foreground mb-2">Preview da Fonte:</div>
               <div className="text-2xl text-foreground" style={getFontStyle(primaryFont, primaryFontWeight)}>
                 O rápido raposa marrom pula sobre o cão preguiçoso
               </div>
               <div className="mt-2 text-xs text-primary font-medium">Selecionada: {primaryFont} ({primaryFontWeight})</div>
             </div>
          )}
        </div>

        {/* Secondary Font */}
        <div className="space-y-4 rounded-lg border border-border p-4 bg-background/50">
          <div>
            <h3 className="font-semibold text-sm mb-1">Fonte Secundária (Opcional)</h3>
            <p className="text-xs text-muted-foreground mb-3">Usada para subtítulos ou detalhes.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Buscar Família</label>
              <Input
                value={secondarySearch}
                onChange={(e) => setSecondarySearch(e.target.value)}
                placeholder={secondaryFont || "Ex: Roboto"}
                onFocus={() => setSecondarySearch("")}
              />
              {secondarySearch && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {isSearchingSecondary ? (
                    <div className="p-2 text-xs text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" /> Buscando...
                    </div>
                  ) : secondaryResults.length > 0 ? (
                    secondaryResults.map((font) => (
                      <button
                        key={font.family}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                        onClick={() => {
                          setSecondaryFont(font.family);
                          setSecondaryFontVariants(font.variants);
                          setSecondaryFontWeight(font.variants.includes("regular") ? "regular" : font.variants[0]);
                          setSecondarySearch("");
                        }}
                      >
                        <span style={{ fontFamily: font.family, fontSize: '1.1em' }}>{font.family}</span> <span className="text-xs text-muted-foreground">({font.category})</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-2 text-xs text-muted-foreground">Nenhuma fonte encontrada.</div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Peso (Weight)</label>
              <select
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={secondaryFontWeight}
                onChange={(e) => setSecondaryFontWeight(e.target.value)}
                disabled={!secondaryFontVariants.length}
              >
                <option value="">Nenhum / Padrão</option>
                {secondaryFontVariants.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          {secondaryFont && (
             <div className="mt-4 p-4 rounded-md border border-border bg-card">
               <div className="text-sm text-muted-foreground mb-2 flex justify-between">
                 <span>Preview da Fonte Secundária:</span>
                 <button 
                   onClick={() => {
                      setSecondaryFont("");
                      setSecondaryFontWeight("");
                      setSecondaryFontVariants([]);
                   }}
                   className="text-destructive hover:underline text-xs"
                 >
                   Remover Fonte
                 </button>
               </div>
               <div className="text-xl text-foreground" style={getFontStyle(secondaryFont, secondaryFontWeight)}>
                 O rápido raposa marrom pula sobre o cão preguiçoso
               </div>
               <div className="mt-2 text-xs text-primary font-medium">
                 Selecionada: {secondaryFont} {secondaryFontWeight ? `(${secondaryFontWeight})` : ''}
               </div>
             </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving || !primaryFont}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            Salvar Tipografia
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
