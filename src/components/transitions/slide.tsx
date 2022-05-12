import React, { cloneElement, createElement, useCallback, useEffect, useRef } from "react"

import { Transition, TransitionStatus } from "react-transition-group"

import transitions, { duration, TransitionProps } from "./transitions"
import { debounce, getTransitionProps, reflow } from "./util"

type Direction = "left" | "right" | "up" | "down"

function getTranslateValue(direction: Direction, node: HTMLElement) {
	if (!node.getBoundingClientRect) return false
	const rect = node.getBoundingClientRect()
	let transform
	if (node["fakeTransform"]) {
		transform = node["fakeTransform"]
	} else {
		const computedStyle = window.getComputedStyle(node)
		transform = computedStyle.getPropertyValue("-webkit-transform") || computedStyle.getPropertyValue("transform")
	}
	let offsetX = 0
	let offsetY = 0
	if (transform && transform !== "none" && typeof transform === "string") {
		const transformValues = transform.split("(")[1].split(")")[0].split(",")
		offsetX = parseInt(transformValues[4], 10)
		offsetY = parseInt(transformValues[5], 10)
	}

	if (direction === "left") {
		return `translateX(${window.innerWidth}px) translateX(-${rect.left - offsetX}px)`
	}

	if (direction === "right") {
		return `translateX(-${rect.left + rect.width - offsetX}px)`
	}

	if (direction === "up") {
		return `translateY(${window.innerHeight}px) translateY(-${rect.top - offsetY}px)`
	}
	return `translateY(-${rect.top + rect.height - offsetY}px)`
}

export function setTranslateValue(direction: Direction, node: HTMLElement) {
	const transform = getTranslateValue(direction, node)
	if (transform) {
		node.style.webkitTransform = transform
		node.style.transform = transform
	}
}

const defaultTimeout = {
	enter: duration.enteringScreen,
	exit: duration.leavingScreen
}

interface SlideProps extends TransitionProps {
	direction: Direction
}
const Slide: React.FC<SlideProps> = props => {
	const {
		children,
		direction = "down",
		in: inProp,
		onEnter,
		onEntering,
		onExit,
		onExited,
		style,
		timeout = defaultTimeout,
		...other
	} = props

	const childrenRef = useRef<HTMLElement>()
	const handleEnter = (_: any, isAppearing?: boolean) => {
		const node = childrenRef.current
		if (!!node) {
			setTranslateValue(direction, node)
			reflow(node)
			if (onEnter) {
				onEnter(node, isAppearing)
			}
		}
	}

	const handleEntering = (_: any, isAppearing?: boolean) => {
		const node = childrenRef.current
		if (node) {
			const transitionProps = getTransitionProps(
				{ timeout, style },
				{
					mode: "enter"
				}
			)
			node.style.webkitTransition = transitions.create("-webkit-transform", {
				...transitionProps,
				easing: transitions.easing.easeOut
			})
			node.style.transition = transitions.create("transform", {
				...transitionProps,
				easing: transitions.easing.easeOut
			})
			node.style.webkitTransform = "none"
			node.style.transform = "none"
			if (onEntering) {
				onEntering(node, isAppearing)
			}
		}
	}

	const handleExit = () => {
		const node = childrenRef.current
		if (node) {
			const transitionProps = getTransitionProps(
				{ timeout, style },
				{
					mode: "exit"
				}
			)
			node.style.webkitTransition = transitions.create("-webkit-transform", {
				...transitionProps,
				easing: transitions.easing.sharp
			})
			node.style.transition = transitions.create("transform", {
				...transitionProps,
				easing: transitions.easing.sharp
			})
			setTranslateValue(direction, node)

			if (onExit) {
				onExit(node)
			}
		}
	}

	const handleExited = () => {
		const node = childrenRef.current
		if (node) {
			node.style.webkitTransition = ""
			node.style.transition = ""
			if (onExited) {
				onExited(node)
			}
		}
	}

	const updatePosition = useCallback(() => {
		if (childrenRef.current) {
			setTranslateValue(direction, childrenRef.current)
		}
	}, [direction])

	useEffect(() => {
		if (inProp || direction === "down" || direction === "right") {
			return undefined
		}
		const handleResize = debounce(() => {
			if (childrenRef.current) {
				setTranslateValue(direction, childrenRef.current)
			}
		})

		window.addEventListener("resize", handleResize)
		return () => {
			handleResize.clear()
			window.removeEventListener("resize", handleResize)
		}
	}, [direction, inProp])

	useEffect(() => {
		if (!inProp) {
			updatePosition()
		}
	}, [inProp, updatePosition])

	return (
		<Transition
			onEnter={handleEnter}
			onEntering={handleEntering}
			onExit={handleExit}
			onExited={handleExited}
			appear
			in={inProp}
			timeout={timeout}
			{...other}
		>
			{(state: TransitionStatus, childProps: any) => {
				const transitionDiv = createElement("div", { style: {}, ref: childrenRef }, children)
				return cloneElement(transitionDiv, {
					style: {
						display: state === "exited" && !inProp ? "none" : undefined,
						...style,
						...transitionDiv.props.style
					},
					...childProps
				})
			}}
		</Transition>
	)
}

export default Slide
