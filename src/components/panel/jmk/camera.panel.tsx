import { JMKContext } from "@/components/provider/jmk.context"
import { panelContext } from "@/components/provider/panel.context"
import "./camera.panel.less"
import { Button, List, Row, Col } from "antd"
import { PlusOutlined, CloseOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import JMKPanel from "./jmk.panel"
import TextInput from "@/components/form/text.input"
import NumberInput from "@/components/form/number.input"
import { useForceUpdate } from "@/utils/use.func"
import CustomUpload from "@/components/utils/custom.upload"
import checkImage from "@/utils/checkImage.func"
import { useEditHook } from "@/components/jmk/jmk.engine"
import serviceScene from "@/services/service.scene"
import ItemSwitch from "@/components/form/item.switch"
import classNames from "classnames"
import eventBus from "@/utils/event.bus"
import JMKUpload from "@/components/utils/jmk.upload"
import serviceLocal from "@/services/service.local"
import urlFunc from "@/utils/url.func"
import { UploadFile } from "antd/lib/upload/interface"
import { baseRes } from "@/interfaces/api.interface"
import { FormattedMessage, useIntl } from "umi"

const CameraPanel: React.FC = () => {
	const Intl = useIntl()
	const forceUpdate = useForceUpdate()
	const JMKHook = useEditHook()
	const { state: panelState } = useContext(panelContext)
	const { state } = useContext(JMKContext)
	const CameraVolumes: any = useMemo(() => state.editHook?.getCamera() || [], [state.editHook])
	const cameraList: any[] = useMemo(() => state.editHook?.getCameraVolumes() || [], [state.editHook])
	const [currentcamera, setCurrentCamera] = useState(null)
	const show = useMemo(() => panelState.model === "base" && panelState.current === "camera" && !!state.editHook, [
		panelState,
		state
	])

	useEffect(() => {
		const newCameraList = cameraList.filter((m: any) => m.assetType === "camera")
		if (state.editHook && newCameraList) {
			setCurrentCamera(newCameraList[0])
		}
	}, [state, cameraList])
	useEffect(() => {
		if (state.editHook && !!show) {
			state.editHook.enableCameraVolumeSelection()
			state.editHook.showCameraVolume([])
		}
	}, [state.editHook, show])
	useEffect(() => {
		if (currentcamera) {
			JMKHook.selectCameraVolume(currentcamera)
		}
	}, [currentcamera])
	useEffect(() => {
		eventBus.off("jmk.sceneChanged").on("jmk.sceneChanged", () => {
			setTimeout(() => {
				forceUpdate()
			}, 0)
		})
	}, [])
	// 点击切换相机
	const clickcameravolumn = useCallback(
		(item: any) => () => {
			setCurrentCamera(item)
		},
		[state]
	)
	// 添加相机
	const addCubeOrSphere = useCallback(
		msg => () => {
			currentcamera ? JMKHook.addCameraVolume(msg) : setCurrentCamera(JMKHook.addCameraVolume(msg))
		},
		[state, currentcamera]
	)
	// 点击朝向相机
	const lookatcameravolumn = useCallback(
		(item: any) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			JMKHook.seeItem(item)
		},
		[state]
	)
	// 删除相机
	const removecameravolumn = useCallback(
		(item: any, index) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			const newCameraList = cameraList.filter((m: any) => m.assetType === "camera")
			const newIndex = newCameraList.findIndex(i => i === currentcamera)
			if (newCameraList.length === 1) {
				setCurrentCamera(null)
			} else if (newCameraList.length > 1 && index === newIndex && index === 0) {
				setCurrentCamera(newCameraList[1])
			} else if (newCameraList.length > 1 && index === newIndex && index !== 0) {
				setCurrentCamera(newCameraList[index - 1])
			}
			state.editHook.removeCameraVolume(item)
		},
		[state, currentcamera, cameraList]
	)
	const successHandle = useCallback(
		(item: any, file: UploadFile<baseRes<string>>) => {
			const texture = JMKHook.loadColorMap({
				alpha: item[0].alpha,
				id: item[0].id,
				name: item[0].name,
				rawExt: item[0].rawExt,
				stdExt: item[0].stdExt,
				url: urlFunc.replaceUrl(
					"/scenes/" + state.sceneName + "/img/" + item[0].webFormats[0] + "/" + item[0].id + "." + item[0].stdExt
				)
			})
			CameraVolumes.colorMap = texture
			forceUpdate()
		},
		[CameraVolumes, state]
	)
	// 删除颜色地图
	const removeFlie = useCallback(() => {
		CameraVolumes.colorMap = null
		forceUpdate()
	}, [CameraVolumes])
	return (
		<JMKPanel title={<FormattedMessage id="jmk.camera.camera" />}>
			<div id="cameraD1">
				<Row gutter={[0, 16]} align="middle">
					<Col span={6} className="formLable">
						{<FormattedMessage id="jmk.camera.exposure" />}：
					</Col>
					<Col span={18}>
						<NumberInput
							item={CameraVolumes}
							valueKey="defaultExposure"
							forceUpdate={forceUpdate}
							defaultValue={0}
							min={-3}
							max={3}
							step={0.1}
							precision={1}
						/>
					</Col>
				</Row>
				<Row gutter={[0, 16]}>
					<Col span={6} className="formLable">
						{<FormattedMessage id="jmk.camera.gamma" />}：
					</Col>
					<Col span={18}>
						<NumberInput
							item={CameraVolumes}
							valueKey="defaultGamma"
							forceUpdate={forceUpdate}
							defaultValue={0}
							min={0.1}
							max={4}
							step={0.1}
							precision={1}
						/>
					</Col>
				</Row>
				<Row gutter={[0, 16]}>
					<Col span={6} className="formLable">
						{<FormattedMessage id="jmk.camera.viewer" />}：
					</Col>
					<Col span={18}>
						<NumberInput
							item={CameraVolumes}
							valueKey="defaultFov"
							forceUpdate={forceUpdate}
							defaultValue={0}
							min={45}
							max={90}
							step={0.1}
							precision={0}
						/>
					</Col>
				</Row>
				<Row gutter={[0, 16]}>
					<Col span={6} className="formLable">
						{<FormattedMessage id="jmk.camera.MaximumMovingSpeed" />}：
					</Col>
					<Col span={18}>
						<NumberInput
							item={CameraVolumes}
							valueKey="moveMaxSpeed"
							forceUpdate={forceUpdate}
							defaultValue={0}
							min={0.1}
							max={50}
							step={0.1}
							precision={1}
						/>
					</Col>
				</Row>
				<Row gutter={[0, 16]}>
					<Col span={6} className="formLable">
						{<FormattedMessage id="jmk.camera.far" />}：
					</Col>
					<Col span={18}>
						<NumberInput
							item={CameraVolumes}
							valueKey="changeFar"
							forceUpdate={forceUpdate}
							defaultValue={100}
							min={0.1}
							step={0.1}
							precision={3}
						/>
					</Col>
				</Row>
				<Row gutter={[0, 16]}>
					<Col span={6} className="formLable">
						{<FormattedMessage id="jmk.camera.near" />}：
					</Col>
					<Col span={18}>
						<NumberInput
							item={CameraVolumes}
							valueKey="changeNear"
							forceUpdate={forceUpdate}
							defaultValue={0.001}
							min={0}
							step={0.1}
							precision={3}
						/>
					</Col>
				</Row>
				<Row gutter={10} align="middle">
					<Col span={12} className="turright">
						{<FormattedMessage id="jmk.camera.autoClimb" />}：
					</Col>
					<Col span={12}>
						<ItemSwitch
							size="small"
							forceUpdate={forceUpdate}
							item={CameraVolumes}
							valueKey="autoClimb"
						/>
					</Col>
				</Row>
				<Row gutter={[0, 16]}>
					<Col span={6} className="formLable">
						{<FormattedMessage id="jmk.camera.ColorMap" />}：
					</Col>
					<Col span={CameraVolumes.colorMap ? 14 : 16}>
						{CameraVolumes.colorMap ? (
							CameraVolumes.colorMap.name + "." + CameraVolumes.colorMap.rawExt
						) : (
							<FormattedMessage id="jmk.camera.null" />
						)}
					</Col>
					{CameraVolumes.colorMap && (
						<>
							<Col span={2}>
								<Button type="primary" size="small" icon={<CloseOutlined />} onClick={removeFlie} />
							</Col>
						</>
					)}
					<Col span={2}>
						{/* <CustomUpload
							btnText=""
							btnicon={<UploadOutlined />}
							accept=".png, .jpg, .jpeg"
							btnProps={{ type: "primary", size: "small" }}
							withChunk={false}
							size={1}
							extParams={{ type: "sky" }}
							apiService={serviceScene.iesProfile}
							customCheck={checkImage(5, 512, 512)}
						></CustomUpload> */}
						<JMKUpload
							btnicon={<UploadOutlined />}
							accept=".png, .jpg, .jpeg"
							btnProps={{ type: "primary", size: "small" }}
							size={1}
							btnText=""
							extParams={{ type: "lut", fromTextureLib: false }}
							apiService={serviceLocal.uploadjmktextures(state.sceneName)}
							onChange={successHandle}
						></JMKUpload>
					</Col>
				</Row>
				{/* <Row gutter={[0, 16]}>
					<Col span={6} className="formLable">
						{<FormattedMessage id="jmk.camera.AutoBrowse" />}：
					</Col>
					<Col span={18}>
						<ItemSwitch size="small" forceUpdate={forceUpdate} item={CameraVolumes} valueKey="autoClimb" />
					</Col>
				</Row> */}
				<Row gutter={[0, 16]}>
					<Col span={24} className="flex-cn">
						{<FormattedMessage id="jmk.camera.CameraRoll" />}
					</Col>
					<Col span={12} className="flex-cn">
						<Button type="dashed" size="small" icon={<PlusOutlined />} block onClick={addCubeOrSphere("cube")}>
							{<FormattedMessage id="jmk.camera.Cube" />}
						</Button>
					</Col>
					<Col span={12} className="flex-cn">
						<Button type="dashed" size="small" icon={<PlusOutlined />} block onClick={addCubeOrSphere("sphere")}>
							{<FormattedMessage id="jmk.camera.Sphere" />}
						</Button>
					</Col>
				</Row>
				<List
					bordered
					size="small"
					dataSource={cameraList.filter((m: any) => m.assetType === "camera")}
					renderItem={(item, index) => (
						<List.Item
							className={classNames({ lightsListActive: currentcamera === item })}
							actions={[
								<Button size="small" type="link" icon={<EyeOutlined />} onClick={lookatcameravolumn(item)} />,
								<Button size="small" type="link" icon={<CloseOutlined />} onClick={removecameravolumn(item, index)} />
							]}
							onClick={clickcameravolumn(item)}
						>
							{item.name}
						</List.Item>
					)}
				/>
				{!!currentcamera && (
					<>
						<div>
							<Row gutter={[0, 16]}>
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.camera.name" />}：
								</Col>
								<Col span={18}>
									<TextInput item={currentcamera} valueKey="name" forceUpdate={forceUpdate} maxLength={30} />
								</Col>
							</Row>
							<Row gutter={[0, 16]}>
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.camera.exposure" />}：
								</Col>
								<Col span={18}>
									<NumberInput
										item={currentcamera}
										valueKey="exposure"
										forceUpdate={forceUpdate}
										defaultValue={0}
										min={-3}
										max={3}
										step={0.1}
										precision={1}
									/>
								</Col>
							</Row>
							<Row gutter={[0, 16]}>
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.camera.gamma" />}：
								</Col>
								<Col span={18}>
									<NumberInput
										item={currentcamera}
										valueKey="gamma"
										forceUpdate={forceUpdate}
										defaultValue={0.1}
										min={0.1}
										max={4}
										step={0.1}
										precision={1}
									/>
								</Col>
							</Row>
							<Row gutter={[0, 16]}>
								<Col span={3} className="flex-cn">
									{<FormattedMessage id="jmk.camera.position" />}：
								</Col>
								<Col span={2} className="flex-cn">
									X
								</Col>
								<Col span={5} className="flex-cn">
									<NumberInput
										onVal={currentcamera.camPosition.x}
										item={currentcamera}
										field="camPosition"
										valueKey="x"
										defaultValue={0}
										precision={3}
										step={0.01}
									/>
								</Col>
								<Col span={2} className="flex-cn">
									Y
								</Col>
								<Col span={5} className="flex-cn">
									<NumberInput
										onVal={currentcamera.camPosition.y}
										item={currentcamera}
										field="camPosition"
										valueKey="y"
										defaultValue={0}
										precision={3}
										step={0.01}
									/>
								</Col>
								<Col span={2} className="flex-cn">
									Z
								</Col>
								<Col span={5} className="flex-cn">
									<NumberInput
										onVal={currentcamera.camPosition.z}
										item={currentcamera}
										field="camPosition"
										valueKey="z"
										defaultValue={0}
										precision={3}
										step={0.01}
									/>
								</Col>
							</Row>
							<Row gutter={[0, 16]}>
								<Col span={3} className="flex-cn">
									{<FormattedMessage id="jmk.camera.rotate" />}：
								</Col>
								<Col span={2} className="flex-cn">
									X
								</Col>
								<Col span={5} className="flex-cn">
									<NumberInput
										onVal={currentcamera.rotationDeg.x}
										item={currentcamera}
										field="rotationDeg"
										valueKey="x"
										defaultValue={0}
										precision={0}
										min={-180}
										max={180}
										step={1}
									/>
								</Col>
								<Col span={2} className="flex-cn">
									Y
								</Col>
								<Col span={5} className="flex-cn">
									<NumberInput
										onVal={currentcamera.rotationDeg.y}
										item={currentcamera}
										field="rotationDeg"
										valueKey="y"
										defaultValue={0}
										precision={0}
										min={-180}
										max={180}
										step={1}
									/>
								</Col>
								<Col span={2} className="flex-cn">
									Z
								</Col>
								<Col span={5} className="flex-cn">
									<NumberInput
										onVal={currentcamera.rotationDeg.z}
										item={currentcamera}
										field="rotationDeg"
										valueKey="z"
										defaultValue={0}
										precision={0}
										min={-180}
										max={180}
										step={1}
									/>
								</Col>
							</Row>
							<Row gutter={[0, 16]}>
								<Col span={3} className="flex-cn">
									{<FormattedMessage id="jmk.camera.zoom" />}：
								</Col>
								<Col span={2} className="flex-cn">
									X
								</Col>
								<Col span={5} className="flex-cn">
									<NumberInput
										onVal={currentcamera.camScale.x}
										item={currentcamera}
										field="camScale"
										valueKey="x"
										defaultValue={0}
										precision={3}
										step={0.01}
									/>
								</Col>
								<Col span={2} className="flex-cn">
									Y
								</Col>
								<Col span={5} className="flex-cn">
									<NumberInput
										onVal={currentcamera.camScale.y}
										item={currentcamera}
										field="camScale"
										valueKey="y"
										defaultValue={0}
										precision={3}
										step={0.01}
									/>
								</Col>
								<Col span={2} className="flex-cn">
									Z
								</Col>
								<Col span={5} className="flex-cn">
									<NumberInput
										onVal={currentcamera.camScale.z}
										item={currentcamera}
										field="camScale"
										valueKey="z"
										defaultValue={0}
										precision={3}
										step={0.01}
									/>
								</Col>
							</Row>
						</div>
					</>
				)}
			</div>
		</JMKPanel>
	)
}
export default CameraPanel
