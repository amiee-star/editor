import { FormattedMessage } from "@/.umi/plugin-locale/localeExports"
import { useEditHook } from "@/components/jmk/jmk.engine"
import { aniContext } from "@/components/provider/ani.context"
import { JMKContext } from "@/components/provider/jmk.context"
import { aniData } from "@/interfaces/ani.interface"
import serviceAnimation from "@/services/service.animation"
import {
	FastBackwardOutlined,
	StepBackwardOutlined,
	CaretRightOutlined,
	StepForwardOutlined,
	FastForwardOutlined,
	SaveOutlined,
	ReadOutlined,
	PauseOutlined
} from "@ant-design/icons"
import { Row, Col, Space, Button, Input, Select, InputNumber, Tooltip, Typography, message } from "antd"
import React, { useCallback, useContext, useState } from "react"
// 动画编辑器头部操作栏
const PlayControl: React.FC = () => {
	const JMKHook = useEditHook()
	const { state: JMK } = useContext(JMKContext)
	const { state: ANI, dispatch: aniAction } = useContext(aniContext)
	const typeChange = useCallback((val: string) => {
		aniAction({
			type: "set",
			payload: {
				lineType: val
			}
		})
	}, [])
	const frameChange = useCallback((val: number) => {
		aniAction({
			type: "set",
			payload: {
				time: val
			}
		})
	}, [])
	const timeChange = useCallback(
		(val: number) => {
			aniAction({
				type: "set",
				payload: {
					time: val * ANI.sample
				}
			})
		},
		[ANI.sample]
	)
	// 保存操作
	const saveAction = useCallback(() => {
		if (JMK.editHook) {
			const allAnimations: aniData[] = JMKHook.getAnimationsJson()
			serviceAnimation
				.setAnimation({
					id: JMK.sceneName,
					animation: allAnimations.filter(m => m.channels.length).map((m: any) => ({ ...m, sampleFrame: ANI.sample }))
				})
				.then(res => {})
		}
	}, [ANI, JMK])
	const PlayAnimation = useCallback(() => {
		const num = ANI.tackList.find(item => item.data.length > 1)
		if (num) {
			aniAction({
				type: "set",
				payload: {
					isPlay: !ANI.isPlay
				}
			})
		} else {
			message.error("请编辑动画！")
		}

		// JMKHook.animationPlay(ANI.selectAni?.asset, Number(ANI.model))
	}, [ANI.isPlay, ANI.tackList])
	const boxHeightChange = useCallback(
		(val: number) => {
			ANI.layout.boxHeight = val
			aniAction({
				type: "set"
			})
		},
		[ANI.layout]
	)
	return (
		<Row justify="center" align="middle">
			<Col>
				<Space direction="horizontal">
					<Button type="text" icon={<FastBackwardOutlined />} />
					<Button type="text" icon={<StepBackwardOutlined />} />
					<Button type="text" icon={!ANI.isPlay ? <CaretRightOutlined /> : <PauseOutlined />} onClick={PlayAnimation} />
					<Button type="text" icon={<StepForwardOutlined />} />
					<Button type="text" icon={<FastForwardOutlined />} />
					<Input.Group compact>
						<Select value={ANI.lineType} dropdownMatchSelectWidth={false} onChange={typeChange}>
							<Select.Option value="time">{<FormattedMessage id="jmk.animation.time" />}</Select.Option>
							<Select.Option value="frame">{<FormattedMessage id="jmk.animation.frame" />}</Select.Option>
						</Select>
						<InputNumber
							style={{
								display: ANI.lineType === "time" ? "none" : "inline-block"
							}}
							precision={0}
							min={0}
							step={1}
							value={ANI.time}
							onChange={frameChange}
						/>
						<InputNumber
							style={{
								display: ANI.lineType === "frame" ? "none" : "inline-block"
							}}
							step={0.01}
							min={0}
							precision={2}
							value={ANI.time / ANI.sample}
							onChange={timeChange}
						/>
					</Input.Group>
					<Typography.Text type="secondary">{<FormattedMessage id="jmk.animation.height" />}:</Typography.Text>
					<InputNumber
						value={ANI.layout.boxHeight}
						onChange={boxHeightChange}
						step={1}
						min={260}
						max={400}
						precision={0}
					/>
					<Tooltip title="保存">
						<Button type="text" icon={<SaveOutlined />} onClick={saveAction} />
					</Tooltip>
					<Tooltip title="帮助">
						<Button type="text" icon={<ReadOutlined />} />
					</Tooltip>
				</Space>
			</Col>
		</Row>
	)
}

export default PlayControl
