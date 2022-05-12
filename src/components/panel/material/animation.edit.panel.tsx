import ItemCheckBox from "@/components/form/item.checkbox"
import ItemSlider from "@/components/form/item.slider"
import TextInput from "@/components/form/text.input"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { Divider, Space, Typography } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { assetData } from "@/interfaces/extdata.interface"
import CenterMainScene from "@/components/form/extobj/centermain.scene"
import ArticleScene from "@/components/form/extobj/article.scene"
import AudioScene from "@/components/form/extobj/audio.scene"
import HotSpot from "@/components/form/extobj/hotspot"
import NumberInput from "@/components/form/number.input"
import ItemColor from "@/components/form/item.color"
import { FormattedMessage, useIntl } from "umi"
import eventBus from "@/utils/event.bus"
import { JMKContext } from "@/components/provider/jmk.context"
import OpationSelect from "@/components/form/select"

interface Props {
	data: assetData
}

const _AnimaEditPanel: React.FC<Props> = props => {
	const Intl = useIntl()
	const { data } = props
	const forceUpdate = useForceUpdate()
	// 相机位列表
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

	const changeValue = useCallback(e => {
		eventBus.emit("jmk.name.change")
	}, [])
	return (
		<div id="AnimaEditPanel">
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
				<Space className="full-w" direction="vertical">
					<div>
						<div style={{ display: "inline", float: "left" }}>
							<div style={{ display: "inline", float: "left" }}>
								{<FormattedMessage id="jmk.addmaterial.amplitude" />}：
							</div>
							<div style={{ display: "inline", float: "left" }}>
								<NumberInput
									item={data}
									valueKey="amplitude"
									defaultValue={0}
									precision={2}
									min={-0.1}
									max={0.1}
									step={0.01}
									forceUpdate={forceUpdate}
								/>
							</div>
						</div>
						<div style={{ display: "inline", float: "left", margin: "0 0 0 10px" }}>
							<div style={{ display: "inline", float: "left" }}>
								{<FormattedMessage id="jmk.addmaterial.speed" />}：
							</div>
							<div style={{ display: "inline", float: "left" }}>
								<NumberInput item={data} valueKey="speed" defaultValue={0} precision={2} min={-1} max={1} step={0.01} />
							</div>
						</div>
					</div>
				</Space>
				<Divider />
				<Space className="full-w" direction="vertical">
					<Space direction="horizontal" align="center">
						<Typography.Text strong>
							{<FormattedMessage id="jmk.addmaterial.Size(flagwidthandheight)" />}：
						</Typography.Text>
						<Typography.Text type="secondary">{<FormattedMessage id="jmk.addmaterial.sizeexplain" />}</Typography.Text>
					</Space>
					<div>
						<div style={{ display: "inline", float: "left" }}>
							<div style={{ display: "inline", float: "left" }}>
								{<FormattedMessage id="jmk.addmaterial.sizewide" />}：
							</div>
							<div style={{ display: "inline", float: "left" }}>
								<NumberInput
									item={data}
									valueKey="flagW"
									defaultValue={0}
									precision={1}
									min={0.1}
									max={100}
									step={0.1}
									forceUpdate={forceUpdate}
								/>
							</div>
						</div>
						<div style={{ display: "inline", float: "left", margin: "0 0 0 10px" }}>
							<div style={{ display: "inline", float: "left" }}>
								{<FormattedMessage id="jmk.addmaterial.sizehigh" />}：
							</div>
							<div style={{ display: "inline", float: "left" }}>
								<NumberInput
									item={data}
									valueKey="flagH"
									defaultValue={0}
									precision={1}
									min={0.1}
									max={100}
									step={0.1}
									forceUpdate={forceUpdate}
								/>
							</div>
						</div>
					</div>
				</Space>
				<Divider />

				<Space className="full-w" direction="vertical">
					<Space direction="horizontal" align="center">
						<Typography.Text strong>
							{<FormattedMessage id="jmk.addmaterial.Size(heightofflagpole)" />}：
						</Typography.Text>
						<Typography.Text type="secondary">{<FormattedMessage id="jmk.addmaterial.sizeexplain" />}</Typography.Text>
					</Space>
					<div>
						<NumberInput
							item={data}
							valueKey="poleH"
							defaultValue={0}
							precision={1}
							min={0.1}
							max={100}
							step={0.1}
							forceUpdate={forceUpdate}
						/>
					</div>
				</Space>
				<Divider />
				{/* <Space className="full-w" direction="vertical">
					<Space direction="horizontal" align="center">
						<Typography.Text strong>棋子颜色</Typography.Text>
						<Typography.Text type="secondary"></Typography.Text>
					</Space>
					<div>
						<ItemColor item={''} valueKey=""  forceUpdate={forceUpdate}  />
					</div>
					<div>
						<div style={{ display: "inline", float: "left" }}>
							<div style={{ display: "inline", float: "left" }}>
								{<FormattedMessage id="jmk.addmaterial.Flagcolor" />}：
							</div>
							<div style={{ display: "inline", float: "left" }}>
								<ItemColor item={data} valueKey="qzColor" />
							</div>
						</div>
						<div style={{ display: "inline", float: "left", margin: "0 0 0 10px" }}>
							<div style={{ display: "inline", float: "left" }}>
								{<FormattedMessage id="jmk.addmaterial.Flagpolecolor" />}：
							</div>
							<div style={{ display: "inline", float: "left" }}>
								<ItemColor item={data} valueKey="qgColor" />
							</div>
						</div>
					</div>
				</Space>
				<Divider /> */}

				{/* <CenterMainScene data={data} />
				<ArticleScene data={data} />
				<AudioScene data={data} />
				<HotSpot data={data.extdata.info.custom.tag}></HotSpot>
				<Divider />
				<Space className="full-w" direction="vertical">
					<Space className="full-w between" direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.Jumplink" />}:</Typography.Text>
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
						/>
					</Space>
					<div>
						<TextInput addonBefore="http://" item={data.extdata.info} valueKey="url" />
					</div>
				</Space>
				<Divider /> */}
				<Space className="full-w" direction="vertical">
					<Space direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.characteristic" />}</Typography.Text>
						<Typography.Text type="secondary"></Typography.Text>
					</Space>
					<ItemCheckBox
						item={data}
						valueKey="enableHideInViews"
						children={<FormattedMessage id="jmk.addmaterial.Onlythecurrentcamerabitisvisible" />}
						forceUpdate={forceUpdate}
					/>
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
				</Space>
				{/* <Space className="full-w" direction="vertical">
					<Space className="full-w between" direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.opacity" />}:</Typography.Text>
					</Space>
					<div>
						<ItemSlider item={data} valueKey="opacity" min={0.1} max={1} step={0.1} />
					</div>
				</Space> */}
			</Space>
		</div>
	)
}

const AnimaEditPanel = useMini(_AnimaEditPanel)
export default AnimaEditPanel
