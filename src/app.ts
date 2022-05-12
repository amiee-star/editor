import { RenderOpts, rootContainerParams, RouteChangeParams, RouteItem } from "./interfaces/app.interface"

export function modifyClientRenderOpts(memo: RenderOpts) {
	return memo
}
export function patchRoutes(e: { routes: RouteItem[] }) {}
export function render(oldRender: Function) {
	oldRender()
}
export function onRouteChange(e: RouteChangeParams) {}
export function rootContainer(e: rootContainerParams) {
	return e
}
