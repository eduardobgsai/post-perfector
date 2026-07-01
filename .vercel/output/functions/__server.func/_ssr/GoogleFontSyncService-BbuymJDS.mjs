import { i as TSS_SERVER_FUNCTION, l as createServerFn } from "./esm-Dova13aH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/GoogleFontSyncService-BbuymJDS.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var fontsCache = null;
var fetchPromise = null;
async function syncGoogleFonts() {
	if (fontsCache) return fontsCache;
	if (fetchPromise) return fetchPromise;
	const apiKey = typeof process !== "undefined" && process.env.GOOGLE_API_KEY ? process.env.GOOGLE_API_KEY : "AIzaSyBLU8t2SanwOrR3XtALVo5GFeonne1kteo";
	if (!apiKey) {
		console.error("API KEY do Google Fonts não encontrada. Configure VITE_GOOGLE_API_KEY no arquivo .env");
		return [];
	}
	fetchPromise = (async () => {
		try {
			const response = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity&fields=items(family,category,variants)`);
			if (!response.ok) throw new Error(`Google Fonts API error: ${response.status}`);
			fontsCache = (await response.json()).items.map((item) => ({
				family: item.family,
				category: item.category,
				variants: item.variants
			}));
			return fontsCache || [];
		} catch (error) {
			console.error("Failed to sync Google Fonts:", error);
			fetchPromise = null;
			return [];
		}
	})();
	return fetchPromise;
}
var searchFonts_createServerFn_handler = createServerRpc({
	id: "8538008b4f99b091419256428d0541f89192fadc31d4541da38f031cbe47ea3e",
	name: "searchFonts",
	filename: "src/lib/GoogleFontSyncService.ts"
}, (opts) => searchFonts.__executeServer(opts));
var searchFonts = createServerFn({ method: "GET" }).validator((data) => data).handler(searchFonts_createServerFn_handler, async ({ data }) => {
	const fonts = await syncGoogleFonts();
	const query = data.query;
	const limit = data.limit || 10;
	if (!query || query.trim() === "") return fonts.slice(0, limit > 0 ? limit : 20);
	const lowerQuery = query.toLowerCase();
	return fonts.filter((font) => font.family.toLowerCase().includes(lowerQuery)).slice(0, limit);
});
//#endregion
export { searchFonts_createServerFn_handler };
