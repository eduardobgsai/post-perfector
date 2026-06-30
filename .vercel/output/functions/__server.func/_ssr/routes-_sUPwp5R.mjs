import { r as __toESM } from "../_runtime.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as supabase } from "./supabase-C2y_zUVs.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as cn, t as AnimatedIcon } from "./AnimatedIcon-Cib4KO2e.mjs";
import { _ as useSensors, a as PointerSensor, c as defaultDropAnimationSideEffects, f as pointerWithin, g as useSensor, i as KeyboardSensor, n as DragOverlay, o as closestCenter, t as DndContext, v as CSS } from "../_libs/@dnd-kit/core+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuth } from "./AuthContext-DCdjol5D.mjs";
import { a as CardHeader, i as CardDescription, n as Card, o as CardTitle, r as CardContent, s as Input, t as Button } from "./button-CRcvUyLi.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { n as useTheme } from "./theme-provider-DJecg6SB.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-C6gypf3Y.mjs";
import { A as Folder, B as CalendarClock, C as LogOut, D as Image, E as Inbox, F as CircleAlert, I as ChevronRight, L as ChevronLeft, M as Coins, N as Clock, O as ImagePlus, P as CircleCheck, R as ChevronDown, S as Menu, T as Layers, _ as PenLine, a as Video, b as Moon, c as Trash2, d as Sparkles, f as ShoppingBag, g as Plus, h as Send, i as Volume2, j as FolderPlus, k as History, l as Sun, m as Settings, n as WandSparkles, o as Upload, p as ShieldCheck, r as VolumeX, s as Type, t as X, u as SquarePen, v as Paperclip, w as LoaderCircle, x as Monitor, y as Palette, z as Check } from "../_libs/lucide-react.mjs";
import { a as useSortable, i as sortableKeyboardCoordinates, n as arrayMove, r as rectSortingStrategy, t as SortableContext } from "../_libs/dnd-kit__sortable.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-_sUPwp5R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var searchFonts = createServerFn({ method: "GET" }).validator((data) => data).handler(createSsrRpc("8538008b4f99b091419256428d0541f89192fadc31d4541da38f031cbe47ea3e"));
var parseVariant = (variant) => {
	if (!variant) return {
		fontWeight: "400",
		fontStyle: "normal",
		isItalic: false
	};
	const isItalic = variant.includes("italic");
	let weight = variant.replace("italic", "");
	if (weight === "regular" || weight === "") weight = "400";
	return {
		fontWeight: weight,
		fontStyle: isItalic ? "italic" : "normal",
		isItalic
	};
};
var loadGoogleFont = (fontFamily, variant) => {
	if (!fontFamily) return;
	let href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, "+")}`;
	if (variant) {
		const { fontWeight, isItalic } = parseVariant(variant);
		if (isItalic) href += `:ital,wght@1,${fontWeight}`;
		else href += `:wght@${fontWeight}`;
	}
	href += `&display=swap`;
	const linkId = `font-${fontFamily.replace(/\s+/g, "-")}-${variant || "default"}`;
	if (!document.getElementById(linkId)) {
		const link = document.createElement("link");
		link.id = linkId;
		link.href = href;
		link.rel = "stylesheet";
		document.head.appendChild(link);
	}
};
var getFontStyle = (fontFamily, variant) => {
	if (!fontFamily) return {};
	const { fontWeight, fontStyle } = parseVariant(variant);
	return {
		fontFamily,
		fontWeight,
		fontStyle
	};
};
function TypographySettings() {
	const { user } = useAuth();
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const [primaryFont, setPrimaryFont] = (0, import_react.useState)("");
	const [primaryFontWeight, setPrimaryFontWeight] = (0, import_react.useState)("");
	const [primaryFontVariants, setPrimaryFontVariants] = (0, import_react.useState)([]);
	const [secondaryFont, setSecondaryFont] = (0, import_react.useState)("");
	const [secondaryFontWeight, setSecondaryFontWeight] = (0, import_react.useState)("");
	const [secondaryFontVariants, setSecondaryFontVariants] = (0, import_react.useState)([]);
	const [primarySearch, setPrimarySearch] = (0, import_react.useState)("");
	const [primaryResults, setPrimaryResults] = (0, import_react.useState)([]);
	const [isSearchingPrimary, setIsSearchingPrimary] = (0, import_react.useState)(false);
	const [secondarySearch, setSecondarySearch] = (0, import_react.useState)("");
	const [secondaryResults, setSecondaryResults] = (0, import_react.useState)([]);
	const [isSearchingSecondary, setIsSearchingSecondary] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user) fetchTypography();
	}, [user]);
	const fetchTypography = async () => {
		try {
			const { data, error } = await supabase.from("brand_typography").select("*").eq("user_id", user?.id).maybeSingle();
			if (error && error.code !== "PGRST116") throw error;
			if (data) {
				setPrimaryFont(data.primary_font);
				setPrimaryFontWeight(data.primary_font_weight);
				setSecondaryFont(data.secondary_font || "");
				setSecondaryFontWeight(data.secondary_font_weight || "");
				if (data.primary_font) {
					const fonts = await searchFonts({ data: {
						query: data.primary_font,
						limit: 1
					} });
					if (fonts.length > 0) setPrimaryFontVariants(fonts[0].variants);
				}
				if (data.secondary_font) {
					const fonts = await searchFonts({ data: {
						query: data.secondary_font,
						limit: 1
					} });
					if (fonts.length > 0) setSecondaryFontVariants(fonts[0].variants);
				}
			}
		} catch (err) {
			console.error("Erro ao buscar tipografia:", err);
		} finally {
			setIsLoading(false);
		}
	};
	const searchGoogleFonts = async (query) => {
		try {
			return await searchFonts({ data: {
				query,
				limit: 10
			} });
		} catch (err) {
			console.error(err);
			return [];
		}
	};
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(async () => {
			setIsSearchingPrimary(true);
			setPrimaryResults(await searchGoogleFonts(primarySearch));
			setIsSearchingPrimary(false);
		}, 300);
		return () => clearTimeout(timer);
	}, [primarySearch]);
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(async () => {
			setIsSearchingSecondary(true);
			setSecondaryResults(await searchGoogleFonts(secondarySearch));
			setIsSearchingSecondary(false);
		}, 300);
		return () => clearTimeout(timer);
	}, [secondarySearch]);
	(0, import_react.useEffect)(() => {
		primaryResults.forEach((font) => loadGoogleFont(font.family));
	}, [primaryResults]);
	(0, import_react.useEffect)(() => {
		secondaryResults.forEach((font) => loadGoogleFont(font.family));
	}, [secondaryResults]);
	(0, import_react.useEffect)(() => {
		if (primaryFont) loadGoogleFont(primaryFont, primaryFontWeight);
	}, [primaryFont, primaryFontWeight]);
	(0, import_react.useEffect)(() => {
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
				secondary_font_weight: secondaryFontWeight || null
			};
			const { data: existing } = await supabase.from("brand_typography").select("id").eq("user_id", user?.id).maybeSingle();
			if (existing) {
				const { error } = await supabase.from("brand_typography").update(payload).eq("id", existing.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("brand_typography").insert([payload]);
				if (error) throw error;
			}
			toast.success("Tipografia salva com sucesso!");
		} catch (err) {
			console.error(err);
			toast.error(`Erro ao salvar tipografia: ${err.message || "Erro desconhecido"}`);
		} finally {
			setIsSaving(false);
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mt-8 border-border/50 bg-card/50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
			className: "text-xl flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, { className: "h-5 w-5" }), " Tipografia"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Defina as fontes que serão usadas como padrão nos seus posts. Buscamos diretamente do Google Fonts." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 rounded-lg border border-border p-4 bg-background/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-sm mb-1",
							children: "Fonte Primária (Obrigatório)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mb-3",
							children: "Usada para títulos e textos principais."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-medium text-muted-foreground mb-1 block",
										children: "Buscar Família"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: primarySearch,
										onChange: (e) => setPrimarySearch(e.target.value),
										placeholder: primaryFont || "Ex: Montserrat",
										onFocus: () => setPrimarySearch("")
									}),
									primarySearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto",
										children: isSearchingPrimary ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2 text-xs text-muted-foreground flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " Buscando..."]
										}) : primaryResults.length > 0 ? primaryResults.map((font) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
											onClick: () => {
												setPrimaryFont(font.family);
												setPrimaryFontVariants(font.variants);
												setPrimaryFontWeight(font.variants.includes("regular") ? "regular" : font.variants[0]);
												setPrimarySearch("");
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														fontFamily: font.family,
														fontSize: "1.1em"
													},
													children: font.family
												}),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs text-muted-foreground",
													children: [
														"(",
														font.category,
														")"
													]
												})
											]
										}, font.family)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-2 text-xs text-muted-foreground",
											children: "Nenhuma fonte encontrada."
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground mb-1 block",
								children: "Peso (Weight)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
								value: primaryFontWeight,
								onChange: (e) => setPrimaryFontWeight(e.target.value),
								disabled: !primaryFontVariants.length,
								children: [!primaryFontVariants.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Selecione uma fonte primeiro"
								}), primaryFontVariants.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: v,
									children: v
								}, v))]
							})] })]
						}),
						primaryFont && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 p-4 rounded-md border border-border bg-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground mb-2",
									children: "Preview da Fonte:"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-2xl text-foreground",
									style: getFontStyle(primaryFont, primaryFontWeight),
									children: "O rápido raposa marrom pula sobre o cão preguiçoso"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 text-xs text-primary font-medium",
									children: [
										"Selecionada: ",
										primaryFont,
										" (",
										primaryFontWeight,
										")"
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 rounded-lg border border-border p-4 bg-background/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-sm mb-1",
							children: "Fonte Secundária (Opcional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mb-3",
							children: "Usada para subtítulos ou detalhes."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-medium text-muted-foreground mb-1 block",
										children: "Buscar Família"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: secondarySearch,
										onChange: (e) => setSecondarySearch(e.target.value),
										placeholder: secondaryFont || "Ex: Roboto",
										onFocus: () => setSecondarySearch("")
									}),
									secondarySearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-48 overflow-y-auto",
										children: isSearchingSecondary ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-2 text-xs text-muted-foreground flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }), " Buscando..."]
										}) : secondaryResults.length > 0 ? secondaryResults.map((font) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
											onClick: () => {
												setSecondaryFont(font.family);
												setSecondaryFontVariants(font.variants);
												setSecondaryFontWeight(font.variants.includes("regular") ? "regular" : font.variants[0]);
												setSecondarySearch("");
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														fontFamily: font.family,
														fontSize: "1.1em"
													},
													children: font.family
												}),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-xs text-muted-foreground",
													children: [
														"(",
														font.category,
														")"
													]
												})
											]
										}, font.family)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "p-2 text-xs text-muted-foreground",
											children: "Nenhuma fonte encontrada."
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-muted-foreground mb-1 block",
								children: "Peso (Weight)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
								value: secondaryFontWeight,
								onChange: (e) => setSecondaryFontWeight(e.target.value),
								disabled: !secondaryFontVariants.length,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Nenhum / Padrão"
								}), secondaryFontVariants.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: v,
									children: v
								}, v))]
							})] })]
						}),
						secondaryFont && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 p-4 rounded-md border border-border bg-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm text-muted-foreground mb-2 flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Preview da Fonte Secundária:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => {
											setSecondaryFont("");
											setSecondaryFontWeight("");
											setSecondaryFontVariants([]);
										},
										className: "text-destructive hover:underline text-xs",
										children: "Remover Fonte"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xl text-foreground",
									style: getFontStyle(secondaryFont, secondaryFontWeight),
									children: "O rápido raposa marrom pula sobre o cão preguiçoso"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 text-xs text-primary font-medium",
									children: [
										"Selecionada: ",
										secondaryFont,
										" ",
										secondaryFontWeight ? `(${secondaryFontWeight})` : ""
									]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: handleSave,
						disabled: isSaving || !primaryFont,
						children: [isSaving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-2 h-4 w-4" }), "Salvar Tipografia"]
					})
				})
			]
		})]
	});
}
function BrandLogos() {
	const { user } = useAuth();
	const [logos, setLogos] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isUploading, setIsUploading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		fetchLogos();
	}, [user]);
	const fetchLogos = async () => {
		if (!user) return;
		setIsLoading(true);
		try {
			const { data, error } = await supabase.from("brand_logos").select("*").order("created_at", { ascending: true });
			if (error) throw error;
			setLogos(data || []);
		} catch (err) {
			console.error(err);
			toast.error(`Erro ao buscar logos: ${err.message}`);
		} finally {
			setIsLoading(false);
		}
	};
	const handleUpload = async (event) => {
		const file = event.target.files?.[0];
		if (!file || !user) return;
		setIsUploading(true);
		try {
			const fileExt = file.name.split(".").pop();
			const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
			const filePath = `${user.id}/${fileName}`;
			const { error: uploadError } = await supabase.storage.from("logos").upload(filePath, file);
			if (uploadError) throw uploadError;
			const { data: publicUrlData } = supabase.storage.from("logos").getPublicUrl(filePath);
			const { data, error: dbError } = await supabase.from("brand_logos").insert([{
				user_id: user.id,
				name: file.name,
				url: publicUrlData.publicUrl
			}]).select().single();
			if (dbError) throw dbError;
			if (data) {
				setLogos((prev) => [...prev, data]);
				toast.success("Logo adicionada com sucesso!");
			}
		} catch (err) {
			console.error(err);
			toast.error(`Erro ao fazer upload da logo: ${err.message}`);
		} finally {
			setIsUploading(false);
			if (event.target) event.target.value = "";
		}
	};
	const handleDelete = async (id, url) => {
		if (!user) return;
		try {
			const { error: dbError } = await supabase.from("brand_logos").delete().eq("id", id);
			if (dbError) throw dbError;
			const urlParts = url.split("/logos/");
			if (urlParts.length > 1) {
				const filePath = urlParts[1];
				await supabase.storage.from("logos").remove([filePath]);
			}
			setLogos((prev) => prev.filter((l) => l.id !== id));
			toast.success("Logo removida!");
		} catch (err) {
			console.error(err);
			toast.error(`Erro ao remover logo: ${err.message}`);
		}
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "border-border/50 bg-card/50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "flex justify-center p-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border/50 bg-card/50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "text-xl flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "h-5 w-5" }), " Logos da Marca"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
				className: "mt-1.5 max-w-md",
				children: "Faça upload das suas logotipos. Elas poderão ser selecionadas e aplicadas nos posts gerados."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "file",
					accept: "image/*",
					className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed",
					onChange: handleUpload,
					disabled: isUploading
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					disabled: isUploading,
					className: "pointer-events-none",
					children: [isUploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "mr-2 h-4 w-4" }), isUploading ? "Enviando..." : "Adicionar Logo"]
				})]
			})]
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: logos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground font-medium",
				children: "Nenhuma logo adicionada. Faça o upload da sua primeira logo!"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",
			children: logos.map((logo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group relative overflow-hidden rounded-xl border border-border/50 bg-background p-2 shadow-sm transition-all hover:shadow-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-square w-full rounded-lg flex items-center justify-center p-2 bg-accent/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: logo.url,
						alt: logo.name,
						className: "max-w-full max-h-full object-contain"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-center justify-between px-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-foreground/80 truncate w-full",
						title: logo.name,
						children: logo.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleDelete(logo.id, logo.url),
						className: "opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md shrink-0 ml-1",
						title: "Remover Logo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
					})]
				})]
			}, logo.id))
		}) })]
	});
}
var hexToRgb = (hex) => {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : {
		r: 0,
		g: 0,
		b: 0
	};
};
var rgbToHex = (r, g, b) => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
function SortableColor({ color, onDelete }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: color.id,
		data: {
			type: "color",
			color
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: setNodeRef,
		style: {
			transform: CSS.Transform.toString(transform),
			transition,
			opacity: isDragging ? .4 : 1
		},
		...attributes,
		...listeners,
		className: "group relative overflow-hidden rounded-xl border border-border/50 bg-card p-2 shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "aspect-video w-full rounded-lg shadow-inner",
			style: { backgroundColor: color.hex }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex items-center justify-between px-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-sm font-medium uppercase text-foreground/80",
				children: color.hex
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: (e) => {
					e.stopPropagation();
					onDelete(color.id);
				},
				onPointerDown: (e) => e.stopPropagation(),
				className: "opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
			})]
		})]
	});
}
function SortableFolder({ folder, childrenColors, onOpen, onDelete }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: folder.id,
		data: {
			type: "folder",
			folder
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: setNodeRef,
		style: {
			transform: CSS.Transform.toString(transform),
			transition,
			opacity: isDragging ? .4 : 1
		},
		...attributes,
		...listeners,
		onClick: () => onOpen(folder),
		className: "group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-2 shadow-sm transition-all hover:shadow-md cursor-grab active:cursor-grabbing hover:bg-accent/20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "aspect-video w-full rounded-lg bg-accent/30 flex items-center justify-center p-2",
			children: childrenColors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-8 w-8 text-muted-foreground/50" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex relative justify-center w-full",
				children: childrenColors.slice(0, 4).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-10 w-10 rounded-md border-2 border-black shadow-sm",
					style: {
						backgroundColor: c.hex,
						marginLeft: i > 0 ? "-1rem" : "0",
						zIndex: 10 - i
					}
				}, c.id))
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex items-center justify-between px-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-serif text-sm font-medium text-foreground/80 truncate flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-3.5 w-3.5" }), folder.name]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: (e) => {
					e.stopPropagation();
					onDelete(folder.id);
				},
				onPointerDown: (e) => e.stopPropagation(),
				className: "opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
			})]
		})]
	});
}
var customCollisionDetection = (args) => {
	const pointerIntersections = pointerWithin(args);
	if (pointerIntersections.length > 0) {
		const hoveredDroppable = pointerIntersections.find((i) => {
			return (args.droppableContainers.find((c) => c.id === i.id)?.data?.current)?.type === "folder";
		});
		if (hoveredDroppable) {
			if (args.active.data.current?.type === "color") return [hoveredDroppable];
		}
	}
	return closestCenter(args);
};
function MediaKit() {
	const { user } = useAuth();
	const [colors, setColors] = (0, import_react.useState)([]);
	const [folders, setFolders] = (0, import_react.useState)([]);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [isAddingColor, setIsAddingColor] = (0, import_react.useState)(false);
	const [isAddingFolder, setIsAddingFolder] = (0, import_react.useState)(false);
	const [newColorHex, setNewColorHex] = (0, import_react.useState)("#000000");
	const [newColorRgb, setNewColorRgb] = (0, import_react.useState)({
		r: 0,
		g: 0,
		b: 0
	});
	const [newFolderName, setNewFolderName] = (0, import_react.useState)("");
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const [openedFolder, setOpenedFolder] = (0, import_react.useState)(null);
	const [activeId, setActiveId] = (0, import_react.useState)(null);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
	(0, import_react.useEffect)(() => {
		fetchData();
	}, [user]);
	const fetchData = async () => {
		if (!user) return;
		setIsLoading(true);
		try {
			const [colorsRes, foldersRes] = await Promise.all([supabase.from("brand_colors").select("*").order("sort_order", { ascending: true }), supabase.from("brand_color_folders").select("*").order("sort_order", { ascending: true })]);
			if (colorsRes.data) setColors(colorsRes.data);
			if (foldersRes.data) setFolders(foldersRes.data);
		} catch (err) {
			console.error("Erro ao buscar Mídia Kit:", err);
		} finally {
			setIsLoading(false);
		}
	};
	const handleHexChange = (e) => {
		let val = e.target.value;
		if (!val.startsWith("#")) val = "#" + val;
		setNewColorHex(val);
		if (val.length === 7) setNewColorRgb(hexToRgb(val));
	};
	const handleRgbChange = (channel, value) => {
		let num = parseInt(value, 10);
		if (isNaN(num)) num = 0;
		if (num > 255) num = 255;
		if (num < 0) num = 0;
		const updated = {
			...newColorRgb,
			[channel]: num
		};
		setNewColorRgb(updated);
		setNewColorHex(rgbToHex(updated.r, updated.g, updated.b));
	};
	const handleSaveColor = async () => {
		if (!user) return;
		setIsSaving(true);
		try {
			const maxSort = colors.filter((c) => c.folder_id === (openedFolder ? openedFolder.id : null)).length + (!openedFolder ? folders.length : 0);
			const { data, error } = await supabase.from("brand_colors").insert([{
				hex: newColorHex,
				user_id: user.id,
				folder_id: openedFolder?.id || null,
				sort_order: maxSort
			}]).select().single();
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
		if (folders.some((f) => f.name.trim().toLowerCase() === newFolderName.trim().toLowerCase())) {
			alert("Já existe uma pasta com este nome. Escolha um nome diferente.");
			return;
		}
		setIsSaving(true);
		try {
			const maxSort = colors.filter((c) => !c.folder_id).length + folders.length;
			const { data, error } = await supabase.from("brand_color_folders").insert([{
				name: newFolderName,
				user_id: user.id,
				sort_order: maxSort
			}]).select().single();
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
	const handleDeleteColor = async (id) => {
		try {
			await supabase.from("brand_colors").delete().eq("id", id);
			setColors((p) => p.filter((c) => c.id !== id));
		} catch (err) {
			console.error(err);
		}
	};
	const handleDeleteFolder = async (id) => {
		try {
			await supabase.from("brand_color_folders").delete().eq("id", id);
			setFolders((p) => p.filter((f) => f.id !== id));
			setColors((p) => p.filter((c) => c.folder_id !== id));
		} catch (err) {
			console.error(err);
		}
	};
	const handleDragStart = (event) => {
		setActiveId(event.active.id);
	};
	const handleDragEnd = async (event) => {
		const { active, over } = event;
		setActiveId(null);
		if (!over || active.id === over.id) return;
		const activeType = active.data.current?.type;
		const overType = over.data.current?.type;
		if (activeType === "color" && overType === "folder") {
			const folderId = over.id;
			setColors((prev) => prev.map((c) => c.id === active.id ? {
				...c,
				folder_id: folderId,
				sort_order: 999
			} : c));
			await supabase.from("brand_colors").update({
				folder_id: folderId,
				sort_order: 999
			}).eq("id", active.id);
			return;
		}
		const contextList = openedFolder ? colors.filter((c) => c.folder_id === openedFolder.id).sort((a, b) => a.sort_order - b.sort_order) : [...folders.map((f) => ({
			...f,
			isFolder: true
		})), ...colors.filter((c) => !c.folder_id).map((c) => ({
			...c,
			isFolder: false
		}))].sort((a, b) => a.sort_order - b.sort_order);
		const oldIndex = contextList.findIndex((x) => x.id === active.id);
		const newIndex = contextList.findIndex((x) => x.id === over.id);
		if (oldIndex !== -1 && newIndex !== -1) arrayMove(contextList, oldIndex, newIndex).forEach(async (item, index) => {
			if (item.isFolder) {
				setFolders((prev) => prev.map((f) => f.id === item.id ? {
					...f,
					sort_order: index
				} : f));
				supabase.from("brand_color_folders").update({ sort_order: index }).eq("id", item.id).then();
			} else {
				setColors((prev) => prev.map((c) => c.id === item.id ? {
					...c,
					sort_order: index
				} : c));
				supabase.from("brand_colors").update({ sort_order: index }).eq("id", item.id).then();
			}
		});
	};
	const rootItems = [...folders.map((f) => ({
		...f,
		_type: "folder"
	})), ...colors.filter((c) => !c.folder_id).map((c) => ({
		...c,
		_type: "color"
	}))].sort((a, b) => a.sort_order - b.sort_order);
	const folderColors = openedFolder ? colors.filter((c) => c.folder_id === openedFolder.id).sort((a, b) => a.sort_order - b.sort_order) : [];
	const currentItems = openedFolder ? folderColors : rootItems;
	const currentItemIds = currentItems.map((i) => i.id);
	const activeItem = activeId ? rootItems.find((i) => i.id === activeId) || folderColors.find((i) => i.id === activeId) : null;
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/50 bg-card/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-xl flex items-center gap-2",
						children: [
							openedFolder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setOpenedFolder(null),
								className: "p-1 -ml-2 hover:bg-accent rounded-md transition-colors text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-5 w-5" }),
							openedFolder ? openedFolder.name : "Cores da Marca"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
						className: "mt-1.5 max-w-md",
						children: openedFolder ? "Gerencie as cores desta pasta." : "Defina as cores que serão usadas como padrão nos seus posts. Arraste uma cor sobre uma pasta para agrupá-la."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 shrink-0",
						children: !isAddingColor && !isAddingFolder && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [!openedFolder && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => setIsAddingFolder(true),
							className: "group transition-colors duration-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "mr-2 h-4 w-4 group-hover:animate-icon-wobble" }), " Nova Pasta"]
						}), openedFolder && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => {
								setIsAddingColor(true);
								setNewColorHex("#3B82F6");
								setNewColorRgb({
									r: 59,
									g: 130,
									b: 246
								});
							},
							className: "group transition-colors duration-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4 group-hover:animate-icon-wobble" }), " Adicionar Cor"]
						})] })
					})]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-6",
					children: [
						isAddingFolder && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-primary/20 shadow-sm animate-in slide-in-from-top-2 fade-in duration-300",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6 flex items-end gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block",
										children: "Nome da Pasta"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: newFolderName,
										onChange: (e) => setNewFolderName(e.target.value),
										placeholder: "Ex: Cores Secundárias",
										autoFocus: true
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => setIsAddingFolder(false),
										children: "Cancelar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleSaveFolder,
										disabled: isSaving || !newFolderName.trim(),
										children: [isSaving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-2 h-4 w-4" }), "Salvar"]
									})]
								})]
							})
						}),
						isAddingColor && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "border-primary/20 shadow-sm animate-in slide-in-from-top-2 fade-in duration-300",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col md:flex-row gap-8 items-start md:items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-24 w-24 rounded-2xl shadow-inner border border-border/50 transition-colors duration-200",
											style: { backgroundColor: newColorHex }
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "relative overflow-hidden rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "color",
												value: newColorHex,
												onChange: handleHexChange,
												className: "h-10 w-24 cursor-pointer border-0 p-0"
											})
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 space-y-4 w-full",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block",
											children: "Hexadecimal"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: newColorHex,
											onChange: handleHexChange,
											className: "font-mono text-sm uppercase",
											maxLength: 7
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block",
											children: "RGB (0-255)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-3 gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm font-medium text-red-500/80",
														children: "R"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "number",
														min: "0",
														max: "255",
														value: newColorRgb.r,
														onChange: (e) => handleRgbChange("r", e.target.value),
														className: "font-mono"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm font-medium text-green-500/80",
														children: "G"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "number",
														min: "0",
														max: "255",
														value: newColorRgb.g,
														onChange: (e) => handleRgbChange("g", e.target.value),
														className: "font-mono"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm font-medium text-blue-500/80",
														children: "B"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "number",
														min: "0",
														max: "255",
														value: newColorRgb.b,
														onChange: (e) => handleRgbChange("b", e.target.value),
														className: "font-mono"
													})]
												})
											]
										})] })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-6 flex justify-end gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => setIsAddingColor(false),
										children: "Cancelar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: handleSaveColor,
										disabled: isSaving,
										children: [isSaving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-2 h-4 w-4" }), "Salvar Cor"]
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DndContext, {
							sensors,
							collisionDetection: customCollisionDetection,
							onDragStart: handleDragStart,
							onDragEnd: handleDragEnd,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "min-h-[200px]",
								children: currentItems.length === 0 && !isAddingColor && !isAddingFolder ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground font-medium",
										children: !openedFolder && folders.length === 0 ? "Nenhuma pasta encontrada. Crie uma pasta para começar." : openedFolder ? "Esta pasta está vazia. Adicione cores aqui." : "Vazio."
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableContext, {
									items: currentItemIds,
									strategy: rectSortingStrategy,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4",
										children: currentItems.map((item) => {
											if (item._type === "folder") {
												const f = item;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableFolder, {
													folder: f,
													childrenColors: colors.filter((c) => c.folder_id === f.id).sort((a, b) => a.sort_order - b.sort_order),
													onOpen: setOpenedFolder,
													onDelete: handleDeleteFolder
												}, f.id);
											} else {
												const c = item;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableColor, {
													color: c,
													onDelete: handleDeleteColor
												}, c.id);
											}
										})
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DragOverlay, {
								dropAnimation: defaultDropAnimationSideEffects({ duration: 200 }),
								children: activeItem ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "opacity-90 scale-105 shadow-2xl",
									children: activeItem._type === "folder" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableFolder, {
										folder: activeItem,
										childrenColors: colors.filter((c) => c.folder_id === activeItem.id).sort((a, b) => a.sort_order - b.sort_order),
										onOpen: () => {},
										onDelete: () => {}
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortableColor, {
										color: activeItem,
										onDelete: () => {}
									})
								}) : null
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLogos, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypographySettings, {})
		]
	});
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedIcon, {
		name: "chevronRight",
		className: "ml-auto"
	})]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedIcon, {
			name: "check",
			className: "h-4 w-4"
		}) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedIcon, {
			name: "checkCircle",
			className: "h-2 w-2 fill-current"
		}) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
function ThemeToggle() {
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			size: "icon",
			className: "h-8 w-8 rounded-md",
			children: [mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				theme === "light" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }),
				theme === "dark" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" }),
				theme === "system" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-4 w-4" })
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-4 w-4 opacity-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Alternar tema"
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onClick: () => setTheme("light"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Claro" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onClick: () => setTheme("dark"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Escuro" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onClick: () => setTheme("system"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sistema" })]
			})
		]
	})] });
}
"" + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'><rect width='400' height='400' fill='%23f1efea'/><text x='50%' y='50%' font-family='Inter,sans-serif' font-size='16' fill='%23a8a29e' text-anchor='middle' dominant-baseline='middle'>imagem gerada</text></svg>`);
function App() {
	const { user, isLoading: authLoading, signOut } = useAuth();
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!authLoading && !user) navigate({ to: "/login" });
	}, [
		user,
		authLoading,
		navigate
	]);
	const [view, setView] = (0, import_react.useState)("review");
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(false);
	const [desktopSidebarOpen, setDesktopSidebarOpen] = (0, import_react.useState)(true);
	const [showSettings, setShowSettings] = (0, import_react.useState)(false);
	const [isFacebookConnected, setIsFacebookConnected] = (0, import_react.useState)(false);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const [reviewPosts, setReviewPosts] = (0, import_react.useState)([]);
	const [scheduled, setScheduled] = (0, import_react.useState)([]);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [selectedPost, setSelectedPost] = (0, import_react.useState)(null);
	const fetchPosts = async () => {
		setIsLoading(true);
		try {
			const { data, error } = await supabase.from("generated_posts").select("*, carrossel_items:post_carrossel_midias(url:media_url, ordem)").order("created_at", { ascending: false });
			if (error) console.error("Erro ao buscar posts:", error);
			else if (data) {
				setReviewPosts(data.filter((p) => p.status === "Aguardando Aprovação"));
				setScheduled(data.filter((p) => p.status === "Aprovada" && p.agendada === true));
				setHistory(data.filter((p) => p.status === "Postada" || p.status === "Publicar Agora" || p.status === "Aprovada" && !p.agendada));
			}
		} catch (err) {
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (user) {
			fetchPosts();
			checkIntegration();
		}
	}, [view, user]);
	const checkIntegration = async () => {
		if (!user) return;
		const { data, error } = await supabase.from("integracoes").select("*").eq("user_id", user.id).eq("plataforma", "instagram").maybeSingle();
		if (data && !error) setIsFacebookConnected(true);
	};
	const conectarInstagram = async () => {
		const { data: { user: currentUser } } = await supabase.auth.getUser();
		if (currentUser?.identities) {
			const fbIdentity = currentUser.identities.find((id) => id.provider === "facebook");
			if (fbIdentity) await supabase.auth.unlinkIdentity(fbIdentity);
		}
		const { data, error } = await supabase.auth.linkIdentity({
			provider: "facebook",
			options: {
				scopes: "email, instagram_basic, instagram_content_publish, pages_show_list, pages_read_engagement",
				redirectTo: `${window.location.origin}/callback`
			}
		});
		if (error) toast.error("Erro ao vincular conta: " + error.message);
	};
	const navItems = [
		{
			id: "new",
			label: "Novo Post",
			icon: SquarePen
		},
		{
			id: "review",
			label: "Aguardando Revisão",
			icon: Inbox,
			count: reviewPosts.length
		},
		{
			id: "scheduled",
			label: "Agendados",
			icon: CalendarClock,
			count: scheduled.length
		},
		{
			id: "history",
			label: "Histórico",
			icon: History
		},
		{
			id: "media-kit",
			label: "Mídia Kit",
			icon: Palette
		}
	];
	const titles = {
		new: "Novo Post",
		review: "Aguardando Revisão",
		scheduled: "Agendados",
		history: "Histórico",
		"media-kit": "Mídia Kit"
	};
	const handleGenerate = (format, prompt) => {
		setView("review");
		fetchPosts();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground antialiased",
		children: [
			sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-30 bg-black/20 md:hidden",
				onClick: () => setSidebarOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-secondary/40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${desktopSidebarOpen ? "md:translate-x-0" : "md:-translate-x-full"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-14 items-center justify-between px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center text-base font-serif font-bold tracking-tight text-foreground/90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/logo.png",
								alt: "Post Perfector Logo",
								className: "h-20 w-20 object-contain dark:invert"
							}), "Post Perfector"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-md p-1 text-muted-foreground hover:bg-accent md:hidden",
							onClick: () => setSidebarOpen(false),
							"aria-label": "Fechar menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "px-2 py-2",
						children: navItems.map((item) => {
							const Icon = item.icon;
							const active = view === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setView(item.id);
									setSidebarOpen(false);
								},
								className: `group flex w-full items-center justify-between rounded-sm px-2 py-2 text-sm transition-colors duration-300 ease-out ${active ? "bg-foreground/15 text-foreground font-semibold" : "text-foreground/80 font-medium hover:bg-foreground/10 hover:text-foreground"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex min-w-0 items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 shrink-0 transition-transform duration-300 ease-out stroke-[2.5] ${!active ? "group-hover:animate-icon-wobble text-foreground" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: item.label
									})]
								}), typeof item.count === "number" && item.count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-background px-1.5 py-0.5 text-[11px] text-muted-foreground",
									children: item.count
								})]
							}, item.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute bottom-6 left-0 right-0 px-3 flex flex-col gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col bg-background/50 rounded-md overflow-hidden border border-border/50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setShowSettings(!showSettings),
								className: "group flex w-full items-center justify-between px-2 py-2 text-sm transition-colors duration-300 ease-out text-foreground/80 font-medium hover:bg-foreground/10 hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:animate-icon-wobble stroke-[2.5]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: "Configurações"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `h-4 w-4 shrink-0 transition-transform duration-300 ${showSettings ? "rotate-180" : ""}` })]
							}), showSettings && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col pb-2 px-2 gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: conectarInstagram,
									className: "flex items-center justify-between rounded-sm px-2 py-1.5 text-xs text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 shrink-0 stroke-[2.5]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: "Autenticação"
										})]
									}), isFacebookConnected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-green-500",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-green-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-[10px] uppercase tracking-wider",
											children: "Ativa"
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "flex items-center justify-between rounded-sm px-2 py-1.5 text-xs text-foreground/70 hover:bg-foreground/10 hover:text-foreground transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-3.5 w-3.5 shrink-0 stroke-[2.5]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: "Créditos"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary font-medium",
										children: "R$ 0,00"
									})]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: signOut,
							className: "group flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm transition-colors duration-300 ease-out text-foreground/80 font-medium hover:bg-destructive/20 hover:text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 shrink-0 transition-transform duration-300 ease-out group-hover:animate-icon-wobble stroke-[2.5]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "Sair da Conta"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `transition-all duration-300 ${desktopSidebarOpen ? "md:pl-64" : "md:pl-0"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: `sticky top-0 z-20 flex h-14 items-center gap-3 px-4 md:px-8 ${view === "new" ? "bg-transparent" : "border-b border-border bg-background/80 backdrop-blur"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-md p-1.5 text-muted-foreground hover:bg-accent md:hidden",
							onClick: () => setSidebarOpen(true),
							"aria-label": "Abrir menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "hidden rounded-md p-1.5 text-muted-foreground hover:bg-accent md:block",
							onClick: () => setDesktopSidebarOpen(!desktopSidebarOpen),
							"aria-label": "Alternar menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
						}),
						view !== "new" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate text-lg font-serif font-semibold text-foreground/90",
							children: titles[view]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeToggle, {})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "px-4 py-6 md:px-8 md:py-8",
					children: [
						view === "new" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewPostForm, { onGenerate: handleGenerate }),
						view === "review" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewList, {
							posts: reviewPosts,
							isLoading,
							onPreview: (post) => setSelectedPost(post)
						}),
						view === "scheduled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScheduledList, {
							posts: scheduled,
							isLoading,
							onPreview: (post) => setSelectedPost(post)
						}),
						view === "history" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryList, {
							posts: history,
							isLoading,
							onPreview: (post) => setSelectedPost(post)
						}),
						view === "media-kit" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaKit, {})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PostDetailsModal, {
				post: selectedPost,
				onClose: () => setSelectedPost(null),
				onUpdate: () => fetchPosts(),
				onLocalUpdate: (updatedPost) => setSelectedPost(updatedPost)
			})
		]
	});
}
function SectionShell({ children, max = "max-w-3xl" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `mx-auto w-full ${max}`,
		children
	});
}
var GENERATE_WEBHOOK_URL = "https://n8n.bgiax.cloud/webhook-test/6119f397-36f8-48b6-9408-bfacd284f211";
var LOADING_MESSAGES = [
	"Analisando sua imagem e prompt...",
	"A IA está roteirizando e gerando o vídeo mágico...",
	"Escrevendo uma legenda de alta performance...",
	"Finalizando os últimos detalhes..."
];
var isVideoUrl = (url) => {
	if (!url) return false;
	const cleanUrl = url.split("?")[0].toLowerCase();
	if (cleanUrl.endsWith(".png") || cleanUrl.endsWith(".jpg") || cleanUrl.endsWith(".jpeg") || cleanUrl.endsWith(".webp") || cleanUrl.endsWith(".gif")) return false;
	return true;
};
var generateMediaAPI = async (imageFiles, prompt, format, mediaType, userId, slideCount, brandColors, typography, logoUrl, useText, tryon, videoResolution, generateAudio, videoDuration) => {
	let imageUrls = [];
	const postId = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = Math.random() * 16 | 0;
		return (c === "x" ? r : r & 3 | 8).toString(16);
	});
	if (imageFiles && imageFiles.length > 0) for (let i = 0; i < imageFiles.length; i++) {
		const file = imageFiles[i];
		const fileExt = file.name.split(".").pop() || "jpg";
		const filePath = `entradas/${postId}_${i}.${fileExt}`;
		const { error } = await supabase.storage.from("midias_posts").upload(filePath, file, { upsert: true });
		if (error) {
			console.error("Erro ao fazer upload da imagem:", error);
			throw new Error("Erro ao fazer upload da imagem para o Supabase Storage: " + error.message);
		}
		const { data: { publicUrl } } = supabase.storage.from("midias_posts").getPublicUrl(filePath);
		imageUrls.push(publicUrl);
	}
	const apiFormat = format === "Feed" ? "FEED" : format === "Reels" ? "REELS" : format === "Stories" ? "STORIES" : format.toUpperCase();
	const resolvedMediaType = format === "Reels" ? "video" : format === "Feed" ? "image" : mediaType;
	if (!(await fetch(GENERATE_WEBHOOK_URL, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			id: postId,
			user_id: userId,
			format: apiFormat,
			prompt,
			images: imageUrls,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			media_type: resolvedMediaType,
			aspect_ratio: format === "Feed" || format === "Carousel" ? "1:1" : "9:16",
			...format === "Carousel" && slideCount ? { slide_count: slideCount } : {},
			...brandColors && brandColors.length > 0 ? { brand_colors: brandColors } : {},
			...typography ? {
				typography,
				fontfamily: typography.primary_font,
				fontweight: typography.primary_font_weight
			} : {
				typography: {
					primary_font: "Roboto",
					primary_font_weight: "regular"
				},
				fontfamily: "Roboto",
				fontweight: "regular"
			},
			...logoUrl ? { logo_url: logoUrl } : {},
			Text: useText !== void 0 ? useText : true,
			tryon: tryon !== void 0 ? tryon : false,
			...resolvedMediaType === "video" ? {
				resolution: videoResolution || "1080p",
				generate_audio: generateAudio !== void 0 ? generateAudio : false,
				duration: videoDuration || "4s"
			} : {}
		})
	})).ok) throw new Error("Falha ao se comunicar com o webhook");
	return new Promise((resolve, reject) => {
		let attempts = 0;
		const maxAttempts = 60;
		const interval = setInterval(async () => {
			attempts++;
			if (attempts > maxAttempts) {
				clearInterval(interval);
				reject(/* @__PURE__ */ new Error("Tempo limite excedido aguardando o post ser gerado no Supabase. Verifique se o fluxo do n8n foi concluído."));
				return;
			}
			try {
				const { data, error } = await supabase.from("generated_posts").select("status, generated_media, caption, format, carrossel_items:post_carrossel_midias(url:media_url, ordem)").eq("id", postId).maybeSingle();
				if (error) {
					console.error("Erro ao fazer polling no Supabase:", error);
					return;
				}
				if (data && data.status === "Aguardando Aprovação") {
					clearInterval(interval);
					let previewMediaUrl = data.generated_media;
					if (data.format?.toUpperCase() === "CAROUSEL" && data.carrossel_items && data.carrossel_items.length > 0) previewMediaUrl = [...data.carrossel_items].sort((a, b) => a.ordem - b.ordem)[0].url;
					resolve({
						videoUrl: previewMediaUrl || "",
						generatedCaption: data.caption || ""
					});
				}
			} catch (err) {
				console.error("Erro na busca do post:", err);
			}
		}, 3e3);
	});
};
var publishToInstagramAPI = async (videoUrl, finalCaption) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(true);
		}, 2500);
	});
};
function NewPostForm({ onGenerate }) {
	const [step, setStep] = (0, import_react.useState)("idle");
	const [format, setFormat] = (0, import_react.useState)("Feed");
	const [mediaType, setMediaType] = (0, import_react.useState)("image");
	const [slideCount, setSlideCount] = (0, import_react.useState)(3);
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [files, setFiles] = (0, import_react.useState)([]);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const inputRef = (0, import_react.useRef)(null);
	const [brandColors, setBrandColors] = (0, import_react.useState)([]);
	const [showMediaKitDropdown, setShowMediaKitDropdown] = (0, import_react.useState)(false);
	const [showColorsSubmenu, setShowColorsSubmenu] = (0, import_react.useState)(false);
	const [selectedFolderId, setSelectedFolderId] = (0, import_react.useState)(null);
	const [typography, setTypography] = (0, import_react.useState)(null);
	const [useTypography, setUseTypography] = (0, import_react.useState)(true);
	const [logos, setLogos] = (0, import_react.useState)([]);
	const [showLogosSubmenu, setShowLogosSubmenu] = (0, import_react.useState)(false);
	const [selectedLogoId, setSelectedLogoId] = (0, import_react.useState)(null);
	const [useText, setUseText] = (0, import_react.useState)(true);
	const [isProductPhoto, setIsProductPhoto] = (0, import_react.useState)(false);
	const [showFormatDropdown, setShowFormatDropdown] = (0, import_react.useState)(false);
	const [videoResolution, setVideoResolution] = (0, import_react.useState)("1080p");
	const [generateAudio, setGenerateAudio] = (0, import_react.useState)(false);
	const [videoDuration, setVideoDuration] = (0, import_react.useState)("4s");
	const [showResolutionDropdown, setShowResolutionDropdown] = (0, import_react.useState)(false);
	const [showDurationDropdown, setShowDurationDropdown] = (0, import_react.useState)(false);
	const [isDraggingGlobal, setIsDraggingGlobal] = (0, import_react.useState)(false);
	const { user } = useAuth();
	(0, import_react.useEffect)(() => {
		let dragCounter = 0;
		const handleDragEnter = (e) => {
			e.preventDefault();
			if (e.dataTransfer?.types.includes("Files")) {
				dragCounter++;
				setIsDraggingGlobal(true);
			}
		};
		const handleDragLeave = (e) => {
			e.preventDefault();
			if (e.dataTransfer?.types.includes("Files")) {
				dragCounter--;
				if (dragCounter === 0) setIsDraggingGlobal(false);
			}
		};
		const handleDrop = (e) => {
			e.preventDefault();
			dragCounter = 0;
			setIsDraggingGlobal(false);
		};
		const handleDragOver = (e) => {
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
	const handleFiles = (incomingFiles) => {
		const fileArray = Array.from(incomingFiles);
		if (fileArray.length === 0) return;
		setFiles((prevFiles) => {
			const newFiles = [...prevFiles, ...fileArray];
			if (newFiles.length > 1) {
				setIsProductPhoto(true);
				if (format === "Reels" || format === "Stories" && mediaType === "video") {
					setFormat("Feed");
					setMediaType("image");
					toast("Múltiplos arquivos detectados. Os modos de vídeo foram desativados e 'Fotos de Produto' ativado.", { duration: 4e3 });
				} else if (prevFiles.length <= 1) toast("Múltiplos arquivos detectados. O modo 'Fotos de Produto' foi ativado.", { duration: 4e3 });
			}
			return newFiles;
		});
	};
	const handleFileUpload = (e) => {
		if (e.target.files) handleFiles(e.target.files);
	};
	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragging(false);
		setIsDraggingGlobal(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
	};
	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragging(true);
	};
	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragging(false);
	};
	const handleModeSelection = (newFormat, newMediaType) => {
		if ((newFormat === "Reels" || newFormat === "Stories" && newMediaType === "video") && files.length > 1) {
			toast("Para criar vídeos, remova as imagens adicionais (suporta apenas 1 arquivo).", { duration: 4e3 });
			return;
		}
		setFormat(newFormat);
		setMediaType(newMediaType);
		if (newFormat === "Reels") setUseText(false);
		setShowFormatDropdown(false);
	};
	const fetchBrandColors = async () => {
		if (!user) return;
		const [colorsRes, foldersRes, typoRes, logosRes] = await Promise.all([
			supabase.from("brand_colors").select("*").order("sort_order", { ascending: true }),
			supabase.from("brand_color_folders").select("*").order("sort_order", { ascending: true }),
			supabase.from("brand_typography").select("*").eq("user_id", user.id).maybeSingle(),
			supabase.from("brand_logos").select("*").eq("user_id", user.id).order("created_at", { ascending: true })
		]);
		const colors = colorsRes.data || [];
		const folders = foldersRes.data || [];
		setLogos(logosRes.data || []);
		setBrandColors([...folders.map((f) => ({
			type: "folder",
			id: f.id,
			name: f.name,
			sort_order: f.sort_order
		})), ...colors.filter((c) => !c.folder_id).map((c) => ({
			type: "color",
			id: c.id,
			hex: c.hex,
			sort_order: c.sort_order
		}))].sort((a, b) => a.sort_order - b.sort_order).map((item) => {
			if (item.type === "folder") {
				const children = colors.filter((c) => c.folder_id === item.id).sort((a, b) => a.sort_order - b.sort_order).map((c) => c.hex);
				return {
					type: "folder",
					id: item.id,
					name: item.name,
					colors: children
				};
			}
			return {
				type: "color",
				id: item.id,
				hex: item.hex
			};
		}));
		if (typoRes.data) setTypography({
			primary_font: typoRes.data.primary_font,
			primary_font_weight: typoRes.data.primary_font_weight,
			secondary_font: typoRes.data.secondary_font,
			secondary_font_weight: typoRes.data.secondary_font_weight
		});
	};
	(0, import_react.useEffect)(() => {
		fetchBrandColors();
	}, [user]);
	const [loadingMessage, setLoadingMessage] = (0, import_react.useState)("");
	const [videoUrl, setVideoUrl] = (0, import_react.useState)("");
	const [caption, setCaption] = (0, import_react.useState)("");
	const [isPublishing, setIsPublishing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (step === "generating") {
			let msgIndex = 0;
			const messages = format === "Carousel" ? [
				"Analisando sua imagem e prompt...",
				"Estruturando os slides do carrossel...",
				"Gerando imagens visualmente impactantes...",
				"Escrevendo uma legenda de alta conversão...",
				"Sincronizando mídias e finalizando..."
			] : LOADING_MESSAGES;
			setLoadingMessage(messages[0]);
			const interval = setInterval(() => {
				msgIndex++;
				if (msgIndex < messages.length) setLoadingMessage(messages[msgIndex]);
			}, format === "Carousel" ? 3500 : 1500);
			const selectedLogoUrl = selectedLogoId ? logos.find((l) => l.id === selectedLogoId)?.url : void 0;
			generateMediaAPI(files, prompt, format, mediaType, user?.id || "", slideCount, selectedFolderId ? brandColors.filter((c) => c.type === "folder" && c.id === selectedFolderId) : void 0, useTypography ? typography : void 0, selectedLogoUrl, useText, isProductPhoto, videoResolution, generateAudio, videoDuration).then((result) => {
				clearInterval(interval);
				setTimeout(() => {
					setVideoUrl(result.videoUrl);
					setCaption(result.generatedCaption);
					setStep("preview");
				}, 600);
			}).catch((err) => {
				clearInterval(interval);
				console.error("Erro ao gerar conteúdo:", err);
				setError(err instanceof Error ? err.message : "Falha ao gerar o conteúdo. Tente novamente.");
				setStep("idle");
			});
			return () => clearInterval(interval);
		}
	}, [
		step,
		files,
		prompt,
		format,
		mediaType,
		slideCount
	]);
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
	if (step === "generating") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
          @keyframes gradient-xy {
            0%, 100% { background-size: 400% 400%; background-position: left center; }
            50% { background-size: 200% 200%; background-position: right center; }
          }
          .animate-gradient-xy { animation: gradient-xy 8s ease infinite; }
        ` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-3xl border border-border bg-card/50 shadow-sm transition-all",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 z-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-gradient-xy opacity-80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 flex flex-col items-center justify-center space-y-8 py-24 text-center animate-in fade-in duration-500",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-28 w-28 items-center justify-center rounded-full bg-background/60 shadow-md backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "absolute h-12 w-12 animate-spin text-primary/80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-6 w-6 text-muted-foreground animate-pulse" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 w-full max-w-md px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-2xl font-medium text-foreground tracking-tight transition-all duration-300",
					children: loadingMessage
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-base text-muted-foreground leading-relaxed",
					children: "Por favor, aguarde. O seu post está sendo gerado e isso pode levar alguns minutos..."
				})]
			})]
		})]
	})] });
	if (step === "preview") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionShell, {
		max: "max-w-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col space-y-5 animate-in slide-in-from-bottom-4 fade-in duration-500",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold tracking-tight",
						children: "Revisão Final"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedIcon, {
								name: "instagram",
								className: "h-3.5 w-3.5"
							}),
							" Instagram ",
							format
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "overflow-hidden border-border bg-card shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 p-3 border-b border-border bg-secondary/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[1.5px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full rounded-full bg-card border-2 border-card" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold leading-none",
									children: "seu_perfil"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground mt-1",
									children: "Agora mesmo"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative aspect-video sm:aspect-[4/5] bg-black flex items-center justify-center",
							children: videoUrl ? isVideoUrl(videoUrl) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: videoUrl,
								controls: true,
								className: "max-h-full max-w-full object-contain",
								autoPlay: true,
								loop: true,
								muted: true
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: videoUrl,
								alt: "Preview",
								className: "max-h-full max-w-full object-contain"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-full w-full rounded-none" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "p-4 space-y-4 bg-card",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-sm font-medium text-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" }), " Sua legenda"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: caption,
									onChange: (e) => setCaption(e.target.value),
									className: "min-h-[120px] resize-none text-sm focus-visible:ring-1 p-3 leading-relaxed",
									placeholder: "Escreva sua legenda aqui..."
								})]
							})
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-destructive text-center font-medium",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-center gap-3 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setStep("idle"),
						disabled: isPublishing,
						className: "w-full sm:w-auto flex-1 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-50",
						children: "Descartar e Tentar Novamente"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handlePublish,
						disabled: isPublishing || !caption.trim(),
						className: "w-full sm:w-[55%] inline-flex items-center justify-center gap-2 rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50",
						children: [isPublishing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), isPublishing ? "Publicando..." : "Aprovar e Postar no Instagram"]
					})]
				})
			]
		})
	});
	if (step === "success") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "flex flex-col items-center justify-center p-10 text-center border-border shadow-sm max-w-md mx-auto mt-6 animate-in zoom-in-95 duration-500",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-8 w-8" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-bold tracking-tight mb-2",
				children: "Sucesso!"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground text-sm mb-8 leading-relaxed",
				children: "Seu post foi gerado e publicado no Instagram. Acompanhe o engajamento diretamente no app."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: resetForm,
				className: "inline-flex items-center gap-2 rounded-md bg-foreground px-6 py-2.5 text-sm font-medium text-background hover:opacity-90 transition-opacity",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-4 w-4" }), "Criar Novo Post"]
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center min-h-[75vh] max-w-3xl mx-auto px-4 w-full animate-in fade-in duration-500",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col items-center mb-10 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl md:text-4xl font-serif text-foreground/90 flex items-center justify-center gap-3",
				children: "O que vamos criar hoje?"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (e) => {
				e.preventDefault();
				if (prompt.trim()) setStep("generating");
			},
			className: "w-full relative",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `bg-card rounded-2xl border shadow-sm p-3 relative flex flex-col focus-within:border-foreground/30 focus-within:shadow-md transition-all duration-300 ${dragging ? "border-primary bg-primary/10 shadow-[0_0_30px_rgba(var(--primary),0.2)] scale-[1.01]" : "border-border"}`,
					onDrop: handleDrop,
					onDragOver: handleDragOver,
					onDragLeave: handleDragLeave,
					children: [
						isDraggingGlobal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl bg-card/80 backdrop-blur-sm border-2 border-dashed transition-colors duration-200 pointer-events-none ${dragging ? "border-primary text-primary" : "border-primary/50 text-muted-foreground"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center p-4 rounded-xl bg-background/80 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-6 w-6 mb-1.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: dragging ? "Solte para anexar" : "Arraste os arquivos para cá"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2 relative self-start z-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setShowFormatDropdown(!showFormatDropdown),
								className: "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-accent/50 text-foreground transition-colors group",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: format
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" })
								]
							}), showFormatDropdown && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-full mt-1 left-0 w-48 rounded-xl border border-border/40 bg-card/95 backdrop-blur-md p-1.5 shadow-lg animate-in fade-in slide-in-from-top-2",
								children: [
									"Feed",
									"Reels",
									"Stories",
									"Carousel"
								].map((fmt) => {
									const isDisabled = fmt === "Reels" && files.length > 1;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => {
												if (isDisabled) return;
												let newMedia = mediaType;
												if (fmt === "Reels") newMedia = "video";
												else if (fmt === "Feed") newMedia = "image";
												handleModeSelection(fmt, newMedia);
											},
											className: `flex items-center w-full px-2 py-2 rounded-lg text-sm transition-colors ${format === fmt ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center w-full gap-2",
												children: [
													fmt === "Feed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-4 w-4 shrink-0" }),
													fmt === "Reels" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "h-4 w-4 shrink-0" }),
													fmt === "Stories" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4 shrink-0" }),
													fmt === "Carousel" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 shrink-0" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: fmt }),
													format === fmt && !isDisabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 ml-auto" })
												]
											})
										}), isDisabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg border border-border/40 bg-card/95 backdrop-blur-md shadow-lg text-xs text-amber-500 font-medium animate-in fade-in slide-in-from-left-1 z-50 pointer-events-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Remova fotos extras para ativar" })]
										})]
									}, fmt);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: prompt,
							onChange: (e) => setPrompt(e.target.value),
							rows: 4,
							placeholder: "Como posso te ajudar hoje?",
							className: "w-full resize-none bg-transparent px-3 py-2 text-base md:text-lg outline-none placeholder:text-muted-foreground/60 leading-relaxed text-foreground"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mt-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										ref: inputRef,
										type: "file",
										accept: "image/*,video/*",
										multiple: !(format === "Reels" || format === "Stories" && mediaType === "video"),
										className: "hidden",
										onChange: handleFileUpload
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => inputRef.current?.click(),
										className: `flex items-center justify-center h-10 w-10 rounded-full transition-colors ${files.length > 0 ? "bg-primary/10 text-primary" : "bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground"}`,
										title: format === "Reels" || format === "Stories" && mediaType === "video" ? "Anexar mídia (Máx 1 arquivo para este modo)" : files.length > 0 ? `${files.length} arquivos selecionados` : "Anexar Imagem",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5" })
									}),
									files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center pl-3 group",
										children: files.map((f, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "transition-all duration-300 ease-out group-hover:!ml-2 group-hover:scale-105",
											style: {
												marginLeft: idx > 0 ? "-1.5rem" : "0",
												zIndex: 10 - idx
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePreview, {
												file: f,
												onRemove: () => setFiles((prev) => prev.filter((_, i) => i !== idx))
											})
										}, `${f.name}-${idx}`))
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: !prompt.trim(),
								className: "flex items-center justify-center h-10 w-10 rounded-full bg-foreground text-background transition-transform hover:scale-105 disabled:opacity-30 disabled:hover:scale-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
							})]
						})
					]
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-destructive font-medium bg-destructive/10 px-3 py-2 rounded-md text-center",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap items-center justify-center gap-2",
					children: [
						format === "Stories" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex bg-card border border-border p-1 rounded-full items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleModeSelection("Stories", "image"),
								className: `px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${mediaType === "image" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`,
								children: "Imagem"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative group flex items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										if (files.length > 1) return;
										handleModeSelection("Stories", "video");
									},
									className: `px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${mediaType === "video" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"} ${files.length > 1 ? "opacity-50 cursor-not-allowed" : ""}`,
									children: "Vídeo"
								}), files.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-lg border border-border/40 bg-card/95 backdrop-blur-md shadow-lg text-xs text-amber-500 font-medium animate-in fade-in slide-in-from-bottom-1 z-50 pointer-events-none",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Remova fotos extras para usar vídeo" })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							disabled: mediaType === "video",
							onClick: () => {
								setUseText(!useText);
							},
							className: `flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${mediaType === "video" ? "opacity-50 cursor-not-allowed border-border bg-card text-muted-foreground" : useText ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:bg-accent hover:border-foreground/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, { className: "h-4 w-4" }), "Textos"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setIsProductPhoto(!isProductPhoto),
							className: `flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${isProductPhoto ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:bg-accent hover:border-foreground/20"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), "Fotos de Produto"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `relative ${showMediaKitDropdown ? "z-50" : "z-40"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setShowMediaKitDropdown(!showMediaKitDropdown);
									setShowColorsSubmenu(false);
									setShowLogosSubmenu(false);
								},
								className: `flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${selectedFolderId || selectedLogoId ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:bg-accent hover:border-foreground/20"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-4 w-4" }), "Mídia Kit"]
							}), showMediaKitDropdown && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-full mt-2 left-1/2 -translate-x-1/2 w-56 rounded-lg border border-border/40 bg-card/95 backdrop-blur-md p-1.5 shadow-md animate-in fade-in slide-in-from-top-2 z-30",
								children: !showColorsSubmenu && !showLogosSubmenu ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setShowColorsSubmenu(true),
										className: "group flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-sm text-foreground hover:bg-accent/50 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: "Cores"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setShowLogosSubmenu(true),
										className: "group flex w-full items-center justify-between rounded-sm px-3 py-2.5 text-sm text-foreground hover:bg-accent/50 transition-colors mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: "Logos"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" })]
									}),
									typography ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: (e) => {
											e.stopPropagation();
											setUseTypography(!useTypography);
										},
										className: "group flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm text-foreground hover:bg-accent/50 transition-colors mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-start gap-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: "Tipografia"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] text-muted-foreground",
												children: typography.primary_font
											})]
										}), useTypography ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-primary shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-4 rounded-sm border border-border shrink-0" })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex w-full flex-col items-start rounded-sm px-3 py-2 mt-1 opacity-60",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-medium text-foreground",
											children: "Tipografia"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground",
											children: "Não configurada"
										})]
									})
								] }) : showColorsSubmenu ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setShowColorsSubmenu(false),
										className: "group flex w-full items-center gap-2 rounded-sm px-2 py-2 mb-1 text-xs text-muted-foreground hover:bg-accent/50 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "",
											children: "Voltar"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px w-full bg-border mb-1" }),
									brandColors.filter((c) => c.type === "folder").length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-col gap-1 max-h-48 overflow-y-auto",
										children: brandColors.filter((c) => c.type === "folder").map((folder) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setSelectedFolderId(selectedFolderId === folder.id ? null : folder.id);
												setShowMediaKitDropdown(false);
											},
											className: `group flex w-full items-center justify-between rounded-sm px-2 py-2 text-sm text-foreground transition-colors ${selectedFolderId === folder.id ? "bg-accent" : "hover:bg-accent/50"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs truncate max-w-[100px] text-left",
													children: folder.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex pl-1",
													children: folder.colors.slice(0, 4).map((hex, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "h-3 w-3 rounded-[2px] border border-black",
														style: {
															backgroundColor: hex,
															marginLeft: idx > 0 ? "-0.4rem" : "0",
															zIndex: 10 - idx
														}
													}, idx))
												}),
												selectedFolderId === folder.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-primary ml-1 shrink-0" })
											]
										}, folder.id))
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2 text-center text-xs text-muted-foreground",
										children: "Nenhuma pasta cadastrada."
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setShowLogosSubmenu(false),
										className: "group flex w-full items-center gap-2 rounded-sm px-2 py-2 mb-1 text-xs text-muted-foreground hover:bg-accent/50 transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "",
											children: "Voltar"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px w-full bg-border mb-1" }),
									logos && logos.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-col gap-1 max-h-48 overflow-y-auto",
										children: logos.map((logo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setSelectedLogoId(selectedLogoId === logo.id ? null : logo.id);
												setShowMediaKitDropdown(false);
											},
											className: `group flex w-full items-center justify-between rounded-sm px-2 py-2 text-sm text-foreground transition-colors ${selectedLogoId === logo.id ? "bg-accent" : "hover:bg-accent/50"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 overflow-hidden",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: logo.url,
													alt: logo.name,
													className: "h-4 w-4 object-contain shrink-0"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs truncate max-w-[100px] text-left",
													children: logo.name
												})]
											}), selectedLogoId === logo.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-primary shrink-0" })]
										}, logo.id))
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-2 text-center text-xs text-muted-foreground",
										children: "Nenhuma logo cadastrada."
									})
								] })
							})]
						})
					]
				}),
				mediaType === "video" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `mt-4 flex flex-wrap items-center justify-center gap-2 animate-in fade-in slide-in-from-bottom-2 relative ${showResolutionDropdown || showDurationDropdown ? "z-50" : "z-30"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium text-muted-foreground mr-2",
							children: "Configurações de Vídeo:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setShowResolutionDropdown(!showResolutionDropdown),
								className: `flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors border-border bg-card text-foreground hover:bg-accent hover:border-foreground/20`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-4 w-4" }), videoResolution]
							}), showResolutionDropdown && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 rounded-lg border border-border/40 bg-card/95 backdrop-blur-md p-1.5 shadow-md animate-in fade-in slide-in-from-bottom-2",
								children: [
									"720p",
									"1080p",
									"4k"
								].map((res) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setVideoResolution(res);
										setShowResolutionDropdown(false);
									},
									className: "w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent/50",
									children: res
								}, res))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setGenerateAudio(!generateAudio),
							className: `flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors ${generateAudio ? "border-primary/50 bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:bg-accent hover:border-foreground/20"}`,
							children: [generateAudio ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "h-4 w-4" }), "Áudio"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setShowDurationDropdown(!showDurationDropdown),
								className: `flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition-colors border-border bg-card text-foreground hover:bg-accent hover:border-foreground/20`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }), videoDuration]
							}), showDurationDropdown && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-24 rounded-lg border border-border/40 bg-card/95 backdrop-blur-md p-1.5 shadow-md animate-in fade-in slide-in-from-bottom-2",
								children: [
									"4s",
									"6s",
									"8s"
								].map((dur) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => {
										setVideoDuration(dur);
										setShowDurationDropdown(false);
									},
									className: "w-full text-left px-3 py-1.5 rounded-md text-sm hover:bg-accent/50",
									children: dur
								}, dur))
							})]
						})
					]
				}),
				format === "Carousel" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs font-medium text-muted-foreground mb-2",
						children: [
							"Quantidade de Slides (",
							slideCount,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: "2",
						max: "10",
						value: slideCount,
						onChange: (e) => setSlideCount(parseInt(e.target.value)),
						className: "w-48 accent-foreground"
					})]
				})
			]
		})]
	});
}
function ReviewList({ posts, isLoading, onPreview }) {
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	}) });
	if (posts.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Nada para revisar",
		description: "Quando a IA gerar novos posts, eles aparecerão aqui para sua aprovação."
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionShell, {
		max: "max-w-5xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
			children: posts.map((post) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewCard, {
				post,
				onPreview: () => onPreview(post)
			}, post.id))
		})
	});
}
function ReviewCard({ post, onPreview }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		onClick: onPreview,
		className: "group overflow-hidden rounded-xl border border-border/60 bg-card/50 shadow-sm cursor-pointer hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 ease-out",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 p-5 sm:flex-row",
			children: [post.carrossel_items && post.carrossel_items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-40 w-full shrink-0 sm:h-32 sm:w-32",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: post.carrossel_items[0].url,
					alt: "Pré-visualização do carrossel",
					className: "h-full w-full rounded-md border border-border object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute top-1.5 right-1.5 bg-black/70 text-white text-[10px] font-medium px-1.5 py-0.5 rounded backdrop-blur-sm shadow-sm",
					children: ["1/", post.carrossel_items.length]
				})]
			}) : post.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: post.image_url,
				alt: "Pré-visualização do post",
				className: "h-40 w-full shrink-0 rounded-md border border-border object-cover sm:h-32 sm:w-32"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-40 w-full shrink-0 rounded-md border border-border bg-secondary/50 flex items-center justify-center sm:h-32 sm:w-32",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-6 w-6 text-muted-foreground" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground uppercase",
						children: post.format
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded bg-accent px-1.5 py-0.5 text-[11px] text-muted-foreground uppercase",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), post.status]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-foreground/80 line-clamp-3",
					children: (post.caption || post.prompt || "").replace(/\\n/g, " ").replace(/\n/g, " ")
				})]
			})]
		})
	});
}
function ScheduledList({ posts, isLoading, onPreview }) {
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	}) });
	if (posts.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Nenhum post agendado",
		description: "Aprove um post e escolha 'Agendar' para vê-lo aqui."
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border/40 rounded-xl border border-border/60 bg-card/50 shadow-sm overflow-hidden",
		children: posts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			onClick: () => onPreview(p),
			className: "group flex items-center gap-4 p-4 cursor-pointer hover:bg-accent/40 transition-all duration-300 ease-out",
			children: [
				p.carrossel_items && p.carrossel_items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-12 w-12 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.carrossel_items[0].url,
						alt: "",
						className: "h-full w-full rounded border border-border object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold px-1 rounded-full shadow-sm",
						children: p.carrossel_items.length
					})]
				}) : p.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: p.image_url,
					alt: "",
					className: "h-12 w-12 shrink-0 rounded border border-border object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-12 w-12 shrink-0 rounded border border-border bg-secondary flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-muted-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm",
						children: (p.caption || p.prompt || "").replace(/\\n/g, " ").replace(/\n/g, " ")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground uppercase",
						children: [
							p.format,
							" · ",
							new Date(p.created_at || Date.now()).toLocaleString("pt-BR")
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-4 w-4 shrink-0 text-muted-foreground" })
			]
		}, p.id))
	}) });
}
function HistoryList({ posts, isLoading, onPreview }) {
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex justify-center p-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" })
	}) });
	if (posts.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "Sem histórico ainda",
		description: "Posts publicados ou recusados aparecerão aqui."
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border/40 rounded-xl border border-border/60 bg-card/50 shadow-sm overflow-hidden",
		children: posts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			onClick: () => onPreview(p),
			className: "group flex items-center gap-4 p-4 cursor-pointer hover:bg-accent/40 transition-all duration-300 ease-out",
			children: [
				p.carrossel_items && p.carrossel_items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-12 w-12 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.carrossel_items[0].url,
						alt: "",
						className: "h-full w-full rounded border border-border object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute -top-1 -right-1 bg-black text-white text-[8px] font-bold px-1 rounded-full shadow-sm",
						children: p.carrossel_items.length
					})]
				}) : p.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: p.image_url,
					alt: "",
					className: "h-12 w-12 shrink-0 rounded border border-border object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-12 w-12 shrink-0 rounded border border-border bg-secondary flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-muted-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm",
						children: (p.caption || p.prompt || "").replace(/\\n/g, " ").replace(/\n/g, " ")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground uppercase",
						children: [
							p.format,
							" · ",
							new Date(p.created_at || Date.now()).toLocaleDateString("pt-BR")
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `shrink-0 rounded px-1.5 py-0.5 text-[11px] uppercase ${p.status === "publicado" ? "bg-accent text-muted-foreground" : "text-destructive"}`,
					children: p.status
				})
			]
		}, p.id))
	}) });
}
function EmptyState({ title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-dashed border-border bg-card px-6 py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm font-medium text-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted-foreground",
			children: description
		})]
	});
}
function ImagePreview({ file, onRemove }) {
	const [url, setUrl] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const objectUrl = URL.createObjectURL(file);
		setUrl(objectUrl);
		return () => URL.revokeObjectURL(objectUrl);
	}, [file]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative group/img w-14 h-14 shrink-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: url,
			alt: "Preview",
			className: "h-full w-full rounded-md object-cover border-2 border-background shadow-sm"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: (e) => {
				e.preventDefault();
				e.stopPropagation();
				onRemove();
			},
			className: "absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground rounded-full h-5 w-5 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity shadow-sm hover:scale-110 z-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
		})]
	});
}
function PostDetailsModal({ post, onClose, onUpdate, onLocalUpdate }) {
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [showDatePicker, setShowDatePicker] = (0, import_react.useState)(false);
	const [scheduleDate, setScheduleDate] = (0, import_react.useState)("");
	const [currentSlide, setCurrentSlide] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setShowDatePicker(false);
		setScheduleDate("");
		setCurrentSlide(0);
	}, [post?.id]);
	if (!post) return null;
	const formattedPrompt = post.prompt?.replace(/\\n/g, "\n") || "";
	const formattedCaption = post.caption?.replace(/\\n/g, "\n") || "A IA ainda não gerou a legenda para este post.";
	const handleApprove = async () => {
		if (!post) return;
		setIsSubmitting(true);
		try {
			const { data, error } = await supabase.from("generated_posts").update({ status: "Aprovada" }).eq("id", post.id).select();
			if (error) throw error;
			if (!data || data.length === 0) throw new Error("Aprovação bloqueada por RLS ou post não encontrado.");
			onLocalUpdate({
				...post,
				status: "Aprovada"
			});
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
			onLocalUpdate({
				...post,
				status: "Publicar Agora"
			});
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
				data_publicacao: new Date(scheduleDate).toISOString()
			}).select();
			if (error1) throw error1;
			if (!data1 || data1.length === 0) throw new Error("Insert em post_agendamentos bloqueado por RLS.");
			const { data: data2, error: error2 } = await supabase.from("generated_posts").update({
				agendada: true,
				status: "Aprovada"
			}).eq("id", post.id).select();
			if (error2) throw error2;
			if (!data2 || data2.length === 0) throw new Error("Update em generated_posts bloqueado por RLS.");
			onLocalUpdate({
				...post,
				agendada: true,
				status: "Aprovada"
			});
			onUpdate();
			onClose();
		} catch (err) {
			console.error(err);
			alert("Erro ao agendar post");
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!post,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "fixed inset-0 z-50 w-screen h-[100dvh] max-w-none max-h-none left-0 top-0 translate-x-0 translate-y-0 rounded-none border-none p-4 md:p-6 lg:p-8 flex flex-col bg-background",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
				className: "shrink-0 pb-2 border-b border-border/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-xl font-bold",
					children: "Detalhes da Publicação"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-h-0 flex flex-col lg:flex-row gap-6 mt-4 overflow-y-auto lg:overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full lg:w-3/5 xl:w-2/3 flex flex-col gap-4 lg:h-full lg:min-h-0 items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 w-full min-h-0 flex items-center justify-center relative bg-black/5 rounded-xl border border-border/40 p-2 lg:p-4",
						children: post.format?.toUpperCase() === "CAROUSEL" && post.carrossel_items && post.carrossel_items.length > 0 ? (() => {
							const sortedItems = [...post.carrossel_items].sort((a, b) => a.ordem - b.ordem);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full h-full relative flex items-center justify-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: sortedItems[currentSlide].url,
										alt: `Slide ${sortedItems[currentSlide].ordem}`,
										className: "max-w-full max-h-full object-contain rounded-lg drop-shadow-sm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute top-2 right-2 md:top-4 md:right-4 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm border border-white/10 z-10",
										children: [
											currentSlide + 1,
											" / ",
											sortedItems.length
										]
									}),
									currentSlide > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setCurrentSlide((c) => c - 1),
										className: "absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors backdrop-blur-md shadow-lg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-6 w-6" })
									}),
									currentSlide < sortedItems.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setCurrentSlide((c) => c + 1),
										className: "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors backdrop-blur-md shadow-lg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-6 w-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute bottom-2 md:bottom-4 left-0 right-0 flex justify-center gap-2 z-10",
										children: sortedItems.map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-2 h-2 rounded-full backdrop-blur-sm transition-colors shadow-sm ${idx === currentSlide ? "bg-white" : "bg-white/40"}` }, idx))
									})
								]
							});
						})() : post.generated_media ? isVideoUrl(post.generated_media) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
							src: post.generated_media,
							controls: true,
							autoPlay: true,
							loop: true,
							muted: true,
							className: "max-w-full max-h-full object-contain rounded-lg drop-shadow-sm"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: post.generated_media,
							alt: "Mídia gerada",
							className: "max-w-full max-h-full object-contain rounded-lg drop-shadow-sm"
						}) : post.image_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: post.image_url,
							alt: "Imagem do post",
							className: "max-w-full max-h-full object-contain rounded-lg drop-shadow-sm"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full h-full flex items-center justify-center text-muted-foreground bg-secondary/20 rounded-lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-10 w-10 opacity-50" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full text-xs text-muted-foreground space-y-2 bg-secondary/30 p-4 rounded-xl border border-border/50 shrink-0 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ID:" }),
								" ",
								post.id
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Formato:" }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "uppercase font-semibold text-foreground/90",
									children: post.format
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Status:" }),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "uppercase font-semibold text-foreground/90",
									children: [
										post.status,
										" ",
										post.agendada && "(Agendada)"
									]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Criado em:" }),
								" ",
								new Date(post.created_at || Date.now()).toLocaleString("pt-BR")
							] })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full lg:w-2/5 xl:w-1/3 flex flex-col lg:h-full lg:min-h-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 flex-1 lg:overflow-y-auto pr-0 lg:pr-2 pb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-semibold flex items-center gap-2 text-foreground/95",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-4 w-4 text-indigo-500" }), " Prompt Original"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground bg-secondary/30 p-4 rounded-xl border border-border/30 italic leading-relaxed whitespace-pre-wrap animate-fade-in",
								children: formattedPrompt
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 flex flex-col flex-1 min-h-[220px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-sm font-semibold flex items-center gap-2 text-foreground/95",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4 text-indigo-500" }), " Legenda"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								readOnly: true,
								value: formattedCaption,
								className: "flex-1 min-h-[180px] lg:min-h-[280px] resize-none text-sm leading-relaxed p-4 bg-secondary/10 border border-border/40 focus:ring-0 focus-visible:ring-0"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 border-t border-border shrink-0 mt-auto bg-background",
						children: [
							post.status === "Aguardando Aprovação" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2 mb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handleApprove,
									disabled: isSubmitting,
									className: "flex-1 rounded-md bg-foreground px-3 py-3 text-sm font-semibold text-background hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50",
									children: "Aprovar"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: handleReject,
								disabled: isSubmitting,
								className: "w-full rounded-md border border-destructive/20 text-destructive bg-destructive/5 px-3 py-2.5 text-sm font-semibold hover:bg-destructive hover:text-destructive-foreground transition-colors cursor-pointer disabled:opacity-50",
								children: "Recusar"
							})] }),
							post.status === "Aprovada" && !post.agendada && !showDatePicker && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowDatePicker(true),
									className: "flex-1 rounded-md bg-indigo-600 text-white px-3 py-3 text-sm font-semibold hover:bg-indigo-700 transition-colors cursor-pointer",
									children: "Agendar"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: handlePostNow,
									className: "flex-1 rounded-md border border-border px-3 py-3 text-sm font-semibold hover:bg-accent transition-colors cursor-pointer",
									children: "Postar Agora"
								})]
							}),
							showDatePicker && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 mb-2 bg-secondary/20 p-4 rounded-xl border border-border/50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "text-sm font-medium",
										children: "Selecione a data e hora de postagem:"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "datetime-local",
										value: scheduleDate,
										onChange: (e) => setScheduleDate(e.target.value),
										className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: handleScheduleSubmit,
											disabled: !scheduleDate || isSubmitting,
											className: "flex-1 rounded-md bg-foreground text-background px-3 py-2 text-sm font-medium disabled:opacity-50 cursor-pointer hover:opacity-90",
											children: isSubmitting ? "Salvando..." : "Confirmar"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setShowDatePicker(false),
											disabled: isSubmitting,
											className: "flex-1 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent cursor-pointer",
											children: "Cancelar"
										})]
									})
								]
							})
						]
					})]
				})]
			})]
		})
	});
}
//#endregion
export { App as component };
