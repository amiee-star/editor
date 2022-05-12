// import ViewBrowser from "@/components/sceneUtils/view.browser"
import { CloseOutlined } from "@ant-design/icons"
import { Button, message, Space, Typography } from "antd"
import React, { useCallback, useContext, useEffect, useState } from "react"
// import { ModalRef } from "../modal.context"
import commonFunc from "@/utils/common.func"
import "./viewer.modal.less"
import { assetData } from "@/interfaces/extdata.interface"
import classNames from "classnames"
import { ModalRef } from "./modal.context"
import { FormattedMessage } from "umi"
import ItemSliderModal from "../form/item.sliderModal"
import { JMKContext } from "../provider/jmk.context"
import eventBus from "@/utils/event.bus"
import { panelContext } from "../provider/panel.context"
import serviceLocal from "@/services/service.local"
import { useEditHook } from "../jmk/jmk.engine"
import lsFunc from "@/utils/ls.func"

declare global {
	interface Window {
		openFrame: boolean
	}
}
window.openFrame = false
interface Props {
	url?: string
	data?: any
	onClose?: Function
	width?: number
	height?: number
}

const ViewerModal: React.FC<Props & ModalRef> = props => {
	const { data, onClose, modalRef, url, width, height } = props
	const { state: JMK } = useContext(JMKContext)
	const { state, dispatch } = useContext(panelContext)
	const JMKHook = useEditHook()
	const mobile = commonFunc.browser().mobile
	const modalClose = useCallback(() => {
		// onClose && onClose()
		modalRef.current?.destroy()
	}, [])
	const [IframeOpacity, setIframeOpacity] = useState(0)
	useEffect(() => {
		setIframeOpacity(data.custom.openIframeOpacity / 100)
		document.getElementsByClassName("ant-modal-mask")[0].style.backgroundColor = `rgba(0, 0, 0, ${
			data.custom.openBgOpacity / 100
		})`
	}, [])
	useEffect(() => {
		if (JMK.editHook) {
			eventBus.off("jmk.modal.opacity").on("jmk.modal.opacity", (e1, e2) => {
				if (e2 == "iframeOpacity") {
					setIframeOpacity(e1 / 100)
				} else if (e2 == "bgOpacity") {
					document.getElementsByClassName("ant-modal-mask")[0].style.backgroundColor = `rgba(0, 0, 0, ${e1 / 100})`
				}
			})
		}
	}, [JMK])

	const coverOpacity = useCallback(() => {
		if (JMK.sceneCofing) {
			if (state.model === "material") {
				// serviceLocal
				// 	.setCover(JMK.sceneName, {
				// 		...JMK.sceneCofing,
				// 		info: { ...JMK.sceneCofing.info, extobjs: JMKHook.getAssetsJson() }
				// 	})
				// 	.then(() => {
				// 		message.success("保存成功")
				// 	})
				const params = {
					id: JMK.sceneName,
					cover: {
						...JMK.sceneCofing,
						info: { ...JMK.sceneCofing.info, extobjs: JMKHook.getAssetsJson() }
					}
				}
				serviceLocal.setCover(params).then(() => {
					message.success("保存成功")
				})
			} else if (state.model === "base") {
				// Promise.all([
				// 	serviceLocal.sceneJsonEdit(JMK.sceneName, JMKHook.getSceneJson()),
				// 	serviceLocal.setCover(JMK.sceneName, {
				// 		...JMK.sceneCofing,
				// 		info: { ...JMK.sceneCofing.info, extobjs: JMKHook.getAssetsJson() }
				// 	}),
				// 	serviceLocal.renderSettingsEdit(JMK.sceneName, lsFunc.getItem("bake"))
				// ]).then(([,]) => {
				// 	message.success("保存成功")
				// })
			} else {
			}
			modalRef.current?.destroy()
		}
	}, [])
	const [iframeurl, setIframe] = useState("")
	useEffect(() => {
		if (!!url) {
			setIframe(url)
		} else {
			if (data.custom.openWidthRatio.split("*")[0] === "960") {
				setIframe(require("../../assets/image/960.png"))
			} else if (data.custom.openWidthRatio.split("*")[0] === "1280") {
				setIframe(require("../../assets/image/1280.png"))
			} else if (data.custom.openWidthRatio.split("*")[0] === "1920") {
				setIframe(require("../../assets/image/1920.png"))
			}
		}
	}, [])
	return (
		<div id={mobile ? "viewerModalMobile" : "viewerModal"}>
			<div className="modal-close">
				<div className="baocun" onClick={coverOpacity}>
					<img src={require("../../assets/image/baocun.png")}></img>
				</div>
				<div className="back" onClick={modalClose}>
					<img src={require("../../assets/image/back.png")}></img>
				</div>
			</div>
			<div className="modal-content">
				<iframe
					frameBorder="0"
					allowFullScreen
					// className={`${classNames({
					// 	full: width ? false : true
					// })}`}
					style={{ backgroundColor: "#fff", opacity: IframeOpacity, zIndex: 3 }}
					src={iframeurl}
					width={width ? width : "auto"}
					height={height ? height : "auto"}
				/>
			</div>

			<div className="InOpacityBox">
				<span>{<FormattedMessage id="jmk.addmaterial.transparentIn" />}</span>
				<ItemSliderModal
					type={"iframeOpacity"}
					item={data.custom}
					valueKey="openIframeOpacity"
					min={1}
					max={100}
					step={1}
				/>
			</div>
			<div
				className="BgOpacityBox"
				style={{
					display: data.custom.openWidthRatio.split("*")[0] === "1920" ? "none" : "flex",
					bottom: data.custom.openWidthRatio.split("*")[0] === "1280" ? 32 : 122
				}}
			>
				<span>{<FormattedMessage id="jmk.addmaterial.transparentOut" />}</span>
				<ItemSliderModal type={"bgOpacity"} item={data.custom} valueKey="openBgOpacity" min={1} max={100} step={1} />
			</div>
		</div>
	)
}
export default ViewerModal
