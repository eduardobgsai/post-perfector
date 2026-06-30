//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-C6gypf3Y.js
var manifest = { "8538008b4f99b091419256428d0541f89192fadc31d4541da38f031cbe47ea3e": {
	functionName: "searchFonts_createServerFn_handler",
	importer: () => import("./_ssr/GoogleFontSyncService-BbuymJDS.mjs")
} };
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
