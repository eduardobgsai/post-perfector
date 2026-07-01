import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState, useEffect } from "react";
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Trash2, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Plus
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const getInstagramAuthUrl = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const clientId = process.env.INSTAGRAM_APP_ID;
    const baseUrl = (process.env.VITE_APP_URL || "").replace(/\/$/, "");
    const redirectUri = `${baseUrl}/api/instagram/callback`;
    const state = userId;
    return `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish&response_type=code&state=${state}`;
  });

export const Route = createFileRoute("/integracoes")({
  validateSearch: (search: Record<string, unknown>) => ({
    success: search.success as string | undefined,
    error: search.error as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Integrações — Postly" },
    ],
  }),
  component: IntegracoesPage,
});

type Integracao = {
  id: string;
  plataforma: string;
  access_token: string;
  created_at: string;
};

function IntegracoesPage() {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  
  const [integracao, setIntegracao] = useState<Integracao | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToken, setShowToken] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    
    const fetchIntegracao = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('integracoes')
          .select('*')
          .eq('user_id', user.id)
          .eq('plataforma', 'instagram')
          .maybeSingle();
          
        if (error) throw error;
        setIntegracao(data as Integracao | null);
      } catch (err) {
        console.error("Erro ao buscar integração:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIntegracao();
  }, [user]);

  useEffect(() => {
    if (searchParams.success === 'instagram_connected') {
      toast.success('Instagram conectado com sucesso!');
      navigate({ to: '/integracoes', replace: true });
    } else if (searchParams.error) {
      toast.error('Erro ao conectar Instagram. Tente novamente.');
      navigate({ to: '/integracoes', replace: true });
    }
  }, [searchParams.success, searchParams.error, navigate]);

  const handleConnect = async () => {
    if (!user) return;
    setIsConnecting(true);
    try {
      const url = await getInstagramAuthUrl({ data: user.id });
      window.location.href = url;
    } catch (err) {
      toast.error("Erro ao gerar link de conexão do Instagram.");
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('integracoes')
        .delete()
        .eq('user_id', user.id)
        .eq('plataforma', 'instagram');
        
      if (error) throw error;
      setIntegracao(null);
      toast.success('Instagram desconectado com sucesso.');
    } catch (err) {
      toast.error('Erro ao desconectar Instagram.');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-foreground/50" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur sm:px-6">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          <div className="h-4 w-[1px] bg-border" />
          <h1 className="text-sm font-semibold text-foreground">Integrações</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="container max-w-4xl py-10 px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Contas Conectadas</h2>
          <p className="text-muted-foreground">Gerencie suas conexões com redes sociais para publicação automática.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Instagram Integration Card */}
          <Card className="flex flex-col border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4 bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white shadow-sm">
                  <InstagramIcon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-semibold">Instagram</CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    {integracao ? "Conectado" : "Não conectado"}
                  </CardDescription>
                </div>
              </div>
              {integracao && (
                <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Ativo
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 pt-6">
              {integracao ? (
                <div className="space-y-4">
                  <div className="rounded-md border bg-muted/50 p-3">
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Access Token</label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input 
                          type={showToken ? "text" : "password"} 
                          value={integracao.access_token} 
                          readOnly 
                          className="w-full bg-background border rounded-sm px-3 py-1.5 text-sm font-mono text-foreground focus:outline-none"
                        />
                      </div>
                      <button 
                        onClick={() => setShowToken(!showToken)}
                        className="flex h-8 w-8 items-center justify-center rounded-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                        title={showToken ? "Esconder Token" : "Mostrar Token"}
                      >
                        {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      Conectado em: {new Date(integracao.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground max-w-[250px]">
                    Conecte sua conta do Instagram Business para publicar diretamente do Postly.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-4 pb-4 border-t bg-muted/10">
              {integracao ? (
                <button
                  onClick={handleDisconnect}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  Desconectar Conta
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50"
                >
                  {isConnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Conectar Instagram
                </button>
              )}
            </CardFooter>
          </Card>
          
          {/* Placeholder for future integrations */}
          <Card className="flex flex-col border-border/50 border-dashed bg-muted/10 opacity-70">
            <CardContent className="flex flex-1 flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-medium text-foreground mb-1">Mais integrações</h3>
              <p className="text-xs text-muted-foreground">Em breve suporte para Facebook, TikTok e LinkedIn.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
