import { useEditHook } from "@/components/jmk/jmk.engine"
import { AsyncModal } from "@/components/modal/modal.context"
import { JMKContext } from "@/components/provider/jmk.context"
import { panelContext } from "@/components/provider/panel.context"
import MaterialList from "@/components/utils/material.list"
import { contentType, materialType } from "@/constant/jmk.type"
import { pictureListItem } from "@/interfaces/api.interface"
import serviceLocal from "@/services/service.local"
import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import { useMini } from "@/utils/use.func"
import { Row, Col, List } from "antd"

import React, { useCallback, useContext, useMemo, useRef } from "react"
import { FormattedMessage, useIntl } from "umi"
import DeleteMaterialModal from "@/components/modal/async/deleteMaterial.modal"
import EditMaterialModal from "@/components/modal/async/editMaterial.modal"

const _HotPanel: React.FC = () => {
	const Intl = useIntl()
	const { state } = useContext(panelContext)
	const { state: JMK, dispatch } = useContext(JMKContext)
	const JMKHook = useEditHook()
	const defultImg = require("@/assets/image/hot.png")
	const onDragStart = useCallback(() => {
		JMKHook.addAsset({
			contentType: contentType.PIC,
			type: materialType.HOTPOINT,
			texture: urlFunc.replaceUrl("/pictures/202204241618499612613.png", "temp")
		}).then(e => {
			eventBus.emit("jmk.assetAdd", e.asset)
			e.extdata.info.custom.tag.length = 0.3
			e.extdata.info.custom.tag.showTitle = true
			// e.extdata.info.custom.tag.texture = window.publicPath + "image/hoticon/hotSystem1.png"
			// e.extdata.info.custom.tag.texture = urlFunc.replaceUrl("/pictures/202204241618499612613.png", "temp")
			e.extdata.info.custom.tag.visible = true
		})
	}, [JMK])

	//!!!!!
	const paramsRef = useRef({
		fileType: contentType.HOTPOINT
	})
	// const onDragStart = useCallback(
	// 	item => () => {
	// 		JMKHook.addAsset({
	// 			contentType: contentType.PIC,
	// 			type: materialType.HOTPOINT,
	// 			texture: urlFunc.replaceUrl(item.picPath)
	// 			// thumb: urlFunc.replaceUrl(item.picPath)
	// 		}).then(e => {
	// 			eventBus.emit("jmk.assetAdd", e.asset)
	// 			e._texture = urlFunc.replaceUrl(item.picPath)
	// 			e.extdata.info.custom.tag.title = item.name
	// 			e.extdata.info.custom.tag.length = 0.3
	// 			e.extdata.info.custom.tag.showTitle = true
	// 			e.extdata.info.custom.tag.color = "#ffffff"
	// 			// e.extdata.info.custom.tag.texture = window.publicPath + "image/hoticon/hotSystem1.png"
	// 			e.extdata.info.custom.tag.texture = urlFunc.replaceUrl(item.picPath)
	// 			e.extdata.info.custom.tag.visible = false
	// 			e.extdata.info.custom.tag.enable = true
	// 		})
	// 	},
	// 	[JMK]
	// )
	// 删除素材
	// const deleteMaterial = useCallback(
	// 	(item: pictureListItem) => async () => {
	// 		const newData = await AsyncModal({
	// 			content: DeleteMaterialModal,
	// 			params: {
	// 				id: item.picId,
	// 				type: contentType.HOTPOINT
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
	// const itemRender = useCallback(
	// 	(item: pictureListItem) => (
	// 		<List.Item key={item.picId}>
	// 			<div className="item-box">
	// 				<div className="item-pic">
	// 					{/* onDragStart={onDragStart(item)} */}
	// 					<img draggable="true" onDragStart={onDragStart(item)} src={urlFunc.replaceUrl(item.picPath)} />
	// 					<i className={"iconfont iconshanchu item-delete-m"} onClick={deleteMaterial(item)}></i>
	// 					<i className={"iconfont iconbianji item-edit-m"} onClick={editMaterial(item)}></i>
	// 				</div>
	// 				<div className="item-name">{item.name}</div>
	// 			</div>
	// 		</List.Item>
	// 	),
	// 	[JMK]
	// )
	return (
		<div id="HotPanel" className="panel-box">
			<div className="list-box">
				<Row>
					<Col span={12}>
						<div className="item-box">
							<div className="item-pic">
								<img onDragStart={onDragStart} draggable="true" src={defultImg} width="100" height="100" />
							</div>
							<div className="item-label">{<FormattedMessage id="jmk.addmaterial.Addhotspot" />}</div>
						</div>
					</Col>
				</Row>
			</div>

			{/* <MaterialList
				itemRender={itemRender}
				apiService={serviceLocal.assetsList}
				params={paramsRef.current}
				isShowThumbnail={false}
				fileAccept={"image/*"}
				cardTitle={Intl.formatMessage({
					id: "jmk.upload.hotPoint"
				})}
			/> */}
		</div>
	)
}

const HotPanel = useMini(_HotPanel)
export default HotPanel
