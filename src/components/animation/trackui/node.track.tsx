import { aniContext } from "@/components/provider/ani.context"
import { groupBy } from "lodash"
import React, { useContext, useMemo } from "react"
import TrackSvg from "./track.svg"

const NodeTrack: React.FC = () => {
	const { state: ANI, dispatch: aniAction } = useContext(aniContext)
	const currentTackList = useMemo(() => {
		return groupBy(
			ANI.tackList.filter(m => m.type !== "fix"),
			m => {
				return m.aid
			}
		)
	}, [ANI])
	return (
		<div className="track-box">
			{Object.keys(currentTackList).map(m => {
				return (
					<div className="track-item" key={m}>
						{!!currentTackList[m].length && (
							<TrackSvg
								aid={currentTackList[m][0].aid}
								trackData={currentTackList[m].map(item => item.data).flat(1)}
								timeData={currentTackList[m]
									.map(item => item.data)
									.flat(1)
									.map(m => m.time)}
							/>
						)}
					</div>
				)
			})}
		</div>
	)
}

export default NodeTrack
