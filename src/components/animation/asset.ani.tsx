import { contentType, materialType } from "@/constant/jmk.type"
import PanelType from "@/constant/panel.type"
import { assetData } from "@/interfaces/extdata.interface"
import { Collapse } from "antd"
import React, { useCallback, useContext, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "umi"
import { useEditHook } from "../jmk/jmk.engine"
import { JMKContext } from "../provider/jmk.context"
import "./asset.ani.less"
import AssetList from "./list/asset.list"
const { Panel } = Collapse
// 动画编辑器侧边素材内容
const AssetAni: React.FC = () => {
	const { state: JMK } = useContext(JMKContext)
	const JMKHook = useEditHook()
	const assetList: (object & assetData)[] = useMemo(() => {
		return JMK.editHook ? Array.from(JMKHook.getAssets()) : []
	}, [JMK])
	//!!!!
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
				contentType: [contentType.FLAG, contentType.FlAME, contentType.BEAM],
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
	// tab选择
	const [currentTab, setCurrentTab] = useState(PanelType.IMAGE)
	const tabChange = useCallback((key: PanelType) => setCurrentTab(key), [])
	return (
		<div id="AssetAni">
			<div className="panel-box">
				<Collapse ghost accordion onChange={tabChange} activeKey={currentTab}>
					{Object.keys(tabList).map((key: keyof typeof tabList) => {
						return (
							<Panel header={tabList[key].name} key={key}>
								<AssetList
									data={assetList.filter(m => {
										return m.type === tabList[key].type && tabList[key].contentType.includes(m.contentType)
									})}
								/>
							</Panel>
						)
					})}
				</Collapse>
			</div>
		</div>
	)
}

export default AssetAni
