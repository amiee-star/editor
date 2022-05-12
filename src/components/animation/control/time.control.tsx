import { aniContext } from "@/components/provider/ani.context"
import { JMKContext } from "@/components/provider/jmk.context"
import React, { useCallback, useContext, useEffect, useMemo } from "react"
import Draggable, { DraggableEventHandler } from "react-draggable"
// 时间线轴
const TimeControl: React.FC = () => {
	const { state: ANI, dispatch: aniAction } = useContext(aniContext)
	const { state: JMK } = useContext(JMKContext)
	const frameSpace = useMemo(() => ANI.layout.lineWidth[ANI.layout.lineIndex] + 1, [
		ANI.layout.lineIndex,
		ANI.layout.lineWidth
	])
	const onDrag: DraggableEventHandler = useCallback(
		(e, data) => {
			if (data.lastX === ANI.layout.pageFrams * frameSpace) return
			const { pageFrams, markIndex, lineIndex, lineWidth } = ANI.layout
			const limit = data.deltaX > 0 ? 1 : -1
			const nextData = pageFrams * markIndex + data.lastX / (lineWidth[lineIndex] + 1)
			if (JMK.editHook && ANI.selectAni && ANI.tackList.filter(m => m.aid === ANI.selectAni?.name).length) {
				setTimeout(() => {
					JMK.editHook.animationJumpTo(ANI.selectAni.asset, (nextData ? nextData + limit : nextData) / ANI.sample)
				}, 0)
			}

			aniAction({
				type: "set",
				payload: {
					time: nextData ? nextData + limit : nextData
				}
			})
		},
		[ANI.layout, ANI.selectAni, ANI.sample, JMK]
	)
	const onStop: DraggableEventHandler = useCallback(
		(e, data) => {
			const { pageFrams, markIndex, lineIndex, lineWidth } = ANI.layout
			aniAction({
				type: "set",
				payload: {
					time: pageFrams * markIndex + data.lastX / (lineWidth[lineIndex] + 1)
				}
			})
		},
		[ANI.layout]
	)
	return (
		<Draggable
			axis="x"
			handle=".time-line"
			bounds={{ left: 0, right: ANI.layout.pageFrams * frameSpace }}
			grid={[frameSpace, 0]}
			defaultPosition={{ x: 0, y: 0 }}
			onDrag={onDrag}
			onStop={onStop}
			position={{
				x: (ANI.time - ANI.layout.pageFrams * ANI.layout.markIndex) * frameSpace,
				y: 0
			}}
		>
			<div className="time-line" id="TimeControl">
				<div className="line"></div>
			</div>
		</Draggable>
	)
}

export default TimeControl
