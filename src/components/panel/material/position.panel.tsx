import { assetData } from "@/interfaces/extdata.interface"
import commonFunc from "@/utils/common.func"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { AlignLeftOutlined, AlignRightOutlined, AlignCenterOutlined } from "@ant-design/icons"
import { Radio, Space, Typography } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "umi"
import eventBus from "@/utils/event.bus"
import { JMKContext } from "@/components/provider/jmk.context"
import { throttle } from "@/components/transitions/util"
interface Props {
	data: assetData
}

const _PositionPanel: React.FC<Props> = props => {
	const Intl = useIntl()
	const { data } = props
	const forceUpdate = useForceUpdate()
	// 相机位列表
	const { state } = useContext(JMKContext)
	const getDistance = useCallback(() => {
		const cameraPos = state.editHook.getCameraPositionV3()
		const distance = data.position.distanceTo(cameraPos)
		const newDistaqnce = Math.round(distance * Math.pow(10, 3)) / Math.pow(10, 3)

		setGameraGap(newDistaqnce)
	}, [state, data])
	useEffect(() => {
		data?.addEventListener("assetUpdated", () =>
			setTimeout(() => {
				getDistance()
				forceUpdate()
			}, 0)
		)
		return () => {
			data?.removeEventListener("assetUpdated")
		}
	}, [state])
	useEffect(() => {
		if (!!state.editHook) {
			getDistance()
		}
		eventBus.on("jmk.camara.change", throttle(getDistance, 80))
	}, [state, data])
	// 音频距相机距离
	const [cameraGap, setGameraGap] = useState(null)
	return (
		<div
			id="PositionPanel"
			style={{
				height: "26px",
				lineHeight: "26px",
				backgroundColor: "#5f6265",
				position: "fixed",
				top: "5px",
				right: "325px",
				padding: "0 10px"
			}}
		>
			{<FormattedMessage id="jmk.audio.spaceTip" />}
			{cameraGap}
		</div>
	)
}

const PositionPanel = useMini(_PositionPanel)
export default PositionPanel
