import { ModalReturn } from "@/interfaces/app.interface"
import { Modal } from "antd"
import { ModalFuncProps } from "antd/lib/modal"
import { ModalStaticFunctions } from "antd/lib/modal/confirm"
import React, { createElement } from "react"
import "./modal.custom.less"

declare global {
	interface Window {
		modalContext: Omit<ModalStaticFunctions, "warn">
	}
}

//钩子,使弹窗可以调用上下文
const ModalContext: React.FC = props => {
	const [modal, contextHolder] = Modal.useModal()
	window.modalContext = modal
	return (
		<>
			{props.children}
			{contextHolder}
		</>
	)
}

interface ModalProxy {
	current?: ModalReturn
}
export interface ModalRef<V = {}> {
	modalRef: ModalProxy
	resolve?: (value?: V) => void
	reject?: (reason?: any) => void
}

//该弹窗无任何官方自带样式,内部内容自行编辑(包括宽高,背景等)
//content传入的组件默认注入modalRef,可以在内容层进行弹窗的关闭更新操作
export function ModalCustom<T = {}>(
	options: Omit<ModalFuncProps, "content"> & { content: React.FC<T & ModalRef>; params?: T }
) {
	const { content, params, ...modalConf } = options
	const modalRef: Partial<ModalProxy> = {}
	modalRef.current = window.modalContext.info({
		className: "Modal-Custom",
		maskClosable: false,
		keyboard: true,
		mask: true,
		centered: true,
		icon: null,
		title: null,
		width: "auto",
		content: createElement(content, { modalRef: modalRef, ...params! }),
		...modalConf
	})
}
export function AsyncModal<V, T = {}>(
	options: Omit<ModalFuncProps, "content"> & { content: React.FC<T & ModalRef<V>>; params?: T }
) {
	return new Promise<V>((resolve, reject) => {
		const { content, params, ...modalConf } = options
		const modalRef: Partial<ModalProxy> = {}
		modalRef.current = window.modalContext.info({
			className: "Modal-Custom",
			maskClosable: false,
			keyboard: true,
			mask: true,
			centered: true,
			icon: null,
			title: null,
			width: "auto",
			content: createElement(content, { modalRef: modalRef, resolve, reject, ...params! }),
			...modalConf
		})
	})
}
export default ModalContext
