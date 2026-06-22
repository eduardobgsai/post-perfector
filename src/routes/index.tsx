import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, type ReactNode, useEffect } from "react";
import {
  PenSquare,
  Inbox,
  CalendarClock,
  History,
  Menu,
  X,
  Upload,
  Check,
  Clock,
  Edit3,
  Sparkles,
  Loader2,
  Wand2,
  Send,
  CheckCircle2,
  Instagram,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Postly — Revisão de Posts com IA" },
      {
        name: "description",
        content:
          "Gerencie, revise e agende postagens de redes sociais geradas por IA com uma interface minimalista.",
      },
    ],
  }),
  component: App,
});

type View = "new" | "review" | "scheduled" | "history";

type Format = "Feed" | "Reels" | "Stories";

export type GeneratedPost = {
  id: string;
  prompt: string;
  status: "Gerando" | "Aguardando Aprovação" | "Aprovada" | "Publicar Agora" | "Postada";
  agendada?: boolean;
  format: string;
  image_url: string;
  video_url: string;
  caption: string;
  created_at: string;
};

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23f1efea'/><text x='50%' y='50%' font-family='Inter,sans-serif' font-size='16' fill='%23a8a29e' text-anchor='middle' dominant-baseline='middle'>imagem gerada</text></svg>`,
  );

function App() {
  const [view, setView] = useState<View>("review");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [reviewPosts, setReviewPosts] = useState<GeneratedPost[]>([]);
  const [scheduled, setScheduled] = useState<GeneratedPost[]>([]);
  const [history, setHistory] = useState<GeneratedPost[]>([]);

  // Modal State
  const [selectedPost, setSelectedPost] = useState<GeneratedPost | null>(null);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("generated_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar posts:", error);
      } else if (data) {
        setReviewPosts(data.filter((p) => p.status === "Aguardando Aprovação"));
        setScheduled(data.filter((p) => p.status === "Aprovada" && p.agendada === true));
        setHistory(data.filter((p) => p.status === "Postada" || p.status === "Publicar Agora" || (p.status === "Aprovada" && !p.agendada)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [view]);

  const navItems: { id: View; label: string; icon: typeof Inbox; count?: number }[] = [
    { id: "new", label: "Novo Post", icon: PenSquare },
    { id: "review", label: "Aguardando Revisão", icon: Inbox, count: reviewPosts.length },
    { id: "scheduled", label: "Agendados", icon: CalendarClock, count: scheduled.length },
    { id: "history", label: "Histórico", icon: History },
  ];

  const titles: Record<View, string> = {
    new: "Novo Post",
    review: "Aguardando Revisão",
    scheduled: "Agendados",
    history: "Histórico",
  };

  const handleApprovePublish = (post: GeneratedPost) => {
    setReviewPosts((p) => p.filter((x) => x.id !== post.id));
    setHistory((h) => [
      {
        ...post,
        status: "Publicado",
      },
      ...h,
    ]);
  };

  const handleSchedule = (post: GeneratedPost, when: string) => {
    setReviewPosts((p) => p.filter((x) => x.id !== post.id));
    setScheduled((s) => [
      {
        ...post,
        status: "Agendado",
      },
      ...s,
    ]);
  };

  const handleReject = (post: GeneratedPost) => {
    setReviewPosts((p) => p.filter((x) => x.id !== post.id));
    setHistory((h) => [
      {
        ...post,
        status: "Recusado",
      },
      ...h,
    ]);
  };

  const handleRequestChange = (post: GeneratedPost, note: string) => {
    setReviewPosts((p) =>
      p.map((x) =>
        x.id === post.id ? { ...x, caption: `[Ajuste solicitado: ${note}] ${x.caption}` } : x,
      ),
    );
  };

  const handleGenerate = (format: Format, prompt: string) => {
    setView("review");
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-secondary/40 transition-transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2 text-sm font-semibold tracking-tight">
            <div className="grid h-6 w-6 place-items-center rounded-md bg-foreground text-background">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            Postly
          </div>
          <button
            className="rounded-md p-1 text-muted-foreground hover:bg-accent md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </span>
                {typeof item.count === "number" && item.count > 0 && (
                  <span className="rounded bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur md:px-8">
          <button
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <h1 className="truncate text-sm font-medium">{titles[view]}</h1>
        </header>

        <main className="px-4 py-6 md:px-8 md:py-8">
          {view === "new" && <NewPostForm onGenerate={handleGenerate} />}
          {view === "review" && (
            <ReviewList
              posts={reviewPosts}
              isLoading={isLoading}
              onPreview={(post) => setSelectedPost(post)}
            />
          )}
          {view === "scheduled" && <ScheduledList posts={scheduled} isLoading={isLoading} onPreview={(post) => setSelectedPost(post)} />}
          {view === "history" && <HistoryList posts={history} isLoading={isLoading} onPreview={(post) => setSelectedPost(post)} />}
        </main>
      </div>

      <PostDetailsModal 
        post={selectedPost} 
        onClose={() => setSelectedPost(null)} 
        onUpdate={() => fetchPosts()}
        onLocalUpdate={(updatedPost) => setSelectedPost(updatedPost)}
      />
    </div>
  );
}

function SectionShell({ children, max = "max-w-3xl" }: { children: ReactNode; max?: string }) {
  return <div className={`mx-auto w-full ${max}`}>{children}</div>;
}

const GENERATE_WEBHOOK_URL =
  "https://webhook.bgiax.cloud/webhook/6119f397-36f8-48b6-9408-bfacd284f211";

const LOADING_MESSAGES = [
  "Analisando sua imagem e prompt...",
  "A IA está roteirizando e gerando o vídeo mágico...",
  "Escrevendo uma legenda de alta performance...",
  "Finalizando os últimos detalhes...",
];

const generateMediaAPI = async (
  imageFile: File | null,
  prompt: string,
  format: string,
): Promise<{ videoUrl: string; generatedCaption: string }> => {
  let imageUrl = "";

  // 1. Gerar UUID único para o post
  const postId =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });

  // 2. Upload da imagem para o Supabase Storage se houver
  if (imageFile) {
    const fileExt = imageFile.name.split(".").pop() || "jpg";
    const filePath = `entradas/${postId}.${fileExt}`;

    const { error } = await supabase.storage.from("midias_posts").upload(filePath, imageFile, {
      upsert: true,
    });

    if (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      throw new Error("Erro ao fazer upload da imagem para o Supabase Storage: " + error.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("midias_posts").getPublicUrl(filePath);

    imageUrl = publicUrl;
  }

  // 3. Enviar o ID e os dados para o webhook do n8n
  const apiFormat = format === "Feed" ? "VIDEO" : format === "Reels" ? "REELS" : format.toUpperCase();

  const response = await fetch(GENERATE_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: postId,
      format: apiFormat,
      prompt,
      image: imageUrl || null,
      timestamp: new Date().toISOString(),
    }),
  });

  if (!response.ok) {
    throw new Error("Falha ao se comunicar com o webhook");
  }

  // 4. Polling no Supabase na tabela 'generated_posts' aguardando o processamento assíncrono do n8n
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 60; // 3 minutos no total (60 tentativas * 3s)

    const interval = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        clearInterval(interval);
        reject(
          new Error(
            "Tempo limite excedido aguardando o post ser gerado no Supabase. Verifique se o fluxo do n8n foi concluído.",
          ),
        );
        return;
      }

      try {
        const { data, error } = await supabase
          .from("generated_posts")
          .select("video_url, caption")
          .eq("id", postId)
          .maybeSingle();

        if (error) {
          console.error("Erro ao fazer polling no Supabase:", error);
          return; // ignora falhas de rede temporárias e tenta novamente
        }

        // Se o registro foi encontrado e tem o vídeo e legenda preenchidos
        if (data && data.video_url && data.caption) {
          clearInterval(interval);
          resolve({
            videoUrl: data.video_url,
            generatedCaption: data.caption,
          });
        }
      } catch (err) {
        console.error("Erro na busca do post:", err);
      }
    }, 3000);
  });
};

const publishToInstagramAPI = async (videoUrl: string, finalCaption: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2500); // 2.5 segundos de mock
  });
};

type FlowState = "idle" | "generating" | "preview" | "success";

function NewPostForm({ onGenerate }: { onGenerate: (f: Format, p: string) => void }) {
  const [step, setStep] = useState<FlowState>("idle");
  const [format, setFormat] = useState<Format>("Feed");
  const [prompt, setPrompt] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Estados: generating
  const [loadingMessage, setLoadingMessage] = useState("");

  // Estados: preview
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (step === "generating") {
      let msgIndex = 0;
      setLoadingMessage(LOADING_MESSAGES[0]);

      const interval = setInterval(() => {
        msgIndex++;
        if (msgIndex < LOADING_MESSAGES.length) {
          setLoadingMessage(LOADING_MESSAGES[msgIndex]);
        }
      }, 1500);

      generateMediaAPI(file, prompt, format)
        .then((result) => {
          clearInterval(interval);
          setTimeout(() => {
            setVideoUrl(result.videoUrl);
            setCaption(result.generatedCaption);
            setStep("preview");
          }, 600);
        })
        .catch((err) => {
          clearInterval(interval);
          console.error("Erro ao gerar conteúdo:", err);
          setError(
            err instanceof Error ? err.message : "Falha ao gerar o conteúdo. Tente novamente.",
          );
          setStep("idle");
        });

      return () => clearInterval(interval);
    }
  }, [step, file, prompt, format]);

  const handlePublish = async () => {
    setIsPublishing(true);
    setError(null);
    try {
      await publishToInstagramAPI(videoUrl, caption);
      setStep("success");
    } catch (err) {
      setError("Falha ao publicar. Tente novamente.");
    } finally {
      setIsPublishing(false);
    }
  };

  const resetForm = () => {
    setStep("idle");
    setPrompt("");
    setFile(null);
    setFileName(null);
    setVideoUrl("");
    setCaption("");
    setError(null);
    setIsPublishing(false);
  };

  if (step === "generating") {
    return (
      <SectionShell>
        <style>{`
          @keyframes gradient-xy {
            0%, 100% { background-size: 400% 400%; background-position: left center; }
            50% { background-size: 200% 200%; background-position: right center; }
          }
          .animate-gradient-xy { animation: gradient-xy 8s ease infinite; }
        `}</style>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/50 shadow-sm transition-all">
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-xy opacity-80" />
          
          <div className="relative z-10 flex flex-col items-center justify-center space-y-8 py-24 text-center animate-in fade-in duration-500">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-background/60 shadow-md backdrop-blur-md">
              <Loader2 className="absolute h-12 w-12 animate-spin text-primary/80" />
              <Wand2 className="h-6 w-6 text-muted-foreground animate-pulse" />
            </div>
            <div className="space-y-4 w-full max-w-md px-4">
              <h3 className="text-2xl font-medium text-foreground tracking-tight transition-all duration-300">
                {loadingMessage}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                Por favor, aguarde. O seu post está sendo gerado e isso pode levar alguns minutos...
              </p>
            </div>
          </div>
        </div>
      </SectionShell>
    );
  }

  if (step === "preview") {
    return (
      <SectionShell max="max-w-md">
        <div className="flex flex-col space-y-5 animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Revisão Final</h2>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <Instagram className="h-3.5 w-3.5" /> Instagram {format}
            </span>
          </div>

          <Card className="overflow-hidden border-border bg-card shadow-sm">
            {/* Mock Header Instagram */}
            <div className="flex items-center gap-3 p-3 border-b border-border bg-secondary/10">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[1.5px]">
                <div className="h-full w-full rounded-full bg-card border-2 border-card" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-none">seu_perfil</span>
                <span className="text-xs text-muted-foreground mt-1">Agora mesmo</span>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video sm:aspect-[4/5] bg-black flex items-center justify-center">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  className="max-h-full max-w-full object-contain"
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <Skeleton className="h-full w-full rounded-none" />
              )}
            </div>

            <CardContent className="p-4 space-y-4 bg-card">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Edit3 className="h-4 w-4" /> Sua legenda
                </label>
                <Textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="min-h-[120px] resize-none text-sm focus-visible:ring-1 p-3 leading-relaxed"
                  placeholder="Escreva sua legenda aqui..."
                />
              </div>
            </CardContent>
          </Card>

          {error && <p className="text-sm text-destructive text-center font-medium">{error}</p>}

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={() => setStep("idle")}
              disabled={isPublishing}
              className="w-full sm:w-auto flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50"
            >
              Descartar e Tentar Novamente
            </button>
            <button
              onClick={handlePublish}
              disabled={isPublishing || !caption.trim()}
              className="w-full sm:w-[55%] inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isPublishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isPublishing ? "Publicando..." : "Aprovar e Postar no Instagram"}
            </button>
          </div>
        </div>
      </SectionShell>
    );
  }

  if (step === "success") {
    return (
      <SectionShell>
        <Card className="flex flex-col items-center justify-center p-10 text-center border-border shadow-sm max-w-md mx-auto mt-6 animate-in zoom-in-95 duration-500">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Sucesso!</h2>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Seu post foi gerado e publicado no Instagram. Acompanhe o engajamento diretamente no
            app.
          </p>
          <button
            onClick={resetForm}
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90 transition-opacity"
          >
            <PenSquare className="h-4 w-4" />
            Criar Novo Post
          </button>
        </Card>
      </SectionShell>
    );
  }

  // Estado: idle
  return (
    <SectionShell>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (prompt.trim()) setStep("generating");
        }}
        className="space-y-6"
      >
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Formato</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as Format)}
            className="w-full rounded-md border border-border bg-card px-3 py-2.5 text-sm outline-none focus:border-foreground"
          >
            <option>Feed</option>
            <option>Reels</option>
            <option>Stories</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Imagem Base (Opcional)
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) {
                setFileName(f.name);
                setFile(f);
              }
            }}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-12 text-center transition-all duration-200 ${
              dragging
                ? "border-foreground bg-accent/50"
                : "border-border bg-card hover:bg-accent/30 hover:border-foreground/50"
            }`}
          >
            <Upload className="mb-3 h-6 w-6 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              {fileName ?? "Arraste uma imagem ou clique para selecionar"}
            </p>
            <p className="mt-1.5 text-xs text-muted-foreground">PNG, JPG até 10MB</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  setFileName(f.name);
                  setFile(f);
                } else {
                  setFileName(null);
                  setFile(null);
                }
              }}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">Prompt da IA</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            placeholder="Descreva detalhadamente o post que você quer gerar…"
            className="w-full resize-none rounded-md border border-border bg-card px-3 py-3 text-sm outline-none focus:border-foreground leading-relaxed"
          />
        </div>

        {error && (
          <p
            className="text-sm text-destructive font-medium bg-destructive/10 px-3 py-2 rounded-md"
            role="alert"
          >
            {error}
          </p>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all hover:scale-[1.02] hover:opacity-90 disabled:opacity-50 disabled:hover:scale-100"
            disabled={!prompt.trim()}
          >
            <Sparkles className="h-4 w-4" />
            Gerar Conteúdo Mágico
          </button>
        </div>
      </form>
    </SectionShell>
  );
}

function ReviewList({
  posts,
  isLoading,
  onPreview,
}: {
  posts: GeneratedPost[];
  isLoading: boolean;
  onPreview: (p: GeneratedPost) => void;
}) {
  if (isLoading) {
    return (
      <SectionShell>
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </SectionShell>
    );
  }

  if (posts.length === 0) {
    return (
      <SectionShell>
        <EmptyState
          title="Nada para revisar"
          description="Quando a IA gerar novos posts, eles aparecerão aqui para sua aprovação."
        />
      </SectionShell>
    );
  }
  return (
    <SectionShell max="max-w-5xl">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {posts.map((post) => (
          <ReviewCard key={post.id} post={post} onPreview={() => onPreview(post)} />
        ))}
      </div>
    </SectionShell>
  );
}

function ReviewCard({ post, onPreview }: { post: GeneratedPost; onPreview: () => void }) {
  return (
    <article
      onClick={onPreview}
      className="overflow-hidden rounded-md border border-border bg-card cursor-pointer hover:border-foreground/50 transition-colors"
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row">
        {post.image_url ? (
          <img
            src={post.image_url}
            alt="Pré-visualização do post"
            className="h-40 w-full shrink-0 rounded-md border border-border object-cover sm:h-32 sm:w-32"
          />
        ) : (
          <div className="h-40 w-full shrink-0 rounded-md border border-border bg-secondary/50 flex items-center justify-center sm:h-32 sm:w-32">
            <Sparkles className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground uppercase">
              {post.format}
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 text-[11px] text-muted-foreground uppercase">
              <Clock className="h-3 w-3" />
              {post.status}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground line-clamp-3">
            {(post.caption || post.prompt || "").replace(/\\n/g, " ").replace(/\n/g, " ")}
          </p>
        </div>
      </div>
    </article>
  );
}

function ScheduledList({ posts, isLoading, onPreview }: { posts: GeneratedPost[], isLoading: boolean, onPreview: (p: GeneratedPost) => void }) {
  if (isLoading) {
    return (
      <SectionShell>
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </SectionShell>
    );
  }

  if (posts.length === 0) {
    return (
      <SectionShell>
        <EmptyState
          title="Nenhum post agendado"
          description="Aprove um post e escolha 'Agendar' para vê-lo aqui."
        />
      </SectionShell>
    );
  }
  return (
    <SectionShell>
      <ul className="divide-y divide-border rounded-md border border-border bg-card">
        {posts.map((p) => (
          <li key={p.id} onClick={() => onPreview(p)} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors">
            {p.image_url ? (
              <img
                src={p.image_url}
                alt=""
                className="h-12 w-12 shrink-0 rounded border border-border object-cover"
              />
            ) : (
              <div className="h-12 w-12 shrink-0 rounded border border-border bg-secondary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{(p.caption || p.prompt || "").replace(/\\n/g, " ").replace(/\n/g, " ")}</p>
              <p className="text-xs text-muted-foreground uppercase">
                {p.format} · {new Date(p.created_at || Date.now()).toLocaleString("pt-BR")}
              </p>
            </div>
            <CalendarClock className="h-4 w-4 shrink-0 text-muted-foreground" />
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function HistoryList({ posts, isLoading, onPreview }: { posts: GeneratedPost[], isLoading: boolean, onPreview: (p: GeneratedPost) => void }) {
  if (isLoading) {
    return (
      <SectionShell>
        <div className="flex justify-center p-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </SectionShell>
    );
  }

  if (posts.length === 0) {
    return (
      <SectionShell>
        <EmptyState
          title="Sem histórico ainda"
          description="Posts publicados ou recusados aparecerão aqui."
        />
      </SectionShell>
    );
  }
  return (
    <SectionShell>
      <ul className="divide-y divide-border rounded-md border border-border bg-card">
        {posts.map((p) => (
          <li key={p.id} onClick={() => onPreview(p)} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors">
            {p.image_url ? (
              <img
                src={p.image_url}
                alt=""
                className="h-12 w-12 shrink-0 rounded border border-border object-cover"
              />
            ) : (
              <div className="h-12 w-12 shrink-0 rounded border border-border bg-secondary flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{(p.caption || p.prompt || "").replace(/\\n/g, " ").replace(/\n/g, " ")}</p>
              <p className="text-xs text-muted-foreground uppercase">
                {p.format} · {new Date(p.created_at || Date.now()).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] uppercase ${
                p.status === "publicado" ? "bg-accent text-muted-foreground" : "text-destructive"
              }`}
            >
              {p.status}
            </span>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-md border border-dashed border-border bg-card px-6 py-16 text-center">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function PostDetailsModal({
  post,
  onClose,
  onUpdate,
  onLocalUpdate,
}: {
  post: GeneratedPost | null;
  onClose: () => void;
  onUpdate: () => void;
  onLocalUpdate: (p: GeneratedPost) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");

  useEffect(() => {
    setShowDatePicker(false);
    setScheduleDate("");
  }, [post?.id]);

  if (!post) return null;

  const formattedPrompt = post.prompt?.replace(/\\n/g, '\n') || "";
  const formattedCaption = post.caption?.replace(/\\n/g, '\n') || "A IA ainda não gerou a legenda para este post.";

  const handleApprove = async () => {
    if (!post) return;
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from("generated_posts").update({ status: "Aprovada" }).eq("id", post.id).select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Aprovação bloqueada por RLS ou post não encontrado.");
      onLocalUpdate({ ...post, status: "Aprovada" });
      onUpdate();
    } catch (err) {
      console.error(err);
      alert("Erro ao aprovar post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!post) return;
    if (!window.confirm("Tem certeza que deseja recusar e deletar este post permanente?")) return;
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from("generated_posts").delete().eq("id", post.id).select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Exclusão bloqueada por RLS ou post não encontrado.");
      onClose();
      onUpdate();
    } catch (err) {
      console.error(err);
      alert("Erro ao recusar post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostNow = async () => {
    if (!post) return;
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from("generated_posts").update({ status: "Publicar Agora" }).eq("id", post.id).select();
      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Publicação bloqueada por RLS ou post não encontrado.");
      
      onLocalUpdate({ ...post, status: "Publicar Agora" });
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao solicitar publicação instantânea");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleSubmit = async () => {
    if (!post || !scheduleDate) return;
    setIsSubmitting(true);
    try {
      const { data: data1, error: error1 } = await supabase.from("post_agendamentos").insert({
        post_id: post.id,
        data_publicacao: new Date(scheduleDate).toISOString(),
      }).select();
      if (error1) throw error1;
      if (!data1 || data1.length === 0) throw new Error("Insert em post_agendamentos bloqueado por RLS.");

      const { data: data2, error: error2 } = await supabase.from("generated_posts").update({ agendada: true, status: "Aprovada" }).eq("id", post.id).select();
      if (error2) throw error2;
      if (!data2 || data2.length === 0) throw new Error("Update em generated_posts bloqueado por RLS.");

      onLocalUpdate({ ...post, agendada: true, status: "Aprovada" });
      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erro ao agendar post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!post} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="fixed inset-0 z-50 w-screen h-[100dvh] max-w-none max-h-none left-0 top-0 translate-x-0 translate-y-0 rounded-none border-none p-4 md:p-6 lg:p-8 flex flex-col bg-background">
        <DialogHeader className="shrink-0 pb-2 border-b border-border/50">
          <DialogTitle className="text-xl font-bold">Detalhes da Publicação</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6 mt-4 overflow-y-auto lg:overflow-hidden">
          {/* Coluna da Esquerda: Mídia (foco total na imagem/vídeo) */}
          <div className="w-full lg:w-3/5 xl:w-2/3 flex flex-col gap-4 lg:h-full lg:min-h-0">
            <div className="flex-1 min-h-[300px] lg:min-h-0 bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center border border-border/40 relative shadow-inner">
              {post.video_url ? (
                <video 
                  src={post.video_url} 
                  controls 
                  autoPlay 
                  loop 
                  muted 
                  className="max-h-full max-w-full object-contain" 
                />
              ) : post.image_url ? (
                <img 
                  src={post.image_url} 
                  alt="Imagem do post" 
                  className="max-h-full max-w-full object-contain" 
                />
              ) : (
                <div className="w-full h-full bg-secondary flex items-center justify-center text-muted-foreground">
                  <Sparkles className="h-12 w-12" />
                </div>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1.5 bg-secondary/30 p-4 rounded-xl border border-border/30 shrink-0">
              <p><strong>ID:</strong> {post.id}</p>
              <p><strong>Formato:</strong> <span className="uppercase font-semibold text-foreground/80">{post.format}</span></p>
              <p><strong>Status:</strong> <span className="uppercase font-semibold text-foreground/80">{post.status} {post.agendada && "(Agendada)"}</span></p>
              <p><strong>Criado em:</strong> {new Date(post.created_at || Date.now()).toLocaleString("pt-BR")}</p>
            </div>
          </div>

          {/* Coluna da Direita: Textos e Ações */}
          <div className="w-full lg:w-2/5 xl:w-1/3 flex flex-col lg:h-full lg:min-h-0">
            <div className="space-y-6 flex-1 lg:overflow-y-auto pr-0 lg:pr-2 pb-6">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground/95">
                  <Wand2 className="h-4 w-4 text-indigo-500" /> Prompt Original
                </h3>
                <p className="text-sm text-muted-foreground bg-secondary/30 p-4 rounded-xl border border-border/30 italic leading-relaxed whitespace-pre-wrap animate-fade-in">
                  {formattedPrompt}
                </p>
              </div>

              <div className="space-y-2 flex flex-col flex-1 min-h-[220px]">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground/95">
                  <Edit3 className="h-4 w-4 text-indigo-500" /> Legenda
                </h3>
                <Textarea 
                  readOnly
                  value={formattedCaption} 
                  className="flex-1 min-h-[180px] lg:min-h-[280px] resize-none text-sm leading-relaxed p-4 bg-secondary/10 border border-border/40 focus:ring-0 focus-visible:ring-0" 
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border shrink-0 mt-auto bg-background">
              {post.status === "Aguardando Aprovação" && (
                <>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <button
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="flex-1 rounded-md bg-foreground px-3 py-3 text-sm font-semibold text-background hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
                    >
                      Aprovar
                    </button>
                  </div>
                  <button
                    onClick={handleReject}
                    disabled={isSubmitting}
                    className="w-full rounded-md border border-destructive/20 text-destructive bg-destructive/5 px-3 py-2.5 text-sm font-semibold hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Recusar
                  </button>
                </>
              )}

              {post.status === "Aprovada" && !post.agendada && !showDatePicker && (
                <div className="flex flex-wrap gap-2 mb-2">
                  <button
                    onClick={() => setShowDatePicker(true)}
                    className="flex-1 rounded-md bg-indigo-600 text-white px-3 py-3 text-sm font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    Agendar
                  </button>
                  <button
                    onClick={handlePostNow}
                    className="flex-1 rounded-md border border-border px-3 py-3 text-sm font-semibold hover:bg-accent transition-colors cursor-pointer"
                  >
                    Postar Agora
                  </button>
                </div>
              )}

              {showDatePicker && (
                <div className="space-y-4 mb-2 bg-secondary/20 p-4 rounded-xl border border-border/50">
                  <h4 className="text-sm font-medium">Selecione a data e hora de postagem:</h4>
                  <input 
                    type="datetime-local" 
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleScheduleSubmit}
                      disabled={!scheduleDate || isSubmitting}
                      className="flex-1 rounded-md bg-foreground text-background px-3 py-2 text-sm font-medium disabled:opacity-50 cursor-pointer hover:opacity-90"
                    >
                      {isSubmitting ? "Salvando..." : "Confirmar"}
                    </button>
                    <button
                      onClick={() => setShowDatePicker(false)}
                      disabled={isSubmitting}
                      className="flex-1 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
