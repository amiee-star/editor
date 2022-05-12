import { aniContext, trackData } from "@/components/provider/ani.context"
import { useMini } from "@/utils/use.func"
import React, { useCallback, useContext, useMemo } from "react"
import Draggable, { DraggableEventHandler } from "react-draggable"
import "./track.svg.less"
interface Props {
	aid: string
	timeData: number[]
	trackData: trackData[]
}
const _TrackSvg: React.FC<Props> = props => {
	const { state: ANI, dispatch: aniAction } = useContext(aniContext)
	const { aid, timeData, trackData } = props
	const minTime = useMemo(() => {
		return Math.min(...timeData)
	}, [timeData])
	const maxTime = useMemo(() => {
		return Math.max(...timeData)
	}, [timeData])
	const frameSpace = useMemo(() => ANI.layout.lineWidth[ANI.layout.lineIndex] + 1, [
		ANI.layout.lineWidth,
		ANI.layout.lineIndex
	])
	const onStop = useCallback(
		(item: trackData): DraggableEventHandler => (e, data) => {
			const nextTime = data.lastX / frameSpace
			if (trackData.find(v => v.time === item.time + nextTime)) {
				return
			}
			item.time = item.time + nextTime
			aniAction({
				type: "set"
			})
		},
		[frameSpace, trackData]
	)

	return (
		<svg data-aid={aid} height={24} className="TrackSvg">
			<g>
				{timeData.length > 1 && (
					<g>
						<path
							className="line"
							strokeWidth={8}
							d={`M${(minTime - ANI.layout.markIndex * ANI.layout.pageFrams) * frameSpace},12 L${
								(maxTime - ANI.layout.markIndex * ANI.layout.pageFrams) * frameSpace
							},12`}
						/>
						<path
							className="line-bg"
							d={`M${(minTime - ANI.layout.markIndex * ANI.layout.pageFrams) * frameSpace},12 L${
								(maxTime - ANI.layout.markIndex * ANI.layout.pageFrams) * frameSpace
							},12`}
							strokeLinecap="round"
							strokeWidth={8}
						/>
					</g>
				)}
				<g className="point-group">
					{trackData.map((m, index) => {
						return (
							<React.Fragment key={`${props.aid}-track-${index}`}>
								<rect className="point" x={(m.time - ANI.layout.markIndex * ANI.layout.pageFrams) * frameSpace} y="6" />
								<Draggable
									axis="x"
									handle=".point-bg"
									bounds={{
										left: -frameSpace * m.time,
										right: frameSpace * ((ANI.layout.markIndex + 1) * ANI.layout.pageFrams - m.time)
									}}
									grid={[frameSpace, 0]}
									onStop={onStop(m)}
									position={{ x: 0, y: 0 }}
								>
									<rect
										className="point-bg"
										x={(m.time - ANI.layout.markIndex * ANI.layout.pageFrams) * frameSpace}
										y="6"
									/>
								</Draggable>
							</React.Fragment>
						)
					})}
				</g>
			</g>
		</svg>
	)
}
const TrackSvg = useMini(_TrackSvg)
export default TrackSvg
