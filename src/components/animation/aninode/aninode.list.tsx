import { FormattedMessage } from "@/.umi/plugin-locale/localeExports"
import { useEditHook } from "@/components/jmk/jmk.engine"
import { aniContext, aniItem } from "@/components/provider/ani.context"
import { JMKContext } from "@/components/provider/jmk.context"
import { assetData } from "@/interfaces/extdata.interface"
import eventBus from "@/utils/event.bus"
import { Dropdown, Menu } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useRef } from "react"
// 动画编辑器节点列表
const AniNodeList: React.FC = () => {
	const { state: ANI, dispatch: aniAction } = useContext(aniContext)
	const { state: JMK } = useContext(JMKContext)
	const JMKHook = useEditHook()
	const aniRef = useRef(ANI)
	useEffect(() => {
		aniRef.current = ANI
	}, [JMK, ANI])
	const selectNode = useCallback((item: assetData | null) => {
		if (item) {
			const data = aniRef.current.aniList.find(m => m.name == item.uuid)
			if (data) {
				aniRef.current.selectAni = data
				aniAction({
					type: "set",
					payload: aniRef.current
				})
			}
		}
	}, [])
	useEffect(() => {
		eventBus.off("jmk.assetSelected", selectNode).on("jmk.assetSelected", selectNode)
		return () => {
			eventBus.off("jmk.assetSelected", selectNode)
		}
	}, [])

	// 点击动画节点
	const selectItem = useCallback(
		(selectAni: aniItem) => () => {
			JMK.editHook.selectAsset(selectAni.asset)
			aniAction({
				type: "set",
				payload: {
					selectAni: selectAni,
					selectCofType: ""
				}
			})
		},
		[ANI.selectAni, JMK]
	)
	const menu = useCallback(
		(item: aniItem) => {
			return (
				<Menu>
					<Menu.Item onClick={removeAnimation(item)}>{<FormattedMessage id="jmk.animation.wipeData" />}</Menu.Item>
					<Menu.Item onClick={copyAnimation(item)}>{<FormattedMessage id="jmk.animation.copyData" />}</Menu.Item>
					{!!ANI.copyAniData && ANI.copyAniData[0].aid !== ANI.selectAni?.name && (
						<Menu.Item onClick={pasteAnimation(item)}>{<FormattedMessage id="jmk.animation.pasteData" />}</Menu.Item>
					)}
				</Menu>
			)
		},
		[ANI.copyAniData, ANI.selectAni, ANI.aniList, ANI.layout, ANI.tackList]
	)
	// 清空数据操作
	const removeAnimation = useCallback(
		item => () => {
			ANI.tackList = ANI.tackList.filter(m => m.aid !== item.name || m.type === "fix")
			aniAction({
				type: "set",
				payload: ANI
			})
		},
		[ANI]
	)
	// 复制数据操作
	const copyAnimation = useCallback(
		item => () => {
			ANI.copyAniData = ANI.tackList.filter(m => m.aid === item.name)
			aniAction({
				type: "set",
				payload: ANI
			})
		},
		[ANI]
	)
	// 粘贴数据操作
	const pasteAnimation = useCallback(
		(item: aniItem) => () => {
			const { name } = item
			ANI.tackList = ANI.tackList
				.filter(m => m.aid !== item.name)
				.concat(ANI.copyAniData.map(m => ({ ...m, aid: name })))
			aniAction({
				type: "set",
				payload: ANI
			})
		},
		[ANI]
	)
	return (
		<div className="node-list" style={{ height: `${ANI.layout.topHeight}px` }}>
			<div className="node-list-title">{<FormattedMessage id="jmk.animation.nodeList" />}</div>
			<div className="node-item-box">
				{ANI.aniList.map(m => {
					return (
						<Dropdown overlay={menu(m)} key={m.name} trigger={["contextMenu"]}>
							<div
								onClick={selectItem(m)}
								className={classNames({
									"node-item": true,
									selected: ANI.selectAni === m
								})}
							>
								{m.name}
							</div>
						</Dropdown>
					)
				})}
			</div>
		</div>
	)
}

export default AniNodeList
