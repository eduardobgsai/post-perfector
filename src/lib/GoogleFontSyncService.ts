import { createServerFn } from '@tanstack/react-start';

export interface GoogleFont {
  family: string;
  category: string;
  variants: string[];
}

let fontsCache: GoogleFont[] | null = null;
let fetchPromise: Promise<GoogleFont[]> | null = null;

export async function syncGoogleFonts(): Promise<GoogleFont[]> {
  if (fontsCache) return fontsCache;
  if (fetchPromise) return fetchPromise;

  const apiKey = typeof process !== 'undefined' && process.env.GOOGLE_API_KEY 
    ? process.env.GOOGLE_API_KEY 
    : (import.meta as any).env?.VITE_GOOGLE_API_KEY;

  if (!apiKey) {
    console.error("API KEY do Google Fonts não encontrada. Configure VITE_GOOGLE_API_KEY no arquivo .env");
    return [];
  }

  fetchPromise = (async () => {
    try {
      const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity&fields=items(family,category,variants)`);
      if (!response.ok) {
        throw new Error(`Google Fonts API error: ${response.status}`);
      }
      
      const data = await response.json();
      fontsCache = data.items.map((item: any) => ({
        family: item.family,
        category: item.category,
        variants: item.variants,
      }));
      
      return fontsCache || [];
    } catch (error) {
      console.error("Failed to sync Google Fonts:", error);
      fetchPromise = null;
      return [];
    }
  })();

  return fetchPromise;
}

export const searchFonts = createServerFn({ method: 'GET' })
  .validator((data: { query: string; limit?: number }) => data)
  .handler(async ({ data }) => {
    const fonts = await syncGoogleFonts();
    const query = data.query;
    const limit = data.limit || 10;
    
    if (!query || query.trim() === "") {
      return fonts.slice(0, limit > 0 ? limit : 20);
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = fonts.filter(font => font.family.toLowerCase().includes(lowerQuery));
    
    return filtered.slice(0, limit);
  });
