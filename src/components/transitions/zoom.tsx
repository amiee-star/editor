import React, { cloneElement, createElement } from "react"

import { Transition } from "react-transition-group"
import { TransitionStatus } from "react-transition-group/Transition"

import transitions, { duration, TransitionProps } from "./transitions"
import { getTransitionProps, reflow } from "./util"

const styles = {
	entering: {
		transform: "none"
	},
	entered: {
		transform: "none"
	},
	exiting: {},
	exited: {},
	unmounted: {}
}

const defaultTimeout = {
	enter: duration.enteringScreen,
	exit: duration.leavingScreen
}

export type ZoomProps = TransitionProps
const Zoom: React.FC<ZoomProps> = props => {
	const { children, in: inProp, onEnter, onExit, style, timeout = defaultTimeout, ...other } = props

	const handleEnter = (node: HTMLElement, isAppearing: boolean) => {
		reflow(node)
		const transitionProps = getTransitionProps(
			{ style, timeout },
			{
				mode: "enter"
			}
		)
		node.style.webkitTransition = transitions.create("transform", transitionProps)
		node.style.transition = transitions.create("transform", transitionProps)
		if (onEnter) {
			onEnter(node, isAppearing)
		}
	}
	const handleExit = (node: HTMLElement) => {
		const transitionProps = getTransitionProps(
			{ style, timeout },
			{
				mode: "exit"
			}
		)
		node.style.webkitTransition = transitions.create("transform", transitionProps)
		node.style.transition = transitions.create("transform", transitionProps)

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
						transform: "scale(0)",
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

export default Zoom
