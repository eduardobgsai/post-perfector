import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Adicionamos esta configuração para forçar a compilação para o Vercel
  nitro: {
    preset: "vercel"
  },
  vite: {
  },
});