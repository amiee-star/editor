import { useEditHook } from "@/components/jmk/jmk.engine"
import { aniContext } from "@/components/provider/ani.context"
import { JMKContext } from "@/components/provider/jmk.context"
import { materialType } from "@/constant/jmk.type"
import { assetData } from "@/interfaces/extdata.interface"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { DeleteOutlined, MinusOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons"
import { Button, List, Popover, Typography } from "antd"
import React, { useCallback, useContext, useEffect, useState } from "react"
import "./asset.list.less"
// 动画编辑器素材内容列表
interface Props {
	data: assetData[]
}
const _AssetList: React.FC<Props> = props => {
	const { data } = props
	const { state } = useContext(JMKContext)
	const { state: ANI, dispatch: aniAction } = useContext(aniContext)
	const JMKHook = useEditHook()
	const renderItem = useCallback(
		(item: assetData) => {
			return (
				<List.Item
					actions={
						ANI.aniList.find(m => m.asset.uuid === item.uuid)
							? [<Button size="small" type="link" onClick={removeItem(item)} icon={<MinusOutlined />} />]
							: [<Button size="small" type="link" onClick={addItem(item)} icon={<PlusOutlined />} />]
					}
					onClick={listClick(item)}
				>
					{[materialType.HOTPOINT, materialType.TEXT].includes(item.type) ? (
						<Typography.Text ellipsis={true}>{item.name}</Typography.Text>
					) : (
						<Popover
							placement="left"
							content={
								<>
									<img src={item.thumb || item.texture} width="200" />
								</>
							}
							title={item.name}
							trigger="hover"
						>
							<Typography.Text ellipsis={true}>{item.name}</Typography.Text>
						</Popover>
					)}
				</List.Item>
			)
		},
		[state, ANI.aniList, ANI.assetShow, ANI.tackList]
	)
	const addItem = useCallback(
		(item: assetData) => (e: React.MouseEvent) => {
			e.stopPropagation()
			const ani = JMKHook.addAnimation(item)
			// ：为了触发能监听到ANI.tackList 的变化
			ANI.tackList = ANI.tackList.concat({ aid: item.uuid, type: "fix", data: [] })
			ANI.selectAni = ani
			ANI.aniList = ANI.aniList.concat(ani)
			aniAction({
				type: "set",
				payload: ANI
			})
		},
		[ANI.aniList, ANI.assetShow, ANI.tackList]
	)
	const removeItem = useCallback(
		(item: assetData) => (e: React.MouseEvent) => {
			e.stopPropagation()
			ANI.selectAni = null
			ANI.selectTack = null
			ANI.selectCofType = ""
			ANI.tackList = ANI.tackList.filter(m => m.aid !== item.uuid)
			ANI.aniList = ANI.aniList.filter(m => m.name !== item.uuid)
			aniAction({
				type: "set",
				payload: ANI
			})
		},
		[ANI.aniList, ANI.assetShow, ANI.tackList]
	)
	const listClick = useCallback(
		(item: assetData) => () => {
			JMKHook.seeItem(item)
		},
		[state]
	)

	return (
		<div className="ani-asset-list">
			<List size="small" dataSource={data} renderItem={renderItem} rowKey="id" />
		</div>
	)
}
const AssetList = useMini(_AssetList)
export default AssetList
