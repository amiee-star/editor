import serviceLocal from "@/services/service.local"
import eventBus from "@/utils/event.bus"
import lsFunc from "@/utils/ls.func"
import { useForceUpdate } from "@/utils/use.func"
import {
	AimOutlined,
	CloseOutlined,
	DeleteOutlined,
	DragOutlined,
	EditOutlined,
	GatewayOutlined,
	InteractionOutlined,
	PlusOutlined,
	RiseOutlined,
	SaveOutlined
} from "@ant-design/icons"
import { Avatar, message, Modal, Space, Tooltip } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useEditHook } from "../jmk/jmk.engine"
import { JMKContext } from "../provider/jmk.context"
import { panelContext } from "../provider/panel.context"
import "./centerTop.menus.less"

const CenterTopMenus: React.FC = () => {
	const { state, dispatch } = useContext(panelContext)
	const { state: JMK } = useContext(JMKContext)
	const JMKHook = useEditHook()
	const [measureEnable, setMeasureEnable] = useState(false)
	const [rulerList, setRulerList] = useState(null)

	const saveAction = useCallback(() => {
		if (JMK.sceneCofing) {
			if (state.model === "material") {
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
				console.log(JMKHook.getSceneJson())
				const params = {
					id: JMK.sceneName,
					cover: {
						...JMK.sceneCofing,
						info: {
							...JMK.sceneCofing.info,
							extobjs: JMKHook.getAssetsJson(),
							sceneObjs: {
								views: JMKHook.getSceneJson().views,
								tours: JMKHook.getSceneJson().tours
							}
						}
					}
				}
				// Promise.all([
				// serviceLocal.sceneJsonEdit(JMK.sceneName, JMKHook.getSceneJson()),
				serviceLocal.setCover(params).then(res => {
					message.success("保存成功")
				})
				// 	serviceLocal.renderSettingsEdit(JMK.sceneName, lsFunc.getItem("bake"))
				// ]).then(([,]) => {
				// })
			} else {
			}
		}
	}, [state, JMK])
	const measure = useCallback(() => {
		if (JMK.jmt) {
			if (!rulerList) {
				let aaa = new JMK.jmt.RulerList()
				setRulerList(aaa)
				aaa.enable()
				setMeasureEnable(true)
			}
			if (!!rulerList && rulerList.enabled) {
				rulerList.disable()
				setMeasureEnable(false)
				return false
			}
			if (!!rulerList && !rulerList.enabled) {
				rulerList.enable()
				setMeasureEnable(true)
				return false
			}
		}
	}, [JMK, rulerList])
	const posiAsset = useCallback(() => {
		if (state.assetAction === "position") {
			dispatch({
				type: "set",
				payload: {
					assetAction: "none"
				}
			})
		} else {
			if (state.selectState) {
				Modal.confirm({
					content: "是否确认退出范围指定模式？",
					onOk() {
						dispatch({
							type: "set",
							payload: {
								selectState: false,
								assetAction: "position"
							}
						})
						JMK.editHook.enableAssetSelection()
					},
					onCancel() {}
				})
			} else {
				dispatch({
					type: "set",
					payload: {
						assetAction: "position"
					}
				})
			}
		}
	}, [state, JMK])
	const forceUpdate = useForceUpdate()
	const show = useMemo(() => true, [state])
	const [currentPosi, setCurrentPosi] = useState(null)
	useEffect(() => {
		eventBus.on("jmk.camara.change", () => {
			setCurrentPosi(null)
		})
		window.addEventListener("resize", () => {
			setCurrentPosi(null)
		})
	}, [])
	useEffect(() => {
		eventBus.on("jmk.assetClick", setposition)
		return () => {
			eventBus.off("jmk.assetClick", setposition)
		}
	})
	useEffect(() => {
		if (JMK.editHook) {
			if (!state.asset && !state.selectState) {
				dispatch({
					type: "set",
					payload: {
						assetAction: "none"
					}
				})
				setCurrentPosi(null)
			}
		}
	}, [state.asset, JMK, state.selectState])
	const setposition = e => {
		if (JMK.editHook && !!e) {
			const camera = JMK.editHook.getCamera()
			const aaa = e.position.project(camera)
			const posi = {
				x: aaa.x,
				y: aaa.y
			}
			aaa.unproject(camera)
			const halfWidth = window.innerWidth / 2
			const halfHeight = window.innerHeight / 2
			const initPosi = {
				x: posi.x * halfWidth + 120,
				y: -posi.y * halfHeight + halfHeight - 100
			}
			setCurrentPosi(initPosi)
		}
	}

	const removeItem = useCallback(() => {
		const asset = state.asset
		const cameraVolumes = [...JMK.editHook.getCameraVolumes()]
		cameraVolumes.forEach((element: any) => {
			if (element.pId === asset.uuid) {
				JMK.editHook.removeCameraVolume(element)
			}
		})
		JMKHook.removeAsset(asset)
		eventBus.emit("jmk.assetSelected", null)
	}, [state])
	const editItem = useCallback(() => {
		if (state.assetAction === "edit") {
			dispatch({
				type: "set",
				payload: {
					assetAction: "none"
				}
			})
		} else {
			dispatch({
				type: "set",
				payload: {
					assetAction: "edit"
				}
			})
		}
	}, [state])
	return (
		<div
			id="CenterTopMenus"
			style={{
				display: show ? "inline-flex" : "none",
				transform: "translate(-50%,0)"
			}}
		>
			<Space>
				<div onClick={saveAction} className="item">
					<Tooltip title="保存">
						<Avatar shape="square" size={40} icon={<SaveOutlined />} />
					</Tooltip>
				</div>
				<div
					onClick={posiAsset}
					className={classNames({
						item: true,
						checked: state.assetAction === "position"
					})}
				>
					<Tooltip title="素材定位">
						<Avatar shape="square" size={40} icon={<AimOutlined />} />
					</Tooltip>
				</div>
				<div
					onClick={measure}
					className={classNames({
						item: true,
						checked: !!measureEnable
					})}
				>
					<Tooltip title="测量">
						<Avatar shape="square" size={40} icon={<RiseOutlined />} />
					</Tooltip>
				</div>
				<div className="item none" data-action="addRulerBtn">
					<Tooltip title="添加测量尺">
						<Avatar shape="square" size={40} icon={<PlusOutlined />} />
					</Tooltip>
				</div>
				<div className="item none" data-action="cancelRulerBtn">
					<Tooltip title="取消测量">
						<Avatar shape="square" size={40} icon={<CloseOutlined />} />
					</Tooltip>
				</div>
				<div className="item none" data-action="removeRulerBtn">
					<Tooltip title="删除测量">
						<Avatar shape="square" size={40} icon={<DeleteOutlined />} />
					</Tooltip>
				</div>
			</Space>
			<div
				className="position-box"
				style={{
					left: !!currentPosi ? currentPosi.x : 0,
					top: !!currentPosi ? currentPosi.y : 0,
					display: !!currentPosi ? "block" : "none"
				}}
			>
				<div
					onClick={editItem}
					className={classNames({
						item: true,
						checked: state.assetAction === "edit"
					})}
				>
					<div
						style={{ display: !!currentPosi && state.model === "material" && !state.selectState ? "block" : "none" }}
					>
						<Tooltip title="修改">
							<Avatar shape="square" size={24} icon={<EditOutlined />} />
						</Tooltip>
					</div>
				</div>
				<div className="item" data-action="move">
					<Tooltip title="平移">
						<Avatar shape="square" size={24} icon={<DragOutlined />} />
					</Tooltip>
				</div>
				<div className="item" data-action="rotation">
					<Tooltip title="旋转">
						<Avatar shape="square" size={24} icon={<InteractionOutlined />} />
					</Tooltip>
				</div>
				<div className="item" data-action="scale">
					<Tooltip title="缩放">
						<Avatar shape="square" size={24} icon={<GatewayOutlined />} />
					</Tooltip>
				</div>
				<div
					className="item"
					onClick={removeItem}
					style={{ display: !!currentPosi && state.model === "material" && !state.selectState ? "block" : "none" }}
				>
					<Tooltip title="删除">
						<Avatar shape="square" size={24} icon={<DeleteOutlined />} />
					</Tooltip>
				</div>
			</div>
		</div>
	)
}

export default CenterTopMenus
