import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Plus, Trash2, Check, FolderPlus, Folder, X, ChevronLeft, ChevronRight, Palette } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomColorPicker } from "./CustomColorPicker";
import { TypographySettings } from "./TypographySettings";
import { BrandLogos } from "./BrandLogos";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  pointerWithin,
  rectIntersection,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type BrandColor = {
  id: string;
  hex: string;
  folder_id: string | null;
  sort_order: number;
};

export type BrandColorFolder = {
  id: string;
  name: string;
  sort_order: number;
};

export type MediaKitItem =
  | { type: "color"; data: BrandColor }
  | { type: "folder"; data: BrandColorFolder; children: BrandColor[] };

// Helper: HEX <-> RGB
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : { r: 0, g: 0, b: 0 };
};
const rgbToHex = (r: number, g: number, b: number) =>
  "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();

// --- COMPONENTS ---

function SortableColor({ color, onDelete }: { color: BrandColor; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: color.id,
    data: { type: "color", color },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card p-2 shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing"
    >
      <div className="aspect-video w-full rounded-lg shadow-inner" style={{ backgroundColor: color.hex }} />
      <div className="mt-3 flex items-center justify-between px-1">
        <span className="font-mono text-sm font-medium uppercase text-foreground/80">{color.hex}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(color.id);
          }}
          onPointerDown={(e) => e.stopPropagation()} // Prevent drag start on click
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function SortableFolder({
  folder,
  childrenColors,
  onOpen,
  onDelete,
}: {
  folder: BrandColorFolder;
  childrenColors: BrandColor[];
  onOpen: (folder: BrandColorFolder) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: folder.id,
    data: { type: "folder", folder },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onOpen(folder)}
      className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-2 shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing hover:bg-accent/20"
    >
      <div className="aspect-video w-full rounded-lg bg-accent/30 flex items-center justify-center p-2">
        {childrenColors.length === 0 ? (
          <Folder className="h-8 w-8 text-muted-foreground/50" />
        ) : (
          <div className="flex relative justify-center w-full">
            {childrenColors.slice(0, 4).map((c, i) => (
              <div
                key={c.id}
                className="h-10 w-10 rounded-md border-2 border-black shadow-sm"
                style={{
                  backgroundColor: c.hex,
                  marginLeft: i > 0 ? "-1rem" : "0",
                  zIndex: 10 - i,
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-center justify-between px-1">
        <span className="font-serif text-sm font-medium text-foreground/80 truncate flex items-center gap-1.5">
          <Folder className="h-3.5 w-3.5" />
          {folder.name}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(folder.id);
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Custom collision detection to handle dropping onto a folder
const customCollisionDetection = (args: any) => {
  const pointerIntersections = pointerWithin(args);
  if (pointerIntersections.length > 0) {
    // Check if we are hovering exactly over a folder (to drop into it)
    const hoveredDroppable = pointerIntersections.find((i) => {
      const data = args.droppableContainers.find((c: any) => c.id === i.id)?.data?.current;
      return data?.type === "folder";
    });

    if (hoveredDroppable) {
      // If we are dragging a color, and hovering a folder, return the folder as the target
      if (args.active.data.current?.type === "color") {
        return [hoveredDroppable];
      }
    }
  }

  // Fallback to closest center for sorting
  return closestCenter(args);
};

export function MediaKit() {
  const { user } = useAuth();
  const [colors, setColors] = useState<BrandColor[]>([]);
  const [folders, setFolders] = useState<BrandColorFolder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // States for adding
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newColorHex, setNewColorHex] = useState("#000000");
  const [newColorRgb, setNewColorRgb] = useState({ r: 0, g: 0, b: 0 });
  const [newFolderName, setNewFolderName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // States for opened folder
  const [openedFolder, setOpenedFolder] = useState<BrandColorFolder | null>(null);

  // DnD States
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [colorsRes, foldersRes] = await Promise.all([
        supabase.from("brand_colors").select("*").order("sort_order", { ascending: true }),
        supabase.from("brand_color_folders").select("*").order("sort_order", { ascending: true }),
      ]);
      if (colorsRes.data) setColors(colorsRes.data);
      if (foldersRes.data) setFolders(foldersRes.data);
    } catch (err) {
      console.error("Erro ao buscar Mídia Kit:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith("#")) val = "#" + val;
    setNewColorHex(val);
    if (val.length === 7) setNewColorRgb(hexToRgb(val));
  };
  const handleRgbChange = (channel: "r" | "g" | "b", value: string) => {
    let num = parseInt(value, 10);
    if (isNaN(num)) num = 0;
    if (num > 255) num = 255;
    if (num < 0) num = 0;
    const updated = { ...newColorRgb, [channel]: num };
    setNewColorRgb(updated);
    setNewColorHex(rgbToHex(updated.r, updated.g, updated.b));
  };

  const handleSaveColor = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // Pega o maior sort_order atual para adicionar no final
      const maxSort =
        colors.filter((c) => c.folder_id === (openedFolder ? openedFolder.id : null)).length +
        (!openedFolder ? folders.length : 0);

      const { data, error } = await supabase
        .from("brand_colors")
        .insert([{ hex: newColorHex, user_id: user.id, folder_id: openedFolder?.id || null, sort_order: maxSort }])
        .select()
        .single();
      if (error) throw error;
      if (data) {
        setColors((prev) => [...prev, data]);
        setIsAddingColor(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveFolder = async () => {
    if (!user || !newFolderName.trim()) return;
    
    const nameExists = folders.some(f => f.name.trim().toLowerCase() === newFolderName.trim().toLowerCase());
    if (nameExists) {
      alert("Já existe uma pasta com este nome. Escolha um nome diferente.");
      return;
    }

    setIsSaving(true);
    try {
      const maxSort = colors.filter((c) => !c.folder_id).length + folders.length;
      const { data, error } = await supabase
        .from("brand_color_folders")
        .insert([{ name: newFolderName, user_id: user.id, sort_order: maxSort }])
        .select()
        .single();
      if (error) throw error;
      if (data) {
        setFolders((prev) => [...prev, data]);
        setIsAddingFolder(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteColor = async (id: string) => {
    try {
      await supabase.from("brand_colors").delete().eq("id", id);
      setColors((p) => p.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    try {
      await supabase.from("brand_color_folders").delete().eq("id", id);
      setFolders((p) => p.filter((f) => f.id !== id));
      // Cores dentro da pasta serão deletadas em cascata pelo banco (ON DELETE CASCADE)
      setColors((p) => p.filter((c) => c.folder_id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- DND Handlers ---
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // Ação: Arrastou Cor para dentro de uma Pasta
    if (activeType === "color" && overType === "folder") {
      const folderId = over.id;
      setColors((prev) =>
        prev.map((c) => (c.id === active.id ? { ...c, folder_id: folderId, sort_order: 999 } : c))
      );
      await supabase.from("brand_colors").update({ folder_id: folderId, sort_order: 999 }).eq("id", active.id);
      return;
    }

    // Ação: Reordenar no nível atual (raiz ou dentro da pasta)
    const contextList = openedFolder
      ? colors.filter((c) => c.folder_id === openedFolder.id).sort((a, b) => a.sort_order - b.sort_order)
      : [
          ...folders.map((f) => ({ ...f, isFolder: true })),
          ...colors.filter((c) => !c.folder_id).map((c) => ({ ...c, isFolder: false })),
        ].sort((a, b) => a.sort_order - b.sort_order);

    const oldIndex = contextList.findIndex((x) => x.id === active.id);
    const newIndex = contextList.findIndex((x) => x.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(contextList, oldIndex, newIndex);

      // Otimisticamente atualiza o estado e envia pro banco
      reordered.forEach(async (item, index) => {
        if ((item as any).isFolder) {
          setFolders((prev) => prev.map((f) => (f.id === item.id ? { ...f, sort_order: index } : f)));
          supabase.from("brand_color_folders").update({ sort_order: index }).eq("id", item.id).then();
        } else {
          setColors((prev) => prev.map((c) => (c.id === item.id ? { ...c, sort_order: index } : c)));
          supabase.from("brand_colors").update({ sort_order: index }).eq("id", item.id).then();
        }
      });
    }
  };

  // --- Render Helpers ---

  // Itens da Raiz (Pastas + Cores Soltas ordenadas)
  const rootItems = [
    ...folders.map((f) => ({ ...f, _type: "folder" })),
    ...colors.filter((c) => !c.folder_id).map((c) => ({ ...c, _type: "color" })),
  ].sort((a, b) => a.sort_order - b.sort_order);

  // Itens da Pasta Aberta
  const folderColors = openedFolder
    ? colors.filter((c) => c.folder_id === openedFolder.id).sort((a, b) => a.sort_order - b.sort_order)
    : [];

  const currentItems = openedFolder ? folderColors : rootItems;
  const currentItemIds = currentItems.map((i) => i.id);

  const activeItem = activeId
    ? rootItems.find((i) => i.id === activeId) || folderColors.find((i) => i.id === activeId)
    : null;

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {openedFolder && (
                  <button
                    onClick={() => setOpenedFolder(null)}
                    className="p-1 -ml-2 hover:bg-accent rounded-md transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                <Palette className="h-5 w-5" />
                {openedFolder ? openedFolder.name : "Cores da Marca"}
              </CardTitle>
              <CardDescription className="mt-1.5 max-w-md">
                {openedFolder ? "Gerencie as cores desta pasta." : "Defina as cores que serão usadas como padrão nos seus posts. Arraste uma cor sobre uma pasta para agrupá-la."}
              </CardDescription>
            </div>
            <div className="flex gap-2 shrink-0">
              {!isAddingColor && !isAddingFolder && (
                <>
                  {!openedFolder && (
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingFolder(true)}
                      className="group transition-colors duration-300"
                    >
                      <FolderPlus className="mr-2 h-4 w-4 group-hover:animate-icon-wobble" /> Nova Pasta
                    </Button>
                  )}
                  {openedFolder && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingColor(true);
                        setNewColorHex("#3B82F6");
                        setNewColorRgb({ r: 59, g: 130, b: 246 });
                      }}
                      className="group transition-colors duration-300"
                    >
                      <Plus className="mr-2 h-4 w-4 group-hover:animate-icon-wobble" /> Adicionar Cor
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">

      {/* FORM: Adicionar Pasta */}
      {isAddingFolder && (
        <Card className="border-primary/20 shadow-sm animate-in slide-in-from-top-2 fade-in duration-300">
          <CardContent className="p-6 flex items-end gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Nome da Pasta
              </label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Ex: Cores Secundárias"
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsAddingFolder(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSaveFolder} disabled={isSaving || !newFolderName.trim()}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Salvar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* FORM: Adicionar Cor */}
      {isAddingColor && (
        <Card className="border-primary/20 shadow-sm animate-in slide-in-from-top-2 fade-in duration-300">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="h-24 w-24 rounded-2xl shadow-inner border border-border/50 transition-colors duration-200"
                  style={{ backgroundColor: newColorHex }}
                />
                <div className="relative overflow-hidden rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                  <input
                    type="color"
                    value={newColorHex}
                    onChange={handleHexChange}
                    className="h-10 w-24 cursor-pointer border-0 p-0"
                  />
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Hexadecimal</label>
                  <Input value={newColorHex} onChange={handleHexChange} className="font-mono text-sm uppercase" maxLength={7} />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">RGB (0-255)</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center gap-2"><span className="text-sm font-medium text-red-500/80">R</span><Input type="number" min="0" max="255" value={newColorRgb.r} onChange={(e) => handleRgbChange("r", e.target.value)} className="font-mono" /></div>
                    <div className="flex items-center gap-2"><span className="text-sm font-medium text-green-500/80">G</span><Input type="number" min="0" max="255" value={newColorRgb.g} onChange={(e) => handleRgbChange("g", e.target.value)} className="font-mono" /></div>
                    <div className="flex items-center gap-2"><span className="text-sm font-medium text-blue-500/80">B</span><Input type="number" min="0" max="255" value={newColorRgb.b} onChange={(e) => handleRgbChange("b", e.target.value)} className="font-mono" /></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsAddingColor(false)}>Cancelar</Button>
              <Button onClick={handleSaveColor} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                Salvar Cor
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DND GRID */}
      <DndContext
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="min-h-[200px]">
          {currentItems.length === 0 && !isAddingColor && !isAddingFolder ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/30">
              <p className="text-muted-foreground font-medium">
                {!openedFolder && folders.length === 0 
                  ? "Nenhuma pasta encontrada. Crie uma pasta para começar."
                  : openedFolder 
                    ? "Esta pasta está vazia. Adicione cores aqui."
                    : "Vazio."}
              </p>
            </div>
          ) : (
            <SortableContext items={currentItemIds} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {currentItems.map((item) => {
                  if ((item as any)._type === "folder") {
                    const f = item as unknown as BrandColorFolder;
                    return (
                      <SortableFolder
                        key={f.id}
                        folder={f}
                        childrenColors={colors.filter((c) => c.folder_id === f.id).sort((a, b) => a.sort_order - b.sort_order)}
                        onOpen={setOpenedFolder}
                        onDelete={handleDeleteFolder}
                      />
                    );
                  } else {
                    const c = item as unknown as BrandColor;
                    return (
                      <SortableColor key={c.id} color={c} onDelete={handleDeleteColor} />
                    );
                  }
                })}
              </div>
            </SortableContext>
          )}
        </div>

        <DragOverlay dropAnimation={defaultDropAnimationSideEffects({ duration: 200 })}>
          {activeItem ? (
            <div className="opacity-90 scale-105 shadow-2xl">
              {activeItem._type === "folder" ? (
                <SortableFolder
                  folder={activeItem as unknown as BrandColorFolder}
                  childrenColors={colors.filter((c) => c.folder_id === activeItem.id).sort((a, b) => a.sort_order - b.sort_order)}
                  onOpen={() => {}}
                  onDelete={() => {}}
                />
              ) : (
                <SortableColor color={activeItem as unknown as BrandColor} onDelete={() => {}} />
              )}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
        </CardContent>
      </Card>

      <BrandLogos />

      <TypographySettings />
    </div>
  );
}
