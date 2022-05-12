import { JMKContext } from "@/components/provider/jmk.context"
import { panelContext } from "@/components/provider/panel.context"
import "./sky.panel.less"
import { FormattedMessage, useIntl } from "umi"
import { Row, Col, Button } from "antd"
import { UploadOutlined, CloseOutlined } from "@ant-design/icons"
import React, { useCallback, useContext, useMemo, useState, useEffect } from "react"
import JMKPanel from "./jmk.panel"
import JMKUpload from "@/components/utils/jmk.upload"
import checkImage from "@/utils/checkImage.func"
import eventBus from "@/utils/event.bus"
// import { upFileItem } from "@/interfaces/api.interface"
import { baseRes, upFileItem } from "@/interfaces/api.interface"
import urlFunc from "@/utils/url.func"
import { useForceUpdate } from "@/utils/use.func"
import { UploadFile } from "antd/lib/upload/interface"
import { useEditHook } from "@/components/jmk/jmk.engine"
import serviceLocal from "@/services/service.local"
import ItemSlider from "@/components/form/item.slider"
import NumberInput from "@/components/form/number.input"

const SkyPanel: React.FC = () => {
	const Intl = useIntl()
	const forceUpdate = useForceUpdate()
	const JMKHook = useEditHook()
	const { state: panelState } = useContext(panelContext)
	const { state } = useContext(JMKContext)
	const show = useMemo(() => panelState.model === "base" && panelState.current === "sky" && !!state.editHook, [
		panelState,
		state
	])
	useEffect(() => {
		if (state.editHook && !!show) {
			JMKHook.disableSelection()
		}
	}, [state.editHook, show])
	const [fileName, setFileName] = useState({ uploadFile: null })
	// const [fileurl, setFileUrl] = useState({ material: { map: { name: null } } })
	let fileurl: any = useMemo(() => {
		return state.editHook ? JMKHook.getSky() : {}
	}, [fileName])

	useEffect(() => {
		if (!!fileurl) {
			if (fileurl.material.map) {
				if (fileurl.material.map.name) {
					setFileName({ uploadFile: fileurl.material.map.name })
				}
			}
		}
	}, [state.editHook])
	const successHandle = useCallback(
		(item: any, file: UploadFile<baseRes<string>>) => {
			JMKHook.changeSkyTexture({
				alpha: item[0].alpha,
				id: item[0].id,
				name: item[0].name,
				rawExt: item[0].rawExt,
				stdExt: item[0].stdExt,
				url: urlFunc.replaceUrl(
					"/scenes/" + state.sceneName + "/img/" + item[0].webFormats[0] + "/" + item[0].id + "." + item[0].stdExt
				)
			})
			// fileurl = JMKHook.getSky()
			setFileName({ uploadFile: item[0].name })
			forceUpdate()
		},
		[state]
	)
	// 删除文件
	const removeFlie = useCallback(() => {
		fileName.uploadFile = null
		// fileName.photometricProfile = null
		JMKHook.removeSkyTexture()
		forceUpdate()
	}, [fileName])
	useEffect(() => {
		eventBus.off("jmk.sceneChanged").on("jmk.sceneChanged", () => {
			setTimeout(() => {
				forceUpdate()
			}, 0)
		})
	}, [])

	return (
		<JMKPanel title={<FormattedMessage id="jmk.sky" />}>
			<div id="SkyPanel">
				<Row gutter={10} align="middle">
					<Col span={6} className="formLable">
						{<FormattedMessage id="jmk.skytexture" />}:
					</Col>
					<Col span={12}>{fileName.uploadFile}</Col>
					<Col span={3}>
						<JMKUpload //天空盒
							btnicon={<UploadOutlined />}
							accept=".png, .jpg, .jpeg"
							btnProps={{ type: "primary", size: "small" }}
							size={1}
							btnText=""
							extParams={{ type: "sky" }}
							apiService={serviceLocal.uploadjmktextures(state.sceneName)}
							onChange={successHandle}
						></JMKUpload>
					</Col>
					{fileName.uploadFile && (
						<>
							<Col span={3}>
								<Button type="primary" size="small" icon={<CloseOutlined />} onClick={removeFlie} />
							</Col>
						</>
					)}
				</Row>
				{fileName.uploadFile && (
					<Row gutter={10} align="middle">
						<Col span={6} className="formLable">
							{<FormattedMessage id="jmk.Rotation" />}：
						</Col>
						<Col span={18}>
							<NumberInput
								min={0}
								max={360}
								step={1}
								forceUpdate={forceUpdate}
								item={fileurl}
								valueKey="yawRotationDeg"
							/>
						</Col>
					</Row>
				)}
			</div>
		</JMKPanel>
	)
}
export default SkyPanel
