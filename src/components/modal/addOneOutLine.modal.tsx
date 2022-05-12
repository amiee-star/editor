import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, Space } from "antd"
import React, { useCallback } from "react"
import { FormattedMessage } from "umi"
import { ModalRef } from "./modal.context"
interface Props {
	pid: number
}
interface Item {
	key: number
	pid: number
  title: string
  config?: {
		tour: any
		pic: string
	}
}
const AddDetailsModal: React.FC<Props & ModalRef<Item>> = props => {
	const { resolve, reject, modalRef, pid } = props

	const [form] = Form.useForm()

	// 提交
	const onFinish = useCallback(
		data => {
			if (data.outLineName) {
				const time = new Date().getTime()
				resolve({ title: data.outLineName, key: time, pid, config: { tour: null, pic: "" }  })
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
			title={<FormattedMessage id="jmk.outLine.addClass" />}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onFinish} form={form}>
				<Form.Item
					name="outLineName"
					label={<FormattedMessage id="jmk.outLine.addClass" />}
					rules={[
						{ required: true, message: "请填写分类名称!" },
						{ message: "请输入1-30个文字", max: 30 }
					]}
				>
					<Input />
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

export default AddDetailsModal
