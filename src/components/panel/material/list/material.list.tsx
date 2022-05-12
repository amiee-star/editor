import { useEditHook } from "@/components/jmk/jmk.engine"
import { aniContext } from "@/components/provider/ani.context"
import { JMKContext } from "@/components/provider/jmk.context"
import { panelContext } from "@/components/provider/panel.context"
import { materialType } from "@/constant/jmk.type"
import { aniData } from "@/interfaces/ani.interface"
import { assetData } from "@/interfaces/extdata.interface"
import serviceAnimation from "@/services/service.animation"
import eventBus from "@/utils/event.bus"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { DeleteOutlined, ExclamationCircleOutlined, SettingOutlined } from "@ant-design/icons"
import { Button, List, message, Modal, Popover, Typography } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useState } from "react"
import "./material.list.less"

interface Props {
	data: assetData[]
}
const { confirm } = Modal
const _MaterialList: React.FC<Props> = props => {
	const forceUpdate = useForceUpdate()
	const { data } = props
	const { state, dispatch } = useContext(panelContext)
	const [currentAsset, setCurrentAsset] = useState<assetData>(null)
	const { state: JMK } = useContext(JMKContext)
	const { state: ANI } = useContext(aniContext)
	const JMKHook = useEditHook()

	const renderItem = useCallback(
		(item: assetData) => {
			return (
				<List.Item
					className={classNames({
						current: currentAsset === item
					})}
					actions={[
						<Button size="small" type="link" onClick={editItem(item)} icon={<SettingOutlined />} />,
						<Button size="small" type="link" onClick={removeItem(item)} icon={<DeleteOutlined />} />
					]}
					onClick={listClick(item)}
				>
					{[materialType.HOTPOINT, materialType.TEXT].includes(item.type) || item.contentType == 11 ? (
						<Typography.Text ellipsis={true}>{item.extdata.info.custom.tag.title + item.type}</Typography.Text>
					) : (
						<Popover
							placement="left"
							content={
								<>
									<img src={item.thumb || item.texture} width="200" />
								</>
							}
							title={item.extdata.info.custom.tag.title}
							trigger="hover"
						>
							<Typography.Text ellipsis={true}>{item.extdata.info.custom.tag.title}</Typography.Text>
						</Popover>
					)}
				</List.Item>
			)
		},
		[currentAsset, JMK]
	)
	const editItem = useCallback(
		(item: assetData) => (e: React.MouseEvent) => {
			if (!item.uuid) {
				message.error("素材还未加载完成")
				return false
			}
			e.stopPropagation()
			eventBus.emit("jmk.assetSelected", item)
		},
		[JMK]
	)
	// 保存animate.json
	const saveAction = useCallback(
		id => {
			if (JMK.editHook) {
				const allAnimations: aniData[] = JMKHook.getAnimationsJson()

				serviceAnimation
					.setAnimation({
						id: JMK.sceneName,
						animation: allAnimations
							.filter(m => m.channels.length && m.channels[0].target.node !== id)
							.map((m: any) => ({ ...m, sampleFrame: ANI.sample }))
					})
					.then(() => {})
			}
		},
		[ANI, JMK]
	)
	const removeItem = useCallback(
		(item: assetData) => (e: React.MouseEvent) => {
			if (!item.uuid) {
				message.error("素材还未加载完成")
				return false
			}
			e.stopPropagation()
			const cameraVolumes = [...JMK.editHook.getCameraVolumes()]
			if (item.animations) {
				confirm({
					title: "该素材中包含动画，是否确认删除？",
					icon: <ExclamationCircleOutlined />,
					okText: "Yes",
					okType: "danger",
					cancelText: "No",
					onOk() {
						saveAction(item.uuid)
						cameraVolumes.forEach((element: any) => {
							if (element.pId === item.uuid) {
								JMK.editHook.removeCameraVolume(element)
							}
						})
						JMKHook.removeAsset(item)
						if (item === currentAsset) {
							eventBus.emit("jmk.assetSelected", null)
						}
					},
					onCancel() {}
				})
			} else {
				cameraVolumes.forEach((element: any) => {
					if (element.pId === item.uuid) {
						JMK.editHook.removeCameraVolume(element)
					}
				})

				JMKHook.removeAsset(item)
				if (item === currentAsset) {
					eventBus.emit("jmk.assetSelected", null)
				}
			}
		},
		[JMK, currentAsset, ANI]
	)

	const listClick = useCallback(
		(item: assetData) => () => {
			JMKHook.seeItem(item)
			// eventBus.emit("jmk.assetSelected", item)
		},
		[JMK]
	)
	const assetClick = useCallback(e => {
		setCurrentAsset(e)
		eventBus.emit("jmk.assetClick", e)
	}, [])

	useEffect(() => {
		eventBus.off("jmk.assetSelected", assetClick)
		eventBus.off("jmk.assetAdd", setCurrentAsset)
		eventBus.off("jmk.name.change", forceUpdate)
		eventBus.on("jmk.assetAdd", setCurrentAsset)
		eventBus.on("jmk.assetSelected", assetClick)
		eventBus.on("jmk.name.change", forceUpdate)
		return () => {
			eventBus.off("jmk.assetSelected", assetClick)
			eventBus.off("jmk.assetAdd", setCurrentAsset)
			eventBus.off("jmk.name.change", forceUpdate)
		}
	}, [])

	return (
		<div id="MaterialList">
			<List size="small" dataSource={data} renderItem={renderItem} rowKey="id" />
		</div>
	)
}
const MaterialList = useMini(_MaterialList)
export default MaterialList
