import { useEditHook } from "@/components/jmk/jmk.engine"
import { JMKContext } from "@/components/provider/jmk.context"
import MaterialList from "@/components/utils/material.list"
import { contentType, materialType } from "@/constant/jmk.type"
import { pictureListItem } from "@/interfaces/api.interface"
import serviceLocal from "@/services/service.local"
import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import { useMini } from "@/utils/use.func"
import { Image, List, Tooltip } from "antd"
import React, { useCallback, useContext, useRef } from "react"
import { useIntl } from "umi"

const _GIFPanel: React.FC = () => {
	const { state: JMK } = useContext(JMKContext)
	const Intl = useIntl()
	const JMKHook = useEditHook()
	const paramsRef = useRef({
		fileType: contentType.GIF
	})
	const onDragStart = useCallback(
		(item: pictureListItem) => () => {
			JMKHook.addAsset({
				contentType: contentType.GIF,
				type: materialType.PIC,
				texture: urlFunc.replaceUrl(item.picPath, "temp"),
				delay: item.delay,
				delayImage: item.delayImage ? urlFunc.replaceUrl(item.delayImage) : undefined
				// thumb: urlFunc.replaceUrl(item.picPath)
			}).then(e => {
				e.extdata.info.custom.tag.title = item.name
				eventBus.emit("jmk.assetAdd", e.asset)
			})
		},
		[JMK]
	)
	// 删除素材
	// const deleteMaterial = useCallback(
	// 	(item: pictureListItem) => async () => {
	// 		const newData = await AsyncModal({
	// 			content: DeleteMaterialModal,
	// 			params: {
	// 				id: item.picId,
	// 				type: contentType.GIF
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
						<img onDragStart={onDragStart(item)} draggable="true" src={urlFunc.replaceUrl(item.picPath, "obs")} />
						{/* 预览图片 */}
						<Tooltip
							overlayStyle={{ maxWidth: 500 }}
							title={<Image src={urlFunc.replaceUrl(item.picPath, "obs")} width={400} preview={false} />}
							placement="right"
						>
							<i className={"iconfont iconGroup- item-previewPic"}></i>
						</Tooltip>
						{/* <i className={"iconfont iconshanchu item-delete"} onClick={deleteMaterial(item)}></i>
						<i className={"iconfont iconbianji item-edit"} onClick={editMaterial(item)}></i> */}
					</div>
					<div className="item-name">{item.name}</div>
				</div>
			</List.Item>
		),
		[JMK]
	)

	return (
		<div id="GIFPanel" className="panel-box">
			<MaterialList
				itemRender={itemRender}
				apiService={serviceLocal.assetsList}
				params={paramsRef.current}
				isShowThumbnail={false}
				fileAccept={".gif"}
				cardTitle={Intl.formatMessage({
					id: "jmk.upload.gift"
				})}
				uploadTip={Intl.formatMessage({
					id: "jmk.upload.giftTip"
				})}
			/>
		</div>
	)
}

const GIFPanel = useMini(_GIFPanel)
export default GIFPanel
