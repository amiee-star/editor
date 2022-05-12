import serviceScene from "@/services/service.scene"
import commonFunc from "@/utils/common.func"
import lsFunc from "@/utils/ls.func"
import { pictureListItem } from "@/interfaces/api.interface"
import { List, Tooltip, Image } from "antd"
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

const _VideoPanel: React.FC = () => {
	const { state: JMK, dispatch } = useContext(JMKContext)
	const Intl = useIntl()
	const JMKHook = useEditHook()
	const paramsRef = useRef({
		fileType: contentType.MP4
	})
	const onDragStart = useCallback(
		(item: pictureListItem) => () => {
			JMKHook.addAsset({
				contentType: contentType.MP4,
				type: materialType.PIC,
				texture: urlFunc.replaceUrl(item.picPath, "obs"),
				thumb: urlFunc.replaceUrl(item.videoThumb, "obs")
			}).then(e => {
				e.extdata.info.custom.tag.title = item.name
				eventBus.emit("jmk.assetAdd", e.asset)
			})
		},
		[JMK]
	)
	// 视频预览
	const previewVideo = useCallback(
		item => (e: React.MouseEvent) => {
			// ModalCustom({
			// 	content: PreviewModal,
			// 	params: {
			//     type:"video",
			//     url:item.picPath
			// 	}
			// })

			e.stopPropagation()
			ModalCustom({
				content: () => (
					<video
						id={"videoPreview"}
						controls
						src={urlFunc.replaceUrl(item.picPath, "obs")}
						style={{ maxWidth: 800, maxHeight: 500 }}
						autoPlay
					/>
				),
				maskClosable: true
			})
		},
		[]
	)
	// 删除素材
	// const deleteMaterial = useCallback(
	// 	(item: pictureListItem) => async () => {
	// 		const newData = await AsyncModal({
	// 			content: DeleteMaterialModal,
	// 			params: {
	// 				id: item.picId,
	// 				type: contentType.MP4
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
		(item: pictureListItem) => (
			<List.Item key={item.picId}>
				<div className="item-box">
					<div className="item-pic">
						<img onDragStart={onDragStart(item)} draggable="true" src={urlFunc.replaceUrl(item.videoThumb, "obs")} />
						<Tooltip
							overlayStyle={{ maxWidth: 500 }}
							title={<Image src={urlFunc.replaceUrl(item.videoThumb, "obs")} width={400} preview={false} />}
							placement="right"
						>
							<i className={"iconfont iconGroup- item-previewPic"}></i>
						</Tooltip>
						{/* <i className={"iconfont iconshanchu item-delete"} onClick={deleteMaterial(item)}></i>
						<i className={"iconfont iconbianji item-edit"} onClick={editMaterial(item)}></i> */}
						{/* 预览视频按钮 */}
						<div className="item-previewVideo" onClick={previewVideo(item)}>
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
		<div id="VideoPanel" className="panel-box">
			<Materiallist
				itemRender={itemRender}
				apiService={serviceLocal.assetsList}
				params={paramsRef.current}
				isShowThumbnail={true}
				fileAccept={"video/*"}
				cardTitle={Intl.formatMessage({
					id: "jmk.upload.video"
				})}
				uploadTip={Intl.formatMessage({
					id: "jmk.upload.videoTip"
				})}
			/>
		</div>
	)
}

const VideoPanel = useMini(_VideoPanel)
export default VideoPanel
