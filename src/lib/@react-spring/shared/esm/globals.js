import { FrameLoop } from "./FrameLoop"
import { noop } from "./helpers"
//
// Required
//
export var createStringInterpolator
export var frameLoop = new FrameLoop()
//
// Optional
//
export var to
export var now = function () {
	return performance.now()
}
export var colorNames = null
export var skipAnimation = false
export var requestAnimationFrame =
	typeof window !== "undefined"
		? window.requestAnimationFrame
		: function () {
				return -1
		  }
export var batchedUpdates = function (callback) {
	return callback()
}
export var willAdvance = function () {}
export var assign = function (globals) {
	var _a
	return (
		(_a = Object.assign(
			{
				to: to,
				now: now,
				frameLoop: frameLoop,
				colorNames: colorNames,
				skipAnimation: skipAnimation,
				createStringInterpolator: createStringInterpolator,
				requestAnimationFrame: requestAnimationFrame,
				batchedUpdates: batchedUpdates,
				willAdvance: willAdvance
			},
			pluckDefined(globals)
		)),
		(to = _a.to),
		(now = _a.now),
		(frameLoop = _a.frameLoop),
		(colorNames = _a.colorNames),
		(skipAnimation = _a.skipAnimation),
		(createStringInterpolator = _a.createStringInterpolator),
		(requestAnimationFrame = _a.requestAnimationFrame),
		(batchedUpdates = _a.batchedUpdates),
		(willAdvance = _a.willAdvance),
		_a
	)
}
// Ignore undefined values
function pluckDefined(globals) {
	var defined = {}
	for (var key in globals) {
		if (globals[key] !== undefined) defined[key] = globals[key]
	}
	return defined
}
//# sourceMappingURL=globals.js.map
