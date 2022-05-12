import { assetData } from "@/interfaces/extdata.interface"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { Button, Col, List, Modal, Radio, Row, Space, Typography } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "umi"
import ItemCheckBox from "../item.checkbox"
import NumberInput from "../number.input"
import "./hotspot.less"
import { JMKContext } from "@/components/provider/jmk.context"
import { useEditHook } from "@/components/jmk/jmk.engine"
import ItemRadio from "../item.radio"
import { AimOutlined, CloseOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons"
import classNames from "classnames"
import TextInput from "../text.input"
import ItemSlider from "../item.slider"
import { panelContext } from "@/components/provider/panel.context"
import eventBus from "@/utils/event.bus"
interface Props {
	data: assetData
}
const _TriggerPlay: React.FC<Props> = props => {
	const Intl = useIntl()
	const { data } = props
	const forceUpdate = useForceUpdate()
	const { state } = useContext(JMKContext)
	const { state: paneState, dispatch } = useContext(panelContext)
	const JMKHook = useEditHook()
	const [currentVolumn, setCurrentVolumn] = useState(null)
	const volumnList: any[] = useMemo(() => state.editHook?.getCameraVolumes() || [], [state.editHook])

	const [currentType, setCurrentType] = useState(data.extdata.info.custom.triggerPlay.triggerType)
	useEffect(() => {
		setCurrentType(data.extdata.info.custom.triggerPlay.triggerType)
	}, [data])
	useEffect(() => {
		if (paneState.selectState) {
			state.editHook.enableCameraVolumeSelection()
			currentVolumn && JMKHook.selectCameraVolume(currentVolumn)
		} else {
			state.editHook.enableAssetSelection()
		}
	}, [paneState, state.editHook, currentVolumn])
	// 全部显示
	useEffect(() => {
		if (volumnList && state.editHook) {
			state.editHook.showCameraVolume(volumnList.filter(m => m.pId === data.uuid))
		}
	}, [state, volumnList.length, data])
	// 点击切换相机
	const clickcameravolumn = useCallback(
		(item: any) => () => {
			JMKHook.seeItem(item)
		},
		[state]
	)
	const changeCameravolumn = useCallback(
		(item: any) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			setCurrentVolumn(item)
		},
		[state]
	)

	useEffect(() => {
		if (currentVolumn) {
			JMKHook.selectCameraVolume(currentVolumn)
			eventBus.emit("jmk.assetClick", currentVolumn)
		}
	}, [currentVolumn])
	// 添加 球体
	const addCubeOrSphere = useCallback(
		msg => () => {
			const type = data.contentType == 11 ? "audio" : "video"
			const volumn = state.editHook.addCameraVolume(msg, null, type, data.uuid)
			!currentVolumn && setCurrentVolumn(volumn)
			forceUpdate()
		},
		[state, currentVolumn, data]
	)
	// 删除相机
	const removecameravolumn = useCallback(
		(item: any, index) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			const cameraList = volumnList.filter(m => m.pId === data.uuid)
			const newIndex = cameraList.findIndex(i => i === currentVolumn)
			if (cameraList.length === 1) {
				setCurrentVolumn(null)
			} else if (cameraList.length > 1 && index === newIndex && index === 0) {
				setCurrentVolumn(cameraList[1])
			} else if (cameraList.length > 1 && index === newIndex && index !== 0) {
				setCurrentVolumn(cameraList[index - 1])
			}
			state.editHook.removeCameraVolume(item)
			forceUpdate()
		},
		[state, currentVolumn, volumnList, data]
	)
	const getChangeValue = useCallback(
		val => {
			setCurrentType(val)
			dispatch({
				type: "set",
				payload: {
					selectState: val === 2
				}
			})
		},
		[state.editHook]
	)
	const toSetCameraVolume = useCallback(() => {
		Modal.confirm({
			content: "是否进入范围指定模式？",
			onOk() {
				getChangeValue(2)
			},
			onCancel() {}
		})
	}, [state.editHook, currentVolumn])

	return (
		<div id="TagCheck">
			<Space className="full-w" direction="vertical">
				<Space direction="horizontal" align="center">
					<Typography.Text strong>{<FormattedMessage id="jmk.audio.spaceTriggerStyle" />}</Typography.Text>
					<Typography.Text type="secondary"></Typography.Text>
				</Space>
				<Space className="full-w between" direction="horizontal" align="center">
					<Typography.Text strong style={{ marginLeft: "20px" }}>
						{<FormattedMessage id="jmk.video.setBgVolume" />}
					</Typography.Text>
					<div style={{ width: "180px" }}>
						<ItemSlider
							min={0.1}
							max={1}
							step={0.1}
							item={data.extdata.info.custom.triggerPlay}
							valueKey="bgVolume"
						></ItemSlider>
					</div>
				</Space>
				<Row>
					<Col span={16} className="flex-cn">
						<ItemRadio
							item={data.extdata.info.custom.triggerPlay}
							valueKey="triggerType"
							children={
								<>
									<Radio.Button value={1}>
										<FormattedMessage id="jmk.audio.spaceTrigger" />
									</Radio.Button>
									{/* <Radio.Button value={2}>
										<FormattedMessage id="jmk.audio.areaSpaceTrigger" />
									</Radio.Button> */}
								</>
							}
							getChangeValue={getChangeValue}
							forceUpdate={forceUpdate}
						/>
					</Col>
					<Col span={6} className="flex-cn">
						{currentType == 2 && !paneState.selectState && (
							<Button type="primary" onClick={toSetCameraVolume}>
								<FormattedMessage id="jmk.addmaterial.materialChoose" />
							</Button>
						)}
					</Col>
				</Row>
				{currentType == 1 && (
					<>
						<Space className="full-w between" direction="horizontal" align="center">
							<Typography.Text strong style={{ marginLeft: "20px" }}>
								{<FormattedMessage id="jmk.video.range" />}（m）:
							</Typography.Text>
							<div style={{ width: "200px" }}>
								<NumberInput
									item={data.extdata.info.custom.triggerPlay}
									valueKey="distance"
									forceUpdate={forceUpdate}
									defaultValue={0.1}
									precision={1}
									min={0.1}
									max={10000}
									step={0.1}
									size="small"
									style={{ width: "160px" }}
								/>
							</div>
						</Space>
						{/* <Space className="full-w between" direction="horizontal" align="center">
							<ItemCheckBox
								// item={data.extdata.info.custom}
								item={data.extdata.info.custom.triggerPlay}
								valueKey="visiblePlay"
								children={<FormattedMessage id="jmk.audio.cameraInAreaPlay" />}
								forceUpdate={forceUpdate}
								style={{ marginLeft: "20px" }}
								disabled
							/>
						</Space>
						<Space className="full-w between" direction="horizontal" align="center">
							<ItemCheckBox
								// item={data.extdata.info.custom}
								item={data.extdata.info.custom.triggerPlay}
								valueKey="nearestPlay"
								children={<FormattedMessage id="jmk.audio.nearCameraPlay" />}
								forceUpdate={forceUpdate}
								style={{ marginLeft: "20px" }}
								disabled
							/>
						</Space> */}
						{/* {data.contentType == 3 && (
							<Space className="full-w between" direction="horizontal" align="center">
								<ItemCheckBox
									item={data.extdata.info.custom.triggerPlay}
									valueKey="playShow"
									children={<FormattedMessage id="jmk.video.playShow" />}
									forceUpdate={forceUpdate}
									style={{ marginLeft: "20px" }}
								/>
							</Space>
						)} */}
					</>
				)}
			</Space>

			{currentType == 2 && (
				<>
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
							<Button type="dashed" size="small" icon={<EditOutlined />} block onClick={addCubeOrSphere("sphere")}>
								{<FormattedMessage id="jmk.camera.Sphere" />}
							</Button>
						</Col>
					</Row>
					<List
						bordered
						size="small"
						className="playList"
						style={{ marginBottom: "30px", display: "block" }}
						dataSource={volumnList.filter(m => m.pId === data.uuid)}
						renderItem={(item, index) => (
							<List.Item
								className={classNames({ lightsListActive: currentVolumn === item })}
								actions={[
									<Button
										size="small"
										type="link"
										icon={<CloseOutlined />}
										onClick={removecameravolumn(item, index)}
									/>,
									<Button size="small" type="link" icon={<AimOutlined />} onClick={changeCameravolumn(item)} />
								]}
								onClick={clickcameravolumn(item)}
							>
								{item.name}
							</List.Item>
						)}
					/>
					{!!currentVolumn && (
						<>
							<div>
								<Row gutter={[0, 16]} style={{ marginBottom: "10px" }}>
									<Col span={6} className="formLable">
										{<FormattedMessage id="jmk.camera.name" />}：
									</Col>
									<Col span={18}>
										<TextInput item={currentVolumn} valueKey="name" forceUpdate={forceUpdate} maxLength={30} />
									</Col>
								</Row>
								<Row gutter={[0, 16]} style={{ marginBottom: "10px" }}>
									<Col span={3} className="flex-cn">
										{<FormattedMessage id="jmk.camera.position" />}：
									</Col>
									<Col span={2} className="flex-cn">
										X
									</Col>
									<Col span={5} className="flex-cn">
										<NumberInput
											onVal={currentVolumn.camPosition.x}
											item={currentVolumn}
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
											onVal={currentVolumn.camPosition.y}
											item={currentVolumn}
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
											onVal={currentVolumn.camPosition.z}
											item={currentVolumn}
											field="camPosition"
											valueKey="z"
											defaultValue={0}
											precision={3}
											step={0.01}
										/>
									</Col>
								</Row>
								<Row gutter={[0, 16]} style={{ marginBottom: "10px" }}>
									<Col span={3} className="flex-cn">
										{<FormattedMessage id="jmk.camera.rotate" />}：
									</Col>
									<Col span={2} className="flex-cn">
										X
									</Col>
									<Col span={5} className="flex-cn">
										<NumberInput
											onVal={currentVolumn.rotationDeg.x}
											item={currentVolumn}
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
											onVal={currentVolumn.rotationDeg.y}
											item={currentVolumn}
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
											onVal={currentVolumn.rotationDeg.z}
											item={currentVolumn}
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
								<Row gutter={[0, 16]} style={{ marginBottom: "10px" }}>
									<Col span={3} className="flex-cn">
										{<FormattedMessage id="jmk.camera.zoom" />}：
									</Col>
									<Col span={2} className="flex-cn">
										X
									</Col>
									<Col span={5} className="flex-cn">
										<NumberInput
											onVal={currentVolumn.camScale.x}
											item={currentVolumn}
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
											onVal={currentVolumn.camScale.y}
											item={currentVolumn}
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
											onVal={currentVolumn.camScale.z}
											item={currentVolumn}
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
				</>
			)}
		</div>
	)
}

const TriggerPlay = useMini(_TriggerPlay)

export default TriggerPlay
