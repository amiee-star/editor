import { JMKContext } from "@/components/provider/jmk.context"
import { panelContext } from "@/components/provider/panel.context"
import "./lights.panel.less"
import { FormattedMessage, useIntl } from "umi"
import { Button, List, Row, Col, Radio } from "antd"
import { PlusOutlined, CloseOutlined, EyeOutlined, UploadOutlined } from "@ant-design/icons"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import JMKPanel from "./jmk.panel"
import TextInput from "@/components/form/text.input"
import OpationSelect from "@/components/form/select"
import NumberInput from "@/components/form/number.input"
import ItemColor from "@/components/form/item.color"
import classNames from "classnames"
import { useEditHook } from "@/components/jmk/jmk.engine"
import { useForceUpdate } from "@/utils/use.func"
import eventBus from "@/utils/event.bus"
import JMKUpload from "@/components/utils/jmk.upload"
import { baseRes } from "@/interfaces/api.interface"
import urlFunc from "@/utils/url.func"
import { UploadFile } from "antd/lib/upload/interface"
import serviceScene from "@/services/service.scene"
import serviceLocal from "@/services/service.local"

const LightsPanel: React.FC = () => {
	const Intl = useIntl()
	const forceUpdate = useForceUpdate()
	const selectOpations = [
		{
			label: <FormattedMessage id="jmk.spot" />,
			value: "spot"
		},
		{
			label: <FormattedMessage id="jmk.point" />,
			value: "point"
		},
		{
			label: <FormattedMessage id="jmk.area" />,
			value: "area"
		},
		{
			label: <FormattedMessage id="jmk.sun" />,
			value: "sun"
		}
	]
	const JMKHook = useEditHook()
	const [currentType, setCurrentType] = useState(selectOpations[0].value)
	const [currentInstances, setCurrentInstances] = useState(null)
	const [currentLight, setCurrentLight] = useState(null)
	const { state: panelState } = useContext(panelContext)
	const { state } = useContext(JMKContext)
	const lightsList: any[] = useMemo(() => (state.editHook ? JMKHook.getLights() : []), [state.editHook])
	const show = useMemo(() => panelState.model === "base" && panelState.current === "lights" && !!state.editHook, [
		panelState,
		state
	])
	useEffect(() => {
		JMKHook.selectLightInstance(currentInstances)
	}, [currentInstances])
	useEffect(() => {
		if (state.editHook && !currentLight && !show) {
			setCurrentLight(lightsList.filter(m => m.type === currentType)[0])
		}
	}, [state])
	useEffect(() => {
		if (state.editHook && !!show) {
			JMKHook.enableLightSelection()
		}
	}, [state.editHook, show])
	const typeChange = useCallback(e => {
		setCurrentType(e.target.value)
	}, [])
	useEffect(() => {
		if (currentLight && !currentInstances) {
			setCurrentInstances(currentLight.instances[0])
		}
	}, [currentLight, currentInstances])
	useEffect(() => {
		if (lightsList) {
			const firstLight = lightsList.filter(m => m.type === currentType)[0]
			setCurrentLight(firstLight)
			if (firstLight?.instances) {
				setCurrentInstances(firstLight.instances[0])
			}
		}
	}, [currentType, lightsList])
	const setLightInstanceSelectedCallback = useCallback(
		item => {
			setCurrentType(item.light.type)
			setCurrentLight(item.light)
			setCurrentInstances(item)
			document.body.querySelector(`[data-id='${item.index}']`).scrollIntoView(true)
		},
		[state]
	)
	useEffect(() => {
		if (state.editHook) {
			state.editHook.setLightInstanceSelectedCallback(setLightInstanceSelectedCallback)
		}
	}, [state.editHook])
	// 点击光源
	const clickLight = useCallback(
		(item: any) => () => {
			setCurrentLight(item)
		},
		[]
	)
	// 点击实例
	const clickInstances = useCallback(
		(item: any) => () => {
			setCurrentInstances(item)
		},
		[]
	)
	// 删除实例
	const removeInstance = useCallback(
		(item: any, index) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			if (currentLight.instances.length === 1) {
				setCurrentInstances(null)
			} else if (currentLight.instances.length > 1 && index === currentInstances.index && index === 0) {
				setCurrentInstances(currentLight.instances[1])
			} else if (currentLight.instances.length > 1 && index === currentInstances.index && index !== 0) {
				setCurrentInstances(currentLight.instances[index - 1])
			}
			JMKHook.removeLightInstance(currentLight, item)
		},
		[state, currentLight, currentInstances]
	)
	// 添加实例
	const addInstance = useCallback(() => {
		const position = JMKHook.getCameraPosition()
		currentInstances
			? JMKHook.addLightInstance(currentLight, position)
			: setCurrentInstances(JMKHook.addLightInstance(currentLight, position))
	}, [currentLight, state, currentInstances])
	// 添加light
	const addLight = useCallback(() => {
		const name = selectOpations.find(t => t.value === currentType).label
		const position = JMKHook.getCameraPosition()
		if (!currentLight) {
			const light = JMKHook.addLight(name + "", currentType, position)
			setCurrentLight(light)
			setCurrentInstances(light.instances[0])
		} else {
			JMKHook.addLight(name + "", currentType, position)
		}
	}, [currentType, state, currentLight])
	// 删除light
	const removeLight = useCallback(
		(item: any, index) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			const list = lightsList.filter(a => a.type === currentType)
			const newIndex = list.findIndex(i => i === currentLight)
			if (list.length === 1) {
				setCurrentLight(null)
			} else if (list.length > 1 && index === newIndex && index === 0) {
				setCurrentLight(list[1])
			} else if (list.length > 1 && index === newIndex && index !== 0) {
				setCurrentLight(list[index - 1])
			}
			JMKHook.removeLight(item)
		},
		[state, currentLight, currentType]
	)
	// 跳转到实例
	const lookAtInstance = useCallback(
		(item: any) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			JMKHook.seeItem(item)
		},
		[currentLight]
	)
	// 上传
	const successHandle = useCallback(
		(res?: any, item?: any) => {
			return new Promise(resolve => {
				currentLight.photometricProfile = res.data.fileName
				resolve(1)
			})
		},
		[currentLight]
	)

	// 删除文件
	const removeFlie = useCallback(() => {
		currentLight.photometricProfile = null
		forceUpdate()
	}, [currentLight])
	useEffect(() => {
		eventBus.off("jmk.sceneChanged").on("jmk.sceneChanged", () => {
			setTimeout(() => {
				forceUpdate()
			}, 0)
		})
	}, [])
	return (
		<JMKPanel title={<FormattedMessage id="jmk.lights" />}>
			<div id="LightsPanel">
				<Row gutter={[0, 16]}>
					<Col span={24} className="flex-cn">
						<Radio.Group size="large" value={currentType} buttonStyle="solid" onChange={typeChange}>
							{selectOpations.map(m => {
								return (
									<Radio.Button key={m.value} value={m.value}>
										{m.label}
									</Radio.Button>
								)
							})}
						</Radio.Group>
					</Col>
					{!(currentType === "sun" && lightsList.filter(a => a.type === currentType).length > 0) && (
						<Col span={24} className="flex-cn">
							<Button type="dashed" icon={<PlusOutlined />} onClick={addLight} block size="small">
								{<FormattedMessage id="jmk.lights" />}
							</Button>
						</Col>
					)}
				</Row>

				<List
					size="small"
					bordered
					style={{
						marginTop: currentType === "sun" && lightsList.filter(a => a.type === currentType).length > 0 ? "16px" : "0"
					}}
					dataSource={lightsList.filter(a => a.type === currentType)}
					renderItem={(item, index) => (
						<List.Item
							className={classNames({ lightsListActive: item === currentLight })}
							actions={[
								<Button type="link" size="small" icon={<CloseOutlined />} onClick={removeLight(item, index)} />
							]}
							onClick={clickLight(item)}
						>
							{item.name}
						</List.Item>
					)}
				/>
				{!!currentLight && (
					<>
						<Row gutter={10} align="middle">
							<Col span={6} className="formLable">
								{<FormattedMessage id="jmk.name" />}：
							</Col>
							<Col span={18}>
								<TextInput item={currentLight} valueKey="name" forceUpdate={forceUpdate} maxLength={15} />
							</Col>
							{/* defaultValue="sun" */}
						</Row>
						<Row gutter={10} align="middle">
							<Col span={6} className="formLable">
								{<FormattedMessage id="jmk.type" />}：
							</Col>
							<Col span={18}>
								<OpationSelect
									item={currentLight}
									valueKey="type"
									forceUpdate={forceUpdate}
									options={selectOpations}
									disabled={true}
								/>
							</Col>
						</Row>
						<Row gutter={10} align="middle">
							<Col span={6} className="formLable">
								{<FormattedMessage id="jmk.strength" />}：
							</Col>
							<Col span={18}>
								<NumberInput
									item={currentLight}
									valueKey="strength"
									forceUpdate={forceUpdate}
									defaultValue={0}
									precision={2}
									min={0}
									max={1000}
									step={1}
								/>
							</Col>
						</Row>
						{currentType === "spot" && (
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.angle" />}：
								</Col>
								<Col span={18}>
									<NumberInput
										item={currentLight}
										valueKey="angle"
										forceUpdate={forceUpdate}
										defaultValue={0}
										precision={0}
										min={1}
										max={180}
										step={1}
									/>
								</Col>
							</Row>
						)}
						{(currentType === "spot" || currentType === "point") && (
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.ies_profile" />}：
								</Col>
								<Col span={currentLight.photometricProfile ? 13 : 15}>
									{currentLight.photometricProfile ? (
										currentLight.photometricProfile
									) : (
										<FormattedMessage id="jmk.not_selected" />
									)}
								</Col>
								{currentLight.photometricProfile && (
									<>
										<Col span={2}>
											<Button type="primary" size="small" icon={<CloseOutlined />} onClick={removeFlie} />
										</Col>
									</>
								)}
								{state.sceneName && (
									<>
										<Col span={2}>
											{/* <CustomUpload
												btnicon={<UploadOutlined />}
												accept=".ies"
												checkType="light"
												apiService={serviceScene.iesProfile}
												extParams={{ sceneName: state.sceneName }}
												btnProps={{ type: "primary", size: "small" }}
												size={1}
												btnText=""

											></CustomUpload> */}
											<JMKUpload //上传IES光域网
												btnicon={<UploadOutlined />}
												accept=".ies"
												btnProps={{ type: "primary", size: "small" }}
												size={1}
												btnText=""
												apiService={serviceLocal.uploadlighties(state.sceneName)}
												uploadCallTask={successHandle}
											></JMKUpload>
										</Col>
									</>
								)}
							</Row>
						)}
						{currentType !== "area" && (
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.size" />}：
								</Col>
								<Col span={18}>
									<NumberInput
										item={currentLight}
										valueKey="size"
										forceUpdate={forceUpdate}
										min={0.01}
										max={0.5}
										step={0.01}
										precision={2}
										defaultValue={0.01}
									/>
								</Col>
							</Row>
						)}
						{currentType === "area" && (
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.width" />}：
								</Col>
								<Col span={18}>
									<NumberInput
										item={currentLight}
										valueKey="width"
										forceUpdate={forceUpdate}
										defaultValue={0.01}
										precision={2}
										min={0.01}
										max={5}
										step={0.01}
									/>
								</Col>
							</Row>
						)}
						{currentType === "area" && (
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.height" />}：
								</Col>
								<Col span={18}>
									<NumberInput
										item={currentLight}
										valueKey="height"
										forceUpdate={forceUpdate}
										defaultValue={0.01}
										precision={2}
										min={0.01}
										max={5}
										step={0.01}
									/>
								</Col>
							</Row>
						)}
						<Row gutter={10} align="middle">
							<Col span={6} className="formLable">
								{<FormattedMessage id="jmk.color" />}：
							</Col>
							<Col span={18}>
								<ItemColor item={currentLight} valueKey="color" forceUpdate={forceUpdate} />
							</Col>
						</Row>

						<div className="instancesList">
							{currentType !== "sun" && (
								<Row gutter={[0, 16]}>
									<Col span={24} className="flex-cn">
										<Button type="dashed" icon={<PlusOutlined />} onClick={addInstance} block size="small">
											{<FormattedMessage id="jmk.instances" />}
										</Button>
									</Col>
								</Row>
							)}

							<List
								size="small"
								bordered
								style={{ marginTop: currentType === "sun" ? "16px" : "0" }}
								dataSource={currentLight.instances}
								renderItem={(item: any, index) => (
									<List.Item
										actions={[
											<Button size="small" type="link" icon={<EyeOutlined />} onClick={lookAtInstance(item)} />
										].concat(
											currentType === "sun"
												? []
												: [
														<Button
															size="small"
															type="link"
															icon={<CloseOutlined />}
															onClick={removeInstance(item, index)}
															hidden={currentType === "sun"}
														/>
												  ]
										)}
										className={classNames({ lightsListActive: currentInstances === item })}
										onClick={clickInstances(item)}
										data-id={item.index}
									>
										{"{" +
											Math.round(item.position.x * 1000) / 1000 +
											"," +
											Math.round(item.position.y * 1000) / 1000 +
											"," +
											Math.round(item.position.z * 1000) / 1000 +
											"}"}
									</List.Item>
								)}
							/>
						</div>
						{currentInstances && (
							<>
								<Row gutter={10} align="middle">
									<Col span={5}>Position</Col>
									<Col span={1}>X</Col>
									<Col span={5}>
										<NumberInput
											onVal={currentInstances.position.x}
											item={currentInstances}
											field="position"
											valueKey="x"
											forceUpdate={forceUpdate}
											defaultValue={0}
											precision={3}
											step={0.01}
										/>
									</Col>
									<Col span={1}>Y</Col>
									<Col span={5}>
										<NumberInput
											onVal={currentInstances.position.y}
											item={currentInstances}
											field="position"
											valueKey="y"
											forceUpdate={forceUpdate}
											defaultValue={0}
											precision={3}
											step={0.01}
										/>
									</Col>
									<Col span={1}>Z</Col>
									<Col span={5}>
										<NumberInput
											onVal={currentInstances.position.z}
											item={currentInstances}
											field="position"
											valueKey="z"
											forceUpdate={forceUpdate}
											defaultValue={0}
											precision={3}
											step={0.01}
										/>
									</Col>
								</Row>
								{(currentLight.type === "spot" || currentLight.type === "area") && (
									<Row gutter={10} align="middle">
										<Col span={5}>Rotation</Col>
										<Col span={1}>X</Col>
										<Col span={5}>
											<NumberInput
												onVal={currentInstances.rotationDeg.x}
												item={currentInstances}
												field="rotationDeg"
												valueKey="x"
												forceUpdate={forceUpdate}
												defaultValue={0}
												precision={0}
												min={-180}
												max={180}
												step={1}
											/>
										</Col>
										<Col span={1}>Y</Col>
										<Col span={5}>
											<NumberInput
												onVal={currentInstances.rotationDeg.y}
												item={currentInstances}
												field="rotationDeg"
												valueKey="y"
												forceUpdate={forceUpdate}
												defaultValue={0}
												precision={0}
												min={-180}
												max={180}
												step={1}
											/>
										</Col>
										<Col span={1}>Z</Col>
										<Col span={5}>
											<NumberInput
												onVal={currentInstances.rotationDeg.z}
												item={currentInstances}
												field="rotationDeg"
												valueKey="z"
												forceUpdate={forceUpdate}
												defaultValue={0}
												precision={0}
												min={-180}
												max={180}
												step={1}
											/>
										</Col>
									</Row>
								)}
							</>
						)}
					</>
				)}
			</div>
		</JMKPanel>
	)
}
export default LightsPanel
