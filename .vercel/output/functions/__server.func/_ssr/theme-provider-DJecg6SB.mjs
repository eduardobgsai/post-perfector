import { r as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/theme-provider-DJecg6SB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ThemeProviderContext = (0, import_react.createContext)({
	theme: "system",
	setTheme: () => null
});
function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme", ...props }) {
	const [theme, setTheme] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") return localStorage.getItem(storageKey) || defaultTheme;
		return defaultTheme;
	});
	(0, import_react.useEffect)(() => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");
		if (theme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			root.classList.add(systemTheme);
			return;
		}
		root.classList.add(theme);
	}, [theme]);
	const value = {
		theme,
		setTheme: (theme) => {
			if (typeof window !== "undefined") localStorage.setItem(storageKey, theme);
			setTheme(theme);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThemeProviderContext.Provider, {
		...props,
		value,
		children
	});
}
var useTheme = () => {
	const context = (0, import_react.useContext)(ThemeProviderContext);
	if (context === void 0) throw new Error("useTheme must be used within a ThemeProvider");
	return context;
};
//#endregion
export { useTheme as n, ThemeProvider as t };
