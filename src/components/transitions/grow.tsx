import React, { createElement, cloneElement, useRef, useEffect } from "react"

import { Transition, TransitionStatus } from "react-transition-group"

import transitions, { TransitionProps } from "./transitions"
import { getTransitionProps, reflow } from "./util"

function getScale(value: number) {
	return `scale(${value}, ${value ** 2})`
}
const styles = {
	entering: {
		opacity: 1,
		transform: getScale(1)
	},
	entered: {
		opacity: 1,
		transform: "none"
	},
	exiting: {},
	exited: {},
	unmounted: {}
}
interface GrowProps extends Omit<TransitionProps, "timeout"> {
	timeout?: TransitionProps["timeout"]
}
const Grow: React.FC<GrowProps> = props => {
	const { children, in: inProp = false, onEnter, onExit, style, timeout = 500, ...otherProps } = props
	const { addEndListener: deleteData, onEntering, onEntered, onExited, onExiting, ...other } = otherProps
	const timer = useRef<NodeJS.Timeout>()
	const autoTimeout = useRef<number>()
	const handleEnter = (node: any, isAppearing?: boolean) => {
		reflow(node)
		const { duration: transitionDuration, delay } = getTransitionProps(
			{ style, timeout },
			{
				mode: "enter"
			}
		)
		let duration
		if (timeout === "auto") {
			duration = transitions.getAutoHeightDuration(node.clientHeight)
			autoTimeout.current = duration
		} else {
			duration = Number(transitionDuration)
		}
		node.style.transition = [
			transitions.create("opacity", {
				duration,
				delay
			}),
			transitions.create("transform", {
				duration: duration * 0.666,
				delay
			})
		].join(",")
		if (onEnter) {
			onEnter(node, isAppearing)
		}
	}
	const handleExit = (node?: HTMLElement) => {
		const { duration: transitionDuration, delay } = getTransitionProps(
			{ style, timeout },
			{
				mode: "exit"
			}
		)
		let duration
		if (timeout === "auto") {
			duration = transitions.getAutoHeightDuration(node.clientHeight)
			autoTimeout.current = duration
		} else {
			duration = Number(transitionDuration)
		}

		node.style.transition = [
			transitions.create("opacity", {
				duration,
				delay
			}),
			transitions.create("transform", {
				duration: duration * 0.666,
				delay: delay || duration * 0.333
			})
		].join(",")

		node.style.opacity = "0"
		node.style.transform = getScale(0.75)

		if (onExit) {
			onExit(node)
		}
	}

	const addEndListener = (_: any, next?: () => void) => {
		if (timeout === "auto") {
			timer.current = setTimeout(next, autoTimeout.current || 0)
		}
	}

	useEffect(() => {
		return () => {
			if (timer.current) {
				clearTimeout(timer.current)
			}
		}
	}, [])

	return (
		<Transition
			appear
			in={inProp}
			onEnter={handleEnter}
			onExit={handleExit}
			addEndListener={addEndListener}
			timeout={timeout === "auto" ? 500 : timeout}
			{...other}
		>
			{(state: TransitionStatus, childProps: any) => {
				const transitionDiv = createElement("div", { style: {} }, children)
				return cloneElement(transitionDiv, {
					style: {
						opacity: 0,
						transform: getScale(0.75),
						display: state === "exited" && !inProp ? "none" : undefined,
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

export default Grow
