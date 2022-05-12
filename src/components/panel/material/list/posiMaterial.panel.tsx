import { useEditHook } from "@/components/jmk/jmk.engine"
import { JMKContext } from "@/components/provider/jmk.context"
import { panelContext } from "@/components/provider/panel.context"
import Grow from "@/components/transitions/grow"
import { contentType, materialType } from "@/constant/jmk.type"
import PanelType from "@/constant/panel.type"
import { assetData } from "@/interfaces/extdata.interface"
import eventBus from "@/utils/event.bus"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { Tabs } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "umi"
import MaterialEdit from "./material.edit"
import MaterialList from "./material.list"
import "./material.list.panel.less"
const _PosiMaterialPanel: React.FC = () => {
	const Intl = useIntl()
	const tabList = useMemo(
		() => ({
			[PanelType.IMAGE]: {
				name: <FormattedMessage id="jmk.left.img" />,
				contentType: [contentType.PIC],
				type: materialType.PIC
			},
			[PanelType.GIF]: {
				name: <FormattedMessage id="jmk.left.gif" />,
				contentType: [contentType.GIF],
				type: materialType.PIC
			},
			[PanelType.VIDEO]: {
				name: <FormattedMessage id="jmk.left.video" />,
				contentType: [contentType.MP4],
				type: materialType.PIC
			},
			// 新加音频
			[PanelType.MUSIC]: {
				name: <FormattedMessage id="jmk.left.music" />,
				contentType: [contentType.MUSIC],
				type: materialType.PIC
			},
			[PanelType.MODEL]: {
				name: <FormattedMessage id="jmk.left.model" />,
				contentType: [contentType.MODEL],
				type: materialType.GLTF
			},
			[PanelType.TEXT]: {
				name: <FormattedMessage id="jmk.left.text" />,
				contentType: [contentType.PIC],
				type: materialType.TEXT
			},
			[PanelType.EFFECT]: {
				name: <FormattedMessage id="jmk.left.animation" />,
				contentType: [contentType.FLAG, 8, 10],
				type: materialType.EFFECT
			},
			[PanelType.HOT]: {
				name: <FormattedMessage id="jmk.left.hotspot" />,
				contentType: [contentType.PIC],
				type: materialType.HOTPOINT
			}
		}),
		[]
	)
	const { TabPane } = Tabs
	const { state } = useContext(panelContext)
	const { state: JMK } = useContext(JMKContext)
	const JMKHook = useEditHook()
	const assetList: (object & assetData)[] = JMK.editHook ? Array.from(JMKHook.getAssets()) : []
	const show = useMemo(() => state.model !== "base" && state.action === "edit" && state.assetAction === "position", [
		state
	])

	const currentAsset = useMemo(() => state.asset || null, [state])
	const forceUpdate = useForceUpdate()
	const [currentTab, setCurrentTab] = useState(PanelType.IMAGE)
	const tabChange = useCallback((key: PanelType) => {
		setCurrentTab(key)
	}, [])
	useEffect(() => {
		if (currentAsset) {
			const { type, contentType } = currentAsset
			const key = Object.keys(tabList).find((m: keyof typeof tabList) => {
				const currentTab = tabList[m]
				return currentTab.contentType.includes(contentType) && currentTab.type === type
			})
			setCurrentTab(key as PanelType)
		}
	}, [currentAsset])
	useEffect(() => {
		return () => {
			eventBus.off("jmk.assetsLoaded", forceUpdate)
			eventBus.off("jmk.sceneChanged", forceUpdate)
		}
	}, [currentAsset])
	useEffect(() => {
		if (JMK.editHook) {
			eventBus.on("jmk.assetsLoaded", forceUpdate)
			eventBus.on("jmk.sceneChanged", forceUpdate)
		}
	}, [JMK, currentAsset])
	return (
		<Grow in={show}>
			<div id="PosiMaterialPanel" className="panel-box">
				<Tabs onChange={tabChange} animated={false} centered activeKey={currentTab} type="card">
					{Object.keys(tabList).map((key: keyof typeof tabList) => {
						return (
							<TabPane tab={tabList[key].name} key={key}>
								<MaterialList
									data={assetList.filter(m => {
										return m.type === tabList[key].type && tabList[key].contentType.includes(m.contentType)
									})}
								/>
							</TabPane>
						)
					})}
				</Tabs>
			</div>
		</Grow>
	)
}

const PosiMaterialPanel = useMini(_PosiMaterialPanel)
export default PosiMaterialPanel
function forceUpdate(arg0: string, forceUpdate: any) {
	throw new Error("Function not implemented.")
}
