import { JMKContext } from "@/components/provider/jmk.context"
import serviceLocal from "@/services/service.local"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, Select, Space } from "antd"
import React, { useCallback, useContext } from "react"
import { FormattedMessage, useIntl } from "umi"
import { ModalRef } from "../modal.context"
interface Props {
	buttonItem: {}
	buttonData: []
}
interface Item {
	key: number
	pid: number
	title: string
}
const editButtonModal: React.FC<Props & ModalRef> = props => {
	const { resolve, reject, modalRef, buttonItem, buttonData } = props
	const Intl = useIntl()
	const [form] = Form.useForm()
	const { state, dispatch: JMKSet } = useContext(JMKContext)
	const typeOpations = [
		{
			label: Intl.formatMessage({ id: "jmk.customButton.typeModal" }),
			value: 0
		},
		{
			label: Intl.formatMessage({ id: "jmk.customButton.typeNew" }),
			value: 1
		}
	]

	// 提交
	const onFinish = useCallback(
		data => {
			if (data.buttonName) {
				// resolve({ title: data.title, key: classItem.key, pid:classItem.pid })
				const newData = {
					buttonName: data.buttonName,
					key: buttonItem.key,
					buttonUrl: data.buttonUrl,
					buttonType: data.buttonType
				}
				const m = buttonData.find(item => item.key == newData.key)
				m.buttonName = newData.buttonName
				m.buttonUrl = newData.buttonUrl
				m.buttonType = newData.buttonType

				serviceLocal.editCustomButton(state.sceneName, buttonData).then(res => {
					if (res.code == "200") {
						resolve("200")
					}
				})
				modalRef.current.destroy()
			}
		},
		[buttonItem.key]
	)
	// 关闭弹窗
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	return (
		<Card
			style={{ width: 600 }}
			title={<FormattedMessage id="jmk.setup.addCustomButton" />}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onFinish} form={form} initialValues={buttonItem}>
				<Form.Item
					name="buttonName"
					label={<FormattedMessage id="jmk.customButton.name" />}
					rules={[
						{ required: true, message: Intl.formatMessage({ id: "jmk.outLine.tip" }) },
						{ message: "请输入1-6个文字", max: 6 }
					]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="buttonUrl"
					label={<FormattedMessage id="jmk.customButton.url" />}
					rules={[{ required: true, message: Intl.formatMessage({ id: "jmk.customButton.urlTip" }) }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					name="buttonType"
					label={<FormattedMessage id="jmk.customButton.type" />}
					rules={[{ required: true, message: Intl.formatMessage({ id: "jmk.customButton.typeTip" }) }]}
				>
					<Select
						style={{ width: 120 }}
						options={typeOpations}
						// onChange={changeType}
					></Select>
				</Form.Item>

				<Form.Item wrapperCol={{ span: 16, offset: 8 }}>
					<Space direction="horizontal">
						<Button type="primary" onClick={closeModal}>
							{<FormattedMessage id="jmk.cancel" />}
						</Button>
						<Button type="primary" htmlType="submit">
							{<FormattedMessage id="jmk.confirm" />}
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Card>
	)
}

export default editButtonModal
