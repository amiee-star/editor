import { useEditHook } from "@/components/jmk/jmk.engine"
import { JMKContext } from "@/components/provider/jmk.context"
import { panelContext } from "@/components/provider/panel.context"
import serviceLocal from "@/services/service.local"
import serviceScene from "@/services/service.scene"
import commonFunc from "@/utils/common.func"
import { CameraOutlined, CloseOutlined } from "@ant-design/icons"
import { Button } from "antd"
import React, { useCallback, useContext, useEffect } from "react"
import { ModalRef } from "../modal.context"
interface Props {
	fileName?: string
	type: 1 | 2
	// 1 小地图 2 导览图
}
const ScreenModal: React.FC<Props & ModalRef<any>> = props => {
	const { resolve, reject, modalRef, type } = props
	const JMKHook = useEditHook()
	const { dispatch } = useContext(panelContext)
	const { state } = useContext(JMKContext)
	const closeModal = useCallback(() => {
		dispatch({
			type: "set",
			payload: {
				action: "edit"
			}
		})
		JMKHook.unmarkScreenshotArea()
		reject()
		modalRef.current.destroy()
	}, [])
	const screenToDataUrl = useCallback(
		(a, b, c, quality?) => {
			a = JMKHook.screenToBuffer(a, b, c)
			for (let d = 0; d < c; ++d) {
				for (let e = 0; e < b; ++e) {
					let f = 4 * (d * b + e)
					if (d < c / 2) {
						for (let g = 4 * ((c - d - 1) * b + e), h = 0; 3 > h; ++h) {
							let k = a[f + h]
							a[f + h] = a[g + h]
							a[g + h] = k
						}
					}
					a[f + 3] = 255
				}
			}
			a = new Uint8ClampedArray(a)
			a = new ImageData(a, b, c)
			let d: any = document.createElement("canvas")
			d.width = b
			d.height = c
			d.getContext("2d").putImageData(a, 0, 0)
			return d.toDataURL("image/jpeg", quality)
		},
		[state]
	)
	const screenGet = useCallback(() => {
		// JMKHook.
		dispatch({
			type: "set",
			payload: {
				action: "screen"
			}
		})
		JMKHook.unmarkScreenshotArea()
		const file = commonFunc.dataURLtoFile(
			screenToDataUrl(false, document.body.clientWidth, document.body.clientHeight),
			`pic-${new Date().getTime()}.jpg`
		)
		const formData = new FormData()
		formData.append("businessId", state.sceneName)
		formData.append("businessType", props.type === 1 ? "1008" : "1007")
		formData.append("file", file, file.name)
		serviceLocal.upload(formData).then(res => {
			resolve(res.data.fileSaveUrl)
			modalRef.current.destroy()
			dispatch({
				type: "set",
				payload: {
					action: "edit"
				}
			})
		})
	}, [state])
	useEffect(() => {
		let dom = document.body.querySelector(".ant-modal-root .ant-modal-wrap")
		dom.setAttribute("class", "screenshot")
	}, [])
	return (
		<>
			<Button onClick={screenGet} ghost type="primary" icon={<CameraOutlined />} style={{ transform: "scale(4)" }} />
			<div
				style={{
					position: "fixed",
					marginLeft: "45vw",
					marginTop: "-45vh"
				}}
			>
				<Button onClick={closeModal} ghost icon={<CloseOutlined />} style={{ transform: "scale(2)" }} />
			</div>
		</>
	)
}

export default ScreenModal
