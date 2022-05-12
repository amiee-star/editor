import eventBus from "@/utils/event.bus"
import { Progress } from "antd"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { JMKContext } from "../provider/jmk.context"
import serviceLocal from "@/services/service.local"
import Grow from "../transitions/grow"
const LoadingUI: React.FC = () => {
	const [percent, setPercent] = useState(0)
	const { state } = useContext(JMKContext)
	useEffect(() => {
		eventBus.on("jmk.loading", n => {
			setPercent(Math.floor(n * 100))
		})
	}, [])
	const screenToDataUrl = useCallback(
		(a, b, c, quality?) => {
			a = state.editHook.screenToBuffer(a, b, c)
			// for (let d = 0; d < c; ++d) {
			// 	for (let e = 0; e < b; ++e) {
			// 		let f = 4 * (d * b + e)
			// 		if (d < c / 2) {
			// 			for (let g = 4 * ((c - d - 1) * b + e), h = 0; 3 > h; ++h) {
			// 				let k = a[f + h]
			// 				a[f + h] = a[g + h]
			// 				a[g + h] = k
			// 			}
			// 		}
			// 		a[f + 3] = 255
			// 	}
			// }
			a = new Uint8ClampedArray(a)
			return a
			// a = new ImageData(a, b, c)
			// let d: any = document.createElement("canvas")
			// d.width = b
			// d.height = c
			// d.getContext("2d").putImageData(a, 0, 0)
			// return d.toDataURL("image/jpeg", quality)
		},
		[state]
	)
	useEffect(() => {
		if (state.editHook) {
			const width = 1920
			const height = 1080
			// serviceLocal.baseToImg(state.sceneName, width, height, screenToDataUrl(false, width, height)).then(res => {})
		}
	}, [state])
	return (
		<div
			style={{
				display: "inline-flex",
				transform: "translate(-50%,-50%)"
			}}
		>
			<Grow in={percent < 100 && !state.editHook} unmountOnExit>
				<div>
					<Progress
						type="circle"
						strokeColor={{
							"0%": "#108ee9",
							"100%": "#87d068"
						}}
						percent={percent}
					/>
				</div>
			</Grow>
		</div>
	)
}
export default LoadingUI
