import FormUploads from "@/components/form/form.uploads"
import serviceLocal from "@/services/service.local"
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, Space, Upload } from "antd"
import React, { useCallback } from "react"
import { useForm } from "antd/lib/form/Form"
import { ModalRef } from "../modal.context"
interface Props {
	fileType: number
}
const UpPictureFrameModal: React.FC<Props & ModalRef<any>> = props => {
	const { reject, modalRef, resolve, fileType } = props
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	const onValuesChange = useCallback(data => {}, [])
	const [form] = useForm<any>()
	const onFinish = useCallback(
		data => {
			const { name, corner, banner } = data
			serviceLocal
				.pictureframeadd({
					name,
					corner: corner[0],
					banner: banner[0]
				})
				.then(res => {
					resolve(true)
					modalRef.current.destroy()
				})
		},
		[fileType]
	)
	const onReset = useCallback(data => {
		form.resetFields()
	}, [])
	return (
		<Card
			style={{ width: 300 }}
			title={"画框上传"}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				labelCol={{ span: 10 }}
				wrapperCol={{ span: 14 }}
				onValuesChange={onValuesChange}
				onFinish={onFinish}
				form={form}
			>
				<Form.Item name="name" label="名称">
					<Input />
				</Form.Item>
				<Form.Item label="框角（左上角）" name="corner">
					<FormUploads accept=".png, .jpg, .jpeg" checkType="image" apiService={serviceLocal.upload} size={1} />
				</Form.Item>
				<Form.Item label="框梁（上横梁）" name="banner">
					<FormUploads accept=".png, .jpg, .jpeg" checkType="image" apiService={serviceLocal.upload} size={1} />
				</Form.Item>
				<Form.Item wrapperCol={{ span: 14, offset: 10 }}>
					<Space direction="horizontal">
						<Button type="primary" htmlType="reset" onClick={onReset}>
							重置
						</Button>
						<Button type="primary" htmlType="submit">
							添加
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Card>
	)
}

export default UpPictureFrameModal
