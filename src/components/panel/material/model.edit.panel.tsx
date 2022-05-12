import NumberClocks from "@/components/form/extobj/number.clocks"
import TextInput from "@/components/form/text.input"
import { assetData } from "@/interfaces/extdata.interface"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { Button, Col, Divider, Radio, Row, Space, Typography } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import ItemCheckBox from "@/components/form/item.checkbox"
import NumberInput from "@/components/form/number.input"
import { FormattedMessage, useIntl } from "umi"
import eventBus from "@/utils/event.bus"
import OpationSelect from "@/components/form/select"
import { JMKContext } from "@/components/provider/jmk.context"
import serviceLocal from "@/services/service.local"
import { contentType } from "@/constant/jmk.type"
import urlFunc from "@/utils/url.func"
import ModelMayerials from "./model.mayerials.panel"
import { SettingOutlined } from "@ant-design/icons"
import { AsyncModal } from "@/components/modal/modal.context"
import SettingPWDModal from "@/components/modal/async/settingPWD.modal"
import TriggerPlay from "@/components/form/extobj/triggerPlay"
interface Props {
	data: assetData
}
const _ModelEditPanel: React.FC<Props> = props => {
	const Intl = useIntl()
	const { data } = props
	const [] = useState(true)
	const [] = useState({ outDetails: true })
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
	// 过渡视频列表
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
				res.data.entities.forEach(m => {
					videos.push({
						label: m.name,
						value: urlFunc.replaceUrl(m.picPath)
					})
				})
				setOpenVideoList(videos)
			})
	}, [])
	useEffect(() => {
		getvideoData()
	}, [])
	// 单选框的功能
	const selectOpations = [
		{
			label: <FormattedMessage id="jmk.attribute" />,
			value: "attribute"
		},
		{
			label: <FormattedMessage id="jmk.materials" />,
			value: "materials"
		}
	]
	const [currentType, setCurrentType] = useState(selectOpations[0].value)
	const typeChange = useCallback(e => {
		setCurrentType(e.target.value)
	}, [])
	const settingPWD = useCallback(async () => {
		const result = await AsyncModal({ content: SettingPWDModal })
		if (result.tour) {
			data.extdata.info.custom.portalWebsite = `${location.origin}/viewer/view.html?sceneName=${result.name}&showRoomType=${result.showRoomType}&tour=${result.tour}&view=${result.view}&code=${result.password}`
		} else {
			data.extdata.info.custom.portalWebsite = `${location.origin}/viewer/view.html?sceneName=${result.name}&showRoomType=${result.showRoomType}&code=${result.password}`
		}
	}, [data])
	return (
		<div id="ModelEditPanel">
			<Radio.Group
				size="large"
				value={currentType}
				buttonStyle="solid"
				onChange={typeChange}
				style={{ margin: "20px 24px" }}
			>
				{selectOpations.map(m => {
					return (
						<Radio.Button key={m.value} value={m.value} style={{ width: "120px", textAlign: "center" }}>
							{m.label}
						</Radio.Button>
					)
				})}
			</Radio.Group>
			{currentType === "attribute" && (
				<Space className="full-w" direction="vertical">
					<Space className="full-w" direction="vertical">
						<Space className="full-w between" direction="horizontal" align="center">
							<div>
								<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.title" />}：</Typography.Text>
								<Typography.Text type="secondary">
									{!!data.extdata.info.custom.tag.title ? data.extdata.info.custom.tag.title.length : 0}/30
								</Typography.Text>
							</div>
							{/* <div>
							<ItemCheckBox item={data} valueKey="isRoamCharacter" children="是否导览人物" forceUpdate={forceUpdate} />
						</div> */}
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
					<Space className="full-w" direction="vertical">
						<Space direction="horizontal" align="center">
							<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.size" />}：</Typography.Text>
							<Typography.Text type="secondary">
								{<FormattedMessage id="jmk.addmaterial.sizeexplain" />}
							</Typography.Text>
						</Space>
						<div>
							<NumberClocks
								precision={0}
								min={50}
								max={20000}
								item={data}
								transform="mmtoM"
								forceUpdate={forceUpdate}
								field="asScale"
								labels={{
									0: <FormattedMessage id="jmk.addmaterial.sizewide" />,
									1: <FormattedMessage id="jmk.addmaterial.sizehigh" />,
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
										forceUpdate={forceUpdate}
										item={data}
										field="asPosition"
										valueKey={"0"}
										defaultValue={0}
										precision={3}
										step={1}
									/>
								</Col>

								<Col span={8}>
									<NumberInput
										onVal={data["asPosition"]["1"]}
										forceUpdate={forceUpdate}
										item={data}
										field="asPosition"
										valueKey={"1"}
										defaultValue={0}
										precision={3}
										step={1}
									/>
								</Col>

								<Col span={8}>
									<NumberInput
										onVal={data["asPosition"]["2"]}
										forceUpdate={forceUpdate}
										item={data}
										field="asPosition"
										valueKey={"2"}
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
										forceUpdate={forceUpdate}
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
										forceUpdate={forceUpdate}
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
										forceUpdate={forceUpdate}
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
					{/* <CenterMainScene data={data} />
				<ArticleScene data={data} />
				<AudioScene data={data} />
				<HotSpot data={data.extdata.info.custom.tag}></HotSpot>
				<Divider /> */}
					{/* <Space className="full-w" direction="vertical">
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
				<Divider /> */}
					<Space className="full-w" direction="vertical">
						<Space direction="horizontal" align="center">
							<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.characteristic" />}</Typography.Text>
							<Typography.Text type="secondary"></Typography.Text>
						</Space>
						<ItemCheckBox
							item={data}
							valueKey="isRoamCharacter"
							children={<FormattedMessage id="jmk.model.addToRoamingRole" />}
						/>
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
						/>
						<ItemCheckBox
							item={data}
							valueKey="followCamera"
							children={<FormattedMessage id="jmk.addmaterial.Facingtheparkingposition" />}
						/>
						<ItemCheckBox
							item={data.extdata.info.custom}
							valueKey="portal"
							children={<FormattedMessage id="jmk.addmaterial.Portal" />}
							forceUpdate={forceUpdate}
						/>
						{!!data.extdata.info.custom.portal && (
							<>
								<Space className="full-w between" direction="horizontal" align="center">
									<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.PortalWebsite" />}:</Typography.Text>
									<TextInput
										item={data.extdata.info.custom}
										valueKey="portalWebsite"
										onVal={data.extdata.info.custom.portalWebsite}
										disabled
										style={{ width: "220px" }}
										addonAfter={<SettingOutlined onClick={settingPWD} />}
									/>
								</Space>
							</>
						)}
						<ItemCheckBox
							item={data.extdata.info.custom}
							valueKey="distanceTrigger"
							children={<FormattedMessage id="jmk.video.distanceTrigger" />}
							forceUpdate={forceUpdate}
						/>
						{!!data.extdata.info.custom.distanceTrigger && (
							<>
								<Space className="full-w between" direction="horizontal" align="center">
									<Typography.Text strong style={{ marginLeft: "20px" }}>
										{<FormattedMessage id="jmk.video.range" />}（m）:
									</Typography.Text>
									<div style={{ width: "200px" }}>
										<NumberInput
											item={data.extdata.info.custom.triggerPlay}
											valueKey="distance"
											forceUpdate={forceUpdate}
											defaultValue={0.1}
											precision={1}
											min={0.1}
											max={10000}
											step={0.1}
											size="small"
											style={{ width: "160px" }}
										/>
									</div>
								</Space>
								<Space className="full-w between" direction="horizontal" align="center">
									<ItemCheckBox
										item={data.extdata.info.custom.triggerPlay}
										valueKey="playShow"
										children={<FormattedMessage id="jmk.model.playShow" />}
										forceUpdate={forceUpdate}
										style={{ marginLeft: "20px" }}
									/>
								</Space>
							</>
						)}
					</Space>
				</Space>
			)}
			{currentType === "materials" && <ModelMayerials materialsList={data.materials}></ModelMayerials>}
		</div>
	)
}

const ModelEditPanel = useMini(_ModelEditPanel)
export default ModelEditPanel
