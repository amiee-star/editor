import CenterMainScene from "@/components/form/extobj/centermain.scene"
import ArticleScene from "@/components/form/extobj/article.scene"
import AudioScene from "@/components/form/extobj/audio.scene"
import HotSpot from "@/components/form/extobj/hotspot"
import { assetData } from "@/interfaces/extdata.interface"
import { useForceUpdate, useMini } from "@/utils/use.func"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { Divider, Space, Typography } from "antd"
import TextInput from "@/components/form/text.input"
import ItemCheckBox from "@/components/form/item.checkbox"
import ItemSlider from "@/components/form/item.slider"
import { FormattedMessage, useIntl } from "umi"
import eventBus from "@/utils/event.bus"
import { JMKContext } from "@/components/provider/jmk.context"
import OpationSelect from "@/components/form/select"
import { useEditHook } from "@/components/jmk/jmk.engine"
import { contentType } from "@/constant/jmk.type"
import serviceLocal from "@/services/service.local"
import urlFunc from "@/utils/url.func"
import ModalSetting from "@/components/form/extobj/modalSetting"
interface Props {
	data: assetData
}
const _HotEditPanel: React.FC<Props> = props => {
	const Intl = useIntl()
	const { data } = props
	const [] = useState(true)
	const [] = useState({ outDetails: true })
	const forceUpdate = useForceUpdate()
	const { state: JMK } = useContext(JMKContext)
	const JMKHook = useEditHook()
	const changeValue = useCallback(e => {
		eventBus.emit("jmk.name.change")
	}, [])
	const { state } = useContext(JMKContext)
	const viewsList: any[] = useMemo(() => state.editHook?.getViews() || [], [state.editHook])
	const [selectList, setSelectList] = useState([])
	useEffect(() => {
		if (viewsList) {
			let viewObjList: any[] = []
			let idList: any[] = []
			viewsList.forEach(item => {
				viewObjList.push({ label: item.name, value: item.id })
				idList.push(item.id)
			})
			setSelectList(viewObjList)
			data.hideInViews.forEach((item, index) => {
				if (idList.indexOf(item) === -1) {
					data.hideInViews.splice(index, 1)
				}
			})
		}
	}, [viewsList])
	// 素材切换类型
	const [materialPicType, setMaterialType] = useState(null)
	const materialTypeList = [
		{
			label: <FormattedMessage id="jmk.left.img" />,
			value: "Img"
		},
		{
			label: <FormattedMessage id="jmk.left.gif" />,
			value: "Gif"
		},
		{
			label: <FormattedMessage id="jmk.left.video" />,
			value: "Video"
		},
		{
			label: <FormattedMessage id="jmk.left.model" />,
			value: "Model"
		}
		// {
		// 	label: <FormattedMessage id="jmk.left.animation" />,
		// 	value: "Animation"
		// }
	]
	const eventData = {
		Img: [
			{
				label: "轮播",
				value: "0"
			},
			{
				label: "单点切换",
				value: "1"
			}
		],
		Gif: [
			{
				label: "轮播",
				value: "0"
			},
			{
				label: "单点切换",
				value: "1"
			}
		],
		Video: [
			{
				label: "视频切换",
				value: "1"
			}
		],
		Model: [
			{
				label: "播放动画",
				value: "1"
			}
		]
	}
	const groupList = [
		{
			label: "组1",
			value: "1"
		},
		{
			label: "组2",
			value: "2"
		},
		{
			label: "组3",
			value: "3"
		},
		{
			label: "组4",
			value: "4"
		},
		{
			label: "组5",
			value: "5"
		},
		{
			label: "组6",
			value: "6"
		},
		{
			label: "组7",
			value: "7"
		},
		{
			label: "组8",
			value: "8"
		},
		{
			label: "组9",
			value: "9"
		},
		{
			label: "组10",
			value: "10"
		}
	]
	// 目标素材数据
	const assetList: any[] = useMemo(() => {
		let list = JMK.editHook ? Array.from(JMKHook.getAssets()) : []
		let videos: any[] = []
		let type = ""
		list = list.filter((t: any) => (t.type === 1 || t.type === 4) && t.contentType !== 11)
		list.forEach((m: any) => {
			if (m.contentType == 1) {
				type = "Img"
			}
			if (m.contentType == 2) {
				type = "Gif"
			}
			if (m.contentType == 3) {
				type = "Video"
			}
			if (m.contentType == 4) {
				type = "Model"
			}
			videos.push({
				label: m.extdata.info.custom.tag.title,
				value: m.uuid,
				type: type
			})
		})
		return videos
	}, [JMK])
	// 替换素材列表
	const [openVideoList, setOpenVideoList] = useState([])
	const getvideoData = useCallback(() => {
		serviceLocal
			.assetsList({
				currentPage: 1,
				pageSize: 1000,
				fileType: contentType.MP4
			})
			.then(res => {
				const videos: any[] = []
				// res.data.entities.forEach(m => {
				// 	videos.push({
				// 		label: m.name,
				// 		value: urlFunc.replaceUrl(m.picPath)
				// 	})
				// })
				setOpenVideoList(videos)
			})
	}, [])
	useEffect(() => {
		getvideoData()
		setMaterialType(data.extdata.info.custom.materialPicType)
	}, [props])
	const changeType = useCallback(
		(item: string) => {
			setMaterialType(item)
			data.extdata.info.custom.targetMaterial = null
			data.extdata.info.custom.replaceMaterial = null
			data.extdata.info.custom.eventControl = eventData[item][0].value
		},
		[props]
	)
	const eventChangeType = useCallback(
		(item: string) => {
			data.extdata.info.custom.targetMaterial = null
		},
		[props]
	)

	// 打开方式
	const openModeList = [
		{
			label: "打开详情",
			value: "openInfo"
		},
		{
			label: "打开链接",
			value: "openLink"
		}
	]

	const openList = [
		{
			label: "内嵌页面打开",
			value: 2
		},
		{
			label: "新窗口打开",
			value: 3
		}
	]
	return (
		<div id="HotEditPanel">
			<Space className="full-w" direction="vertical">
				<Space className="full-w" direction="vertical">
					<Space direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.title" />}：</Typography.Text>
						<Typography.Text type="secondary">
							{!!data.extdata.info.custom.tag.title ? data.extdata.info.custom.tag.title.length : 0}/30
						</Typography.Text>
					</Space>
					<div>
						<TextInput
							item={data.extdata.info.custom.tag}
							valueKey="title"
							maxLength={30}
							changeValue={changeValue}
							forceUpdate={forceUpdate}
						/>
					</div>
				</Space>
				<Divider />
				<Space className="full-w between" direction="horizontal" align="center">
					<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.openMode" />}:</Typography.Text>
					<div style={{ width: "220px" }}>
						<OpationSelect
							onVal={data.extdata.info.custom.openMode}
							item={data.extdata.info.custom}
							valueKey="openMode"
							forceUpdate={forceUpdate}
							options={openModeList}
						/>
					</div>
				</Space>
				{data.extdata.info.custom.openMode === "openInfo" && (
					<>
						<Divider />
						<CenterMainScene data={data} />
						<ArticleScene data={data} />
						<AudioScene data={data} />
						<HotSpot data={data.extdata.info.custom.tag}></HotSpot>
					</>
				)}

				<Divider />
				<Space className="full-w" direction="vertical">
					<Space className="full-w between" direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.Jumplink" />}:</Typography.Text>
						{/* <ItemCheckBox
							defaultValue={2}
							value={3}
							item={data.extdata.info}
							valueKey="target"
							children={
								<Typography.Text type="secondary">
									{<FormattedMessage id="jmk.addmaterial.Anewwindowopens" />}
								</Typography.Text>
							}
						/> */}
					</Space>
					<div>
						{/* <TextInput addonBefore="http://" item={data.extdata.info} valueKey="url" /> */}
						<TextInput addonBefore="" item={data.extdata.info} valueKey="url" />
					</div>

					{/* !!!start */}
					<div>
						{/* <ItemCheckBox
							// defaultValue={2}
							// value={3}
							item={data.extdata.info.custom}
							valueKey="openLinkType"
							children={
								<Typography.Text type="secondary">{<FormattedMessage id="jmk.addmaterial.embedded" />}</Typography.Text>
							}
						/>
						<ItemCheckBox
							defaultValue={2}
							value={3}
							item={data.extdata.info}
							valueKey="target"
							children={
								<Typography.Text type="secondary">
									{<FormattedMessage id="jmk.addmaterial.Anewwindowopens" />}
								</Typography.Text>
							}
						/> */}
						{data.extdata.info.custom.openMode === "openLink" && (
							<OpationSelect
								onVal={data.extdata.info.target}
								item={data.extdata.info}
								valueKey="target"
								forceUpdate={forceUpdate}
								options={openList}
							/>
						)}
					</div>
					{data.extdata.info.target === 2 && data.extdata.info.custom.openMode === "openLink" && (
						<>
							<ModalSetting data={data.extdata.info}></ModalSetting>
						</>
					)}
					{/* !!!end */}
				</Space>
				<Divider />
				<Space className="full-w" direction="vertical">
					<Space direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.characteristic" />}</Typography.Text>
						<Typography.Text type="secondary"></Typography.Text>
					</Space>
					{/* <ItemCheckBox
						item={data.extdata.info.custom}
						valueKey="hoverChange"
						children={<FormattedMessage id="jmk.addmaterial.hoverChange" />}
						forceUpdate={forceUpdate}
					/> */}
					{/* <ItemCheckBox
						item={data}
						valueKey="enableHideInViews"
						children={<FormattedMessage id="jmk.addmaterial.Onlythecurrentcamerabitisvisible" />}
						forceUpdate={forceUpdate}
					/> */}
					{!!data.enableHideInViews && (
						<OpationSelect
							item={data}
							mode="multiple"
							valueKey="hideInViews"
							forceUpdate={forceUpdate}
							options={selectList}
						/>
					)}
					<ItemCheckBox
						item={data}
						valueKey="enable"
						children={<FormattedMessage id="jmk.addmaterial.Clickintheexhibitionhall" />}
						forceUpdate={forceUpdate}
					/>
					<ItemCheckBox
						item={data}
						valueKey="followCamera"
						children={<FormattedMessage id="jmk.addmaterial.Facingtheparkingposition" />}
						forceUpdate={forceUpdate}
					/>
					<ItemCheckBox
						item={data.extdata.info.custom}
						valueKey="materialSwitch"
						children={<FormattedMessage id="jmk.addmaterial.materialSwitch" />}
						forceUpdate={forceUpdate}
					/>
					{!!data.extdata.info.custom.materialSwitch && (
						<>
							<Space className="full-w between" direction="horizontal" align="center">
								<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.materialPicType" />}:</Typography.Text>
								<div style={{ width: "220px" }}>
									<OpationSelect
										item={data.extdata.info.custom}
										valueKey="materialPicType"
										forceUpdate={forceUpdate}
										options={materialTypeList}
										itemChange={changeType}
									/>
								</div>
							</Space>
							<Space className="full-w between" direction="horizontal" align="center">
								<Typography.Text strong>{<FormattedMessage id="jmk.event.eventControl" />}:</Typography.Text>
								<div style={{ width: "220px" }}>
									<OpationSelect
										item={data.extdata.info.custom}
										valueKey="eventControl"
										forceUpdate={forceUpdate}
										options={eventData[materialPicType]}
										itemChange={eventChangeType}
									/>
								</div>
							</Space>
							{!!data.extdata.info.custom.eventControl && (
								<Space className="full-w between" direction="horizontal" align="center">
									<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.targetMaterial" />}:</Typography.Text>
									<div style={{ width: "220px" }}>
										{data.extdata.info.custom.eventControl === "0" && (
											<OpationSelect
												onVal={data.extdata.info.custom.targetMaterial}
												item={data.extdata.info.custom}
												valueKey="targetMaterial"
												forceUpdate={forceUpdate}
												options={assetList.filter((m: any) => m.type === materialPicType)}
												mode="multiple"
											/>
										)}
										{data.extdata.info.custom.eventControl !== "0" && (
											<OpationSelect
												onVal={data.extdata.info.custom.targetMaterial}
												item={data.extdata.info.custom}
												valueKey="targetMaterial"
												forceUpdate={forceUpdate}
												options={assetList.filter((m: any) => m.type === materialPicType)}
											/>
										)}
									</div>
								</Space>
							)}

							{!!data.extdata.info.custom.materialSwitch && materialPicType === "Video" && (
								<Space className="full-w between" direction="horizontal" align="center">
									<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.replaceMaterial" />}:</Typography.Text>
									<div style={{ width: "220px" }}>
										<OpationSelect
											onVal={data.extdata.info.custom.replaceMaterial}
											item={data.extdata.info.custom}
											valueKey="replaceMaterial"
											forceUpdate={forceUpdate}
											options={openVideoList}
										/>
									</div>
								</Space>
							)}
							{!!data.extdata.info.custom.materialSwitch && (materialPicType === "Img" || materialPicType === "Gif") && (
								<Space className="full-w between" direction="horizontal" align="center">
									<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.group" />}:</Typography.Text>
									<div style={{ width: "220px" }}>
										<OpationSelect
											onVal={data.extdata.info.custom.replaceMaterial}
											item={data.extdata.info.custom}
											valueKey="replaceMaterial"
											forceUpdate={forceUpdate}
											options={groupList}
										/>
									</div>
								</Space>
							)}
						</>
					)}
				</Space>
				<Space className="full-w" direction="vertical">
					<Space className="full-w between" direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.opacity" />}:</Typography.Text>
					</Space>
					<div>
						<ItemSlider item={data} valueKey="opacity" min={0.1} max={1} step={0.1} />
					</div>
				</Space>
			</Space>
		</div>
	)
}

const HotEditPanel = useMini(_HotEditPanel)
export default HotEditPanel
