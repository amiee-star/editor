import { aniContext } from "@/components/provider/ani.context"
import { groupBy } from "lodash"
import React, { useContext, useMemo } from "react"
import TrackSvg from "./track.svg"

const ConfigTrack: React.FC = () => {
	const { state: ANI, dispatch: aniAction } = useContext(aniContext)
	const currentTackList = useMemo(() => {
		return groupBy(ANI.tackList.filter(m => m.aid === ANI.selectAni?.name && m.type !== "fix") || [], m => {
			return m.type
		})
	}, [ANI.tackList, ANI.selectAni])
	return (
		<div className="config-track">
			{Object.keys(currentTackList).map(m => {
				return (
					<div className="config-item" key={m}>
						{!!currentTackList[m].length && (
							<TrackSvg
								aid={currentTackList[m][0].aid}
								trackData={currentTackList[m][0].data}
								timeData={currentTackList[m][0].data.map(m => m.time)}
							/>
						)}
					</div>
				)
			})}
		</div>
	)
}

export default ConfigTrack
