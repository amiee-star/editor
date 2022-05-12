import { useEditHook } from "@/components/jmk/jmk.engine"
import { JMKContext } from "@/components/provider/jmk.context"
import { panelContext } from "@/components/provider/panel.context"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card } from "antd"
import React, { useCallback, useContext, useEffect } from "react"
interface Props {
	title: JSX.Element
	width?: number
}
const JMKPanel: React.FC<Props> = props => {
	const { children, title, width = 320 } = props
	const { dispatch, state } = useContext(panelContext)
	const { state: JMK } = useContext(JMKContext)
	const JMKHook = useEditHook()
	const hidePanel = useCallback(() => {
		dispatch({
			type: "set",
			payload: {
				current: ""
			}
		})
	}, [])
	useEffect(() => {
		JMK.editHook && !state.current && state.model === "base" && JMKHook.disableSelection()
	}, [state, JMK])
	return (
		<Card
			className="panel-box"
			bordered={false}
			title={title}
			extra={<Button onClick={hidePanel} type="ghost" shape="circle" icon={<CloseOutlined />} />}
			style={{ width }}
		>
			{children}
		</Card>
	)
}
export default JMKPanel
