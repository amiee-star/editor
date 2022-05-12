import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, Select, Space } from "antd"
import React, { useCallback } from "react"
import { FormattedMessage, useIntl } from "umi"
import { ModalRef } from "../modal.context"
interface Props {
	pid: number
}
interface Item {
	key: number

  buttonName: string
  buttonUrl:string
  buttonType:number
  config?: {
		tour: any
		pic: string
	}
}
const AddButtonModal: React.FC<Props & ModalRef<Item>> = props => {
	const { resolve, reject, modalRef, pid } = props
  const Intl = useIntl()
	const [form] = Form.useForm()
  const typeOpations = [
		{
			label:Intl.formatMessage({ id: "jmk.customButton.typeModal" }) ,
			value: 0
		},
		{
			label: Intl.formatMessage({ id: "jmk.customButton.typeNew" }) ,
			value: 1
		},

	]
	// 提交
	const onFinish = useCallback(
		data => {
			if (data.buttonName) {
				const time = new Date().getTime()
				resolve({ buttonName: data.buttonName, key: time, buttonUrl:data.buttonUrl,buttonType:data.buttonType  })
				modalRef.current.destroy()
			}
		},
		[pid]
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
			<Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onFinish} form={form}>
				<Form.Item
					name="buttonName"
					label={<FormattedMessage id="jmk.customButton.name" />}
					rules={[
						{ required: true, message:Intl.formatMessage({ id: "jmk.outLine.tip" }) },
						{ message: "请输入1-6个文字", max: 6 }
					]}
				>
					<Input />
				</Form.Item>
        <Form.Item
					name="buttonUrl"
					label={<FormattedMessage id="jmk.customButton.url" />}
					rules={[
						{ required: true, message:Intl.formatMessage({ id: "jmk.customButton.urlTip" }) },

					]}
				>
					<Input />
				</Form.Item>
        <Form.Item
					name="buttonType"
					label={<FormattedMessage id="jmk.customButton.type" />}
					rules={[
						{ required: true, message:Intl.formatMessage({ id: "jmk.customButton.typeTip" }) },
					]}
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

export default AddButtonModal
