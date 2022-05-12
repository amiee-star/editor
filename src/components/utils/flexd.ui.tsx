import PanelType from "@/constant/panel.type"
import React, { useContext, useMemo } from "react"
import { panelContext } from "../provider/panel.context"
import Grow from "../transitions/grow"

interface Props extends React.CSSProperties {
	model?: "material" | "base" | "ani"
	current?: keyof typeof PanelType
	action?: "edit" | "replace" | "screen"
	unmountOnExit?: boolean
	zIndex?: number
}

const FixedUI: React.FC<Props> = props => {
	const { children, model, current, action, zIndex, unmountOnExit = true, ...divStyle } = props
	const { state } = useContext(panelContext)
	const show = useMemo(() => {
		if (action) {
			return action === state.action
		} else {
			return model ? (state.model === model ? (current ? state.current === PanelType[current] : true) : false) : true
		}
	}, [state])
	return (
		<div
			style={{
				...divStyle,
				position: "absolute",
				zIndex: zIndex
			}}
		>
			<Grow in={show} unmountOnExit={unmountOnExit}>
				{children}
			</Grow>
		</div>
	)
}
export default FixedUI
