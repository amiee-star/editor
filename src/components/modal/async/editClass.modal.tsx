import { JMKContext } from "@/components/provider/jmk.context"
import serviceLocal from "@/services/service.local"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, Space } from "antd"
import React, { useCallback, useContext } from "react"
import { FormattedMessage } from "umi"
import { ModalRef } from "../modal.context"
interface Props {
	classItem: {}
	treeData: []
}
interface Item {
	key: number
	pid: number
	title: string
}
const editClassModal: React.FC<Props & ModalRef> = props => {
	const { resolve, reject, modalRef, classItem, treeData } = props
	const [form] = Form.useForm()
	const { state, dispatch: JMKSet } = useContext(JMKContext)
	// 提交
	const onFinish = useCallback(
		data => {
			if (data.title) {
				// resolve({ title: data.title, key: classItem.key, pid:classItem.pid })
				const newData = { title: data.title, key: classItem.key, pid: classItem.pid }
				const m = treeData.find(item => item.key == newData.key)
				m.title = newData.title

				serviceLocal.editClassify(state.sceneName, treeData).then(res => {
					if (res.code == "200") {
						resolve("200")
					}
				})
				modalRef.current.destroy()
			}
		},
		[classItem]
	)
	// 关闭弹窗
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	return (
		<Card
			style={{ width: 600 }}
			title={<FormattedMessage id="jmk.setup.editClass" />}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onFinish} form={form} initialValues={classItem}>
				<Form.Item
					name="title"
					label={<FormattedMessage id="jmk.setup.editClass" />}
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

export default editClassModal
