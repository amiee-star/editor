import serviceScene from "@/services/service.scene"
import { modelListItem } from "@/interfaces/api.interface"
import { List, message, Tooltip, Image } from "antd"
import React, { useCallback, useContext, useRef } from "react"
import Materiallist from "@/components/utils/material.list"
import { useEditHook } from "@/components/jmk/jmk.engine"
import { JMKContext } from "@/components/provider/jmk.context"
import { contentType, materialType } from "@/constant/jmk.type"
import { useMini } from "@/utils/use.func"
import eventBus from "@/utils/event.bus"
import serviceLocal from "@/services/service.local"
import urlFunc from "@/utils/url.func"
import { FormattedMessage, useIntl } from "umi"
import { AsyncModal } from "@/components/modal/modal.context"
import DeleteMaterialModal from "@/components/modal/async/deleteMaterial.modal"
import EditMaterialModal from "@/components/modal/async/editMaterial.modal"

const _ModelPanel: React.FC = () => {
	const { state: JMK, dispatch } = useContext(JMKContext)
	const JMKHook = useEditHook()
	const paramsRef = useRef({
		// fileType: [contentType.MODEL,contentType.RING].toString()

		fileType: [contentType.MODEL, contentType.RING].toString()
	})
	const Intl = useIntl()
	const onDragStart = useCallback(
		(item: modelListItem) => () => {
			if (item.fileType == 15) {
				JMKHook.addAsset({
					contentType: contentType.PIC,
					type: materialType.PIC,
					texture: urlFunc.replaceUrl(item.thumbnail),
					name: item.name
				}).then(e => {
					e.extdata.info.custom.tag.title = item.name
					e.extdata.info.custom.ringShotUrl = urlFunc.replaceUrl(item.modelFile)
					eventBus.emit("jmk.assetAdd", e.asset)
				})
			} else {
				JMKHook.addAsset({
					contentType: contentType.MODEL,
					type: materialType.GLTF,
					texture: urlFunc.replaceUrl(item.modelFile),
					scale: 0.001,
					thumb: urlFunc.replaceUrl(item.thumbnail),
					name: item.name
				})
					.then(e => {
						e.extdata.info.custom.tag.title = item.name
						eventBus.emit("jmk.assetAdd", e.asset)
					})
					.catch(() => {
						message.error("请检查模型数据")
					})
				// }
			}
		},
		[JMK]
	)
	// 删除素材
	const deleteMaterial = useCallback(
		(item: modelListItem) => async () => {
			const newData = await AsyncModal({
				content: DeleteMaterialModal,
				params: {
					id: item.picId,
					type: item.fileType == 4 ? contentType.MODEL : contentType.RING
				}
			})
			if (newData == "200") {
				eventBus.emit("jmk.getNewAssets", "200")
			}
		},
		[]
	)
	// 编辑素材
	const editMaterial = useCallback(
		(item: pictureListItem) => async () => {
			const newData = await AsyncModal({
				content: EditMaterialModal,
				params: {
					item
					// id:item.picId,
					// type:contentType.PIC,
					// name:item.name,
					// 分类待加
				}
			})
			if (newData == "200") {
				eventBus.emit("jmk.getNewAssets", "200")
			}
		},
		[]
	)
	const itemRender = useCallback(
		(item: modelListItem) => (
			<List.Item key={item.code}>
				<div className="item-box">
					<div className="item-pic">
						<img src={urlFunc.replaceUrl(item.thumbnail)} draggable="true" onDragStart={onDragStart(item)} />
						<Tooltip
							overlayStyle={{ maxWidth: 500 }}
							title={<Image src={urlFunc.replaceUrl(item.thumbnail)} width={400} preview={false} />}
							placement="right"
						>
							<i className={"iconfont iconGroup- item-previewPic"}></i>
						</Tooltip>
						<i className={"iconfont iconshanchu item-delete"} onClick={deleteMaterial(item)}></i>
						<i className={"iconfont iconbianji item-edit"} onClick={editMaterial(item)}></i>
					</div>
					<div className="item-name">{item.name}</div>
					{/* {item.fileType === 4 && <div className="item-ringTip">3D</div>} */}
					<div className="item-ringTip">
						{item.fileType === 4 ? "3D" : Intl.formatMessage({ id: "jmk.material.RingMaterial" })}
					</div>
				</div>
			</List.Item>
		),
		[JMK]
	)

	return (
		<div id="ModelPanel" className="panel-box">
			<Materiallist
				itemRender={itemRender}
				apiService={serviceLocal.assetsList}
				params={paramsRef.current}
				isShowThumbnail={true}
				fileAccept={".jm2"}
				cardTitle={Intl.formatMessage({
					id: "jmk.upload.model"
				})}
				uploadTip={Intl.formatMessage({
					id: "jmk.upload.modelTip"
				})}
			/>
		</div>
	)
}

const ModelPanel = useMini(_ModelPanel)
export default ModelPanel
