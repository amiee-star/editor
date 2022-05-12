import FormUploads from "@/components/form/form.uploads"
import { useEditHook } from "@/components/jmk/jmk.engine"
import MiniMapModal from "@/components/modal/async/miniMap.modal"
import { AsyncModal } from "@/components/modal/modal.context"
import { JMKContext } from "@/components/provider/jmk.context"
import { panelContext } from "@/components/provider/panel.context"
import Grow from "@/components/transitions/grow"
import CustomUpload from "@/components/utils/custom.upload"
import { baseRes } from "@/interfaces/api.interface"
import { coverData } from "@/interfaces/jmt.interface"
import serviceLocal from "@/services/service.local"
import checkVideo from "@/utils/checkVideo.func"
import commonFunc from "@/utils/common.func"
import { regxEmail, regxPhone } from "@/utils/regexp.func"
import { CameraOutlined, EditOutlined, SettingOutlined, UploadOutlined } from "@ant-design/icons"
import { Button, Checkbox, Col, Form, Input, InputNumber, Row, Space, Tooltip } from "antd"
import { useForm } from "antd/es/form/Form"
import TextArea from "antd/lib/input/TextArea"
import { UploadFile } from "antd/lib/upload/interface"
import React, { useCallback, useContext, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "umi"
import JMKPanel from "../jmk/jmk.panel"
const SetUpPanel: React.FC = () => {
	const Intl = useIntl()
	const { state, dispatch: JMKSet } = useContext(JMKContext)
	const { state: panelState, dispatch } = useContext(panelContext)
	const JMKHook = useEditHook()
	const initValue = useMemo(() => {
		const coverData: coverData = JSON.parse(JSON.stringify(state.sceneCofing))
		coverData.info.contact.headimgurl = !!coverData.info.contact.headimgurl
			? ([coverData.info.contact.headimgurl] as any)
			: ([] as any) //展厅logo
		coverData.info.thumb = !!coverData.info.thumb ? ([coverData.info.thumb] as any) : ([] as any) //PC封面
		coverData.info.mobileThumb = !!coverData.info.mobileThumb ? ([coverData.info.mobileThumb] as any) : ([] as any) //手机封面
		coverData.info.minimap.mapImage = !!coverData.info.minimap.mapImage
			? ([coverData.info.minimap.mapImage] as any)
			: ([] as any) //小地图
		coverData.info.openingVideo.url = !!coverData.info.openingVideo.url
			? ([coverData.info.openingVideo.url] as any)
			: ([] as any) //小地图
		coverData.info.musicFile = !!coverData.info.musicFile ? ([coverData.info.musicFile] as any) : ([] as any) //音乐
		coverData.info.hideLogo = !coverData.info.hideLogo
		coverData.info.closeMusic = !coverData.info.closeMusic
		// coverData.info.outline
		coverData.info.danmu = !!coverData.info.danmu
		return coverData.info
	}, [state.editHook])
	const layout = {
		labelCol: { span: 6 },
		wrapperCol: { span: 18 }
	}
	const SceneBBox: any = useMemo(() => JMKHook.getSceneBBox() || {}, [state.editHook])
	const copyDeep = useCallback((source, target) => {
		for (const key in source) {
			source[key] =
				key in target
					? typeof target[key] === "object"
						? copyDeep(source[key], target[key])
						: target[key]
					: source[key]
		}
		return source
	}, [])
	const onFinish = (values: any) => {
		values.contact.headimgurl = values.contact.headimgurl.length ? values.contact.headimgurl[0] : ""
		values.thumb = values.thumb.length ? values.thumb[0] : ""
		values.mobileThumb = values.mobileThumb.length ? values.mobileThumb[0] : ""
		values.minimap.mapImage = values.minimap.mapImage.length ? values.minimap.mapImage[0] : ""
		values.openingVideo.url = values.openingVideo.url.length ? values.openingVideo.url[0] : ""
		values.musicFile = values.musicFile.length ? values.musicFile[0] : ""
		values.hideLogo = !values.hideLogo
		values.closeMusic = !values.closeMusic
		const sunmitValues = {
			...state.sceneCofing,
			info: copyDeep(initValue, values)
		}

		// 提交接口
		serviceLocal
			.setCover({
				id: state.sceneName,
				cover: sunmitValues
			})
			.then(() => {
				JMKSet({
					type: "set",
					payload: {
						sceneCofing: sunmitValues
					}
				})
				dispatch({
					type: "set",
					payload: {
						current: ""
					}
				})
			})
	}
	const [showNade, setShowNode] = useState({
		hideLogo: initValue.hideLogo, // 字段属性相反
		descFlag: initValue.descFlag,
		useThumbLoading: initValue.useThumbLoading,
		minimap: initValue.minimap.show,
		closeMusic: initValue.closeMusic, // 字段属性相反
		usePwd: initValue.usePwd,
		mapImage: initValue.minimap.mapImage,
		// //启用展厅大纲
		// outLine: initValue.outLine.show,
		openVideo: initValue.openingVideo.show
	})
	const [form] = useForm<coverData>()

	// 截小地图
	const setViewThumb = useCallback(async () => {
		const offWidth = SceneBBox.max.x - SceneBBox.min.x
		const offHeight = SceneBBox.max.y - SceneBBox.min.y
		const file = commonFunc.dataURLtoFile(
			state.editHook.getSceneMiniMap(512, Math.round((512 * offHeight) / offWidth)),
			`pic-${new Date().getTime()}.jpg`
		)
		const formData = new FormData()
		formData.append("businessId", state.sceneName)
		formData.append("businessType", "1008")
		formData.append("file", file, file.name)
		serviceLocal.upload(formData).then(res => {
			form.setFields([
				{ name: ["minimap", "rect"], value: Math.round(512 / offWidth) },
				{ name: ["minimap", "mapImage"], value: [res.data.fileSaveUrl] },
				{ name: ["minimap", "mapName"], value: state.sceneName + "_minimap.jpg" }
			])
			setShowNode({ ...showNade, mapImage: res.data.fileSaveUrl })
		})
	}, [state])
	const onValuesChange = useCallback(
		async data => {
			const key = Object.keys(data)[0]
			if (key in showNade && key !== "minimap" && key !== "openVideo") {
				setShowNode({ ...showNade, [key]: data[key] })
			} else if (key === "minimap" && "show" in data.minimap) {
				setShowNode({ ...showNade, minimap: data.minimap.show })
			} else if (key === "minimap" && "mapImage" in data.minimap) {
				setShowNode({ ...showNade, mapImage: data.minimap.mapImage[0] })
			} else if (key === "openingVideo" && "show" in data.openingVideo) {
				setShowNode({ ...showNade, openVideo: data.openingVideo.show })
			}
		},
		[showNade]
	)
	const setMapScale = useCallback(async () => {
		const data = await AsyncModal({
			content: MiniMapModal,
			mask: true,
			params: {
				file: form.getFieldValue(["minimap", "mapImage"])[0]
			}
		})
		if (data) {
			const formData = new FormData()
			const fileName = "corpper_" + form.getFieldValue(["minimap", "mapName"])
			const newFile = new File([data.file], fileName)
			formData.append("fileName", fileName)
			formData.append("file", newFile)
			serviceLocal.upload(formData).then(res => {
				form.setFields([
					{ name: ["minimap", "rect"], value: data.scale },
					{ name: ["minimap", "mapImage"], value: [res.data.fileSaveUrl] },
					{ name: ["minimap", "mapName"], value: fileName }
				])
			})
		}
	}, [])
	const show = useMemo(
		() => panelState.model === "material" && panelState.current === "setup" && panelState.action === "edit",
		[panelState, state]
	)
	// 文件上传
	const uploadFile = useCallback(
		(name: string) => (item: string[], file: UploadFile<baseRes<string>>) => {
			if (name === "minimap") {
				form.setFields([{ name: ["minimap", "mapName"], value: file.name }])
			} else if (name === "musicName") {
				form.setFields([{ name: "musicName", value: file.name }])
			} else if (name === "videoName") {
				form.setFields([{ name: ["openingVideo", "name"], value: file.name }])
			}
		},
		[state]
	)

	const { state: JMK } = useContext(JMKContext)
	const showOutLine = useCallback(() => {
		JMK.editHook &&
			dispatch({
				type: "set",
				payload: {
					current: "outline"
				}
			})
	}, [state, JMK])

	return (
		<Grow in={show}>
			<JMKPanel title={<FormattedMessage id="jmk.left.setup" />}>
				<div id="setupD1">
					<Form
						form={form}
						{...layout}
						name="nest-messages"
						initialValues={initValue}
						onFinish={onFinish}
						preserve
						onValuesChange={onValuesChange}
					>
						<Form.Item label={<FormattedMessage id="jmk.minimap.Halllogo" />}>
							<Form.Item name="hideLogo" noStyle valuePropName="checked">
								<Checkbox style={{ lineHeight: "28px" }}>{<FormattedMessage id="jmk.minimap.showHalllogo" />}</Checkbox>
							</Form.Item>
							<Form.Item noStyle name={["contact", "headimgurl"]} hidden={!showNade.hideLogo}>
								<FormUploads
									extParams={{
										businessId: state.sceneName,
										businessType: 1003
									}}
									size={1}
									accept=".png, .jpg, .jpeg"
									apiService={serviceLocal.upload}
									baseUrl="obs"
								/>
							</Form.Item>
						</Form.Item>
						<Form.Item
							label={<FormattedMessage id="jmk.minimap.name" />}
							name="name"
							rules={[{ required: true, message: <FormattedMessage id="jmk.minimap.Pleaseenteraname" /> }]}
						>
							<Input maxLength={12} />
						</Form.Item>
						<Form.Item
							label={<FormattedMessage id="jmk.minimap.contacts" />}
							name={["contact", "contactName"]}
							rules={[{ required: true, message: <FormattedMessage id="jmk.minimap.Pleaseenteraname" /> }]}
						>
							<Input maxLength={12} />
						</Form.Item>
						<Form.Item
							label={<FormattedMessage id="jmk.minimap.Exhibitionhalladdress" />}
							name={["contact", "contactAddress"]}
						>
							<Input maxLength={50} />
						</Form.Item>
						<Form.Item
							label={<FormattedMessage id="jmk.minimap.phone" />}
							name={["contact", "contactPhone"]}
							rules={[
								{},
								{
									validator: (rule, value, callback) => {
										if (value && !regxPhone.test(value)) {
											callback(Intl.formatMessage({ id: "jmk.minimap.Pleaseinputthecorrectmobilephonenumber" }))
										} else {
											callback()
										}
									}
								}
							]}
						>
							<Input addonBefore="+86" />
						</Form.Item>
						<Form.Item
							label={<FormattedMessage id="jmk.minimap.email" />}
							name={["contact", "contactEmail"]}
							rules={[
								{},
								{
									validator: (rule, value, callback) => {
										if (value && !regxEmail.test(value)) {
											callback(Intl.formatMessage({ id: "jmk.minimap.Pleaseenterthecorrectemailaddress" }))
										} else {
											callback()
										}
									}
								}
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item label={<FormattedMessage id="jmk.minimap.describe" />}>
							<Form.Item name="descFlag" noStyle valuePropName="checked">
								<Checkbox style={{ lineHeight: "28px" }}>
									{<FormattedMessage id="jmk.minimap.ShowGallerydescriptionwhenloading" />}
								</Checkbox>
							</Form.Item>
							<Form.Item
								noStyle
								name="description"
								rules={[
									{
										required: showNade.descFlag,
										message: <FormattedMessage id="jmk.minimap.Pleaseenteradescription" />
									}
								]}
								hidden={!showNade.descFlag}
							>
								<TextArea showCount maxLength={100} />
							</Form.Item>
						</Form.Item>
						<Form.Item label={<FormattedMessage id="jmk.minimap.cover" />}>
							<Form.Item name="useThumbLoading" noStyle valuePropName="checked">
								<Checkbox style={{ lineHeight: "28px" }}>
									{<FormattedMessage id="jmk.minimap.Coverasloadingbackgroundimage" />}
								</Checkbox>
							</Form.Item>
							<Space direction="horizontal" size={0}>
								<Form.Item noStyle name="thumb" hidden={!showNade.useThumbLoading}>
									<FormUploads
										size={1}
										accept=".png, .jpg, .jpeg"
										extParams={{
											businessId: state.sceneName,
											businessType: 1008
										}}
										apiService={serviceLocal.upload}
										btnTxt={<FormattedMessage id="jmk.minimap.PCcover" />}
										imgAction={{ crop: true, aspectRatio: [1600, 1000] }}
									/>
								</Form.Item>
								<Form.Item noStyle name="mobileThumb" hidden={!showNade.useThumbLoading}>
									<FormUploads
										size={1}
										accept=".png, .jpg, .jpeg"
										extParams={{
											businessId: state.sceneName,
											businessType: 1008
										}}
										apiService={serviceLocal.upload}
										btnTxt={<FormattedMessage id="jmk.minimap.Mobilephonecover" />}
										imgAction={{ crop: true, aspectRatio: [1242, 2016] }}
									/>
								</Form.Item>
							</Space>
						</Form.Item>
						<Form.Item label={<FormattedMessage id="jmk.minimap.miniMap" />}>
							<Form.Item noStyle name={["minimap", "show"]} valuePropName="checked">
								<Checkbox style={{ lineHeight: "28px" }}>{<FormattedMessage id="jmk.minimap.showminiMap" />}</Checkbox>
							</Form.Item>
							<Row gutter={10} align="middle" hidden={!showNade.minimap}>
								<Col span={15}>
									<Form.Item
										noStyle
										name={["minimap", "mapName"]}
										rules={[
											{
												required: showNade.minimap,
												message: <FormattedMessage id="jmk.minimap.PleaseconfigureminiMap" />
											}
										]}
									>
										<Input disabled style={{ borderStyle: "none" }} />
									</Form.Item>
								</Col>
								<Col span={3}>
									<Tooltip placement="topRight" title={<FormattedMessage id="jmk.minimap.configureminiMap" />}>
										<Button
											type="primary"
											size="small"
											icon={<SettingOutlined />}
											onClick={setMapScale}
											disabled={!(showNade.mapImage.length > 0)}
										/>
									</Tooltip>
								</Col>
								<Col span={3}>
									<Form.Item noStyle name={["minimap", "mapImage"]}>
										<CustomUpload //上传小地图
											btnicon={<UploadOutlined />}
											accept=".png, .jpg, .jpeg"
											btnProps={{ type: "primary", size: "small" }}
											size={1}
											btnText=""
											extParams={{
												businessId: state.sceneName,
												businessType: 1008
											}}
											apiService={serviceLocal.upload}
											onChange={uploadFile("minimap")}
										/>
									</Form.Item>
								</Col>
								<Col span={3}>
									<Tooltip
										placement="topRight"
										title={<FormattedMessage id="jmk.minimap.Automaticgenerationofsmallmap" />}
									>
										<Button type="primary" size="small" icon={<CameraOutlined />} onClick={setViewThumb} />
									</Tooltip>
								</Col>
							</Row>
						</Form.Item>
						<Form.Item
							label={<FormattedMessage id="jmk.minimap.Mapscale" />}
							name={["minimap", "rect"]}
							rules={[{ required: showNade.minimap, message: <FormattedMessage id="jmk.minimap.Pleasesetmapscale" /> }]}
							help={<FormattedMessage id="jmk.minimap.Howmanypixelsdoesameterrepresentinthescene" />}
							hidden={!showNade.minimap}
						>
							<InputNumber style={{ width: "100%" }} disabled />
						</Form.Item>
						<Form.Item label={<FormattedMessage id="jmk.minimap.backgroundmusic" />}>
							<Form.Item name="closeMusic" noStyle valuePropName="checked">
								<Checkbox style={{ lineHeight: "28px" }}>
									{<FormattedMessage id="jmk.minimap.Enablebackgroundmusic" />}
								</Checkbox>
							</Form.Item>
							<Row gutter={[10, 10]} align="middle" hidden={!showNade.closeMusic}>
								<Col span={21}>
									<Form.Item
										noStyle
										name="musicName"
										rules={[
											{
												required: showNade.closeMusic,
												message: <FormattedMessage id="jmk.minimap.Pleaseuploadbackgroundmusic" />
											}
										]}
									>
										<Input disabled style={{ borderStyle: "none" }} />
									</Form.Item>
								</Col>
								<Col span={3}>
									<Form.Item noStyle name="musicFile">
										<CustomUpload //上传音乐
											btnicon={<UploadOutlined />}
											accept="audio/*"
											btnProps={{ type: "primary", size: "small" }}
											size={1}
											btnText=""
											apiService={serviceLocal.upload}
											onChange={uploadFile("musicName")}
										></CustomUpload>
									</Form.Item>
								</Col>
							</Row>
						</Form.Item>
						<Form.Item label={<FormattedMessage id="jmk.minimap.Accesspassword" />}>
							<Form.Item name="usePwd" noStyle valuePropName="checked">
								<Checkbox style={{ lineHeight: "32px" }}>
									{<FormattedMessage id="jmk.minimap.Enableaccesspassword" />}
								</Checkbox>
							</Form.Item>
							<Form.Item
								noStyle
								name="password"
								rules={[
									{ required: showNade.usePwd, message: <FormattedMessage id="jmk.minimap.Pleasesetthepassword" /> }
								]}
								hidden={!showNade.usePwd}
							>
								<Input.Password />
							</Form.Item>
						</Form.Item>
						<Form.Item label={<FormattedMessage id="jmk.minimap.openVideo" />}>
							<Form.Item name={["openingVideo", "show"]} noStyle valuePropName="checked">
								<Checkbox style={{ lineHeight: "28px" }}>
									{<FormattedMessage id="jmk.minimap.EnableopenVideo" />}
								</Checkbox>
							</Form.Item>
							<Row gutter={[10, 10]} align="middle" hidden={!showNade.openVideo}>
								<Col span={21}>
									<Form.Item
										noStyle
										name={["openingVideo", "name"]}
										rules={[
											{
												required: showNade.openVideo,
												message: <FormattedMessage id="jmk.minimap.PleaseuploadopenVideo" />
											}
										]}
									>
										<Input disabled style={{ borderStyle: "none" }} />
									</Form.Item>
								</Col>
								<Col span={3}>
									<Form.Item noStyle name={["openingVideo", "url"]}>
										<CustomUpload //前置视频
											btnicon={<UploadOutlined />}
											accept="video/*"
											btnProps={{ type: "primary", size: "small" }}
											size={1}
											btnText=""
											extParams={{
												businessId: state.sceneName,
												businessType: 1005
											}}
											apiService={serviceLocal.upload}
											customCheck={checkVideo("video", 200)}
											onChange={uploadFile("videoName")}
										></CustomUpload>
									</Form.Item>
								</Col>
							</Row>
						</Form.Item>
						{/* 权限设置 */}
						{/* <Form.Item label={<FormattedMessage id="jmk.minimap.Permissionsetting" />}>
							<Space direction="horizontal" size={0} wrap={true}>
								<Form.Item name="enLang" noStyle valuePropName="checked">
									<Checkbox style={{ lineHeight: "32px" }}>
										{<FormattedMessage id="jmk.minimap.Englishstation" />}
									</Checkbox>
								</Form.Item>
								<Form.Item name={["buttonOptions", "comment"]} noStyle valuePropName="checked">
									<Checkbox style={{ lineHeight: "32px" }}>
										{<FormattedMessage id="jmk.minimap.Hidecomments" />}
									</Checkbox>
								</Form.Item>
								<Form.Item name={["buttonOptions", "share"]} noStyle valuePropName="checked">
									<Checkbox style={{ lineHeight: "32px" }}>
										{<FormattedMessage id="jmk.minimap.Hidesharing" />}
									</Checkbox>
								</Form.Item>
								<Form.Item name="titleFlag" noStyle valuePropName="checked">
									<Checkbox style={{ lineHeight: "32px" }}>
										{<FormattedMessage id="jmk.minimap.Exhibitionhallnameappearswhenloading" />}
									</Checkbox>
								</Form.Item>
							</Space>
						</Form.Item> */}

						{/* 添加展厅大纲新需求 */}
						{/* <Form.Item
							label={<FormattedMessage id="jmk.minimap.Halloutline" />}
							name={["outline", "show"]}
							noStyle
							valuePropName="checked"
						>
							<Checkbox style={{ lineHeight: "32px" }}>
								{<FormattedMessage id="jmk.minimap.Starthalloutline" />}
							</Checkbox>
							<Button icon={<EditOutlined />} type="text" onClick={showOutLine}></Button>
						</Form.Item> */}
						<Form.Item label={<FormattedMessage id="jmk.minimap.Halloutline" />}>
							<Form.Item name={["outline", "show"]} noStyle valuePropName="checked">
								<Checkbox style={{ lineHeight: "32px" }}>
									{<FormattedMessage id="jmk.minimap.Starthalloutline" />}
								</Checkbox>
							</Form.Item>
							<Form.Item noStyle>
								<Button icon={<EditOutlined />} type="text" onClick={showOutLine}></Button>
							</Form.Item>
						</Form.Item>
						<Form.Item label={<FormattedMessage id="jmk.danmu.open" />}>
							<Form.Item name="danmu" noStyle valuePropName="checked">
								<Checkbox style={{ lineHeight: "32px" }}>
									{/* {<FormattedMessage id="jmk.minimap.Starthalloutline" />} */}
								</Checkbox>
							</Form.Item>
						</Form.Item>
						<Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
							<Button type="primary" htmlType="submit">
								{<FormattedMessage id="jmk.minimap.Submit" />}
							</Button>
						</Form.Item>
					</Form>
				</div>
				{/* {!!isShowOutLine ? <OutLineDrawer /> : null} */}
			</JMKPanel>
		</Grow >
	)
}
export default SetUpPanel
