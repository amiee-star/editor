import { aniContext } from "@/components/provider/ani.context"
import React, { useCallback, useContext, useRef } from "react"
import Draggable, { DraggableEventHandler } from "react-draggable"
const WidthControl: React.FC = () => {
	const { state: ANI, dispatch: aniAction } = useContext(aniContext)
	const domRef = useRef<HTMLDivElement>(null)
	const onDrag: DraggableEventHandler = useCallback(
		(e, data) => {
			aniAction({
				type: "set",
				payload: {
					layout: {
						...ANI.layout,
						leftWidth: data.lastX
					}
				}
			})
		},
		[ANI.layout]
	)
	return (
		<Draggable
			axis="x"
			handle=".control-x"
			bounds={{ left: 150, right: domRef.current?.parentElement.offsetWidth - 150 }}
			defaultPosition={{ x: ANI.layout.leftWidth, y: 0 }}
			onDrag={onDrag}
		>
			<div className="control control-x" ref={domRef} />
		</Draggable>
	)
}

export default WidthControl
