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
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

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

type ReviewPost = {
  id: string;
  format: Format;
  caption: string;
  image: string;
  prompt: string;
};

type ScheduledPost = {
  id: string;
  format: Format;
  caption: string;
  image: string;
  scheduledFor: string;
};

type HistoryPost = {
  id: string;
  format: Format;
  caption: string;
  image: string;
  status: "Publicado" | "Recusado";
  date: string;
};

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23f1efea'/><text x='50%' y='50%' font-family='Inter,sans-serif' font-size='16' fill='%23a8a29e' text-anchor='middle' dominant-baseline='middle'>imagem gerada</text></svg>`,
  );

const initialReview: ReviewPost[] = [
  {
    id: "r1",
    format: "Feed",
    caption:
      "Comece a semana com clareza. Três passos simples para organizar suas ideias antes do café esfriar. ☕",
    image: PLACEHOLDER_IMG,
    prompt: "Post motivacional sobre produtividade de segunda-feira",
  },
  {
    id: "r2",
    format: "Reels",
    caption:
      "Você não precisa de uma nova ferramenta. Precisa de um sistema. Veja como simplificar o seu fluxo em 30 segundos.",
    image: PLACEHOLDER_IMG,
    prompt: "Reels curto sobre simplificar fluxo de trabalho",
  },
  {
    id: "r3",
    format: "Stories",
    caption: "Enquete: qual seu maior bloqueio criativo hoje? 👇",
    image: PLACEHOLDER_IMG,
    prompt: "Story com enquete sobre criatividade",
  },
];

const initialScheduled: ScheduledPost[] = [
  {
    id: "s1",
    format: "Feed",
    caption: "Lançamento amanhã. Marque na agenda.",
    image: PLACEHOLDER_IMG,
    scheduledFor: "2026-06-20T09:00",
  },
];

const initialHistory: HistoryPost[] = [
  {
    id: "h1",
    format: "Feed",
    caption: "Obrigado pelos 10k. Vocês fazem isso ser possível.",
    image: PLACEHOLDER_IMG,
    status: "Publicado",
    date: "2026-06-12",
  },
  {
    id: "h2",
    format: "Reels",
    caption: "Versão antiga descartada na revisão.",
    image: PLACEHOLDER_IMG,
    status: "Recusado",
    date: "2026-06-10",
  },
];

function App() {
  const [view, setView] = useState<View>("review");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [reviewPosts, setReviewPosts] = useState<ReviewPost[]>(initialReview);
  const [scheduled, setScheduled] = useState<ScheduledPost[]>(initialScheduled);
  const [history, setHistory] = useState<HistoryPost[]>(initialHistory);

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

  const handleApprovePublish = (post: ReviewPost) => {
    setReviewPosts((p) => p.filter((x) => x.id !== post.id));
    setHistory((h) => [
      {
        id: post.id,
        format: post.format,
        caption: post.caption,
        image: post.image,
        status: "Publicado",
        date: new Date().toISOString().slice(0, 10),
      },
      ...h,
    ]);
  };

  const handleSchedule = (post: ReviewPost, when: string) => {
    setReviewPosts((p) => p.filter((x) => x.id !== post.id));
    setScheduled((s) => [
      { id: post.id, format: post.format, caption: post.caption, image: post.image, scheduledFor: when },
      ...s,
    ]);
  };

  const handleReject = (post: ReviewPost) => {
    setReviewPosts((p) => p.filter((x) => x.id !== post.id));
    setHistory((h) => [
      {
        id: post.id,
        format: post.format,
        caption: post.caption,
        image: post.image,
        status: "Recusado",
        date: new Date().toISOString().slice(0, 10),
      },
      ...h,
    ]);
  };

  const handleRequestChange = (post: ReviewPost, note: string) => {
    setReviewPosts((p) =>
      p.map((x) =>
        x.id === post.id
          ? { ...x, caption: `[Ajuste solicitado: ${note}] ${x.caption}` }
          : x,
      ),
    );
  };

  const handleGenerate = (format: Format, prompt: string) => {
    const id = `r${Date.now()}`;
    setReviewPosts((p) => [
      {
        id,
        format,
        prompt,
        image: PLACEHOLDER_IMG,
        caption: `Conteúdo gerado a partir do prompt: "${prompt.slice(0, 80)}${prompt.length > 80 ? "…" : ""}"`,
      },
      ...p,
    ]);
    setView("review");
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
              onApprovePublish={handleApprovePublish}
              onSchedule={handleSchedule}
              onReject={handleReject}
              onRequestChange={handleRequestChange}
            />
          )}
          {view === "scheduled" && <ScheduledList posts={scheduled} />}
          {view === "history" && <HistoryList posts={history} />}
        </main>
      </div>
    </div>
  );
}

function SectionShell({ children, max = "max-w-3xl" }: { children: ReactNode; max?: string }) {
  return <div className={`mx-auto w-full ${max}`}>{children}</div>;
}

const GENERATE_WEBHOOK_URL =
  "https://n8n.bgiax.cloud/webhook-test/6119f397-36f8-48b6-9408-bfacd284f211";

const LOADING_MESSAGES = [
  "Analisando sua imagem e prompt...",
  "A IA está roteirizando e gerando o vídeo mágico...",
  "Escrevendo uma legenda de alta performance...",
  "Finalizando os últimos detalhes..."
];

const generateMediaAPI = async (imageFile: File | null, prompt: string, format: string): Promise<{ videoUrl: string; generatedCaption: string }> => {
  const formData = new FormData();
  formData.append("prompt", prompt);
  formData.append("format", format);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await fetch(GENERATE_WEBHOOK_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Falha ao se comunicar com o webhook");
  }

  const result = await response.json();

  if (result.status === "success" && result.data) {
    return {
      videoUrl: result.data.videoUrls,
      generatedCaption: result.data.caption,
    };
  }

  throw new Error("Formato de resposta inválido");
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
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("");

  // Estados: preview
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (step === "generating") {
      let msgIndex = 0;
      setLoadingMessage(LOADING_MESSAGES[0]);
      setProgress(0);

      const interval = setInterval(() => {
        msgIndex++;
        if (msgIndex < LOADING_MESSAGES.length) {
          setLoadingMessage(LOADING_MESSAGES[msgIndex]);
        }
        setProgress((p) => Math.min(p + 25, 95));
      }, 1500);

      generateMediaAPI(file, prompt, format)
        .then((result) => {
          clearInterval(interval);
          setProgress(100);
          setTimeout(() => {
            setVideoUrl(result.videoUrl);
            setCaption(result.generatedCaption);
            setStep("preview");
          }, 600);
        })
        .catch(() => {
          clearInterval(interval);
          setError("Falha ao gerar o conteúdo. Tente novamente.");
          setStep("idle");
        });

      return () => clearInterval(interval);
    }
  }, [step, file, prompt]);

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
        <div className="flex flex-col items-center justify-center space-y-8 py-20 text-center animate-in fade-in duration-500">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-accent/50 shadow-inner">
            <Loader2 className="absolute h-12 w-12 animate-spin text-foreground/80" />
            <Wand2 className="h-6 w-6 text-muted-foreground animate-pulse" />
          </div>
          <div className="space-y-4 w-full max-w-md">
            <h3 className="text-xl font-medium text-foreground tracking-tight transition-all duration-300">
              {loadingMessage}
            </h3>
            <Progress value={progress} className="h-2 w-full transition-all duration-500" />
            <p className="text-sm text-muted-foreground">Por favor, aguarde. O seu post está sendo gerado e isso pode levar alguns minutos...</p>
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
            Seu post foi gerado e publicado no Instagram. Acompanhe o engajamento diretamente no app.
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
      <form onSubmit={(e) => { e.preventDefault(); if (prompt.trim()) setStep("generating"); }} className="space-y-6">
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
          <label className="mb-2 block text-sm font-medium text-foreground">Imagem Base (Opcional)</label>
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
              dragging ? "border-foreground bg-accent/50" : "border-border bg-card hover:bg-accent/30 hover:border-foreground/50"
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
          <p className="text-sm text-destructive font-medium bg-destructive/10 px-3 py-2 rounded-md" role="alert">
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
  onApprovePublish,
  onSchedule,
  onReject,
  onRequestChange,
}: {
  posts: ReviewPost[];
  onApprovePublish: (p: ReviewPost) => void;
  onSchedule: (p: ReviewPost, when: string) => void;
  onReject: (p: ReviewPost) => void;
  onRequestChange: (p: ReviewPost, note: string) => void;
}) {
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
          <ReviewCard
            key={post.id}
            post={post}
            onApprovePublish={() => onApprovePublish(post)}
            onSchedule={(when) => onSchedule(post, when)}
            onReject={() => onReject(post)}
            onRequestChange={(note) => onRequestChange(post, note)}
          />
        ))}
      </div>
    </SectionShell>
  );
}

function ReviewCard({
  post,
  onApprovePublish,
  onSchedule,
  onReject,
  onRequestChange,
}: {
  post: ReviewPost;
  onApprovePublish: () => void;
  onSchedule: (when: string) => void;
  onReject: () => void;
  onRequestChange: (note: string) => void;
}) {
  const [approveOpen, setApproveOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);
  const [when, setWhen] = useState("");
  const [note, setNote] = useState("");

  return (
    <article className="overflow-hidden rounded-md border border-border bg-card">
      <div className="flex flex-col gap-4 p-4 sm:flex-row">
        <img
          src={post.image}
          alt="Pré-visualização do post"
          className="h-40 w-full shrink-0 rounded-md border border-border object-cover sm:h-32 sm:w-32"
        />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground">
              {post.format}
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 text-[11px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              Pendente
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground">{post.caption}</p>
        </div>
      </div>

      <div className="border-t border-border bg-secondary/30 px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => {
              setApproveOpen((v) => !v);
              setChangeOpen(false);
              setScheduleOpen(false);
            }}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-foreground hover:bg-accent"
          >
            <Check className="h-3.5 w-3.5" />
            Aprovar
          </button>
          <button
            onClick={() => {
              setChangeOpen((v) => !v);
              setApproveOpen(false);
              setScheduleOpen(false);
            }}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-foreground hover:bg-accent"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Pedir Alteração
          </button>
          <button
            onClick={onReject}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-destructive hover:bg-accent"
          >
            Recusar
          </button>
        </div>

        {approveOpen && (
          <div className="mt-2 flex flex-wrap gap-1.5 border-t border-border pt-2">
            <button
              onClick={onApprovePublish}
              className="rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background hover:opacity-90"
            >
              Publicar Agora
            </button>
            <button
              onClick={() => setScheduleOpen((v) => !v)}
              className="rounded-md border border-border px-2.5 py-1 text-xs hover:bg-accent"
            >
              Agendar
            </button>
            {scheduleOpen && (
              <div className="mt-2 flex w-full flex-wrap items-center gap-2">
                <input
                  type="datetime-local"
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  className="rounded-md border border-border bg-card px-2 py-1 text-xs outline-none focus:border-foreground"
                />
                <button
                  disabled={!when}
                  onClick={() => onSchedule(when)}
                  className="rounded-md bg-foreground px-2.5 py-1 text-xs font-medium text-background hover:opacity-90 disabled:opacity-50"
                >
                  Confirmar
                </button>
              </div>
            )}
          </div>
        )}

        {changeOpen && (
          <div className="mt-2 flex flex-col gap-2 border-t border-border pt-2 sm:flex-row">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="O que a IA deve corrigir?"
              className="flex-1 rounded-md border border-border bg-card px-2 py-1.5 text-xs outline-none focus:border-foreground"
            />
            <button
              disabled={!note.trim()}
              onClick={() => {
                onRequestChange(note.trim());
                setNote("");
                setChangeOpen(false);
              }}
              className="rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background hover:opacity-90 disabled:opacity-50"
            >
              Enviar Ajuste
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function ScheduledList({ posts }: { posts: ScheduledPost[] }) {
  if (posts.length === 0) {
    return (
      <SectionShell>
        <EmptyState title="Nenhum post agendado" description="Aprove um post e escolha 'Agendar' para vê-lo aqui." />
      </SectionShell>
    );
  }
  return (
    <SectionShell>
      <ul className="divide-y divide-border rounded-md border border-border bg-card">
        {posts.map((p) => (
          <li key={p.id} className="flex items-center gap-3 p-3">
            <img src={p.image} alt="" className="h-12 w-12 shrink-0 rounded border border-border object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{p.caption}</p>
              <p className="text-xs text-muted-foreground">
                {p.format} · {new Date(p.scheduledFor).toLocaleString("pt-BR")}
              </p>
            </div>
            <CalendarClock className="h-4 w-4 shrink-0 text-muted-foreground" />
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}

function HistoryList({ posts }: { posts: HistoryPost[] }) {
  if (posts.length === 0) {
    return (
      <SectionShell>
        <EmptyState title="Sem histórico ainda" description="Posts publicados ou recusados aparecerão aqui." />
      </SectionShell>
    );
  }
  return (
    <SectionShell>
      <ul className="divide-y divide-border rounded-md border border-border bg-card">
        {posts.map((p) => (
          <li key={p.id} className="flex items-center gap-3 p-3">
            <img src={p.image} alt="" className="h-12 w-12 shrink-0 rounded border border-border object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">{p.caption}</p>
              <p className="text-xs text-muted-foreground">
                {p.format} · {new Date(p.date).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] ${
                p.status === "Publicado"
                  ? "bg-accent text-muted-foreground"
                  : "text-destructive"
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
