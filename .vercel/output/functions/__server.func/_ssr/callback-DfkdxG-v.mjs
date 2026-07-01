import { r as __toESM } from "../_runtime.mjs";
import { g as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as supabase } from "./supabase-C2y_zUVs.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as AnimatedIcon } from "./AnimatedIcon-Cib4KO2e.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/callback-DfkdxG-v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function IntegracaoCallback() {
	const navigate = useNavigate();
	const hasProcessed = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const hash = window.location.hash;
		const search = window.location.search;
		if (hash.includes("error=") || search.includes("error=")) {
			const params = new URLSearchParams(hash.includes("error=") ? hash.substring(1) : search);
			const errorDesc = params.get("error_description") || params.get("error");
			toast.error("Erro na autorização do Facebook: " + errorDesc?.replace(/\+/g, " "));
			navigate({ to: "/" });
			return;
		}
		const processAuth = async (session) => {
			if (hasProcessed.current) return;
			const metaToken = session?.provider_token;
			const userId = session?.user?.id;
			if (metaToken && userId) {
				hasProcessed.current = true;
				const { error } = await supabase.from("integracoes").upsert({
					user_id: userId,
					plataforma: "instagram",
					access_token: metaToken
				}, { onConflict: "user_id" });
				if (!error) toast.success("Conta vinculada com sucesso!");
				else {
					console.error("Erro ao salvar token:", error);
					toast.error("Erro ao salvar token: " + error.message);
				}
				navigate({ to: "/" });
			}
		};
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			if (session && session.provider_token) processAuth(session);
		});
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (session && session.provider_token) processAuth(session);
		});
		const timer = setTimeout(() => {
			if (!hasProcessed.current) navigate({ to: "/" });
		}, 3e3);
		return () => {
			subscription.unsubscribe();
			clearTimeout(timer);
		};
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col items-center justify-center bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedIcon, {
			name: "loader",
			className: "h-8 w-8 animate-spin text-primary mb-4"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-lg font-medium text-foreground/80",
			children: "Processando sua conexão com o Facebook..."
		})]
	});
}
//#endregion
export { IntegracaoCallback as component };
