import { assetData } from "@/interfaces/extdata.interface"
import eventBus from "@/utils/event.bus"
import { useForceUpdate } from "@/utils/use.func"
import { Col, Divider, Dropdown, Input, Menu, Radio, Row, Space, Typography } from "antd"
import { groupBy } from "lodash"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "umi"
import ItemSwitch from "../form/item.switch"
import NumberInput from "../form/number.input"
import { aniContext, StateContext, trackItem } from "../provider/ani.context"
import { JMKContext } from "../provider/jmk.context"
import { throttle } from "../transitions/util"
import "./config.ani.less"
// 属性内容
const ConfigAni: React.FC = () => {
	const { state: ANI, dispatch: aniAction } = useContext(aniContext)
	const { state: JMK } = useContext(JMKContext)
	const Intl = useIntl()
	const [currentAsset, setCurrentAsset] = useState<object & assetData>(null)
	// 强制刷新
	const forceUpdate = useForceUpdate()
	useEffect(() => {
		setCurrentAsset(ANI.selectAni?.asset)
	}, [ANI])
	const upDate = useCallback(() => {
		setTimeout(() => {
			forceUpdate()
		}, 0)
	}, [])
	const updateTack = useCallback(() => {
		const { uuid } = currentAsset
		const hasTack = ANI.tackList.filter(m => m.aid === uuid)
		if (hasTack.length) {
			const keyVal = groupBy(
				hasTack.filter(m => m.type !== "fix"),
				m => m.type
			)
			Object.keys(keyVal).map(type => {
				const frameData = keyVal[type][0].data
				const hasFrame = frameData.find(m => m.time === ANI.time)
				const value = currentAsset[type].toArray()
				if (hasFrame) {
					hasFrame.value = value
				} else {
					frameData.push({ time: ANI.time, value })
				}
			})
			aniAction({
				type: "set",
				payload: ANI
			})
		}
	}, [currentAsset, ANI])
	const OldAsset = useRef<assetData>(null)
	useEffect(() => {
		if (!!currentAsset) {
			if (!!OldAsset.current && OldAsset.current !== currentAsset) {
				OldAsset.current.updatedCallback = null
			}
			const action = throttle(updateTack, 2)
			currentAsset.updatedCallback = () => (upDate(), action())
			OldAsset.current = currentAsset
		} else {
			!!OldAsset.current && (OldAsset.current.updatedCallback = null)
		}
	}, [currentAsset, ANI])
	//, ANI, JMK
	// 动画触发
	const selectOpations = [
		{
			label: <FormattedMessage id="jmk.animate.openTrigger" />,
			value: "Default"
		},
		{
			label: <FormattedMessage id="jmk.animate.spaceTrigger" />,
			value: "Distance"
		},
		{
			label: <FormattedMessage id="jmk.animate.timeTrigger" />,
			value: "Time"
		}
	]
	const changeTriggerType = useCallback(
		e => {
			currentAsset.animations[0].trigger.type = e.target.value
			ANI.selectAni.trigger.type = currentAsset.animations[0].trigger.type
			forceUpdate()
		},
		[currentAsset]
	)
	const changeTriggerEnable = useCallback(
		e => {
			ANI.selectAni.trigger.enable = e.enable
			//forceUpdate()
		},
		[currentAsset]
	)

	const changeTriggerPara = useCallback(
		e => {
			ANI.selectAni.trigger.type = currentAsset.animations[0].trigger.type
			ANI.selectAni.trigger.enable = currentAsset.animations[0].trigger.enable
			ANI.selectAni.trigger.threshold = currentAsset.animations[0].trigger.threshold
			forceUpdate()
		},
		[currentAsset]
	)
	return (
		!!currentAsset &&
		ANI.selectAni && (
			<div id="ConfigAni">
				<div className="panel-box">
					<Space className="full-w" direction="vertical">
						<Space direction="horizontal" align="center">
							<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.position" />}:</Typography.Text>
							<Typography.Text type="secondary"></Typography.Text>
						</Space>
						<div>
							<Row gutter={10} align="middle" justify="center">
								<Col span={8}>X</Col>
								<Col span={8}>Y</Col>
								<Col span={8}>Z</Col>
								<Col span={8}>
									<NumberInput
										onVal={currentAsset["asPosition"]["0"]}
										item={currentAsset}
										field="asPosition"
										valueKey={"0"}
										forceUpdate={forceUpdate}
										defaultValue={0}
										precision={3}
										step={0.001}
									/>
								</Col>
								<Col span={8}>
									<NumberInput
										onVal={currentAsset["asPosition"]["1"]}
										item={currentAsset}
										field="asPosition"
										valueKey={"1"}
										defaultValue={0}
										forceUpdate={forceUpdate}
										precision={3}
										step={0.001}
									/>
								</Col>
								<Col span={8}>
									<NumberInput
										onVal={currentAsset["asPosition"]["2"]}
										item={currentAsset}
										field="asPosition"
										valueKey={"2"}
										forceUpdate={forceUpdate}
										defaultValue={0}
										precision={3}
										step={0.001}
									/>
								</Col>
							</Row>
						</div>
					</Space>
					<Divider />
					<Space className="full-w" direction="vertical">
						<Space direction="horizontal" align="center">
							<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.rotate" />}：</Typography.Text>
							<Typography.Text type="secondary"></Typography.Text>
						</Space>
						<div>
							<Row gutter={[10, 0]} align="middle" justify="center">
								<Col span={8}>X</Col>
								<Col span={8}>Y</Col>
								<Col span={8}>Z</Col>
								<Col span={8}>
									<NumberInput
										onVal={currentAsset["asRotation"]["0"]}
										item={currentAsset}
										field="asRotation"
										forceUpdate={forceUpdate}
										valueKey={"0"}
										defaultValue={0}
										precision={3}
										step={0.001}
										// transform="radWithDeg"
									/>
								</Col>
								<Col span={8}>
									<NumberInput
										onVal={currentAsset["asRotation"]["1"]}
										item={currentAsset}
										field="asRotation"
										forceUpdate={forceUpdate}
										valueKey={"1"}
										defaultValue={0}
										precision={3}
										step={0.001}
										// transform="radWithDeg"
									/>
								</Col>
								<Col span={8}>
									<NumberInput
										onVal={currentAsset["asRotation"]["2"]}
										item={currentAsset}
										field="asRotation"
										forceUpdate={forceUpdate}
										valueKey={"2"}
										defaultValue={0}
										precision={3}
										step={0.001}
										// transform="radWithDeg"
									/>
								</Col>
							</Row>
						</div>
					</Space>
					<Divider />
					<Space className="full-w" direction="vertical">
						<Space direction="horizontal" align="center">
							<Typography.Text strong>{<FormattedMessage id="jmk.camera.zoom" />}:</Typography.Text>
							<Typography.Text type="secondary"></Typography.Text>
						</Space>
						<div>
							<Row gutter={10} align="middle" justify="center">
								<Col span={8}>X</Col>
								<Col span={8}>Y</Col>
								<Col span={8}>Z</Col>
								<Col span={8}>
									<NumberInput
										onVal={currentAsset["asScale"]["0"]}
										item={currentAsset}
										field="asScale"
										valueKey={"0"}
										forceUpdate={forceUpdate}
										defaultValue={0}
										precision={3}
										step={0.001}
									/>
								</Col>
								<Col span={8}>
									<NumberInput
										onVal={currentAsset["asScale"]["1"]}
										item={currentAsset}
										field="asScale"
										valueKey={"1"}
										defaultValue={0}
										forceUpdate={forceUpdate}
										precision={3}
										step={0.001}
									/>
								</Col>
								<Col span={8}>
									<NumberInput
										onVal={currentAsset["asScale"]["2"]}
										item={currentAsset}
										field="asScale"
										valueKey={"2"}
										forceUpdate={forceUpdate}
										defaultValue={0}
										precision={3}
										step={0.001}
									/>
								</Col>
							</Row>
						</div>
					</Space>
					<Divider />
					{!!currentAsset.animations?.[0]?.trigger && (
						<>
							<Row gutter={[0, 16]}>
								<Col span={7} className="formLable">
									{<FormattedMessage id="jmk.animate.triggerAnimate" />}：
								</Col>
								<Col span={17}>
									<ItemSwitch
										size="small"
										forceUpdate={forceUpdate}
										item={ANI.selectAni.trigger}
										valueKey="enable"
										// itemChange={changeTriggerEnable}
										// onChange={changeTriggerEnable}
									/>
								</Col>
								{!!currentAsset.animations[0].trigger.enable && (
									<>
										<Col span={24} className="flex-cn">
											<Radio.Group
												size="small"
												value={currentAsset.animations[0].trigger.type}
												buttonStyle="solid"
												onChange={changeTriggerType}
											>
												{selectOpations.map(m => {
													return (
														<Radio.Button key={m.value} value={m.value}>
															{m.label}
														</Radio.Button>
													)
												})}
											</Radio.Group>
										</Col>
										{(currentAsset.animations[0].trigger.type == "Time" ||
											currentAsset.animations[0].trigger.type == "Distance") && (
											<>
												<Col span={7} className="formLable">
													{<FormattedMessage id="jmk.animate.Range" />}
													{currentAsset.animations[0].trigger.type == "Time" ? " (s) " : " (m) "}：
												</Col>
												<Col span={17} className="flex-cn">
													<Input.Group compact size="small">
														<NumberInput
															size="small"
															style={{ width: 70 }}
															onVal={currentAsset.animations[0].trigger["threshold"]["0"]}
															item={currentAsset.animations[0].trigger}
															field="threshold"
															forceUpdate={forceUpdate}
															valueKey={"0"}
															defaultValue={0}
															min={0}
															precision={3}
															step={0.001}
															valueChange={changeTriggerPara}
														/>
														<Input
															className="site-input-split"
															style={{
																width: 20,
																borderLeft: 0,
																borderRight: 0,
																pointerEvents: "none"
															}}
															placeholder="~"
															disabled
														/>
														<NumberInput
															size="small"
															style={{ width: 70 }}
															onVal={currentAsset.animations[0].trigger["threshold"]["1"]}
															item={currentAsset.animations[0].trigger}
															field="threshold"
															valueKey={"1"}
															forceUpdate={forceUpdate}
															defaultValue={0}
															precision={3}
															min={0}
															step={0.001}
															valueChange={changeTriggerPara}
														/>
													</Input.Group>
												</Col>
												<Col span={12} className="flex-cn">
													{<FormattedMessage id="jmk.animation.isDoor" />}：
												</Col>
												<Col span={12}>
													<ItemSwitch size="small" forceUpdate={forceUpdate} item={ANI.selectAni} valueKey="isDoor" />
												</Col>
											</>
										)}
									</>
								)}
							</Row>
						</>
					)}
				</div>
			</div>
		)
	)
}

export default ConfigAni
