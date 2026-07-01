import { r as __toESM } from "../_runtime.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Lottie$1 } from "../_libs/lottie-react+lottie-web.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AnimatedIcon-Cib4KO2e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var Lottie = Lottie$1.default || Lottie$1;
function AnimatedIcon({ name, className, loop = true, autoplay = true, ...props }) {
	const [animationData, setAnimationData] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let isMounted = true;
		fetch(`/icons/${name}.json`).then((res) => {
			if (!res.ok) throw new Error("Icon not found");
			return res.json();
		}).then((data) => {
			if (isMounted) setAnimationData(data);
		}).catch((err) => console.error(`Failed to load icon ${name}`, err));
		return () => {
			isMounted = false;
		};
	}, [name]);
	if (!animationData) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("inline-block w-4 h-4", className),
		...props
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lottie, {
		animationData,
		loop,
		autoplay,
		className: cn("inline-block w-4 h-4", className),
		...props
	});
}
//#endregion
export { cn as n, AnimatedIcon as t };
