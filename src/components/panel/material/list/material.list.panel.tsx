import { useEditHook } from "@/components/jmk/jmk.engine"
import { aniContext } from "@/components/provider/ani.context"
import { JMKContext } from "@/components/provider/jmk.context"
import { panelContext } from "@/components/provider/panel.context"
import Grow from "@/components/transitions/grow"
import PanelType from "@/constant/panel.type"
import { assetData } from "@/interfaces/extdata.interface"
import eventBus from "@/utils/event.bus"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { Avatar, Tabs, Tooltip } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useIntl } from "umi"
import { DeleteOutlined, DragOutlined, EditOutlined, GatewayOutlined, InteractionOutlined } from "@ant-design/icons"
import "./material.list.panel.less"
import classNames from "classnames"
const _MaterialListPanel: React.FC = () => {
	const Intl = useIntl()

	const { state: panelState, dispatch } = useContext(panelContext)
	const { state: JMK } = useContext(JMKContext)
	const [currentAsset, setCurrentAsset] = useState<object & assetData>(null)
	const JMKHook = useEditHook()
	const forceUpdate = useForceUpdate()
	const assetList: (object & assetData)[] = JMK.editHook ? Array.from(JMKHook.getAssets()) : []
	const show = useMemo(() => panelState.model !== "base" && panelState.action === "edit", [panelState])
	const { state: ANI } = useContext(aniContext)
	useEffect(() => {
		if (JMK.editHook) {
			show ? JMKHook.enableAssetSelection() : JMKHook.disableSelection()
		}
	}, [JMK, show])
	useEffect(() => {
		return () => {
			eventBus.off("jmk.assetSelected", setCurrentAsset)
			eventBus.off("jmk.assetAdd", setCurrentAsset)
		}
	}, [currentAsset])
	useEffect(() => {
		if (JMK.editHook) {
			eventBus.on("jmk.assetAdd", setCurrentAsset)
			eventBus.on("jmk.assetSelected", setCurrentAsset)
		}
	}, [JMK, currentAsset])
	useEffect(() => {
		if (JMK.editHook && !!currentAsset) {
			JMK.editHook.selectAsset(currentAsset)
			const aaa = document.querySelector("[data-action=move]")
			aaa.click()
		}
		if (JMK.editHook && !currentAsset) {
			dispatch({
				type: "set",
				payload: {
					assetAction: "none"
				}
			})
		}
		dispatch({
			type: "set",
			payload: {
				asset: currentAsset
			}
		})
	}, [currentAsset, JMK])
	useEffect(() => {
		if (!show) {
			dispatch({
				type: "set",
				payload: {
					assetAction: "none",
					asset: null
				}
			})
		}
	}, [show])
	return (
		<Grow in={show}>
			<div id="MaterialListPanel"></div>
		</Grow>
	)
}

const MaterialListPanel = useMini(_MaterialListPanel)
export default MaterialListPanel
function dispatch(arg0: {
	type: string
	payload: {
		layout: {
			trackBoxEle: any
			boxHeight: number
			lineIndex: number
			lineWidth: number[]
			topHeight: number
			leftWidth: number
			markIndex: number
			pageFrams: number
			markSpace: number
		}
	}
}) {
	throw new Error("Function not implemented.")
}
