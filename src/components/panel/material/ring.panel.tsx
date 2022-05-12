import serviceScene from "@/services/service.scene"
import { modelListItem } from "@/interfaces/api.interface"
import { List, message } from "antd"
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

const _RingPanel: React.FC = () => {
	const { state: JMK, dispatch } = useContext(JMKContext)
	const JMKHook = useEditHook()
	const paramsRef = useRef({
		fileType: contentType.RING
	})
	const Intl = useIntl()
	const onDragStart = useCallback(
		(item: modelListItem) => () => {
			message.warning(Intl.formatMessage({ id: "jmk.public.isRingTip" }))
			// JMKHook.addAsset({
			// 	contentType: contentType.MODEL,
			// 	type: materialType.GLTF,
			// 	texture: urlFunc.replaceUrl(item.modelFile),
			// 	scale: 0.001,
			// 	thumb: urlFunc.replaceUrl(item.thumbnail),
			// 	name: item.name
			// })
			// 	.then(e => {
			// 		e.extdata.info.custom.tag.title = item.name
			// 		eventBus.emit("jmk.assetAdd", e.asset)
			// 	})
			// 	.catch(() => {
			// 		message.error("请检查模型数据")
			// 	})
		},
		[JMK]
	)
	const itemRender = useCallback(
		(item: modelListItem) => (
			<List.Item key={item.code}>
				<div className="item-box">
					<div className="item-pic">
						<img src={urlFunc.replaceUrl(item.thumbnail)} draggable="true" onDragStart={onDragStart(item)} />
					</div>
					<div className="item-name">{item.name}</div>
					{/* <div className="item-ringTip">3D</div> */}
				</div>
			</List.Item>
		),
		[JMK]
	)

	return (
		<div id="RingPanel" className="panel-box">
			<Materiallist
				itemRender={itemRender}
				apiService={serviceLocal.assetsList}
				params={paramsRef.current}
				isShowThumbnail={true}
				fileAccept={".zip,.rar"}
			/>
		</div>
	)
}

const RingPanel = useMini(_RingPanel)
export default RingPanel
