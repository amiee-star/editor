import React, { useContext } from "react"
import { aniContext } from "../provider/ani.context"
//标记刻度尺
const MarkBgAni: React.FC = () => {
	const { state: ANI } = useContext(aniContext)
	return (
		<div className="line-mark">
			<div
				className="full"
				style={{
					position: "absolute",
					backgroundImage: `linear-gradient(90deg,rgb(99,99,99) 1px,transparent 0)`,
					backgroundSize: `${
						ANI.layout.lineIndex < 4
							? (ANI.layout.lineWidth[ANI.layout.lineIndex] + 1) * 5
							: ANI.layout.lineWidth[ANI.layout.lineIndex] + 1
					}px`
				}}
			/>
			<div
				className="full"
				style={{
					position: "absolute",
					backgroundImage: `linear-gradient(90deg,rgba(71,72,76,${
						[2, 3].includes(ANI.layout.lineIndex) ? (ANI.layout.lineIndex - 1) / 3 : "0"
					}) 1px,transparent 0)`,
					backgroundSize: `${ANI.layout.lineWidth[ANI.layout.lineIndex] + 1}px`
				}}
			/>
		</div>
	)
}

export default MarkBgAni
