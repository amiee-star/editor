import { AsyncModal, ModalCustom, ModalRef } from "../modal.context"
import { Input, Button, Checkbox, Form, Space, InputNumber, Tooltip, Row, Col, Card, Divider, Modal } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { useForm } from "antd/es/form/Form"
import CustomUpload from "@/components/utils/custom.upload"
import { CameraOutlined, CloseOutlined, SettingOutlined, UploadOutlined } from "@ant-design/icons"
import { JMKContext } from "@/components/provider/jmk.context"
import serviceLocal from "@/services/service.local"
import { panelContext } from "@/components/provider/panel.context"
import { coverData } from "@/interfaces/jmt.interface"
import { useEditHook } from "@/components/jmk/jmk.engine"
import MiniMapModal from "@/components/modal/async/miniMap.modal"
import { UploadFile } from "antd/lib/upload/interface"
import { baseRes } from "@/interfaces/api.interface"
import { FormattedMessage, Link, useIntl } from "umi"
import checkVideo from "@/utils/checkVideo.func"
import { useForceUpdate } from "@/utils/use.func"
import "./setup.Modal.less"
import RecycleModal from "../../modal/async/recycle.Modal"

import HallInfo from "../../setPanel/hall.info"
import HallCover from "../../setPanel/hall.cover"
import HallMusic from "@/components/setPanel/hall.music"
import HallFunction from "@/components/setPanel/hall.function"
import HallLimits from "@/components/setPanel/hall.limits"
import HallClassfiy from "@/components/setPanel/hall.classify"
import AudioMediaModal from "./audioMedia.modal"
import commonFunc from "@/utils/common.func"
import eventBus from "@/utils/event.bus"
interface Props {
	info: any
}
const setupModal: React.FC<Props & ModalRef<any>> = props => {
	const { resolve, reject, modalRef, info } = props
	const forceUpdate = useForceUpdate()
	const Intl = useIntl()
	const { state, dispatch: JMKSet } = useContext(JMKContext)
	const { state: panelState, dispatch } = useContext(panelContext)
	const JMKHook = useEditHook()

	const initValue = useMemo(() => {
		if (state.sceneCofing) {
			const coverData: coverData = JSON.parse(JSON.stringify(state.sceneCofing))
			coverData.info.contact.headimgurl = !!coverData.info.contact.headimgurl
				? ([coverData.info.contact.headimgurl] as any)
				: ([] as any) //展厅logo
			coverData.info.thumb = !!coverData.info.thumb ? ([coverData.info.thumb] as any) : ([] as any) //PC封面
			coverData.info.mobileThumb = !!coverData.info.mobileThumb ? ([coverData.info.mobileThumb] as any) : ([] as any) //手机封面
			coverData.info.minimap.mapImage = !!coverData.info.minimap.mapImage
				? ([coverData.info.minimap.mapImage] as any)
				: ([] as any) //小地图
			coverData.info.openingVideo.showSkip = !!coverData.info.openingVideo.showSkip
			coverData.info.openingVideo.url = !!coverData.info.openingVideo.url
				? ([coverData.info.openingVideo.url] as any)
				: ([] as any) //pc前置视频
			coverData.info.mobileOpeningVideo.url = !!coverData.info.mobileOpeningVideo.url
				? ([coverData.info.mobileOpeningVideo.url] as any)
				: ([] as any) //移动端前置视频
			coverData.info.musicFile = !!coverData.info.musicFile ? ([coverData.info.musicFile] as any) : ([] as any) //音乐
			coverData.info.hideLogo = !coverData.info.hideLogo
			coverData.info.closeMusic = !coverData.info.closeMusic
			// coverData.info.outline
			coverData.info.danmu = !!coverData.info.danmu
			coverData.info.isLikes = !!coverData.info.isLikes
			coverData.info.isMessage = !!coverData.info.danmu
			coverData.info.isShare = !!coverData.info.isShare
			//!
			coverData.info.category.visible = !!coverData.info.category.visible
			coverData.info.customBtnList = !!coverData.info.customBtnList ? coverData.info.customBtnList : []
			return coverData.info
		}
	}, [state.editHook])
	console.log(initValue, "initValueinitValueinitValue")
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
		console.log(values, 978987)
		console.log(form.getFieldValue("customBtnList"), "哈哈哈哈")
		values.contact.headimgurl = values.contact.headimgurl.length ? values.contact.headimgurl[0] : ""
		values.thumb = values.thumb.length ? values.thumb[0] : ""
		values.mobileThumb = values.mobileThumb.length ? values.mobileThumb[0] : ""
		values.minimap.mapImage = values.minimap.mapImage.length
			? values.minimap.mapImage[0] || values.minimap.mapImage[0].fileSaveUrl
			: ""
		values.openingVideo.url = values.openingVideo.url.length ? values.openingVideo.url[0] : ""
		values.openingVideo.showSkip = values.openingVideo.showSkip
		values.musicFile = values.musicFile
		values.hideLogo = !values.hideLogo
		values.closeMusic = !values.closeMusic
		values.mobileOpeningVideo.url = values.mobileOpeningVideo.url.length ? values.mobileOpeningVideo.url[0] : ""
		const sunmitValues = {
			...state.sceneCofing,
			info: copyDeep(initValue, values)
		}
		// 提交接口
		serviceLocal.setCover({ id: state.sceneName, cover: sunmitValues }).then(() => {
			JMKSet({
				type: "set",
				payload: {
					sceneCofing: sunmitValues
				}
			})
			// dispatch({
			// 	type: "set",
			// 	payload: {
			// 		current: ""
			// 	}
			// })
			modalRef.current.destroy()
		})
	}

	//失败提交
	const onFinishFailed = (errorInfo: any) => {
		if (errorInfo.errorFields.length > 1) {
			document.body.querySelectorAll(".select-item")[0].scrollIntoView(true)
			setTabIndex(0)
		} else {
			if (errorInfo.errorFields[0].name.indexOf("minimap") > -1) {
				document.body.querySelectorAll(".select-item")[3].scrollIntoView(true)
				setTabIndex(4)
			} else {
				document.body.querySelectorAll(".select-item")[0].scrollIntoView(true)
				setTabIndex(0)
			}
		}
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
		openVideo: initValue.openingVideo.show,
		mobileOpeningVideo: initValue.mobileOpeningVideo.show,
		openTour: initValue.openTour.show,
		// category: initValue.category.visible,
		customButton: initValue.customButton.visible
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
			// setMapScale()
		})
	}, [state])
	const [ischanged, setIsChanged] = useState(false)
	const onValuesChange = useCallback(
		async data => {
			if (!!data) {
				setIsChanged(true)
			} else {
				setIsChanged(false)
			}
			const key = Object.keys(data)[0]
			if (
				key in showNade &&
				key !== "minimap" &&
				key !== "openVideo" &&
				key !== "mobileOpeningVideo" &&
				key !== "openTour" &&
				key !== "category" &&
				key !== "customButton"
			) {
				setShowNode({ ...showNade, [key]: data[key] })
			} else if (key === "minimap" && "show" in data.minimap) {
				setShowNode({ ...showNade, minimap: data.minimap.show })
			} else if (key === "minimap" && "mapImage" in data.minimap) {
				setShowNode({ ...showNade, mapImage: data.minimap.mapImage })
			} else if (key === "mobileOpeningVideo" && "show" in data.mobileOpeningVideo) {
				setShowNode({ ...showNade, mobileOpeningVideo: data.mobileOpeningVideo.show })
			} else if (key === "openingVideo" && "show" in data.openingVideo) {
				setShowNode({ ...showNade, openVideo: data.openingVideo.show })
			} else if (key === "openTour" && "show" in data.openTour) {
				setShowNode({ ...showNade, openTour: data.openTour.show })
			} else if (key == "class") {
				Modal.confirm({
					title: Intl.formatMessage({ id: "jmk.outLine.tip" }),
					content: Intl.formatMessage({ id: "jmk.setup.classStartUsingTip" }),
					closable: true,
					onOk: () => {}
				})
			} else if (key == "category") {
				// setShowNode({ ...showNade, category: data.category.visible })
			} else if (key == "customButton") {
				setShowNode({ ...showNade, customButton: data.customButton.visible })
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
			formData.append("file", newFile, newFile.name)
			formData.append("businessId", state.sceneName)
			formData.append("businessType", "1008")
			serviceLocal.upload(formData).then(res => {
				form.setFields([
					{ name: ["minimap", "rect"], value: data.scale },
					{ name: ["minimap", "mapImage"], value: [res.data.fileSaveUrl] },
					{ name: ["minimap", "mapName"], value: fileName }
				])
				setShowNode({ ...showNade, mapImage: res.data.fileSaveUrl })
			})
		}
	}, [state.sceneName])

	useEffect(() => {
		eventBus.on("jmk.ButtonList", (res: any) => {
			form.setFields([{ name: "customBtnList", value: res }])
		})
		return () => {
			eventBus.off("jmk.ButtonList")
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

	const menuSubList = [
		{
			id: "hallInfo",
			name: Intl.formatMessage({ id: "jmk.setup.hallInfo" })
		},
		{
			id: "hallCover",
			name: Intl.formatMessage({ id: "jmk.setup.hallCover" })
		},
		{
			id: "hallMusic",
			name: Intl.formatMessage({ id: "jmk.setup.hallMusic" })
		},
		{
			id: "hallFunction",
			name: Intl.formatMessage({ id: "jmk.setup.hallFunction" })
		},
		{
			id: "hallLimit",
			name: Intl.formatMessage({ id: "jmk.setup.hallLimit" })
		}
		// {
		// 	id: "ClassSetting",
		// 	name: Intl.formatMessage({ id: "jmk.setup.class" })
		// }
	]
	const closeModal = useCallback(() => {
		// reject()
		modalRef.current.destroy()
	}, [])

	const [tabIndex, setTabIndex] = useState(0)
	// 滑动
	const onScroll = (e: any) => {
		let me = this
		let select = document.querySelectorAll(".select-item")
		select.forEach((item, index) => {
			const box = item.getBoundingClientRect()
			const top = box.top >= 0
			const bottom =
				box.bottom <= (document.getElementById("setupD1").offsetHeight || document.documentElement.clientHeight) + 0
			if (top && bottom) setTabIndex(index)
		})
	}

	const scrollTo = (index: number) => () => {
		document.body.querySelectorAll(".select-item")[index].scrollIntoView(true)
		setTabIndex(index)
	}
	// 回收站弹窗
	const handleRecycle = useCallback(async () => {
		const newData = await AsyncModal({
			content: RecycleModal,
			params: {}
		})
	}, [])
	const selectMedia = useCallback(async () => {
		const selectData = await AsyncModal({
			content: AudioMediaModal,
			params: {
				info: {
					custom: {
						detailAudio: { name: form.getFieldValue("musicName"), musicFile: form.getFieldValue("musicFile") }
					}
				}
			}
		})

		form.setFields([
			{ name: "musicName", value: selectData.name },
			{ name: "musicFile", value: selectData.musicFile }
		])

		// info.custom.detailAudio.name = selectData.name
		// info.custom.detailAudio.musicFile = selectData.musicFile
		// forceUpdate()
	}, [])
	return (
		<Card
			id="SetupModal"
			style={{ width: 600 }}
			title={<FormattedMessage id="jmk.left.setup" />}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Row>
				<Col span={6}>
					<div className={"leftTab"}>
						<ul>
							{!!menuSubList.length &&
								menuSubList.map((item, index) => (
									<li key={item.id} className={tabIndex == index ? "active" : ""} onClick={scrollTo(index)}>
										{item.name}
									</li>
								))}
						</ul>
						{/* 网络版暂时屏蔽 回收站 */}
						{/* <Button className={"recycleButton"} type="text" onClick={handleRecycle}>
							<i className={"iconfont iconshanchu"}>{Intl.formatMessage({ id: "jmk.setup.recycle" })}</i>
						</Button> */}
					</div>
				</Col>
				<Col span={18}>
					<div id="setupD1" className={"contentBox"} onScroll={onScroll}>
						<Form
							form={form}
							{...layout}
							name="nest-messages"
							initialValues={initValue}
							onFinish={onFinish}
							preserve
							onValuesChange={onValuesChange}
							onFinishFailed={onFinishFailed}
						>
							{/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
							{/* 展厅信息 */}
							<div className={"select-item"}>
								<HallInfo showNade={showNade} />
								<Divider />
							</div>
							{/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
							{/* 展厅封面 */}
							<div className={"select-item"}>
								<HallCover showNade={showNade} />
								<Divider />
							</div>
							{/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
							{/* 背景音乐 */}
							<div className={"select-item"}>
								{/* <HallMusic showNade={showNade} uploadFile={uploadFile("musicName")}/> */}
								<Form.Item label={<FormattedMessage id="jmk.minimap.backgroundmusic" />}>
									<Form.Item name="closeMusic" noStyle valuePropName="checked">
										<Checkbox style={{ lineHeight: "28px" }}>
											{<FormattedMessage id="jmk.minimap.Enablebackgroundmusic" />}
										</Checkbox>
									</Form.Item>
									<Row gutter={[10, 10]} align="middle" hidden={!showNade.closeMusic}>
										<Col span={16}>
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
										<Col span={8}>
											<Button size="small" type="primary" ghost onClick={selectMedia}>
												{<FormattedMessage id="jmk.addmaterial.Selectaudio" />}
											</Button>
											<Form.Item noStyle name="musicFile" hidden>
												<Input hidden />
											</Form.Item>
											{/* <Form.Item noStyle name="musicFile">
												<CustomUpload //上传音乐
													btnicon={<UploadOutlined />}
													accept="audio/*"
													btnProps={{ type: "primary", size: "small" }}
													size={1}
													btnText=""
													apiService={serviceLocal.upload}
													onChange={uploadFile("musicName")}
												/>
											</Form.Item> */}
										</Col>
									</Row>
								</Form.Item>
								<Divider />
							</div>

							{/* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */}
							{/* 功能设置 */}
							<div className={"select-item"}>
								{/* 小地图 */}
								<Form.Item label={<FormattedMessage id="jmk.minimap.miniMap" />}>
									<Form.Item noStyle name={["minimap", "show"]} valuePropName="checked">
										<Checkbox style={{ lineHeight: "28px" }}>
											{<FormattedMessage id="jmk.minimap.showminiMap" />}
										</Checkbox>
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
									rules={[
										{ required: showNade.minimap, message: <FormattedMessage id="jmk.minimap.Pleasesetmapscale" /> }
									]}
									help={<FormattedMessage id="jmk.minimap.Howmanypixelsdoesameterrepresentinthescene" />}
									hidden={!showNade.minimap}
								>
									<InputNumber style={{ width: "100%" }} disabled />
								</Form.Item>
								{/* 大纲编辑 */}
								<HallFunction
									ischanged={ischanged}
									showNade={showNade}
									onFinish={onFinish}
									form={form}
									modalRef={modalRef}
								/>
								<Divider />
							</div>

							{/* ！！！！！！！！！！！！！！！！！！！！！！！ */}
							{/* 权限设置 */}
							<div className={"select-item"}>
								<HallLimits showNade={showNade} />
								<Divider />
							</div>

							{/* 分类设置 */}
							{/* <div className={"select-item"}>
								<HallClassfiy showNade={showNade} />
							</div> */}

							<Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 6 }}>
								<Space>
									<Button type="primary" htmlType="submit">
										{<FormattedMessage id="jmk.minimap.Submit" />}
									</Button>
									<Button onClick={closeModal}>
										<FormattedMessage id="jmk.addmaterial.cancel" />
									</Button>
								</Space>
							</Form.Item>
						</Form>
					</div>
				</Col>
			</Row>
		</Card>
	)
}

export default setupModal
