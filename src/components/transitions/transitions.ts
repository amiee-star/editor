import { CSSProperties } from "react"
import { TransitionActions, TransitionProps as _TransitionProps } from "react-transition-group/Transition"

export type TransitionHandlerKeys = "onEnter" | "onEntering" | "onEntered" | "onExit" | "onExiting" | "onExited"
export type TransitionHandlerProps = Pick<_TransitionProps, TransitionHandlerKeys>

export type TransitionKeys =
	| "in"
	| "mountOnEnter"
	| "unmountOnExit"
	| "timeout"
	| "addEndListener"
	| TransitionHandlerKeys
export interface TransitionProps extends TransitionActions, Partial<Pick<_TransitionProps, TransitionKeys>> {
	style?: CSSProperties
}

export const easing = {
	easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
	easeOut: "cubic-bezier(0.0, 0, 0.2, 1)",
	easeIn: "cubic-bezier(0.4, 0, 1, 1)",
	sharp: "cubic-bezier(0.4, 0, 0.6, 1)"
}

export const duration = {
	shortest: 150,
	shorter: 200,
	short: 250,
	standard: 300,
	complex: 375,
	enteringScreen: 225,
	leavingScreen: 195
}

function formatMs(milliseconds: number) {
	return `${Math.round(milliseconds)}ms`
}

export default {
	easing,
	duration,
	create: (
		props: string | string[] = ["all"],
		options: Partial<{
			duration: number | string
			easing: string
			delay: number | string
		}> = {}
	) => {
		const { duration: durationOption = duration.standard, easing: easingOption = easing.easeInOut, delay = 0 } = options

		return (Array.isArray(props) ? props : [props])
			.map(
				animatedProp =>
					`${animatedProp} ${
						typeof durationOption === "string" ? durationOption : formatMs(durationOption)
					} ${easingOption} ${typeof delay === "string" ? delay : formatMs(delay)}`
			)
			.join(",")
	},
	getAutoHeightDuration(height: number) {
		if (!height) {
			return 0
		}
		const constant = height / 36
		return Math.round((4 + 15 * constant ** 0.25 + constant / 5) * 10)
	}
}
