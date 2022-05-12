import { Form, Checkbox, Input, Button, Select, Modal } from "antd"
import React, { useCallback, useContext, useMemo, useRef, useState } from "react"
import { JMKContext } from "@/components/provider/jmk.context"
import { useMini } from "@/utils/use.func"
import { FormattedMessage, useIntl } from "umi"
import { EditOutlined } from "@ant-design/icons"
import { panelContext } from "../provider/panel.context"
interface Props {
	showNade: any
	ischanged?: boolean
	onFinish?: Function
	form: any
	modalRef: any
}
const _HallFunction: React.FC<Props> = props => {
	const { showNade, ischanged, modalRef, onFinish, form } = props
	const { state: JMK, dispatch: JMKSet } = useContext(JMKContext)
	const { state: panelState, dispatch } = useContext(panelContext)
	const Intl = useIntl()
	const tourList: any[] = useMemo(() => JMK.editHook?.getTours() || [], [JMK.editHook])
	// const [ischanged, setIsChanged] = useState(false)
	const [tipModalShow, setTipModalShow] = useState(false)

	const showOutLine = useCallback(() => {
		if (!!ischanged) {
			setTipModalShow(true)
		} else {
			modalRef.current.destroy()
			JMK.editHook &&
				dispatch({
					type: "set",
					payload: {
						current: "outline"
					}
				})
		}
		// JMK.editHook &&
		// 	dispatch({
		// 		type: "set",
		// 		payload: {
		// 			current: "outline"
		// 		}
		// 	})
	}, [JMK, ischanged])
	// 保存信息
	const saveSetUp = useCallback(() => {
		form.submit()
		setTipModalShow(false)

		JMK.editHook &&
			dispatch({
				type: "set",
				payload: {
					current: "outline",
					action: "edit"
				}
			})
	}, [JMK])
	// 取消保存信息
	const noSaveSetUp = useCallback(() => {
		setTipModalShow(false)
	}, [])
	return (
		<>
			{/* <Form.Item label={<FormattedMessage id="jmk.minimap.Halloutline" />}>
				<Form.Item name={["outline", "show"]} noStyle valuePropName="checked">
					<Checkbox style={{ lineHeight: "32px" }}>{<FormattedMessage id="jmk.minimap.Starthalloutline" />}</Checkbox>
				</Form.Item>
				<Form.Item noStyle>
					<Button icon={<EditOutlined />} type="text" onClick={showOutLine}></Button>
				</Form.Item>
			</Form.Item> */}
			{/* 弹幕 */}
			<Form.Item label={<FormattedMessage id="jmk.danmu.open" />}>
				<Form.Item name="danmu" noStyle valuePropName="checked">
					<Checkbox style={{ lineHeight: "32px" }}>{<FormattedMessage id="jmk.danmu.openTip" />}</Checkbox>
				</Form.Item>
				<Form.Item name="isMessage" noStyle valuePropName="checked">
					<Checkbox style={{ lineHeight: "32px" }}>{<FormattedMessage id="jmk.isMessage.openTip" />}</Checkbox>
				</Form.Item>
				<Form.Item name="isShare" noStyle valuePropName="checked">
					<Checkbox style={{ lineHeight: "32px" }}>{<FormattedMessage id="jmk.isShare.openTip" />}</Checkbox>
				</Form.Item>
				<Form.Item name="isLikes" noStyle valuePropName="checked">
					<Checkbox style={{ lineHeight: "32px" }}>{<FormattedMessage id="jmk.isLike.openTip" />}</Checkbox>
				</Form.Item>
			</Form.Item>
			{/* 留言 */}

			{/* 点位切换按钮 */}
			<Form.Item label={<FormattedMessage id="jmk.trigger.spot" />}>
				<Form.Item name={["spotSwitchBtn", "show"]} noStyle valuePropName="checked">
					<Checkbox style={{ lineHeight: "32px" }}>{<FormattedMessage id="jmk.danmu.triggerTip" />}</Checkbox>
				</Form.Item>
			</Form.Item>
			{/* 导览路径 */}
			<Form.Item label={<FormattedMessage id="jmk.tour.setUp" />}>
				<Form.Item name={["openTour", "show"]} noStyle valuePropName="checked">
					<Checkbox style={{ lineHeight: "32px" }}>{<FormattedMessage id="jmk.tour.open" />}</Checkbox>
				</Form.Item>
				<Form.Item name={["openTour", "tour"]} noStyle hidden={!showNade.openTour}>
					<Select
						options={tourList.map(item => {
							return {
								label: item.name,
								value: item.id
							}
						})}
					/>
				</Form.Item>
				<Form.Item name={["openTour", "changeBGM"]} noStyle valuePropName="checked" hidden={!showNade.openTour}>
					<Checkbox style={{ lineHeight: "32px" }}>{<FormattedMessage id="jmk.tour.suspendBGM" />}</Checkbox>
				</Form.Item>
			</Form.Item>
			{/* 引导页 */}
			<Form.Item label={<FormattedMessage id="jmk.setup.beginnerGuidance" />}>
				<Form.Item name={["guidePage", "show"]} noStyle valuePropName="checked">
					<Checkbox style={{ lineHeight: "32px" }}>
						{<FormattedMessage id="jmk.setup.startBeginnerGuidance" />}
					</Checkbox>
				</Form.Item>
			</Form.Item>
			<Modal
				title={Intl.formatMessage({ id: "jmk.outLine.tip" })}
				visible={tipModalShow}
				onOk={saveSetUp}
				onCancel={noSaveSetUp}
				okText={<FormattedMessage id="jmk.confirm" />}
				cancelText={<FormattedMessage id="jmk.cancel" />}
			>
				{Intl.formatMessage({ id: "jmk.outLine.savetip" })}
			</Modal>
		</>
	)
}

const HallFunction = useMini(_HallFunction)
export default HallFunction
