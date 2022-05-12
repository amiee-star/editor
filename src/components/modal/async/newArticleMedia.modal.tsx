import { ModalRef } from "../modal.context"
import React, { useCallback, useState } from "react"
import { Button, Card, Form, Input } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import WangEditor from "@/components/editor/wang.editor"
import FormUploads from "@/components/form/form.uploads"
import serviceLocal from "@/services/service.local"
import { FormattedMessage, useIntl } from "umi"
interface Props {
	info: any
}

const ArticleMediaModal: React.FC<Props & ModalRef<any>> = props => {
	const { resolve, reject, modalRef, info } = props
  const [form] = Form.useForm()
  const Intl = useIntl()
	const closeModal = useCallback(() => {
		form.resetFields()
		reject()
		modalRef.current.destroy()
	}, [])
	const layout = {
		labelCol: { span: 4 },
		wrapperCol: { span: 20 }
	}
	const tailLayout = {
		wrapperCol: { offset: 10, span: 4 }
	}
	const onFinish = (values: any) => {
		resolve(values)
		modalRef.current.destroy()
	}
	return (
		<Card
			id="SelectMediaModal"
			style={{ width: 800 }}
			title={<FormattedMessage id="jmk.addmaterial.addArticle" />}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<div>
				<Form
					{...layout}
					name="basic"
					form={form}
					initialValues={{ remember: true }}
					onFinish={onFinish}
					// onFinishFailed={onFinishFailed}
				>
					<Form.Item label={<FormattedMessage id="jmk.title" />} name="title" rules={[{ message: Intl.formatMessage({ id: "jmk.addmaterial.titleTip" }) }]}>
						<Input />
					</Form.Item>
					<Form.Item label={<FormattedMessage id="jmk.addmaterial.content" />} name="content" rules={[{ required: true, message: Intl.formatMessage({ id: "jmk.addmaterial.contentTip" }) }]}>
						<WangEditor />
					</Form.Item>
					<Form.Item label="Pdf" name="pdf">
						<FormUploads apiService={serviceLocal.upload} size={1} accept=".pdf" checkType="pdf" />
					</Form.Item>
					<Form.Item {...tailLayout}>
						<Button htmlType="button" onClick={closeModal} size="small">
            {Intl.formatMessage({ id: "jmk.addmaterial.cancel" })}
						</Button>
						<Button type="primary" htmlType="submit" size="small" style={{ marginLeft: "30px" }}>
            {Intl.formatMessage({ id: "jmk.addmaterial.determine" })}
						</Button>
					</Form.Item>
				</Form>
			</div>
		</Card>
	)
}

export default ArticleMediaModal
