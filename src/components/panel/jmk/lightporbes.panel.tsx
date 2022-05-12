import { JMKContext } from "@/components/provider/jmk.context"
import { panelContext } from "@/components/provider/panel.context"
import "./lightporbes.panel.less"
import { FormattedMessage, useIntl } from "umi"
import { Button, List, Card, Row, Col, Checkbox } from "antd"
import { PlusOutlined, CloseOutlined, EyeOutlined } from "@ant-design/icons"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import JMKPanel from "./jmk.panel"
import NumberInput from "@/components/form/number.input"
import { useForceUpdate } from "@/utils/use.func"
import eventBus from "@/utils/event.bus"

const LightporbesPanel: React.FC = () => {
	const Intl = useIntl()
	const forceUpdate = useForceUpdate()
	const [currentLightprobes, setCurrentLightprobes] = useState(null)
	const [boundingBoxshow, setBoundingboxshow] = useState(null)
	const { state: panelState } = useContext(panelContext)
	const { state } = useContext(JMKContext)
	const lightProbesList: any[] = useMemo(() => state.editHook?.getLightProbes() || [], [state.editHook])
	const show = useMemo(() => panelState.model === "base" && panelState.current === "lightporbes" && !!state.editHook, [
		panelState,
		state
	])
	useEffect(() => {
		if (state.editHook && !currentLightprobes) {
			setCurrentLightprobes(lightProbesList[0])
		}
	}, [state])
	useEffect(() => {
		if (currentLightprobes) {
			setBoundingboxshow(currentLightprobes.isBoundingBoxEnabled())
		}
	}, [currentLightprobes])
	useEffect(() => {
		if (currentLightprobes) {
			currentLightprobes.setBoxMax(
				currentLightprobes.boxMax.x,
				currentLightprobes.boxMax.y,
				currentLightprobes.boxMax.z
			)
		}
	}, [currentLightprobes?.boxMax])
	useEffect(() => {
		if (currentLightprobes) {
			currentLightprobes.setBoxMin(
				currentLightprobes.boxMin.x,
				currentLightprobes.boxMin.y,
				currentLightprobes.boxMin.z
			)
		}
	}, [currentLightprobes?.boxMin])
	useEffect(() => {
		if (state.editHook && !!show) {
			state.editHook.enableLightProbeSelection()
		}
	}, [state.editHook, show])
	useEffect(() => {
		if (currentLightprobes) {
			if (currentLightprobes.boxMax.x == currentLightprobes.boxMin.x) {
				currentLightprobes.boxMax.x += 0.01
				currentLightprobes.boxMin.x -= 0.01
			}
			if (currentLightprobes.boxMax.y == currentLightprobes.boxMin.y) {
				currentLightprobes.boxMax.y += 0.01
				currentLightprobes.boxMin.y -= 0.01
			}
			if (currentLightprobes.boxMax.z == currentLightprobes.boxMin.z) {
				currentLightprobes.boxMax.z += 0.01
				currentLightprobes.boxMin.z -= 0.01
			}
		}
		state.editHook.selectLightProbe(currentLightprobes)
	}, [currentLightprobes, state.editHook])
	// 点击反射球列表
	const clickLightprobes = useCallback(
		(item: any) => () => {
			if (item.boxMax.x == item.boxMin.x) {
				item.boxMax.x += 0.01
				item.boxMin.x -= 0.01
			}
			if (item.boxMax.y == item.boxMin.y) {
				item.boxMax.y += 0.01
				item.boxMin.y -= 0.01
			}
			if (item.boxMax.z == item.boxMin.z) {
				item.boxMax.z += 0.01
				item.boxMin.z -= 0.01
			}
			setCurrentLightprobes(item)
		},
		[state]
	)
	// 添加
	const addInstances = useCallback(() => {
		const position = state.editHook.getCameraPosition()
		state.editHook.addLightProbe(position)
		if (lightProbesList.length == 1) {
			setCurrentLightprobes(lightProbesList[0])
		}

		forceUpdate()
	}, [state])

	const removeLightprobes = useCallback(
		(item: any, index) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			const list = lightProbesList
			const newIndex = list.findIndex(i => i === currentLightprobes)

			if (list.length === 1) {
				setCurrentLightprobes(null)
			} else if (list.length > 1 && index === newIndex && index === 0) {
				setCurrentLightprobes(list[1])
			} else if (list.length > 1 && index === newIndex && index !== 0) {
				setCurrentLightprobes(list[index - 1])
			}
			state.editHook.removeLightProbe(item)
			forceUpdate()
		},
		[state, currentLightprobes]
	)
	const setLightProbeSelectedCallback = useCallback(
		item => {
			setCurrentLightprobes(item)
		},
		[currentLightprobes]
	)
	useEffect(() => {
		if (state.editHook) {
			state.editHook.setLightProbeSelectedCallback(setLightProbeSelectedCallback)
		}
	}, [state.editHook])

	useEffect(() => {
		eventBus.off("jmk.sceneChanged").on("jmk.sceneChanged", () => {
			setTimeout(() => {
				forceUpdate()
			}, 0)
		})
	}, [])

	const lookatLightprobes = useCallback(
		(item: any) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			state.editHook.seeItem(item)
		},
		[currentLightprobes]
	)
	return (
		<JMKPanel title={<FormattedMessage id="jmk.lightprobes" />}>
			<div id="LightsProbesPanel">
				<Row gutter={[0, 16]}>
					<Col span={24} className="flex-cn">
						{<FormattedMessage id="jmk.lightprobeslist" />}
					</Col>
					<Col span={24} className="flex-cn">
						<Button
							type="dashed"
							size="small"
							icon={<PlusOutlined />}
							block
							onClick={() => {
								addInstances()
							}}
						>
							{<FormattedMessage id="jmk.newlightprobes" />}
						</Button>
					</Col>
				</Row>
				<div className="lightProbesList">
					<List
						bordered
						size="small"
						dataSource={lightProbesList}
						renderItem={(item, index) => (
							<List.Item
								className={item === currentLightprobes ? "active" : null}
								actions={[
									<Button size="small" type="link" icon={<EyeOutlined />} onClick={lookatLightprobes(item)} />,
									<Button size="small" type="link" icon={<CloseOutlined />} onClick={removeLightprobes(item, index)} />
								]}
								onClick={clickLightprobes(item)}
							>
								{item._name}&nbsp;&nbsp;
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

				{!!currentLightprobes && (
					<>
						<Card title={<FormattedMessage id="jmk.lightprobesposition" />} style={{ width: 300 }}>
							<Row gutter={10} align="middle" className="mar12">
								<Col span={24}>
									<Row gutter={10} align="middle">
										<Col span={1}>X</Col>
										<Col span={7}>
											<NumberInput
												onVal={currentLightprobes.position.x}
												item={currentLightprobes}
												field="position"
												valueKey="x"
												forceUpdate={forceUpdate}
												precision={3}
												defaultValue={0}
												step={0.01}
											/>
										</Col>
										<Col span={1}>Y</Col>
										<Col span={7}>
											<NumberInput
												onVal={currentLightprobes.position.y}
												item={currentLightprobes}
												field="position"
												valueKey="y"
												forceUpdate={forceUpdate}
												precision={3}
												defaultValue={0}
												step={0.01}
											/>
										</Col>
										<Col span={1}>Z</Col>
										<Col span={7}>
											<NumberInput
												onVal={currentLightprobes.position.z}
												item={currentLightprobes}
												field="position"
												valueKey="z"
												forceUpdate={forceUpdate}
												defaultValue={0}
												precision={3}
												step={0.01}
											/>
										</Col>
									</Row>
								</Col>
							</Row>
						</Card>
						<Card
							title={<FormattedMessage id="jmk.lightprobesboundingbox" />}
							extra={
								<Checkbox
									checked={boundingBoxshow}
									onChange={value => {
										setBoundingboxshow(value.target.checked)
										value.target.checked
											? currentLightprobes.enableBoundingBox()
											: currentLightprobes.disableBoundingBox()
									}}
								></Checkbox>
							}
							style={{ width: 300 }}
						>
							{boundingBoxshow && (
								<Row gutter={10} align="middle" className="mar12">
									<Col span={24}>
										<Row gutter={10} align="middle">
											<Col span={3}>Max:</Col>
											<Col span={1}>X</Col>
											<Col span={6}>
												<NumberInput
													onVal={currentLightprobes.boxMax.x}
													item={currentLightprobes}
													field="boxMax"
													valueKey="x"
													forceUpdate={forceUpdate}
													defaultValue={currentLightprobes.boxMin.x + 0.01}
													min={currentLightprobes.boxMin.x + 0.01}
													step={0.01}
													precision={2}
												/>
											</Col>
											<Col span={1}>Y</Col>
											<Col span={6}>
												<NumberInput
													onVal={currentLightprobes.boxMax.y}
													item={currentLightprobes}
													field="boxMax"
													valueKey="y"
													forceUpdate={forceUpdate}
													defaultValue={currentLightprobes.boxMin.y + 0.01}
													min={currentLightprobes.boxMin.y + 0.01}
													step={0.01}
													precision={2}
												/>
											</Col>
											<Col span={1}>Z</Col>
											<Col span={6}>
												<NumberInput
													onVal={currentLightprobes.boxMax.z}
													item={currentLightprobes}
													field="boxMax"
													valueKey="z"
													forceUpdate={forceUpdate}
													defaultValue={currentLightprobes.boxMin.z + 0.01}
													min={currentLightprobes.boxMin.z + 0.01}
													step={0.01}
													precision={2}
												/>
											</Col>
										</Row>
									</Col>
								</Row>
							)}
							{boundingBoxshow && (
								<Row gutter={10} align="middle" className="mar12">
									<Col span={24}>
										<Row gutter={10} align="middle">
											<Col span={3}>Min:</Col>
											<Col span={1}>X</Col>
											<Col span={6}>
												<NumberInput
													onVal={currentLightprobes.boxMin.x}
													item={currentLightprobes}
													field="boxMin"
													valueKey="x"
													forceUpdate={forceUpdate}
													defaultValue={currentLightprobes.boxMax.x - 0.01}
													max={currentLightprobes.boxMax.x - 0.01}
													step={0.01}
													precision={2}
												/>
											</Col>
											<Col span={1}>Y</Col>
											<Col span={6}>
												<NumberInput
													onVal={currentLightprobes.boxMin.y}
													item={currentLightprobes}
													field="boxMin"
													valueKey="y"
													forceUpdate={forceUpdate}
													defaultValue={currentLightprobes.boxMax.y - 0.01}
													max={currentLightprobes.boxMax.y - 0.01}
													step={0.01}
													precision={2}
												/>
											</Col>
											<Col span={1}>Z</Col>
											<Col span={6}>
												<NumberInput
													onVal={currentLightprobes.boxMin.z}
													item={currentLightprobes}
													field="boxMin"
													valueKey="z"
													forceUpdate={forceUpdate}
													defaultValue={currentLightprobes.boxMax.z - 0.01}
													max={currentLightprobes.boxMax.z - 0.01}
													step={0.01}
													precision={2}
												/>
											</Col>
										</Row>
									</Col>
								</Row>
							)}
						</Card>
					</>
				)}
			</div>
		</JMKPanel>
	)
}
export default LightporbesPanel
