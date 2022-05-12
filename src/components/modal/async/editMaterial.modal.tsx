import serviceLocal from "@/services/service.local"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, Row, Space, Typography } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { FormattedMessage } from "umi"
import { ModalRef } from "../modal.context"
interface Props {
	// id:string,
	// type:number,
	// name:string
	item: any
}
interface Item {
	key: number
	pid: number
	title: string
	config: {
		tour: any
		pic: string
	}
}
const EditMaterialModal: React.FC<Props & ModalRef<string>> = props => {
	const { resolve, reject, modalRef, item } = props

	const [form] = Form.useForm()
	const [nameLength, setNameLength] = useState(0)
	useEffect(() => {
		setNameLength(item.name.length)
	}, [item])
	const onValuesChange = useCallback(data => {
		if (!!data.name) {
			setNameLength(data.name.length)
		}
	}, [])
	// 提交
	const onFinish = useCallback(data => {
		const paramsData = { id: item.fileType == 11 ? item.musicId : item.picId, type: item.fileType, name: data.name }
		serviceLocal.editAssets(paramsData).then(res => {
			if (res.code == "200") {
				resolve(res.code)
				modalRef.current.destroy()
			}
		})
	}, [])
	// 关闭弹窗
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	return (
		<Card
			style={{ width: 400 }}
			title={<FormattedMessage id="jmk.outLine.tip" />}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				labelCol={{ span: 4 }}
				wrapperCol={{ span: 20 }}
				onFinish={onFinish}
				form={form}
				initialValues={item}
				onValuesChange={onValuesChange}
			>
				<Form.Item
					label={<FormattedMessage id="jmk.name" />}
					name={"name"}
					rules={[
						{
							message: <FormattedMessage id="jmk.minimap.Pleaseenteraname" />
						}
					]}
				>
					<Input maxLength={20} />
					{/* <Typography.Text strong>{nameLength}/20</Typography.Text> */}
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

export default EditMaterialModal
