import { ModalRef } from "../modal.context"
import React, { useCallback, useRef, useState } from "react"
import { Button, Card, List } from "antd"
import { CheckCircleTwoTone, CloseOutlined } from "@ant-design/icons"
import lsFunc from "@/utils/ls.func"
import { pictureListItem } from "@/interfaces/api.interface"
import commonFunc from "@/utils/common.func"
import CenterMateriallist from "@/components/utils/centermaterial.list"
import serviceLocal from "@/services/service.local"
import classNames from "classnames"
import { useForceUpdate } from "@/utils/use.func"
import "./CenterSelectMedia.Modal.less"
import { FormattedMessage } from "umi"
import urlFunc from "@/utils/url.func"
interface Props {
	info: any
}
const CenterSelectMediaModal: React.FC<Props & ModalRef<any>> = props => {
	const { resolve, reject, modalRef, info } = props
	const paramsRef = useRef({
		// fileType: 1,
		token: lsFunc.getItem("token")
	})
	const [Currentcheckbox, setCurrentcheckbox] = useState(info.custom.detailAlbum)
	const forceUpdate = useForceUpdate()
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	const choiceitem = useCallback(
		item => {
			const number = info.custom.detailAlbum.findIndex((v: any) => v.picId === item.picId)
			if (number > -1) {
				info.custom.detailAlbum.splice(number, 1)
			} else {
				const newAlbum = info.custom.addCustomAlbum()
				newAlbum.picId = item.picId
				if (item.fileType) {
					newAlbum.fileType = item.fileType
					newAlbum.picPath = item.picPath
					newAlbum.videoThumb = item.thumbnail
					newAlbum.link = item.link
					newAlbum.thumbnail = item.thumbnail
					if (item.fileType == 3) {
						newAlbum.videoThumb = item.videoThumb
					}
					if (item.fileType == 15) {
						newAlbum.modelFile = item.modelFile
						newAlbum.modelName = item.name
					}
				} else {
					newAlbum.fileType = 4
					newAlbum.picPath = item.picPath
					newAlbum.videoThumb = item.thumbnail
					newAlbum.link = item.link
					newAlbum.thumbnail = item.thumbnail
				}
			}
			const ringArr = info.custom.detailAlbum.filter((m: { fileType: number }) => m.fileType == 15)
			if (ringArr.length) {
				const mediaArr = info.custom.detailAlbum.filter((m: { fileType: number }) => m.fileType !== 15)
				const newringArr = ringArr[ringArr.length - 1]
				info.custom.detailAlbum = [...mediaArr, newringArr]
			} else {
			}
			setCurrentcheckbox([...info.custom.detailAlbum])
			forceUpdate()
		},
		[Currentcheckbox]
	)

	const itemRender = useCallback(
		(item: pictureListItem) => (
			<List.Item key={item.picId}>
				<div
					className={classNames({
						"item-box": true,
						check: Currentcheckbox.some((m: { picId: string }) => {
							return m.picId === item.picId
						})
					})}
					onClick={() => {
						choiceitem(item)
					}}
				>
					{Currentcheckbox.some((m: { picId: string }) => {
						return m.picId === item.picId
					}) && <CheckCircleTwoTone style={{ fontSize: 30 }} />}

					<div className="item-pic">
						{/* {item.videoThumb ? (
							<img src={commonFunc.thumb(item?.videoThumb, 150)} />
						) : item.thumbnail ? (
							<img src={commonFunc.thumb(item?.thumbnail, 150)} />
						) : (
							<img src={commonFunc.thumb(item?.picPath, 150)} />
                )} */}
						{item.videoThumb ? (
							<img src={urlFunc.replaceUrl(item?.videoThumb, "obs")} />
						) : (
							<img src={urlFunc.replaceUrl(item?.picPath, "obs")} />
						)}
					</div>
					<div className="item-name">{item.name}</div>
				</div>
			</List.Item>
		),
		[Currentcheckbox]
	)
	const getcentermaterial = useCallback(() => {
		resolve(info.custom.detailAlbum)
		modalRef.current.destroy()
	}, [Currentcheckbox])
	return (
		<Card
			id="SelectMediaModal"
			style={{ width: 800, height: 770 }}
			title={<FormattedMessage id="jmk.addmaterial.Choosematerial" />}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<CenterMateriallist
				withFilter
				itemRender={itemRender}
				apiService={serviceLocal.assetsList}
				params={paramsRef.current}
			/>
			<div className="pull-right modelfoot">
				<Button onClick={closeModal}>
					<FormattedMessage id="jmk.addmaterial.cancel" />
				</Button>
				<Button type="primary" onClick={getcentermaterial}>
					<FormattedMessage id="jmk.addmaterial.determine" />
				</Button>
			</div>
		</Card>
	)
}

export default CenterSelectMediaModal
