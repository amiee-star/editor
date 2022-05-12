import ItemCheckBox from "@/components/form/item.checkbox"
import ItemSlider from "@/components/form/item.slider"
import TextInput from "@/components/form/text.input"
import { assetData } from "@/interfaces/extdata.interface"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { Col, Divider, Input, List, Modal, Radio, Row, Space, Typography } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import NumberInput from "@/components/form/number.input"
import { FormattedMessage, useIntl } from "umi"
import eventBus from "@/utils/event.bus"
import { JMKContext } from "@/components/provider/jmk.context"
import { useEditHook } from "@/components/jmk/jmk.engine"
import "./music.edit.panel.less"
import { throttle } from "@/components/transitions/util"
import TriggerPlay from "@/components/form/extobj/triggerPlay"
import commonFunc from "@/utils/common.func"
import serviceLocal from "@/services/service.local"
import { CheckCircleTwoTone, DeleteOutlined, UploadOutlined } from "@ant-design/icons"
import DeleteMaterialModal from "@/components/modal/async/deleteMaterial.modal"
import { AsyncModal } from "@/components/modal/modal.context"
import { contentType } from "@/constant/jmk.type"
import CustomUpload from "@/components/utils/custom.upload"
import { UploadFile } from "antd/lib/upload/interface"
import { baseRes } from "@/interfaces/api.interface"

interface Props {
	data?: assetData
}
const _MusicEditPanel: React.FC<Props> = props => {
	const Intl = useIntl()
	const { data } = props
	const forceUpdate = useForceUpdate()
	const defaultCommentators = [
		"image/commentator/man.gif",
		"image/commentator/commentator1.gif",
		"image/commentator/women.gif"
	]
	// 相机位列表
	const { state } = useContext(JMKContext)
	const [commentators, setCommentators] = useState([])

	// 自定义解说员数据
	const getCommentators = useCallback(() => {
		const params = {
			tag: "解说员",
			currentPage: 1,
			pageSize: 100,
			fileType: 2,
			wd: "",
			category_1: "",
			category_2: "",
			category_3: ""
		}
		serviceLocal.assetsList(params).then(res => {
			if (res.code == "200") {
				setCommentators(res.data.entities)
			}
		})
	}, [])
	useEffect(() => {
		getCommentators()
		!!data.extdata.info.custom.triggerPlay.narratorUrl?.length &&
			setCurrentcheckbox([data.extdata.info.custom.triggerPlay.narratorUrl])
		narratorLyricsName.current = data.extdata.info.custom.triggerPlay?.narratorLyricsName
	}, [])

	const [Currentcheckbox, setCurrentcheckbox] = useState([])
	// 选择自定义解说员
	const choiceitem = useCallback(
		item => {
			setCurrentcheckbox([item])
			data.extdata.info.custom.triggerPlay.narratorUrl = item && item
			forceUpdate()
		},
		[Currentcheckbox]
	)
	// 选择默认解说员
	const choiceitemDefault = useCallback(
		item => {
			setCurrentcheckbox([item])
			data.extdata.info.custom.triggerPlay.narratorUrl = item && item
			forceUpdate()
		},
		[Currentcheckbox]
	)
	// 删除自定义解说员
	const removeCommentator = useCallback(
		item => async (e: { stopPropagation: () => void }) => {
			e.stopPropagation()
			if (Currentcheckbox[0] !== item.picPath) {
				const newData = await AsyncModal({
					content: DeleteMaterialModal,
					params: {
						id: item.picId,
						type: contentType.GIF,
						deleteTip: Intl.formatMessage({ id: "jmk.upload.commentatorDelTip1" })
					}
				})
				if (newData == "200") {
					eventBus.emit("jmk.getNewAssets", "200")
					getCommentators()
				}
			} else {
				Modal.info({
					title: Intl.formatMessage({ id: "jmk.outLine.tip" }),
					content: Intl.formatMessage({ id: "jmk.upload.commentatorDelTip2" }),
					closable: true
				})
			}
		},
		[Currentcheckbox]
	)
	// 切换解说员尺寸
	const changeSize = useCallback(
		(e: Event) => {
			data.extdata.info.custom.triggerPlay.narratorSize = e.target.value
			forceUpdate()
		},
		[data]
	)
	// 上传解说词
	const narratorLyricsName = useRef("")
	const uploadFile = useCallback(
		(name: string) => (item: string[], file: UploadFile<baseRes<string>>) => {
			narratorLyricsName.current = file?.name
			data.extdata.info.custom.triggerPlay.narratorLyricsUrl = item
			data.extdata.info.custom.triggerPlay.narratorLyricsName = file?.name
			forceUpdate()
		},
		[state]
	)
	return (
		<div id="MusicEditPanel">
			<Space className="full-w" direction="vertical">
				<Space direction="horizontal" align="center">
					<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.title" />}：</Typography.Text>
					<Typography.Text type="secondary">
						{!!data.extdata.info.custom.tag.title ? data.extdata.info.custom.tag.title.length : 0}/30
					</Typography.Text>
				</Space>
				<div>
					<TextInput
						// item={data.extdata.info.custom.tag}
						item={!!data ? data.extdata.info.custom.tag : ""}
						valueKey="title"
						maxLength={30}
						forceUpdate={forceUpdate}
					/>
				</div>
			</Space>
			<Divider />
			{/* 时长 */}
			<Space className="full-w" direction="vertical">
				<Space className="full-w between" direction="horizontal" align="center">
					<Typography.Text strong>
						{<FormattedMessage id="jmk.addmaterial.duration" />}
						<TextInput
							// item={data.extdata.info.custom.tag}
							item={data}
							valueKey="audioTime"
							maxLength={30}
							forceUpdate={forceUpdate}
							disabled={true}
						/>
					</Typography.Text>
				</Space>
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
			{/* 特性 */}
			{/* 循环播放 */}
			<Space className="full-w" direction="vertical"></Space>
			<Space className="full-w" direction="vertical">
				<Space direction="horizontal" align="center">
					<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.characteristic" />}</Typography.Text>
					<Typography.Text type="secondary"></Typography.Text>
				</Space>
				<ItemCheckBox
					item={data.extdata.info.custom.triggerPlay}
					valueKey="isLoop"
					children={<FormattedMessage id="jmk.audio.circulation" />}
					forceUpdate={forceUpdate}
				/>
				{/* 是否显示解说员 */}
				{/* <ItemCheckBox
					item={data.extdata.info.custom.triggerPlay}
					valueKey="isShowNarrator"
					children={<FormattedMessage id="jmk.audio.isShowNarrator" />}
					forceUpdate={forceUpdate}
				/>
				{!!data.extdata.info.custom.triggerPlay.isShowNarrator && (
					<>
						<Space className="full-w between" direction="horizontal" align="center">
							<Typography.Text>{<FormattedMessage id="jmk.audio.systemDefault" />}</Typography.Text>
						</Space> */}
				{/* 默认解说员 */}
				{/* <List
							// className="commentators-list"
							rowKey="picId"
							dataSource={defaultCommentators}
							renderItem={(item: any) => (
								<List.Item key={item.index}>
									<div
										className="check item-box"
										onClick={() => {
											choiceitemDefault(item)
										}}
									>
										{Currentcheckbox.some(m => {
											return m === item
										}) && (
											<CheckCircleTwoTone style={{ fontSize: 20, position: "absolute", left: "3px", top: "3px" }} />
										)}
										<div className="item-pic1">
											<img src={window.publicPath + item} />
										</div>
									</div>
								</List.Item>
							)}
						/>
						<Divider />
						<Space className="full-w between" direction="horizontal" align="center">
							<Typography.Text>{<FormattedMessage id="jmk.audio.customUpload" />}</Typography.Text>
						</Space> */}
				{/* 自定义解说员 */}
				{/* <List
							style={{ display: "flex" }}
							className="commentators-list"
							rowKey="picId"
							dataSource={commentators}
							renderItem={(item: any) => (
								<List.Item key={item.picId}>
									<div
										className="check item-box"
										onClick={() => {
											choiceitem(item.picPath)
										}}
									>
										{Currentcheckbox.some((m: { picId: string }) => {
											return m === item.picPath
										}) && (
											<CheckCircleTwoTone style={{ fontSize: 20, position: "absolute", left: "3px", top: "3px" }} />
										)}
										<div className="item-pic1">
											<img src={commonFunc.thumb(item.picPath, 150)} style={{ height: "100%", width: "100%" }} />
										</div>
										<div className="item-del-icon" onClick={removeCommentator(item)}>
											<DeleteOutlined />
										</div>
									</div>
								</List.Item>
							)}
						/>
						<Divider /> */}
				{/* 解说员尺寸 */}
				{/* <Space className="full-w between" direction="horizontal" align="center">
							<Typography.Text>{<FormattedMessage id="jmk.audio.commentatorSize" />}</Typography.Text>
						</Space>

						<Radio.Group
							defaultValue={data.extdata.info.custom.triggerPlay.narratorSize}
							buttonStyle="solid"
							onChange={changeSize}
						>
							<Radio.Button value="maximum">{<FormattedMessage id="jmk.audio.maximum" />}</Radio.Button>
							<Radio.Button value="medium">{<FormattedMessage id="jmk.audio.medium" />}</Radio.Button>
							<Radio.Button value="minimum">{<FormattedMessage id="jmk.audio.minimum" />}</Radio.Button>
						</Radio.Group> */}

				{/* 解说词!!!!!!!!!!!!!! */}
				{/* <Space className="full-w between" direction="horizontal" align="center">
							<Typography.Text>{<FormattedMessage id="jmk.audio.commentary" />}</Typography.Text>
						</Space>
						<ItemCheckBox
							item={data.extdata.info.custom.triggerPlay}
							valueKey="narratorLyrics"
							children={<FormattedMessage id="jmk.audio.showCommentary" />}
							forceUpdate={forceUpdate}
						/>
						{!!data.extdata.info.custom.triggerPlay.narratorLyrics && (
							<Row gutter={[10, 10]} align="middle">
								<Col span={21}>
									<Input value={narratorLyricsName.current} disabled style={{ borderStyle: "none" }} />
								</Col>
								<Col span={3}>
									<CustomUpload //解说词
										btnicon={<UploadOutlined />}
										accept=".srt"
										btnProps={{ type: "primary", size: "small" }}
										size={1}
										btnText=""
										apiService={serviceLocal.upload}
										onChange={uploadFile("commentary")}
									/>
								</Col>
							</Row>
						)}
					</>
				)}
			</Space>
			<Divider /> */}

				{/* 音量 */}
				<Space className="full-w" direction="vertical">
					<Space className="full-w between" direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.audio.volume" />}:</Typography.Text>
					</Space>
					<div>
						<ItemSlider item={data.extdata.info.custom.triggerPlay} valueKey="volume" min={0.1} max={1} step={0.1} />
					</div>
				</Space>
				<Divider />
				<TriggerPlay data={data}></TriggerPlay>
			</Space>
		</div>
	)
}

const MusicEditPanel = useMini(_MusicEditPanel)
export default MusicEditPanel
