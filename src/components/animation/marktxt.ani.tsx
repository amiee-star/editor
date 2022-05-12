import commonFunc from "@/utils/common.func"
import { Space } from "antd"
import React, { useCallback, useContext, useEffect, useMemo } from "react"
import { aniContext, trackData } from "../provider/ani.context"
// 标记文本
const MarkTxtAni: React.FC = () => {
	const { state: ANI, dispatch } = useContext(aniContext)
	const frameSpace = useMemo(() => ANI.layout.lineWidth[ANI.layout.lineIndex], [
		ANI.layout.lineWidth,
		ANI.layout.lineIndex
	])
	const txtNumber = useMemo(() => {
		return ANI.layout.trackBoxEle
			? Array(Math.ceil(ANI.layout.trackBoxEle.offsetWidth / (ANI.layout.markSpace * (frameSpace + 1)))).fill("")
			: []
	}, [ANI.layout.trackBoxEle, ANI.layout.markSpace, frameSpace])
	const domLoaded = useCallback(
		(ele: HTMLDivElement | null) => {
			if (!!ele && !ANI.layout.trackBoxEle) {
				dispatch({
					type: "set",
					payload: {
						layout: {
							...ANI.layout,
							trackBoxEle: ele
						}
					}
				})
			}
		},
		[ANI.layout]
	)
	useEffect(() => {
		const { time, layout } = ANI
		const {
			lineIndex,
			lineWidth,
			trackBoxEle,
			markIndex: OldIndex,
			markSpace: OldSpace,
			pageFrams: OldPageSize
		} = layout

		if (!trackBoxEle) return
		const frameSpace = lineWidth[lineIndex]
		const markSpace = frameSpace > 46 ? 1 : frameSpace < 14 ? 10 : 5
		const pageFrams = Math.max(
			1,
			Math.floor(Math.floor(trackBoxEle.offsetWidth / (frameSpace + 1)) / markSpace) * markSpace
		)
		const markIndex = Math.floor(time / pageFrams)
		if (OldIndex !== markIndex || OldSpace !== markSpace || OldPageSize !== pageFrams) {
			dispatch({
				type: "set",
				payload: {
					layout: {
						...ANI.layout,
						markIndex,
						pageFrams,
						markSpace
					}
				}
			})
		}
	}, [ANI])
	useEffect(() => {
		return () => {
			dispatch({
				type: "clear"
			})
		}
	}, [])

	const timeData = useMemo(() => {
		const { tackList } = ANI
		return tackList
			.map(m => m.data)
			.flat(Infinity)
			.map((m: trackData) => m.time)
	}, [ANI])
	const minTime = useMemo(() => {
		return timeData.length ? Math.min(...timeData) : 0
	}, [ANI])
	const maxTime = useMemo(() => {
		return timeData.length ? Math.max(...timeData) : 0
	}, [ANI])
	const maxWidth = useMemo(() => {
		const { layout } = ANI
		const { lineWidth, lineIndex } = layout
		return (lineWidth[lineIndex] + 1) * (maxTime - minTime)
	}, [ANI])
	return (
		<div className="txt-mark">
			<div className="txt-list" ref={domLoaded}>
				<Space direction="horizontal" size={ANI.layout.markSpace * (frameSpace + 1)}>
					{txtNumber.map((m, index) => {
						return (
							<div className="txt-item" key={index}>
								<div className="txt">
									{ANI.lineType === "frame"
										? ANI.layout.pageFrams * ANI.layout.markIndex + index * ANI.layout.markSpace
										: `${commonFunc.toFixed(
												(ANI.layout.pageFrams * ANI.layout.markIndex + index * ANI.layout.markSpace) / ANI.sample,
												2
										  )}s`}
								</div>
							</div>
						)
					})}
				</Space>
			</div>
			<div
				className="ani-time-box"
				style={{
					width: maxWidth,
					transform: `translateX(-${
						ANI.layout.pageFrams * (ANI.layout.lineWidth[ANI.layout.lineIndex] + 1) * ANI.layout.markIndex
					}px)`,
					marginLeft: `${minTime * (ANI.layout.lineWidth[ANI.layout.lineIndex] + 1)}px`
				}}
			/>
		</div>
	)
}

export default MarkTxtAni
