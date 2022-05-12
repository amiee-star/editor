import { ModalRef } from "../modal.context"
import React, { useCallback, useEffect, useState } from "react"
import { Button, Card, Cascader, Form, Input, message, Select, Space } from "antd"
import { CloseOutlined } from "@ant-design/icons"

import { useForm } from "antd/es/form/Form"

import { Base64 } from "js-base64"
import serviceLocal from "@/services/service.local"
import { FormattedMessage } from "@/.umi/plugin-locale/localeExports"

interface Props {}
const SettingPWDModal: React.FC<
	Props & ModalRef<{ name: string; tour?: string; view?: any; password: string; showRoomType: string }>
> = props => {
	const { resolve, reject, modalRef } = props
	const [form] = useForm()
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback(data => {
		const { showRoomData, password, showRoomType } = data
		if (showRoomData.length == 1) {
			resolve({
				name: showRoomData[0],
				showRoomType: showRoomType,
				password: Base64.encode(password)
			})
			modalRef.current.destroy()
		} else if (showRoomData.length == 2) {
			message.error("该导览路径下没有视图，请前往设置")
		} else {
			resolve({
				name: showRoomData[0],
				tour: showRoomData[1],
				view: showRoomData[2],
				showRoomType: showRoomType,
				password: Base64.encode(password)
			})
			modalRef.current.destroy()
		}
	}, [])
	const onReset = useCallback(() => {
		form.resetFields()
	}, [])
	const [options, setOptions] = useState(null)
	useEffect(() => {
		serviceLocal.getShowroomData().then(res => {
			const opations123: any = []
			const data = res.data
			data.forEach(a => {
				a.id = a.name
			})
			getLable(opations123, data)
			setOptions(opations123)
		})
	}, [])
	const getLable = useCallback((arr: any[], data: any) => {
		data.forEach((a: any) => {
			let newarr: any[] = []
			let data111 = {
				value: a.id,
				label: a.name,
				children: newarr
			}
			arr.push(data111)
			!!a.tours && getLable(data111.children, a.tours)
			!!a.views && getLable(data111.children, a.views)
		})
	}, [])
	// 跳转方式
	const selectOpations = [
		{
			label: "定位到导览路劲",
			value: "0"
		},
		{
			label: "定位到视图",
			value: "1"
		}
	]
	return (
		<Card
			id="SettingPWDModal"
			style={{ width: 500 }}
			title="传送门设置"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} onFinish={onFinish} form={form}>
				<Form.Item name="showRoomData" label="展厅信息" rules={[{ required: true, message: "请选择展厅信息" }]}>
					{/* <Input /> */}
					<Cascader options={options} changeOnSelect />
				</Form.Item>
				<Form.Item name="showRoomType" label="定位方式" rules={[{ required: true, message: "请选择定位方式" }]}>
					<Select options={selectOpations}></Select>
				</Form.Item>
				<Form.Item name="password" label="访问密码">
					<Input />
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

export default SettingPWDModal
