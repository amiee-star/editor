import { ModalRef } from "../modal.context"
import React, { useCallback, useEffect, useState } from "react"
import { Button, Card, Form, Input, message, Space } from "antd"
import { CloseOutlined } from "@ant-design/icons"

import { useForm } from "antd/es/form/Form"
interface Props {
	info: any
}
const SettingViewerModal: React.FC<Props & ModalRef<{ info: any }>> = props => {
	const { resolve, reject, modalRef, info } = props
	const [form] = useForm()
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback(data => {
		const { name } = data
		if (info.nameList.indexOf(name) < 0) {
			resolve(name)
			modalRef.current.destroy()
		} else {
			message.error("该名称已存在")
		}
	}, [])
	const onReset = useCallback(() => {
		form.resetFields()
	}, [])
	const [currentTitle, setCurrentTitle] = useState(null)
	useEffect(() => {
		// type  1 tour新增  2 tour修改  3 viewer新增  4 viewer修改
		if (info.type === 1) {
			setCurrentTitle("添加导览路径")
		}
		if (info.type === 2) {
			setCurrentTitle("修改导览路径")
		}
		if (info.type === 3) {
			setCurrentTitle("添加视图")
		}
		if (info.type === 4) {
			setCurrentTitle("修改视图")
		}
	}, [])
	return (
		<Card
			id="SettingViewerModal"
			style={{ width: 300 }}
			title={currentTitle}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} onFinish={onFinish} form={form}>
				<Form.Item
					name="name"
					label="名称"
					rules={[{ required: true, message: "请填写名称" }]}
					initialValue={info.name}
				>
					<Input maxLength={20} />
				</Form.Item>
				<Form.Item wrapperCol={{ span: 16, offset: 8 }}>
					<Space direction="horizontal">
						<Button type="primary" htmlType="reset" onClick={onReset}>
							重置
						</Button>
						<Button type="primary" htmlType="submit">
							确定
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Card>
	)
}

export default SettingViewerModal
