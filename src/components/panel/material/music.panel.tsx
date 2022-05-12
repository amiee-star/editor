import { musicListItem, pictureListItem } from "@/interfaces/api.interface"
import { List } from "antd"
import React, { useCallback, useContext, useRef } from "react"
import Materiallist from "@/components/utils/material.list"
import { JMKContext } from "@/components/provider/jmk.context"
import { contentType, materialType } from "@/constant/jmk.type"
import { useEditHook } from "@/components/jmk/jmk.engine"
import { useMini } from "@/utils/use.func"
import eventBus from "@/utils/event.bus"
import serviceLocal from "@/services/service.local"
import urlFunc from "@/utils/url.func"
import { useIntl } from "umi"
import { AsyncModal, ModalCustom } from "@/components/modal/modal.context"
import DeleteMaterialModal from "@/components/modal/async/deleteMaterial.modal"
import EditMaterialModal from "@/components/modal/async/editMaterial.modal"

const _MusicPanel: React.FC = () => {
	const { state: JMK, dispatch } = useContext(JMKContext)
	const Intl = useIntl()
	const JMKHook = useEditHook()
	const paramsRef = useRef({
		fileType: contentType.MUSIC
	})
	const onDragStart = useCallback(
		(item: musicListItem) => () => {
			JMKHook.addAsset({
				contentType: contentType.MUSIC,
				type: materialType.PIC,
				texture: urlFunc.replaceUrl(item.musicFile, "obs"),
				time: item.time
				// 音乐没有图片
				// thumb: urlFunc.replaceUrl(item.videoThumb)
			}).then(e => {
				e.extdata.info.custom.tag.title = item.name
				e.audioTime = item.time
				e.followCamera = true
				eventBus.emit("jmk.assetAdd", e.asset)
			})
		},
		[JMK]
	)
	// 音频预览
	const previewAudio = useCallback(
		item => (e: React.MouseEvent) => {
			e.stopPropagation()
			return ModalCustom({
				content: () => <audio src={item.musicFile} controls />,
				maskClosable: true
			})
		},
		[]
	)
	// 删除素材
	// const deleteMaterial = useCallback(
	// 	(item: musicListItem) => async () => {
	// 		const newData = await AsyncModal({
	// 			content: DeleteMaterialModal,
	// 			params: {
	// 				id: item.musicId,
	// 				type: contentType.MUSIC
	// 			}
	// 		})
	// 		if (newData == "200") {
	// 			eventBus.emit("jmk.getNewAssets", "200")
	// 		}
	// 	},
	// 	[]
	// )
	// 编辑素材
	// const editMaterial = useCallback(
	// 	(item: pictureListItem) => async () => {
	// 		const newData = await AsyncModal({
	// 			content: EditMaterialModal,
	// 			params: {
	// 				item
	// 				// id:item.picId,
	// 				// type:contentType.PIC,
	// 				// name:item.name,
	// 				// 分类待加
	// 			}
	// 		})
	// 		if (newData == "200") {
	// 			eventBus.emit("jmk.getNewAssets", "200")
	// 		}
	// 	},
	// 	[]
	// )
	const itemRender = useCallback(
		(item: musicListItem) => (
			<List.Item key={item.musicId}>
				<div className="item-box">
					<div className="item-pic">
						<img onDragStart={onDragStart(item)} draggable="true" src={require("@/assets/image/Mp3.png")} />
						{/* <FilePdfOutlined onDragStart={onDragStart(item)} draggable="true" /> */}
						{/* <i className={"iconfont iconshanchu item-delete-m"} onClick={deleteMaterial(item)}></i>
						<i className={"iconfont iconbianji item-edit-m"} onClick={editMaterial(item)}></i> */}
						{/* 预览视频按钮 */}
						<div className="item-previewVideo" onClick={previewAudio(item)}>
							{Intl.formatMessage({
								id: "jmk.preview"
							})}
						</div>
					</div>
					<div className="item-name">{item.name}</div>
				</div>
			</List.Item>
		),
		[JMK]
	)
	return (
		<div id="MusicPanel" className="panel-box">
			<Materiallist
				itemRender={itemRender}
				apiService={serviceLocal.musicList}
				params={paramsRef.current}
				isShowThumbnail={false}
				fileAccept={"audio/*"}
				cardTitle={Intl.formatMessage({
					id: "jmk.upload.audio"
				})}
			/>
		</div>
	)
}

const MusicPanel = useMini(_MusicPanel)
export default MusicPanel
