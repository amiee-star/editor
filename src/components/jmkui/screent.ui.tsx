import eventBus from "@/utils/event.bus"
import { useMini } from "@/utils/use.func"
import { CameraOutlined, CloseOutlined } from "@ant-design/icons"
import { Button } from "antd"
import React, { useCallback, useContext } from "react"
import { panelContext } from "../provider/panel.context"

const _ScreenUI: React.FC = () => {
	const { dispatch } = useContext(panelContext)
	const setThumb = useCallback(() => {
		eventBus.emit("view.setThumb")
	}, [])
	return (
		<div id="ScreenUI">
			<div
				style={{
					display: "inline-flex",
					transform: "translate(-50%,-50%) scale(2)"
				}}
			>
				<Button icon={<CameraOutlined />} ghost size="large" onClick={setThumb} />
			</div>
			<div
				style={{
					position: "fixed",
					right: "50px",
					top: "50px",
					transform: "scale(2)"
				}}
			>
				<Button
					icon={<CloseOutlined />}
					ghost
					size="large"
					onClick={() => {
						dispatch({
							type: "set",
							payload: {
								action: "edit"
							}
						})
					}}
				/>
			</div>
		</div>
	)
}
const ScreenUI = useMini(_ScreenUI)

export default ScreenUI
