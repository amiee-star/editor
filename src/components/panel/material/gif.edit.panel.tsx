import CenterMainScene from "@/components/form/extobj/centermain.scene"
import ArticleScene from "@/components/form/extobj/article.scene"
import AudioScene from "@/components/form/extobj/audio.scene"
import HotSpot from "@/components/form/extobj/hotspot"
import NumberClocks from "@/components/form/extobj/number.clocks"
import ItemCheckBox from "@/components/form/item.checkbox"
import ItemSlider from "@/components/form/item.slider"
import TextInput from "@/components/form/text.input"
import { assetData } from "@/interfaces/extdata.interface"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { Col, Divider, Row, Space, Typography } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import TextAreaInput from "@/components/form/textarea.input"
import NumberInput from "@/components/form/number.input"
import { FormattedMessage, useIntl } from "umi"
import eventBus from "@/utils/event.bus"
import OpationSelect from "@/components/form/select"
import { JMKContext } from "@/components/provider/jmk.context"
import ModalSetting from "@/components/form/extobj/modalSetting"
interface Props {
	data: assetData
}
const _GIFEditPanel: React.FC<Props> = props => {
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
	const reset = useCallback(() => {
		data.restoreScale()
		forceUpdate()
	}, [])
	useEffect(() => {
		data.addEventListener("assetUpdated", () =>
			setTimeout(() => {
				forceUpdate()
			}, 0)
		)
		return () => {
			data.removeEventListener("assetUpdated")
		}
	}, [])
	const changeValue = useCallback(e => {
		eventBus.emit("jmk.name.change")
	}, [])
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
		<div id="GIFEditPanel">
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
				<Space direction="horizontal" align="center">
					<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.size" />}：</Typography.Text>
					<Typography.Text type="secondary">{<FormattedMessage id="jmk.addmaterial.sizeexplain" />}</Typography.Text>
				</Space>
				<div>
					<NumberClocks
						precision={0}
						min={50}
						max={20000}
						item={data}
						forceUpdate={forceUpdate}
						transform="mmtoM"
						field="asScale"
						labels={{
							1: <FormattedMessage id="jmk.addmaterial.sizewide" />,
							0: <FormattedMessage id="jmk.addmaterial.sizehigh" />,
							2: <FormattedMessage id="jmk.addmaterial.sizelong" />
						}}
						keyNames={["0", "1", "2"]}
						reset={reset}
						withLock
					/>
				</div>
			</Space>
			<Divider />
			<Space className="full-w" direction="vertical">
				<Space direction="horizontal" align="center">
					<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.position" />}:</Typography.Text>
					<Typography.Text type="secondary"></Typography.Text>
				</Space>
				<div>
					<Row gutter={10} align="middle" justify="center">
						<Col span={8}>X</Col>
						<Col span={8}>Y</Col>
						<Col span={8}>Z</Col>
						<Col span={8}>
							<NumberInput
								onVal={data["asPosition"]["0"]}
								item={data}
								field="asPosition"
								transform="mmtoM"
								valueKey={"0"}
								forceUpdate={forceUpdate}
								defaultValue={0}
								precision={3}
								step={1}
							/>
						</Col>
						<Col span={8}>
							<NumberInput
								onVal={data["asPosition"]["1"]}
								item={data}
								field="asPosition"
								transform="mmtoM"
								valueKey={"1"}
								defaultValue={0}
								forceUpdate={forceUpdate}
								precision={3}
								step={1}
							/>
						</Col>
						<Col span={8}>
							<NumberInput
								onVal={data["asPosition"]["2"]}
								item={data}
								field="asPosition"
								transform="mmtoM"
								valueKey={"2"}
								forceUpdate={forceUpdate}
								defaultValue={0}
								precision={3}
								step={1}
							/>
						</Col>
					</Row>
				</div>
			</Space>
			<Divider />
			<Space className="full-w" direction="vertical">
				<Space direction="horizontal" align="center">
					<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.rotate" />}：</Typography.Text>
					<Typography.Text type="secondary"></Typography.Text>
				</Space>
				<div>
					<Row gutter={[10, 0]} align="middle" justify="center">
						<Col span={8}>X</Col>
						<Col span={8}>Y</Col>
						<Col span={8}>Z</Col>
						<Col span={8}>
							<NumberInput
								onVal={data["asRotation"]["0"]}
								item={data}
								field="asRotation"
								valueKey={"0"}
								defaultValue={0}
								precision={3}
								step={0.001}
							/>
						</Col>
						<Col span={8}>
							<NumberInput
								onVal={data["asRotation"]["1"]}
								item={data}
								field="asRotation"
								valueKey={"1"}
								defaultValue={0}
								precision={3}
								step={0.001}
							/>
						</Col>
						<Col span={8}>
							<NumberInput
								onVal={data["asRotation"]["2"]}
								item={data}
								field="asRotation"
								valueKey={"2"}
								defaultValue={0}
								precision={3}
								step={0.001}
							/>
						</Col>
					</Row>
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
						defaultValue={2}
						value={3}
						item={data.extdata.info}
						valueKey="target"
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
				{/* 打开链接 */}
				{data.extdata.info.target === 2 && data.extdata.info.custom.openMode === "openLink" && (
					<>
						<ModalSetting data={data.extdata.info}></ModalSetting>
					</>
				)}
				{/* !!!end */}
			</Space>
			<Divider />
			<Space className="full-w" direction="vertical">
				<Space className="full-w between" direction="horizontal" align="center">
					<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.content" />}</Typography.Text>
					<Typography.Text type="secondary">
						{<FormattedMessage id="jmk.addmaterial.Spaceandlinefeedaresupported" />}
					</Typography.Text>
				</Space>
				<div>
					<TextAreaInput autoSize={false} item={data.extdata.info} valueKey="description" showCount maxLength={1000} />
				</div>
			</Space>
			<Divider />
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
			<Space className="full-w" direction="vertical">
				<Space className="full-w between" direction="horizontal" align="center">
					<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.opacity" />}:</Typography.Text>
				</Space>
				<div>
					<ItemSlider item={data} valueKey="opacity" min={0.1} max={1} step={0.1} />
				</div>
			</Space>
		</div>
	)
}

const GIFEditPanel = useMini(_GIFEditPanel)
export default GIFEditPanel
