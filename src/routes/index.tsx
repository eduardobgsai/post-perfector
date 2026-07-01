import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
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
  ChevronRight,
  ChevronLeft,
  LogOut,
  Palette,
  Video,
  Image,
  Layers,
  Type,
  ShoppingBag,
  ChevronDown,
  Monitor,
  Volume2,
  VolumeX,
  AlertCircle,
  Paperclip,
  Settings,
  ShieldCheck,
  Coins,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { MediaKit } from "@/components/MediaKit";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { AnimatedIcon } from "@/components/AnimatedIcon";

const getInstagramAuthUrl = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const clientId = process.env.INSTAGRAM_APP_ID;
    const baseUrl = (process.env.VITE_APP_URL || "").replace(/\/$/, "");
    const redirectUri = `${baseUrl}/api/instagram/callback`;
    const state = userId;
    return `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=instagram_business_basic%2Cinstagram_business_manage_messages%2Cinstagram_business_manage_comments%2Cinstagram_business_content_publish&response_type=code&state=${state}`;
  });

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    success: search.success as string | undefined,
    error: search.error as string | undefined,
  }),
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

type View = "new" | "review" | "scheduled" | "history" | "media-kit";

type Format = "Feed" | "Reels" | "Stories" | "Carousel";

export type GeneratedPost = {
  id: string;
  prompt: string;
  status: "Gerando" | "Aguardando Aprovação" | "Aprovada" | "Publicar Agora" | "Postada";
  agendada?: boolean;
  format: string;
  image_url: string;
  generated_media: string;
  carrossel_items?: { url: string; ordem: number }[];
  caption: string;
  created_at: string;
  proporcao?: string;
};

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23f1efea'/><text x='50%' y='50%' font-family='Inter,sans-serif' font-size='16' fill='%23a8a29e' text-anchor='middle' dominant-baseline='middle'>imagem gerada</text></svg>`,
  );

function App() {
  const { user, isLoading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, authLoading, navigate]);

  const searchParams = Route.useSearch();
  useEffect(() => {
    if (searchParams.success === 'instagram_connected') {
      toast.success('Instagram conectado com sucesso!');
      navigate({ to: '/', replace: true });
    } else if (searchParams.error) {
      toast.error('Erro ao conectar Instagram. Tente novamente.');
      navigate({ to: '/', replace: true });
    }
  }, [searchParams.success, searchParams.error, navigate]);

  const [view, setView] = useState<View>("review");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

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
        .select("*, carrossel_items:post_carrossel_midias(url:media_url, ordem)")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar posts:", error);
      } else if (data) {
        setReviewPosts(data.filter((p) => p.status === "Aguardando Aprovação"));
        setScheduled(data.filter((p) => p.status === "Aprovada" && p.agendada === true));
        setHistory(
          data.filter(
            (p) =>
              p.status === "Postada" ||
              p.status === "Publicar Agora" ||
              (p.status === "Aprovada" && !p.agendada),
          ),
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [view, user]);

  const navItems: { id: View; label: string; icon: typeof Inbox; count?: number }[] = [
    { id: "new", label: "Novo Post", icon: PenSquare },
    { id: "review", label: "Aguardando Revisão", icon: Inbox, count: reviewPosts.length },
    { id: "scheduled", label: "Agendados", icon: CalendarClock, count: scheduled.length },
    { id: "history", label: "Histórico", icon: History },
    { id: "media-kit", label: "Mídia Kit", icon: Palette },
  ];

  const titles: Record<View, string> = {
    new: "Novo Post",
    review: "Aguardando Revisão",
    scheduled: "Agendados",
    history: "Histórico",
    "media-kit": "Mídia Kit",
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
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-secondary/40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${desktopSidebarOpen ? "md:translate-x-0" : "md:-translate-x-full"}`}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center text-base font-serif font-bold tracking-tight text-foreground/90">
            <img
              src="/logo.png"
              alt="Post Perfector Logo"
              className="h-20 w-20 object-contain dark:invert"
            />
            Post Perfector
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
                className={`group flex w-full items-center justify-between rounded-sm px-2 py-2 text-sm transition-colors duration-300 ease-out ${active
                  ? "bg-foreground/15 text-foreground font-semibold"
                  : "text-foreground/80 font-medium hover:bg-foreground/10 hover:text-foreground"
                  }`}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Icon
                    className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-out stroke-[2.5] ${!active ? "group-hover:animate-icon-wobble text-foreground" : ""}`}
                  />
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

        <div className="absolute bottom-6 left-0 right-0 px-3 flex flex-col gap-1">
          <div className="flex flex-col bg-background/50 rounded-md overflow-hidden border border-border/50">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="group flex w-full items-center justify-between px-2 py-2 text-sm transition-colors duration-300 ease-out text-foreground/80 font-medium hover:bg-foreground/10 hover:text-foreground"
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:animate-icon-wobble stroke-[2.5]" />
                <span className="truncate">Configurações</span>
              </div>
              <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-300 ${showSettings ? "rotate-180" : ""}`} />
            </button>

            {showSettings && (
              <div className="flex flex-col pb-2 px-2 gap-1">
                <button
                  className="flex items-center justify-between rounded-sm px-2 py-1.5 text-xs text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Coins className="h-3.5 w-3.5 shrink-0 stroke-[2.5]" />
                    <span className="truncate">Créditos</span>
                  </div>
                  <span className="text-primary font-medium">R$ 0,00</span>
                </button>
                <button
                  onClick={async () => {
                    if (user) {
                      try {
                        const url = await getInstagramAuthUrl({ data: user.id });
                        window.location.href = url;
                      } catch (err) {
                        toast.error("Erro ao gerar link de conexão do Instagram.");
                      }
                    }
                  }}
                  className="flex items-center justify-between rounded-sm px-2 py-1.5 text-xs text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <AnimatedIcon name="instagram" className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Conectar Instagram</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={signOut}
            className="group flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm transition-colors duration-300 ease-out text-foreground/80 font-medium hover:bg-destructive/20 hover:text-destructive"
          >
            <LogOut className="h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:animate-icon-wobble stroke-[2.5]" />
            <span className="truncate">Sair da Conta</span>
          </button>
        </div>
      </aside>

      <div className={`transition-all duration-300 ${desktopSidebarOpen ? "md:pl-64" : "md:pl-0"}`}>
        <header
          className={`sticky top-0 z-20 flex h-14 items-center gap-3 px-4 md:px-8 ${view === "new" ? "bg-transparent" : "border-b border-border bg-background/80 backdrop-blur"}`}
        >
          <button
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <button
            className="hidden rounded-md p-1.5 text-muted-foreground hover:bg-accent md:block"
            onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
            aria-label="Alternar menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          {view !== "new" && (
            <h1 className="truncate text-lg font-serif font-semibold text-foreground/90">
              {titles[view]}
            </h1>
          )}
          <div className="flex-1" />
          <ThemeToggle />
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
          {view === "scheduled" && (
            <ScheduledList
              posts={scheduled}
              isLoading={isLoading}
              onPreview={(post) => setSelectedPost(post)}
            />
          )}
          {view === "history" && (
            <HistoryList
              posts={history}
              isLoading={isLoading}
              onPreview={(post) => setSelectedPost(post)}
            />
          )}
          {view === "media-kit" && <MediaKit />}
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
  "https://n8n.bgiax.cloud/webhook-test/6119f397-36f8-48b6-9408-bfacd284f211";

const LOADING_MESSAGES = [
  "Analisando sua imagem e prompt...",
  "A IA está roteirizando e gerando o vídeo mágico...",
  "Escrevendo uma legenda de alta performance...",
  "Finalizando os últimos detalhes...",
];

const isVideoUrl = (url: string): boolean => {
  if (!url) return false;
  const cleanUrl = url.split("?")[0].toLowerCase();
  if (
    cleanUrl.endsWith(".png") ||
    cleanUrl.endsWith(".jpg") ||
    cleanUrl.endsWith(".jpeg") ||
    cleanUrl.endsWith(".webp") ||
    cleanUrl.endsWith(".gif")
  ) {
    return false;
  }
  return true;
};

const generateMediaAPI = async (
  imageFiles: File[],
  prompt: string,
  format: string,
  mediaType: "image" | "video",
  userId: string,
  slideCount?: number,
  brandColors?: any[],
  typography?: any,
  logoUrl?: string,
  useText?: boolean,
  tryon?: boolean,
  videoResolution?: string,
  generateAudio?: boolean,
  videoDuration?: string
): Promise<{ videoUrl: string; generatedCaption: string }> => {
  let imageUrls: string[] = [];

  // 1. Gerar UUID único para o post
  const postId =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

  // 2. Upload das imagens para o Supabase Storage
  if (imageFiles && imageFiles.length > 0) {
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const fileExt = file.name.split(".").pop() || "jpg";
      const filePath = `entradas/${postId}_${i}.${fileExt}`;

      const { error } = await supabase.storage.from("midias_posts").upload(filePath, file, {
        upsert: true,
      });

      if (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        throw new Error("Erro ao fazer upload da imagem para o Supabase Storage: " + error.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("midias_posts").getPublicUrl(filePath);

      imageUrls.push(publicUrl);
    }
  }

  // 3. Enviar o ID e os dados para o webhook do n8n
  const apiFormat =
    format === "Feed"
      ? "FEED"
      : format === "Reels"
        ? "REELS"
        : format === "Stories"
          ? "STORIES"
          : format.toUpperCase();

  const resolvedMediaType = format === "Reels" ? "video" : format === "Feed" ? "image" : mediaType;

  const response = await fetch(GENERATE_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: postId,
      user_id: userId,
      format: apiFormat,
      prompt,
      images: imageUrls,
      timestamp: new Date().toISOString(),
      media_type: resolvedMediaType,
      aspect_ratio: format === "Feed" || format === "Carousel" ? "1:1" : "9:16",
      ...(format === "Carousel" && slideCount ? { slide_count: slideCount } : {}),
      ...(brandColors && brandColors.length > 0 ? { brand_colors: brandColors } : {}),
      ...(typography ? {
        typography: typography,
        fontfamily: typography.primary_font,
        fontweight: typography.primary_font_weight
      } : {
        typography: { primary_font: "Roboto", primary_font_weight: "regular" },
        fontfamily: "Roboto",
        fontweight: "regular"
      }),
      ...(logoUrl ? { logo_url: logoUrl } : {}),
      Text: useText !== undefined ? useText : true,
      tryon: tryon !== undefined ? tryon : false,
      ...(resolvedMediaType === "video" ? {
        resolution: videoResolution || "1080p",
        generate_audio: generateAudio !== undefined ? generateAudio : false,
        duration: videoDuration || "4s",
      } : {}),
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
          .select(
            "status, generated_media, caption, format, carrossel_items:post_carrossel_midias(url:media_url, ordem)",
          )
          .eq("id", postId)
          .maybeSingle();

        if (error) {
          console.error("Erro ao fazer polling no Supabase:", error);
          return; // ignora falhas de rede temporárias e tenta novamente
        }

        // Se o registro foi encontrado e o status já avançou para Aguardando Aprovação
        if (data && data.status === "Aguardando Aprovação") {
          clearInterval(interval);

          let previewMediaUrl = data.generated_media;
          if (
            data.format?.toUpperCase() === "CAROUSEL" &&
            data.carrossel_items &&
            data.carrossel_items.length > 0
          ) {
            const sorted = [...data.carrossel_items].sort((a, b) => a.ordem - b.ordem);
            previewMediaUrl = sorted[0].url;
          }

          resolve({
            videoUrl: previewMediaUrl || "",
            generatedCaption: data.caption || "",
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
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [slideCount, setSlideCount] = useState<number>(3);
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mídia Kit
  const [brandColors, setBrandColors] = useState<any[]>([]);
  const [showMediaKitDropdown, setShowMediaKitDropdown] = useState(false);
  const [showColorsSubmenu, setShowColorsSubmenu] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [typography, setTypography] = useState<any>(null);
  const [useTypography, setUseTypography] = useState(true);
  const [logos, setLogos] = useState<any[]>([]);
  const [showLogosSubmenu, setShowLogosSubmenu] = useState(false);
  const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null);
  const [useText, setUseText] = useState(true);
  const [isProductPhoto, setIsProductPhoto] = useState(false);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [videoResolution, setVideoResolution] = useState<"720p" | "1080p" | "4k">("1080p");
  const [generateAudio, setGenerateAudio] = useState(false);
  const [videoDuration, setVideoDuration] = useState<"4s" | "6s" | "8s">("4s");
  const [showResolutionDropdown, setShowResolutionDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [isDraggingGlobal, setIsDraggingGlobal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes("Files")) {
        dragCounter++;
        setIsDraggingGlobal(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes("Files")) {
        dragCounter--;
        if (dragCounter === 0) {
          setIsDraggingGlobal(false);
        }
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setIsDraggingGlobal(false);
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleDrop);
    window.addEventListener("dragover", handleDragOver);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleDrop);
      window.removeEventListener("dragover", handleDragOver);
    };
  }, []);

  const handleFiles = (incomingFiles: FileList | File[]) => {
    const fileArray = Array.from(incomingFiles);
    if (fileArray.length === 0) return;

    setFiles(prevFiles => {
      const newFiles = [...prevFiles, ...fileArray];
      const totalFiles = newFiles.length;

      if (totalFiles > 1) {
        setIsProductPhoto(true);
        const isVideoMode = format === "Reels" || (format === "Stories" && mediaType === "video");
        if (isVideoMode) {
          setFormat("Feed");
          setMediaType("image");
          toast("Múltiplos arquivos detectados. Os modos de vídeo foram desativados e 'Fotos de Produto' ativado.", { duration: 4000 });
        } else if (prevFiles.length <= 1) {
          toast("Múltiplos arquivos detectados. O modo 'Fotos de Produto' foi ativado.", { duration: 4000 });
        }
      }

      return newFiles;
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    setIsDraggingGlobal(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleModeSelection = (newFormat: Format, newMediaType: "image" | "video") => {
    const isNewVideoMode = newFormat === "Reels" || (newFormat === "Stories" && newMediaType === "video");

    if (isNewVideoMode && files.length > 1) {
      toast("Para criar vídeos, remova as imagens adicionais (suporta apenas 1 arquivo).", { duration: 4000 });
      return;
    }

    setFormat(newFormat);
    setMediaType(newMediaType);

    if (newFormat === "Reels") {
      setUseText(false);
    }

    setShowFormatDropdown(false);
  };

  const fetchBrandColors = async () => {
    if (!user) return;
    const [colorsRes, foldersRes, typoRes, logosRes] = await Promise.all([
      supabase.from("brand_colors").select("*").order("sort_order", { ascending: true }),
      supabase.from("brand_color_folders").select("*").order("sort_order", { ascending: true }),
      supabase.from("brand_typography").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("brand_logos").select("*").eq("user_id", user.id).order("created_at", { ascending: true }),
    ]);

    const colors = colorsRes.data || [];
    const folders = foldersRes.data || [];
    setLogos(logosRes.data || []);

    const rootItems = [
      ...folders.map((f) => ({ type: "folder", id: f.id, name: f.name, sort_order: f.sort_order })),
      ...colors
        .filter((c) => !c.folder_id)
        .map((c) => ({ type: "color", id: c.id, hex: c.hex, sort_order: c.sort_order })),
    ].sort((a, b) => a.sort_order - b.sort_order);

    const structuredColors = rootItems.map((item) => {
      if (item.type === "folder") {
        const children = colors
          .filter((c) => c.folder_id === item.id)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((c) => c.hex);
        return { type: "folder", id: item.id, name: item.name, colors: children };
      }
      return { type: "color", id: item.id, hex: item.hex };
    });

    setBrandColors(structuredColors);
    if (typoRes.data) {
      setTypography({
        primary_font: typoRes.data.primary_font,
        primary_font_weight: typoRes.data.primary_font_weight,
        secondary_font: typoRes.data.secondary_font,
        secondary_font_weight: typoRes.data.secondary_font_weight,
      });
    }
  };

  useEffect(() => {
    fetchBrandColors();
  }, [user]);

  // Estados: generating
  const [loadingMessage, setLoadingMessage] = useState("");

  // Estados: preview
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    if (step === "generating") {
      let msgIndex = 0;

      const messages =
        format === "Carousel"
          ? [
            "Analisando sua imagem e prompt...",
            "Estruturando os slides do carrossel...",
            "Gerando imagens visualmente impactantes...",
            "Escrevendo uma legenda de alta conversão...",
            "Sincronizando mídias e finalizando...",
          ]
          : LOADING_MESSAGES;

      setLoadingMessage(messages[0]);

      const interval = setInterval(
        () => {
          msgIndex++;
          if (msgIndex < messages.length) {
            setLoadingMessage(messages[msgIndex]);
          }
        },
        format === "Carousel" ? 3500 : 1500,
      );

      const selectedLogoUrl = selectedLogoId ? logos.find((l) => l.id === selectedLogoId)?.url : undefined;

      generateMediaAPI(
        files,
        prompt,
        format,
        mediaType,
        user?.id || "",
        slideCount,
        selectedFolderId
          ? brandColors.filter((c: any) => c.type === "folder" && c.id === selectedFolderId)
          : undefined,
        useTypography ? typography : undefined,
        selectedLogoUrl,
        useText,
        isProductPhoto,
        videoResolution,
        generateAudio,
        videoDuration
      )
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
  }, [step, files, prompt, format, mediaType, slideCount]);

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
    setFiles([]);
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
              <AnimatedIcon name="instagram" className="h-3.5 w-3.5" /> Instagram {format}
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
                isVideoUrl(videoUrl) ? (
                  <video
                    src={videoUrl}
                    controls
                    className="max-h-full max-w-full object-contain"
                    autoPlay
                    loop
                    muted
                  />
                ) : (
                  <img
                    src={videoUrl}
                    alt="Preview"
                    className="max-h-full max-w-full object-contain"
                  />
                )
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
    <div className="flex flex-col items-center justify-center min-h-[75vh] max-w-3xl mx-auto px-4 w-full animate-in fade-in duration-500">
      <div className="flex flex-col items-center mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-serif text-foreground/90 flex items-center justify-center gap-3">
          O que vamos criar hoje?
        </h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (prompt.trim()) setStep("generating");
        }}
        className="w-full relative"
      >
        <div
          className={`bg-card rounded-2xl border shadow-sm p-3 relative flex flex-col focus-within:border-foreground/30 focus-within:shadow-md transition-all duration-300 ${dragging ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(var(--primary),0.2)] scale-[1.01]" : "border-border"
            }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {isDraggingGlobal && (
            <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl bg-card/80 backdrop-blur-sm border-2 border-dashed transition-colors duration-200 pointer-events-none ${dragging ? "border-primary text-primary" : "border-primary/50 text-muted-foreground"
              }`}>
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-background/80 shadow-sm">
                <Paperclip className="h-6 w-6 mb-1.5" />
                <p className="text-sm">{dragging ? "Solte para anexar" : "Arraste os arquivos para cá"}</p>
              </div>
            </div>
          )}

          <div className="mb-2 relative self-start z-50">
            <button
              type="button"
              onClick={() => setShowFormatDropdown(!showFormatDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-accent/50 text-foreground transition-colors group"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-semibold">{format}</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>

            {showFormatDropdown && (
              <div className="absolute top-full mt-1 left-0 w-48 rounded-xl border border-border/40 bg-card/95 backdrop-blur-md p-1.5 shadow-lg animate-in fade-in slide-in-from-top-2">
                {["Feed", "Reels", "Stories", "Carousel"].map((fmt) => {
                  const isDisabled = fmt === "Reels" && files.length > 1;
                  return (
                    <div key={fmt} className="relative group">
                      <button
                        type="button"
                        onClick={() => {
                          if (isDisabled) return;
                          let newMedia: "image" | "video" = mediaType;
                          if (fmt === "Reels") newMedia = "video";
                          else if (fmt === "Feed") newMedia = "image";
                          handleModeSelection(fmt as Format, newMedia);
                        }}
                        className={`flex items-center w-full px-2 py-2 rounded-lg text-sm transition-colors ${format === fmt ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                          } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="flex items-center w-full gap-2">
                          {fmt === "Feed" && <PenSquare className="h-4 w-4 shrink-0" />}
                          {fmt === "Reels" && <Video className="h-4 w-4 shrink-0" />}
                          {fmt === "Stories" && <Image className="h-4 w-4 shrink-0" />}
                          {fmt === "Carousel" && <Layers className="h-4 w-4 shrink-0" />}
                          <span>{fmt}</span>
                          {format === fmt && !isDisabled && <Check className="h-4 w-4 ml-auto" />}
                        </div>
                      </button>
                      {isDisabled && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg border border-border/40 bg-card/95 backdrop-blur-md shadow-lg text-xs text-amber-500 font-medium animate-in fade-in slide-in-from-left-1 z-50 pointer-events-none">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>Remova fotos extras para ativar</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="Como posso te ajudar hoje?"
            className="w-full resize-none bg-transparent px-3 py-2 text-base md:text-lg outline-none placeholder:text-muted-foreground/60 leading-relaxed text-foreground"
          />

          <div className="flex items-center justify-between mt-2 pt-2">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="file"
                accept="image/*,video/*"
                multiple={!(format === "Reels" || (format === "Stories" && mediaType === "video"))}
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={`flex items-center justify-center h-10 w-10 rounded-full transition-colors ${files.length > 0 ? "bg-primary/10 text-primary" : "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground"}`}
                title={
                  (format === "Reels" || (format === "Stories" && mediaType === "video"))
                    ? "Anexar mídia (Máx 1 arquivo para este modo)"
                    : files.length > 0
                      ? `${files.length} arquivos selecionados`
                      : "Anexar Imagem"
                }
              >
                <Upload className="h-5 w-5" />
              </button>

              {files.length > 0 && (
                <div className="flex items-center pl-3 group">
                  {files.map((f, idx) => (
                    <div
                      key={`${f.name}-${idx}`}
                      className="transition-all duration-300 ease-out group-hover:!ml-2 group-hover:scale-105"
                      style={{
                        marginLeft: idx > 0 ? "-1.5rem" : "0",
                        zIndex: 10 - idx,
                      }}
                    >
                      <ImagePreview
                        file={f}
                        onRemove={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!prompt.trim()}
              className="flex items-center justify-center h-10 w-10 rounded-full bg-foreground text-background transition-transform hover:scale-105 disabled:opacity-30 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-4 text-sm text-destructive font-medium bg-destructive/10 px-3 py-2 rounded-md text-center">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {format === "Stories" && (
            <div className="flex bg-card border border-border p-1 rounded-full items-center gap-1">
              <button
                type="button"
                onClick={() => handleModeSelection("Stories", "image")}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${mediaType === "image" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                Imagem
              </button>
              <div className="relative group flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    if (files.length > 1) return;
                    handleModeSelection("Stories", "video");
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${mediaType === "video" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    } ${files.length > 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Vídeo
                </button>
                {files.length > 1 && (
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg border border-border/40 bg-card/95 backdrop-blur-md shadow-lg text-xs text-amber-500 font-medium animate-in fade-in slide-in-from-bottom-1 z-50 pointer-events-none">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Remova fotos extras para usar vídeo</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            disabled={mediaType === "video"}
            onClick={() => {
              setUseText(!useText);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${mediaType === "video"
              ? "opacity-50 cursor-not-allowed border-border bg-card text-muted-foreground"
              : useText
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-card text-foreground hover:bg-accent hover:border-foreground/20"
              }`}
          >
            <Type className="h-4 w-4" />
            Textos
          </button>

          <button
            type="button"
            onClick={() => setIsProductPhoto(!isProductPhoto)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${isProductPhoto
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-border bg-card text-foreground hover:bg-accent hover:border-foreground/20"
              }`}
          >
            <ShoppingBag className="h-4 w-4" />
            Fotos de Produto
          </button>

          <div className={`relative ${showMediaKitDropdown ? "z-50" : "z-40"}`}>
            <button
              type="button"
              onClick={() => {
                setShowMediaKitDropdown(!showMediaKitDropdown);
                setShowColorsSubmenu(false);
                setShowLogosSubmenu(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${selectedFolderId || selectedLogoId
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-card text-foreground hover:bg-accent hover:border-foreground/20"
                }`}
            >
              <Palette className="h-4 w-4" />
              Mídia Kit
            </button>

            {showMediaKitDropdown && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-56 rounded-lg border border-border/40 bg-card/95 backdrop-blur-md p-1.5 shadow-md animate-in fade-in slide-in-from-top-2 z-30">
                {!showColorsSubmenu && !showLogosSubmenu ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowColorsSubmenu(true)}
                      className="group flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-sm text-foreground hover:bg-accent/50 transition-colors"
                    >
                      <span className="font-medium">Cores</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLogosSubmenu(true)}
                      className="group flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-sm text-foreground hover:bg-accent/50 transition-colors mt-1"
                    >
                      <span className="font-medium">Logos</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </button>
                    {typography ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setUseTypography(!useTypography);
                        }}
                        className="group flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm text-foreground hover:bg-accent/50 transition-colors mt-1"
                      >
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="font-medium">Tipografia</span>
                          <span className="text-[11px] text-muted-foreground">{typography.primary_font}</span>
                        </div>
                        {useTypography ? (
                          <Check className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-sm border border-border shrink-0" />
                        )}
                      </button>
                    ) : (
                      <div className="flex w-full flex-col items-start rounded-sm px-3 py-2 mt-1 opacity-60">
                        <span className="text-sm font-medium text-foreground">Tipografia</span>
                        <span className="text-[11px] text-muted-foreground">Não configurada</span>
                      </div>
                    )}
                  </>
                ) : showColorsSubmenu ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowColorsSubmenu(false)}
                      className="group flex w-full items-center gap-2 rounded-sm px-2 py-2 mb-1 text-xs text-muted-foreground hover:bg-accent/50 transition-colors"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span className="">Voltar</span>
                    </button>
                    <div className="h-px w-full bg-border mb-1" />
                    {brandColors.filter((c: any) => c.type === "folder").length > 0 ? (
                      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                        {brandColors
                          .filter((c: any) => c.type === "folder")
                          .map((folder: any) => (
                            <button
                              key={folder.id}
                              type="button"
                              onClick={() => {
                                setSelectedFolderId(
                                  selectedFolderId === folder.id ? null : folder.id,
                                );
                                setShowMediaKitDropdown(false);
                              }}
                              className={`group flex w-full items-center justify-between rounded-sm px-2 py-2 text-sm text-foreground transition-colors ${selectedFolderId === folder.id ? "bg-accent" : "hover:bg-accent/50"
                                }`}
                            >
                              <span className="text-xs truncate max-w-[100px] text-left">
                                {folder.name}
                              </span>
                              <div className="flex pl-1">
                                {folder.colors.slice(0, 4).map((hex: string, idx: number) => (
                                  <div
                                    key={idx}
                                    className="h-3 w-3 rounded-[2px] border border-black"
                                    style={{
                                      backgroundColor: hex,
                                      marginLeft: idx > 0 ? "-0.4rem" : "0",
                                      zIndex: 10 - idx,
                                    }}
                                  />
                                ))}
                              </div>
                              {selectedFolderId === folder.id && (
                                <Check className="h-3 w-3 text-primary ml-1 shrink-0" />
                              )}
                            </button>
                          ))}
                      </div>
                    ) : (
                      <div className="p-2 text-center text-xs text-muted-foreground">
                        Nenhuma pasta cadastrada.
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowLogosSubmenu(false)}
                      className="group flex w-full items-center gap-2 rounded-sm px-2 py-2 mb-1 text-xs text-muted-foreground hover:bg-accent/50 transition-colors"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span className="">Voltar</span>
                    </button>
                    <div className="h-px w-full bg-border mb-1" />
                    {logos && logos.length > 0 ? (
                      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                        {logos.map((logo: any) => (
                          <button
                            key={logo.id}
                            type="button"
                            onClick={() => {
                              setSelectedLogoId(selectedLogoId === logo.id ? null : logo.id);
                              setShowMediaKitDropdown(false);
                            }}
                            className={`group flex w-full items-center justify-between rounded-sm px-2 py-2 text-sm text-foreground transition-colors ${selectedLogoId === logo.id ? "bg-accent" : "hover:bg-accent/50"
                              }`}
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              <img src={logo.url} alt={logo.name} className="h-4 w-4 object-contain shrink-0" />
                              <span className="text-xs truncate max-w-[100px] text-left">
                                {logo.name}
                              </span>
                            </div>
                            {selectedLogoId === logo.id && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-2 text-center text-xs text-muted-foreground">
                        Nenhuma logo cadastrada.
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {mediaType === "video" && (
          <div className={`mt-4 flex flex-wrap items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 relative ${showResolutionDropdown || showDurationDropdown ? "z-50" : "z-30"}`}>
            <span className="text-xs font-medium text-muted-foreground mr-2">Configurações de Vídeo:</span>

            <div className="relative z-10">
              <button
                type="button"
                onClick={() => setShowResolutionDropdown(!showResolutionDropdown)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors border-border bg-card text-foreground hover:bg-accent hover:border-foreground/20`}
              >
                <Monitor className="h-4 w-4" />
                {videoResolution}
              </button>
              {showResolutionDropdown && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 rounded-lg border border-border/40 bg-card/95 backdrop-blur-md p-1.5 shadow-md animate-in fade-in slide-in-from-bottom-2">
                  {["720p", "1080p", "4k"].map(res => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => {
                        setVideoResolution(res as "720p" | "1080p" | "4k");
                        setShowResolutionDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent/50"
                    >
                      {res}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setGenerateAudio(!generateAudio)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${generateAudio
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-card text-foreground hover:bg-accent hover:border-foreground/20"
                }`}
            >
              {generateAudio ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Áudio
            </button>

            <div className="relative z-10">
              <button
                type="button"
                onClick={() => setShowDurationDropdown(!showDurationDropdown)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors border-border bg-card text-foreground hover:bg-accent hover:border-foreground/20`}
              >
                <Clock className="h-4 w-4" />
                {videoDuration}
              </button>
              {showDurationDropdown && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-24 rounded-lg border border-border/40 bg-card/95 backdrop-blur-md p-1.5 shadow-md animate-in fade-in slide-in-from-bottom-2">
                  {["4s", "6s", "8s"].map(dur => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => {
                        setVideoDuration(dur as "4s" | "6s" | "8s");
                        setShowDurationDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent/50"
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {format === "Carousel" && (
          <div className="mt-6 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-2">
            <label className="text-xs font-medium text-muted-foreground mb-2">
              Quantidade de Slides ({slideCount})
            </label>
            <input
              type="range"
              min="2"
              max="10"
              value={slideCount}
              onChange={(e) => setSlideCount(parseInt(e.target.value))}
              className="w-48 accent-foreground"
            />
          </div>
        )}
      </form>
    </div>
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
      className="group overflow-hidden rounded-xl border border-border/60 bg-card/50 shadow-sm cursor-pointer hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out"
    >
      <div className="flex flex-col gap-4 p-5 sm:flex-row">
        {post.carrossel_items && post.carrossel_items.length > 0 ? (
          <div className="relative h-40 w-full shrink-0 sm:h-32 sm:w-32">
            <img
              src={post.carrossel_items[0].url}
              alt="Pré-visualização do carrossel"
              className="h-full w-full rounded-md border border-border object-cover"
            />
            <div className="absolute top-1.5 right-1.5 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-sm shadow-sm">
              1/{post.carrossel_items.length}
            </div>
          </div>
        ) : post.image_url ? (
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
          <p className="text-sm leading-relaxed text-foreground/80 line-clamp-3">
            {(post.caption || post.prompt || "").replace(/\\n/g, " ").replace(/\n/g, " ")}
          </p>
        </div>
      </div>
    </article>
  );
}

function ScheduledList({
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
          title="Nenhum post agendado"
          description="Aprove um post e escolha 'Agendar' para vê-lo aqui."
        />
      </SectionShell>
    );
  }
  return (
    <SectionShell>
      <ul className="divide-y divide-border/40 rounded-xl border border-border/60 bg-card/50 shadow-sm overflow-hidden">
        {posts.map((p) => (
          <li
            key={p.id}
            onClick={() => onPreview(p)}
            className="group flex items-center gap-4 p-4 cursor-pointer hover:bg-accent/40 transition-all duration-300 ease-out"
          >
            {p.carrossel_items && p.carrossel_items.length > 0 ? (
              <div className="relative h-12 w-12 shrink-0">
                <img
                  src={p.carrossel_items[0].url}
                  alt=""
                  className="h-full w-full rounded border border-border object-cover"
                />
                <div className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold px-1 rounded-full shadow-sm">
                  {p.carrossel_items.length}
                </div>
              </div>
            ) : p.image_url ? (
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
              <p className="truncate text-sm">
                {(p.caption || p.prompt || "").replace(/\\n/g, " ").replace(/\n/g, " ")}
              </p>
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

function HistoryList({
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
          title="Sem histórico ainda"
          description="Posts publicados ou recusados aparecerão aqui."
        />
      </SectionShell>
    );
  }
  return (
    <SectionShell>
      <ul className="divide-y divide-border/40 rounded-xl border border-border/60 bg-card/50 shadow-sm overflow-hidden">
        {posts.map((p) => (
          <li
            key={p.id}
            onClick={() => onPreview(p)}
            className="group flex items-center gap-4 p-4 cursor-pointer hover:bg-accent/40 transition-all duration-300 ease-out"
          >
            {p.carrossel_items && p.carrossel_items.length > 0 ? (
              <div className="relative h-12 w-12 shrink-0">
                <img
                  src={p.carrossel_items[0].url}
                  alt=""
                  className="h-full w-full rounded border border-border object-cover"
                />
                <div className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold px-1 rounded-full shadow-sm">
                  {p.carrossel_items.length}
                </div>
              </div>
            ) : p.image_url ? (
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
              <p className="truncate text-sm">
                {(p.caption || p.prompt || "").replace(/\\n/g, " ").replace(/\n/g, " ")}
              </p>
              <p className="text-xs text-muted-foreground uppercase">
                {p.format} · {new Date(p.created_at || Date.now()).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] uppercase ${p.status === "publicado" ? "bg-accent text-muted-foreground" : "text-destructive"
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

function ImagePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="relative group/img w-14 h-14 shrink-0">
      <img
        src={url}
        alt="Preview"
        className="h-full w-full rounded-md object-cover border-2 border-background shadow-sm"
      />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity shadow-sm hover:scale-110 z-10"
      >
        <X className="h-3 w-3" />
      </button>
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
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setShowDatePicker(false);
    setScheduleDate("");
    setCurrentSlide(0);
  }, [post?.id]);

  if (!post) return null;

  const formattedPrompt = post.prompt?.replace(/\\n/g, "\n") || "";
  const formattedCaption =
    post.caption?.replace(/\\n/g, "\n") || "A IA ainda não gerou a legenda para este post.";

  const handleApprove = async () => {
    if (!post) return;
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("generated_posts")
        .update({ status: "Aprovada" })
        .eq("id", post.id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0)
        throw new Error("Aprovação bloqueada por RLS ou post não encontrado.");
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
      const { data, error } = await supabase
        .from("generated_posts")
        .delete()
        .eq("id", post.id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0)
        throw new Error("Exclusão bloqueada por RLS ou post não encontrado.");
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
      const { data, error } = await supabase
        .from("generated_posts")
        .update({ status: "Publicar Agora" })
        .eq("id", post.id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0)
        throw new Error("Publicação bloqueada por RLS ou post não encontrado.");

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
      const { data: data1, error: error1 } = await supabase
        .from("post_agendamentos")
        .insert({
          post_id: post.id,
          data_publicacao: new Date(scheduleDate).toISOString(),
        })
        .select();
      if (error1) throw error1;
      if (!data1 || data1.length === 0)
        throw new Error("Insert em post_agendamentos bloqueado por RLS.");

      const { data: data2, error: error2 } = await supabase
        .from("generated_posts")
        .update({ agendada: true, status: "Aprovada" })
        .eq("id", post.id)
        .select();
      if (error2) throw error2;
      if (!data2 || data2.length === 0)
        throw new Error("Update em generated_posts bloqueado por RLS.");

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
          <div className="w-full lg:w-3/5 xl:w-2/3 flex flex-col gap-4 lg:h-full lg:min-h-0 items-center justify-center">
            <div className="flex-1 w-full min-h-0 flex items-center justify-center relative bg-black/5 rounded-xl border border-border/40 p-2 lg:p-4">
              {post.format?.toUpperCase() === "CAROUSEL" &&
                post.carrossel_items &&
                post.carrossel_items.length > 0 ? (
                (() => {
                  const sortedItems = [...post.carrossel_items].sort((a, b) => a.ordem - b.ordem);
                  return (
                    <div className="w-full h-full relative flex items-center justify-center">
                      <img
                        src={sortedItems[currentSlide].url}
                        alt={`Slide ${sortedItems[currentSlide].ordem}`}
                        className="max-w-full max-h-full object-contain rounded-lg drop-shadow-sm"
                      />
                      <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm border border-white/10 z-10">
                        {currentSlide + 1} / {sortedItems.length}
                      </div>

                      {currentSlide > 0 && (
                        <button
                          onClick={() => setCurrentSlide((c) => c - 1)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors backdrop-blur-md shadow-lg"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                      )}

                      {currentSlide < sortedItems.length - 1 && (
                        <button
                          onClick={() => setCurrentSlide((c) => c + 1)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors backdrop-blur-md shadow-lg"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      )}

                      <div className="absolute bottom-2 md:bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                        {sortedItems.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-2 h-2 rounded-full backdrop-blur-sm transition-colors shadow-sm ${idx === currentSlide ? "bg-white" : "bg-white/40"}`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()
              ) : post.generated_media ? (
                isVideoUrl(post.generated_media) ? (
                  <video
                    src={post.generated_media}
                    controls
                    autoPlay
                    loop
                    muted
                    className="max-w-full max-h-full object-contain rounded-lg drop-shadow-sm"
                  />
                ) : (
                  <img
                    src={post.generated_media}
                    alt="Mídia gerada"
                    className="max-w-full max-h-full object-contain rounded-lg drop-shadow-sm"
                  />
                )
              ) : post.image_url ? (
                <img
                  src={post.image_url}
                  alt="Imagem do post"
                  className="max-w-full max-h-full object-contain rounded-lg drop-shadow-sm"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/20 rounded-lg">
                  <Sparkles className="h-10 w-10 opacity-50" />
                </div>
              )}
            </div>

            <div className="w-full text-xs text-muted-foreground space-y-2 bg-secondary/30 p-4 rounded-xl border border-border/50 shrink-0 text-left">
              <p>
                <strong>ID:</strong> {post.id}
              </p>
              <p>
                <strong>Formato:</strong>{" "}
                <span className="uppercase font-semibold text-foreground/90">{post.format}</span>
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="uppercase font-semibold text-foreground/90">
                  {post.status} {post.agendada && "(Agendada)"}
                </span>
              </p>
              <p>
                <strong>Criado em:</strong>{" "}
                {new Date(post.created_at || Date.now()).toLocaleString("pt-BR")}
              </p>
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
