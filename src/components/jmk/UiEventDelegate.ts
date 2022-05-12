/**
 * Created by Kai on 2021/2/23.
 */

export default class UiEventDelegate extends THREE.EventDispatcher {
	constructor() {
		super()

		Object.defineProperty(this, "cover", {
			get: function () {}
		})
	}

	updateCover(cover) {}

	onResize() {}

	onFullScreenChange(changed) {}

	onPointerLockChange(changed) {}

	onVrChange(changed) {}

	setVrSupported(value) {}
	setFullScreenSupported() {}

	setPointerLockSupported() {}

	sceneReadyToDisplay(scene, teleport, autoTour, screenshotTaker) {}

	sceneLoadComplete() {}

	sceneLoadStarted() {}

	loadProgress(event) {}

	contextLost() {}

	refresh() {}

	init() {
		return this
	}
}
