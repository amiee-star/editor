import serviceLocal from "@/services/service.local"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, Modal, Space } from "antd"
import React, { useCallback, useEffect } from "react"
import { FormattedMessage, useIntl } from "umi"
import { ModalRef } from "../modal.context"
interface Props {
	id: string
	type: number
	deleteTip?: string
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
const DeleteMaterialModal: React.FC<Props & ModalRef<string>> = props => {
	const { resolve, reject, modalRef, id, type, deleteTip } = props
	const Intl = useIntl()

	// const [form] = Form.useForm()

	// 提交
	// const onFinish = useCallback(
	// 	data => {
	//     const paramsData  = {id:id,type:type}
	//     serviceLocal.deleteAssets(paramsData).then(res => {
	// 			if (res.code == "200") {
	//         resolve(res.code)
	// 			modalRef.current.destroy()
	// 			}
	// 		})
	// 	},
	// 	[id]
	// )
	// 关闭弹窗
	// const closeModal = useCallback(() => {
	// 	reject()
	// 	modalRef.current.destroy()
	// }, [])
	useEffect(() => {
		Modal.confirm({
			title: Intl.formatMessage({ id: "jmk.outLine.tip" }),
			content: deleteTip ? deleteTip : Intl.formatMessage({ id: "jmk.material.deleteTip" }),
			closable: true,
			onOk: () => {
				const paramsData = { id: id, type: type }
				serviceLocal.deleteAssets(paramsData).then(res => {
					if (res.code == "200") {
						resolve(res.code)
						modalRef.current.destroy()
					}
				})
			},
			onCancel() {
				modalRef.current.destroy()
			}
		})
	}, [id])
	return (
		<></>
		// <Card
		// 	style={{ width: 600 }}
		// 	title={<FormattedMessage id="jmk.outLine.tip" />}
		// 	extra={
		// 		<Button size="small" type="text" onClick={closeModal}>
		// 			<CloseOutlined />
		// 		</Button>
		// 	}
		// >
		// 	<Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} onFinish={onFinish} form={form}>

		// 		<div>	{<FormattedMessage id="jmk.material.deleteTip" />}</div>
		// 		<Form.Item wrapperCol={{ span: 16, offset: 8 }}>
		// 			<Space direction="horizontal">
		// 				<Button type="primary" onClick={closeModal}>
		// 					{<FormattedMessage id="jmk.cancel" />}
		// 				</Button>
		// 				<Button type="primary" htmlType="submit">
		// 					{<FormattedMessage id="jmk.confirm" />}
		// 				</Button>
		// 			</Space>
		// 		</Form.Item>
		// 	</Form>
		// </Card>
	)
}

export default DeleteMaterialModal
