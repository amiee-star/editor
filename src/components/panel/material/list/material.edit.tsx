import { useMini } from "@/utils/use.func"
import React, { useContext, useMemo } from "react"
import { Empty } from "antd"
import { contentType, materialType } from "@/constant/jmk.type"
import ImageEditPanel from "../image.edit.panel"
import GIFEditPanel from "../gif.edit.panel"
import VideoEditPanel from "../video.edit.panel"
import ModelEditPanel from "../model.edit.panel"
import TextEditPanel from "../text.edit.panel"
import HotEditPanel from "../hot.edit.panel"
import AnimaEditPanel from "../animation.edit.panel"
import BeamEditPanel from "../beam.edit.panel"
import MusicEditPanel from "../music.edit.panel"
import "./material.edit.less"
import { assetData } from "@/interfaces/extdata.interface"
import { FormattedMessage, useIntl } from "umi"
import { panelContext } from "@/components/provider/panel.context"
import PositionPanel from "../position.panel"
interface Props {
	data: assetData | null
}
const _MaterialEdit: React.FC<Props> = props => {
	const Intl = useIntl()
	const { data } = props
	const typeID = useMemo(() => data?.type, [data])
	const contentTypeID = useMemo(() => data?.contentType, [data])
	const { state: panelState } = useContext(panelContext)
	return (
		<div id="MaterialEdit">
			{/* 测试 */}
			{/* <MusicEditPanel /> */}
			{!!data && panelState.assetAction === "edit" ? (
				<>
					{!!contentTypeID && !!typeID && <PositionPanel data={data} />}
					{contentTypeID === contentType.PIC && typeID === materialType.PIC && <ImageEditPanel data={data} />}
					{contentTypeID === contentType.GIF && typeID === materialType.PIC && <GIFEditPanel data={data} />}
					{contentTypeID === contentType.MP4 && typeID === materialType.PIC && <VideoEditPanel data={data} />}
					{contentTypeID === contentType.MODEL && typeID === materialType.GLTF && <ModelEditPanel data={data} />}
					{contentTypeID === contentType.PIC && typeID === materialType.TEXT && <TextEditPanel data={data} />}
					{contentTypeID === contentType.FLAG && typeID === materialType.EFFECT && <AnimaEditPanel data={data} />}
					{contentTypeID === 10 && typeID === materialType.EFFECT && <BeamEditPanel data={data} />}
					{contentTypeID === contentType.PIC && typeID === materialType.HOTPOINT && <HotEditPanel data={data} />}
					{/* 音乐 */}
					{contentTypeID === contentType.MUSIC && typeID === materialType.PIC && <MusicEditPanel data={data} />}
				</>
			) : (
				<Empty description={<FormattedMessage id="jmk.public.Pleaseselectmaterial" />} />
			)}
		</div>
	)
}

const MaterialEdit = useMini(_MaterialEdit)
export default MaterialEdit
