import { JMKContext } from "@/components/provider/jmk.context"
import serviceLocal from "@/services/service.local"
import ItemCheckBox from "@/components/form/item.checkbox"
import ItemSlider from "@/components/form/item.slider"
import TextInput from "@/components/form/text.input"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { Button, Col, Divider, List, Popover, Row, Space, Typography } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { assetData } from "@/interfaces/extdata.interface"
import NumberClocks from "@/components/form/extobj/number.clocks"
import CenterMainScene from "@/components/form/extobj/centermain.scene"
import UpPictureFrameModal from "@/components/modal/async/upPictureFrame.modal"
import ArticleScene from "@/components/form/extobj/article.scene"
import AudioScene from "@/components/form/extobj/audio.scene"
import HotSpot from "@/components/form/extobj/hotspot"
import ModalSetting from "@/components/form/extobj/modalSetting"
import lsFunc from "@/utils/ls.func"
import urlFunc from "@/utils/url.func"
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import { AsyncModal } from "@/components/modal/modal.context"
import "./image.edit.panel.less"
import TextAreaInput from "@/components/form/textarea.input"
import NumberInput from "@/components/form/number.input"
import eventBus from "@/utils/event.bus"
import { FormattedMessage, useIntl } from "umi"
import OpationSelect from "@/components/form/select"

interface Props {
	data: assetData
}
const _TextEditPanel: React.FC<Props> = props => {
	const Intl = useIntl()
	const { data } = props
	// const [Pictureframeliet, getPictureframeliet] = useState([])
	const [] = useState({ outDetails: true })
	// const [currentPictureframeliet, setCurrentPictureframeliet] = useState(null)
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

	const forceUpdate = useForceUpdate()

	// useEffect(() => {
	// 	getPictureframe()
	// }, [])
	// const getPictureframe = useCallback(() => {
	// 	serviceLocal.getPictureframe({ token: lsFunc.getItem("token") }).then(res => {
	// 		getPictureframeliet(res.data.entities)
	// 		if (data.frameVisible && data.frameId) {
	// 			if (res.data.entities.length > 0) {
	// 				res.data.entities.forEach((item, index: React.ReactText) => {
	// 					if (data.frameId == item.id) {
	// 						setCurrentPictureframeliet(res.data.entities[index])
	// 					}
	// 				})
	// 			}
	// 		} else {
	// 			setCurrentPictureframeliet(undefined)
	// 		}
	// 	})
	// 	forceUpdate()
	// }, [currentPictureframeliet, Pictureframeliet])
	// const chosePictureframe = useCallback(
	// 	item => {
	// 		if (data.frameId && data.frameVisible) {
	// 			if (data.frameId === item.id) {
	// 				setCurrentPictureframeliet(undefined)
	// 				data.frameVisible = false
	// 				data.frameId = undefined
	// 				data.cornerImage = undefined
	// 				data.bannerImage = undefined
	// 			} else {
	// 				setCurrentPictureframeliet(item)

	// 				data.frameId = item.id
	// 				data.cornerImage = urlFunc.replaceUrl(item.corner)
	// 				data.bannerImage = urlFunc.replaceUrl(item.banner)
	// 				data.frameVisible = true
	// 			}
	// 		} else {
	// 			setCurrentPictureframeliet(item)

	// 			data.frameId = item.id
	// 			data.cornerImage = urlFunc.replaceUrl(item.corner)
	// 			data.bannerImage = urlFunc.replaceUrl(item.banner)
	// 			data.frameVisible = true
	// 		}
	// 	},
	// 	[currentPictureframeliet]
	// )
	// const newPictureframe = useCallback(async () => {
	// 	const selectData = await AsyncModal({
	// 		content: UpPictureFrameModal,
	// 		params: {
	// 			fileType: 11
	// 		}
	// 	})
	// 	selectData ? getPictureframe() : null
	// 	forceUpdate()
	// }, [])
	// const remove = useCallback(
	// 	item => (e: React.MouseEvent<HTMLDivElement>) => {
	// 		e.stopPropagation()
	// 		serviceLocal
	// 			.pictureframedelete({
	// 				id: item.id
	// 			})
	// 			.then(res => {
	// 				if (res.code === "200") {
	// 					getPictureframe()
	// 				}
	// 			})
	// 	},
	// 	[currentPictureframeliet]
	// )
	const reset = useCallback(() => {
		data.restoreScale()
		forceUpdate()
	}, [])
	useEffect(() => {
		data.addEventListener("assetUpdated", () => {
			setTimeout(() => {
				forceUpdate()
			}, 0)
		})
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
	console.log(data)
	useEffect(() => {
		// 防止初始_openWidthRatio值为null而报错
		if (!data.extdata.info.custom._openWidthRatio) {
			data.extdata.info.custom._openWidthRatio = "1280*720"
			forceUpdate()
		}
	}, [])
	return (
		<div id="ImageEditPanel">
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
				<Space className="full-w" direction="vertical">
					<Space direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.size" />}：</Typography.Text>
						<Typography.Text type="secondary">{<FormattedMessage id="jmk.addmaterial.sizeexplain" />}</Typography.Text>
					</Space>
					<div>
						<NumberClocks
							precision={0}
							min={50}
							max={200000}
							forceUpdate={forceUpdate}
							item={data}
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
									valueKey={"0"}
									// forceUpdate={forceUpdate}
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
									forceUpdate={forceUpdate}
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
									forceUpdate={forceUpdate}
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
									forceUpdate={forceUpdate}
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
				{/* 打开详情 */}
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
						{/* 新窗口打开在打开链接的时候 显示 */}
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
					<Space className="full-w between" direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.content" />}</Typography.Text>
						<Typography.Text type="secondary">
							{<FormattedMessage id="jmk.addmaterial.Spaceandlinefeedaresupported" />}
						</Typography.Text>
					</Space>
					<div>
						<TextAreaInput
							autoSize={false}
							item={data.extdata.info}
							valueKey="description"
							showCount
							maxLength={1000}
						/>
					</div>
				</Space>
				<Divider />
				<Space className="full-w" direction="vertical">
					<Space direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.characteristic" />}:</Typography.Text>
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
				{/* <Space className="full-w" direction="vertical">
					<Space className="full-w between" direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.Pictureframe" />}:</Typography.Text>
						<Typography.Text type="secondary">
							<Button size="small" type="primary" ghost icon={<PlusOutlined />} onClick={newPictureframe}>
								{<FormattedMessage id="jmk.addmaterial.NewPictureframe" />}
							</Button>
						</Typography.Text>
					</Space>
					<div className="Pictureframeliet">
						<List
							bordered
							size="small"
							dataSource={Pictureframeliet}
							renderItem={(item, index) => (
								<List.Item
									className={item === currentPictureframeliet ? "active" : null}
									onClick={() => {
										chosePictureframe(item)
									}}
									actions={[<Button size="small" type="link" icon={<CloseOutlined />} onClick={remove(item)} />]}
								>
									<Popover
										className="popoverpreviewbox"
										placement="left"
										content={
											<>
												<div className="previewbox">
													<img src={urlFunc.replaceUrl(item.corner)} width="20" height="20" />
													<img src={urlFunc.replaceUrl(item.banner)} height="20" width="110" className="sframe" />
													<img
														src={urlFunc.replaceUrl(item.corner)}
														width="20"
														height="20"
														className="czfz180 thframe"
													/>
													<img src={urlFunc.replaceUrl(item.banner)} height="20" width="110" className="xz90 foframe" />
													<img src={urlFunc.replaceUrl(item.corner)} width="20" height="20" className="xz180 fiframe" />
													<img
														src={urlFunc.replaceUrl(item.banner)}
														height="20"
														width="110"
														className="spfz180 siframe"
													/>
													<img src={urlFunc.replaceUrl(item.corner)} width="20" height="20" className="xz270 seframe" />
													<img
														src={urlFunc.replaceUrl(item.banner)}
														height="20"
														width="110"
														className="xz270 eiframe"
													/>
													<img src={data.config.texture} height="110" width="110" className="centerimg" />
												</div>
											</>
										}
										title={item.name}
										trigger="hover"
									>
										<Typography.Text ellipsis={true}>{item.name}</Typography.Text>
									</Popover>
								</List.Item>
							)}
						/>
					</div>
				</Space> */}
			</Space>
		</div>
	)
}

const TextEditPanel = useMini(_TextEditPanel)
export default TextEditPanel
