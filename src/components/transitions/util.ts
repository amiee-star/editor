import React from "react"

export const reflow = (node: HTMLElement) => node.scrollTop

export function getTransitionProps(
	props: {
		timeout: number | { appear?: number; enter?: number; exit?: number }

		style?: React.CSSProperties
	},
	options: {
		mode: "appear" | "enter" | "exit"
	}
): Partial<{
	duration: number | string
	easing: string
	delay: number | string
}> {
	const { timeout, style = {} } = props
	const duration =
		style.transitionDuration || typeof timeout === "number" ? Number(timeout) : Number(timeout[options.mode]) || 0
	return {
		duration,
		delay: style.transitionDelay
	}
}
//防抖函数
export function debounce(func: Function, wait: number = 166) {
	let timeout: NodeJS.Timeout
	function debounced(...args: any[]) {
		clearTimeout(timeout)
		timeout = setTimeout(() => {
			func(...args)
		}, wait)
	}
	debounced.clear = () => {
		clearTimeout(timeout)
	}
	return debounced
}
//节流函数
export function throttle(func: Function, wait: number = 166) {
	let previous = 0
	return function (...args: any[]) {
		const now = Date.now()
		if (previous > 0) {
			if (now - previous > wait) {
				func(...args)
				previous = now
			}
		} else {
			previous = now
		}
	}
}
