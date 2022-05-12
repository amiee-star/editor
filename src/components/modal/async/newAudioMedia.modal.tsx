import FormUploads from "@/components/form/form.uploads"
import { baseRes } from "@/interfaces/api.interface"
import serviceLocal from "@/services/service.local"
import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, Space, Upload } from "antd"
import { useForm } from "antd/lib/form/Form"
import { UploadFile } from "antd/lib/upload/interface"
import React, { useCallback } from "react"
import { ModalRef } from "../modal.context"
interface Props {
	info: any
}
const AudioUploadModal: React.FC<Props & ModalRef<any>> = props => {
	const { reject, modalRef, resolve } = props
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	const onValuesChange = useCallback(data => {}, [])
	const [form] = useForm<any>()
	const onFinish = useCallback(data => {
		const { name, file } = data
		serviceLocal
			.assetsAddaudio({
				name,
				type: 11,
				musicFile: urlFunc.replaceUrl(file[0], "api")
			})
			.then(res => {
				eventBus.emit("jmk.assetsAddaudio", res.code)
				resolve(true)
				modalRef.current.destroy()
			})
	}, [])

	const onReset = useCallback(data => {
		form.resetFields()
	}, [])

	// 上传音乐
	const uploadFile = useCallback((file: UploadFile<baseRes<string>>) => {
		form.setFields([{ name: "name", value: file.name }])
	}, [])

	return (
		<Card
			style={{ width: 300 }}
			title={"音乐上传"}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				onValuesChange={onValuesChange}
				onFinish={onFinish}
				form={form}
			>
				<Form.Item name="name" label="名称" rules={[{ required: true, message: "请填写音乐名称!" }]}>
					<Input />
				</Form.Item>
				<Form.Item label="mp3文件" name="file" rules={[{ required: true, message: "请上传音乐文件!" }]}>
					<FormUploads apiService={serviceLocal.upload} size={1} onChangeProps={uploadFile} accept="audio/*" />
				</Form.Item>
				<Form.Item wrapperCol={{ span: 16, offset: 8 }}>
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

export default AudioUploadModal
