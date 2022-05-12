import { ModalRef } from "../modal.context"
import React, { useCallback, useRef } from "react"
import { Button, Card, List } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import lsFunc from "@/utils/ls.func"
import { pictureListItem } from "@/interfaces/api.interface"
import commonFunc from "@/utils/common.func"
import Materiallist from "@/components/utils/material.list"
import serviceScene from "@/services/service.scene"
import urlFunc from "@/utils/url.func"
interface Props {}

const SelectMediaModal: React.FC<Props & ModalRef<any>> = props => {
	const { resolve, reject, modalRef } = props
	const paramsRef = useRef({
		fileType: 1,
		token: lsFunc.getItem("token")
	})
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	const itemRender = useCallback(
		(item: pictureListItem) => (
			<List.Item key={item.picId}>
				<div className="item-box">
					<div className="item-pic">
						<img src={commonFunc.thumb(urlFunc.replaceUrl(item?.picPath, "obs"), 150)} />
					</div>
					<div className="item-name">{item.name}</div>
				</div>
			</List.Item>
		),
		[]
	)
	return (
		<Card
			id="SelectMediaModal"
			style={{ width: 800 }}
			title="选择素材"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Materiallist
				withFilter
				itemRender={itemRender}
				apiService={serviceScene.pictureList}
				params={paramsRef.current}
				isShowThumbnail={false}
			/>
		</Card>
	)
}

export default SelectMediaModal
