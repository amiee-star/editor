import React, { cloneElement, createElement } from "react"

import { Transition, TransitionStatus } from "react-transition-group"

import transitions, { duration, TransitionProps } from "./transitions"
import { getTransitionProps, reflow } from "./util"

const styles = {
	entering: {
		opacity: 1
	},
	entered: {
		opacity: 1
	},
	exiting: {},
	exited: {},
	unmounted: {}
}

const defaultTimeout = {
	enter: duration.enteringScreen,
	exit: duration.leavingScreen
}

export type FadeProps = TransitionProps
const Fade: React.FC<FadeProps> = props => {
	const { children, in: inProp, onEnter, onExit, style, timeout = defaultTimeout, ...other } = props

	const handleEnter = (node: any, isAppearing?: boolean) => {
		reflow(node)
		const transitionProps = getTransitionProps(
			{ style, timeout },
			{
				mode: "enter"
			}
		)
		node.style.webkitTransition = transitions.create("opacity", transitionProps)
		node.style.transition = transitions.create("opacity", transitionProps)

		if (onEnter) {
			onEnter(node, isAppearing)
		}
	}

	const handleExit = (node?: HTMLElement) => {
		const transitionProps = getTransitionProps(
			{ style, timeout },
			{
				mode: "exit"
			}
		)
		node.style.webkitTransition = transitions.create("opacity", transitionProps)
		node.style.transition = transitions.create("opacity", transitionProps)
		if (onExit) {
			onExit(node)
		}
	}
	return (
		<Transition appear in={inProp} onEnter={handleEnter} onExit={handleExit} timeout={timeout} {...other}>
			{(state: TransitionStatus, childProps: any) => {
				const transitionDiv = createElement("div", { style: {} }, children)
				return cloneElement(transitionDiv, {
					style: {
						opacity: 0,
						visibility: state === "exited" && !inProp ? "hidden" : undefined,
						...styles[state],
						...style,
						...transitionDiv.props.style
					},
					...childProps
				})
			}}
		</Transition>
	)
}

export default Fade
