import React, { useEffect, useRef } from "react"

import { Transition } from "react-transition-group"
import { TransitionStatus } from "react-transition-group/Transition"

import transitions, { duration, TransitionProps } from "./transitions"
import { getTransitionProps } from "./util"

export interface CollapseProps extends TransitionProps {
	collapsedHeight?: string | number
}
const Collapse: React.FC<CollapseProps> = props => {
	const {
		children,
		collapsedHeight: collapsedHeightProp = "0px",
		in: inProp,
		onEnter,
		onEntered,
		onEntering,
		onExit,
		onExiting,
		style,
		timeout = duration.standard,
		...otherProps
	} = props
	const { addEndListener: deleteData, onExited, ...other } = otherProps
	const timer = useRef<NodeJS.Timeout>()
	const wrapperRef = useRef<HTMLDivElement>(null)
	const autoTransitionDuration = useRef<number>()
	const collapsedHeight = typeof collapsedHeightProp === "number" ? `${collapsedHeightProp}px` : collapsedHeightProp

	useEffect(() => {
		return () => {
			if (timer.current) {
				clearTimeout(timer.current)
			}
		}
	}, [])

	const handleEnter = (node: any, isAppearing?: boolean) => {
		node.style.height = collapsedHeight
		if (onEnter) {
			onEnter(node, isAppearing)
		}
	}

	const handleEntering = (node: any, isAppearing?: boolean) => {
		const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0
		const { duration: transitionDuration } = getTransitionProps(
			{ style, timeout },
			{
				mode: "enter"
			}
		)

		if (timeout === "auto") {
			const duration2 = transitions.getAutoHeightDuration(wrapperHeight)
			node.style.transitionDuration = `${duration2}ms`
			autoTransitionDuration.current = duration2
		} else {
			node.style.transitionDuration =
				typeof transitionDuration === "string" ? transitionDuration : `${transitionDuration}ms`
		}

		node.style.height = `${wrapperHeight}px`

		if (onEntering) {
			onEntering(node, isAppearing)
		}
	}

	const handleEntered = (node: any, isAppearing?: boolean) => {
		node.style.height = "auto"

		if (onEntered) {
			onEntered(node, isAppearing)
		}
	}

	const handleExit = (node?: any) => {
		const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0
		node.style.height = `${wrapperHeight}px`

		if (onExit) {
			onExit(node)
		}
	}

	const handleExiting = (node?: any) => {
		const wrapperHeight = wrapperRef.current ? wrapperRef.current.clientHeight : 0

		const { duration: transitionDuration } = getTransitionProps(
			{ style, timeout },
			{
				mode: "exit"
			}
		)

		if (timeout === "auto") {
			const duration2 = transitions.getAutoHeightDuration(wrapperHeight)
			node.style.transitionDuration = `${duration2}ms`
			autoTransitionDuration.current = duration2
		} else {
			node.style.transitionDuration =
				typeof transitionDuration === "string" ? transitionDuration : `${transitionDuration}ms`
		}

		node.style.height = collapsedHeight

		if (onExiting) {
			onExiting(node)
		}
	}

	const addEndListener = (next?: () => void) => {
		if (timeout === "auto") {
			timer.current = setTimeout(next, autoTransitionDuration.current || 0)
		}
	}

	return (
		<Transition
			in={inProp}
			onEnter={handleEnter}
			onEntered={handleEntered}
			onEntering={handleEntering}
			onExit={handleExit}
			onExiting={handleExiting}
			addEndListener={addEndListener}
			timeout={timeout === "auto" ? 300 : timeout}
			{...other}
		>
			{(state: TransitionStatus, childProps: any) => (
				<div
					style={{
						height: state
							? state === "entered"
								? "auto"
								: state === "exited" && !inProp && collapsedHeight === "0px"
								? "0"
								: "auto"
							: "0",
						overflow: state === "entered" ? "visible" : "hidden",
						transition: transitions.create("height"),
						visibility: state === "exited" && !inProp && collapsedHeight === "0px" ? "hidden" : "visible",
						minHeight: collapsedHeight,
						...style
					}}
					{...childProps}
				>
					<div
						style={{
							display: "flex"
						}}
						ref={wrapperRef}
					>
						<div
							style={{
								width: "100%"
							}}
						>
							{children}
						</div>
					</div>
				</div>
			)}
		</Transition>
	)
}

export default Collapse
