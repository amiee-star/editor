import { ModalRef } from "../modal.context"
import NewArticleMediaModal from "@/components/modal/async/newArticleMedia.modal"
import React, { useCallback, useMemo, useState } from "react"
import { Button, Card, Dropdown, Menu } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import ArticListTable from "@/components/utils/articlelist.table"
import serviceScene from "@/services/service.scene"
import { AsyncModal } from "@/components/modal/modal.context"
import { useForceUpdate } from "@/utils/use.func"
import serviceLocal from "@/services/service.local"
import eventBus from "@/utils/event.bus"
import { FormattedMessage } from "umi"
import MaterialUploadModal from "./material.upload"
interface Props {
	info: any
}

const ArticleMediaModal: React.FC<Props & ModalRef<any>> = props => {
	const { resolve, reject, modalRef, info } = props
	const forceUpdate = useForceUpdate()
	const [Currentcheckbox, setCurrentcheckbox] = useState({
		id: info.custom.detailArticle.id,
		title: info.custom.detailArticle.title
	})
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	const getArticle = useCallback(() => {
		resolve(Currentcheckbox)
		modalRef.current.destroy()
	}, [Currentcheckbox])
	// const newModal = useCallback(async () => {
	// 	const selectData: any = await AsyncModal({
	// 		content: NewArticleMediaModal,
	// 		params: { info }
	// 	})
	// 	console.log(selectData, "selectData")
	// 	// if (selectData.title && selectData.content) {
	// 	if (selectData.content) {
	// 		serviceLocal
	// 			.assetsAddarticle({
	// 				title: selectData.title ? selectData.title : "",
	// 				content: selectData.content,
	// 				pdf: selectData.pdf?.[0] || "",
	// 				type: 12
	// 			})
	// 			.then(res => {
	// 				// resolve(true)
	// 				eventBus.emit("jmk.assetsAddarticle", res.code)
	// 				forceUpdate()
	// 				// modalRef.current.destroy()
	// 			})
	// 	}
	// 	// info.custom.detailArticle = selectData
	// 	forceUpdate()
	// }, [])
	// const uploadPdf = useCallback(async () => {
	// 	const done = await AsyncModal({
	// 		content: MaterialUploadModal,
	// 		params: {
	// 			fileType: 1,
	// 			isShowThumbnail: false,
	// 			fileAccept: ".pdf",
	// 			checkType: "pdf"
	// 		}
	// 	})
	// 	if (!!done) {
	// 		const { file, name } = done
	// 		serviceLocal
	// 			.assetsAddarticle({
	// 				title: name,
	// 				pdf: file,
	// 				type: 13
	// 			})
	// 			.then(res => {
	// 				eventBus.emit("jmk.assetsAddarticle", res.code)
	// 				forceUpdate()
	// 			})
	// 	}
	// 	forceUpdate()
	// }, [])
	const columns = [
		{
			title: "id",
			dataIndex: "id",
			key: "id"
		},
		{
			title: <FormattedMessage id="jmk.type" />,
			dataIndex: <FormattedMessage id="jmk.addmaterial.article" />,
			key: "id",
			render: () => {
				return <FormattedMessage id="jmk.addmaterial.article" />
			}
		},
		{
			title: <FormattedMessage id="jmk.name" />,
			dataIndex: "title",
			key: "title"
		}
	]
	// const menu = useMemo(
	// 	() => (
	// 		<Menu>
	// 			<Menu.Item onClick={newModal}>普通文章</Menu.Item>
	// 			<Menu.Item onClick={uploadPdf}>Pdf</Menu.Item>
	// 		</Menu>
	// 	),
	// 	[]
	// )
	return (
		<Card
			id="SelectMediaModal"
			style={{ width: 800 }}
			title={<FormattedMessage id="jmk.addmaterial.Selectarticles" />}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<ArticListTable
				columns={columns}
				apiService={serviceLocal.articleList}
				rowSelection={{
					selectedRowKeys: [Currentcheckbox.id],
					onChange: (keys, data) => {
						if (data.length > 0) {
							setCurrentcheckbox(data[data.length - 1])
						} else {
							setCurrentcheckbox({ id: null, title: null })
						}
					},
					hideSelectAll: true
				}}
			/>
			<div className="pull-right">
				{/* <Dropdown overlay={menu} placement="topRight" arrow> */}
				{/* <Button size="small" onClick={newModal}>
					<FormattedMessage id="jmk.newlightprobes" />
				</Button> */}
				{/* </Dropdown> */}
				<Button size="small" onClick={closeModal}>
					<FormattedMessage id="jmk.cancel" />
				</Button>
				<Button size="small" type="primary" onClick={getArticle}>
					<FormattedMessage id="jmk.confirm" />
				</Button>
			</div>
		</Card>
	)
}

export default ArticleMediaModal
