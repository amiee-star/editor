import { JMKContext } from "@/components/provider/jmk.context"
import { panelContext } from "@/components/provider/panel.context"
import Grow from "@/components/transitions/grow"
import "./objects.panel.less"
import { FormattedMessage, useIntl } from "umi"
import { Button, Row, Col, Tree, Select, Radio } from "antd"
import {
	PlusOutlined,
	CheckOutlined,
	CloseOutlined,
	EyeOutlined,
	DownOutlined,
	OrderedListOutlined,
	SortAscendingOutlined
} from "@ant-design/icons"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import JMKPanel from "./jmk.panel"
import OpationSelect from "@/components/form/select"
import NumberInput from "@/components/form/number.input"
import classNames from "classnames"
import { useEditHook } from "@/components/jmk/jmk.engine"
import { useForceUpdate } from "@/utils/use.func"
import eventBus from "@/utils/event.bus"
import ItemSwitch from "@/components/form/item.switch"

const ObjectPanel: React.FC = () => {
	const Intl = useIntl()
	const forceUpdate = useForceUpdate()
	const selectOpations = [
		{
			label: <FormattedMessage id="jmk.off" />,
			value: ""
		},
		{
			label: <FormattedMessage id="jmk.yaw" />,
			value: "yaw"
		},
		{
			label: <FormattedMessage id="jmk.yaw&pitch" />,
			value: "yaw&pitch"
		}
	]
	const sortOptions = [
		{
			label: <OrderedListOutlined />,
			value: "order"
		},
		{
			label: <SortAscendingOutlined />,
			value: "size"
		}
	]
	const JMKHook = useEditHook()
	const [currentObject, setCurrentObject] = useState(null)
	const [currentObjectkey, setCurrentObjectkey] = useState(null)
	const [currentOrder, setCurrentOrder] = useState("order")
	const { state: panelState } = useContext(panelContext)
	const { state, dispatch } = useContext(JMKContext)
	const objectsList: any[] = useMemo(() => (state.editHook ? JMKHook.getNodes() : []), [state.editHook])
	const saveData = useRef({})

	const sceneFaces: { geometryFacesCnt: number } = useMemo(
		() => (state.editHook ? JMKHook.getSceneStats() : []),
		[state.editHook]
	)
	const [currentSceneFaces, getSceneFaces] = useState<{ geometryFacesCnt: number }>(sceneFaces)

	const show = useMemo(
		() => panelState.model === "base" && panelState.current === "objects" && !!state.editHook,
		[panelState, state]
	)

	useEffect(() => {
		if (state.editHook && !!show) {
			JMKHook.enableNodeSelection()
		}
	}, [state.editHook, show])
	useEffect(() => {
		if (state.editHook && !currentObjectkey && !!show) {
			setCurrentObjectkey(treedobjects[0].id)
			setCurrentObject(treedobjects[0])
		}
	}, [state])
	// 跳转到实例
	const lookAtInstance = useCallback(
		(item: any) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			JMKHook.seeItem(item)
			JMKHook.selectNodes([item], item.config && item.config.nodes)
		},
		[currentObject]
	)
	const findDep = useCallback((node: any[] = []): any[] => {
		return node.sort(compareid).map(m => ({
			...m,
			title: m.config.name,
			key: m.id,
			icon: <EyeOutlined onClick={lookAtInstance(m)} />,
			children: m.children.length ? findDep(m.children) : []
		}))
	}, [])
	let compareid = (obj1: any, obj2: any) => {
		var val1 = obj1.id
		var val2 = obj2.id
		if (val1 < val2) {
			return -1
		} else if (val1 > val2) {
			return 1
		} else {
			return 0
		}
	}
	let comparename = (obj1: any, obj2: any) => {
		var val1 = obj1.config.name
		var val2 = obj2.config.name
		if (val1 < val2) {
			return -1
		} else if (val1 > val2) {
			return 1
		} else {
			return 0
		}
	}
	const findSizeDep = useCallback((node: any[] = []): any[] => {
		return node.sort(comparename).map(m => ({
			...m,
			title: m.config.name,
			key: m.id,
			icon: <EyeOutlined onClick={lookAtInstance(m)} />,
			children: m.children.length ? findDep(m.children) : []
		}))
	}, [])

	let treedobjects = findDep(objectsList)
	let orderlist = findSizeDep(objectsList)

	const viewsList: any[] = useMemo(() => state.editHook?.getViews() || [], [state.editHook])
	const [selectList, setSelectList] = useState([])
	useEffect(() => {
		if (viewsList) {
			let viewObjList: any[] = []
			viewsList.forEach(item => {
				viewObjList.push({ label: item.name, value: item.id })
			})
			setSelectList(viewObjList)
		}
	}, [viewsList])

	const addVk = useCallback((node: any[] = []): any[] => {
		return node.map(m => ({
			label: m.name,
			value: m.id
		}))
	}, [])

	const oldviewerarr = useRef([])

	const treedataSelect = useCallback(
		(selectedKeys, info) => {
			setCurrentObject(info.node)
			setCurrentObjectkey(info.node.key)
			JMKHook.selectNodes([info.node], info.node.config && info.node.config.nodes)
		},
		[currentObjectkey, currentObject]
	)
	const setNodeSelectedCallback = useCallback(
		item => {
			setCurrentObject(item)
			setCurrentObjectkey(item.id)
		},
		[currentObjectkey, currentObject]
	)
	useEffect(() => {
		if (state.editHook) {
			state.editHook.setNodeSelectedCallback(setNodeSelectedCallback)
		}
	}, [state.editHook])
	useEffect(() => {
		if (!!currentObject) {
			oldviewerarr.current = currentObject.config.hideInViews || []
		}
	}, [currentObject])
	useEffect(() => {
		eventBus.off("jmk.sceneChanged").on("jmk.sceneChanged", () => {
			setTimeout(() => {
				forceUpdate()
			}, 0)
		})
	}, [])
	const listorderChange = useCallback(
		selectedKeys => {
			setCurrentOrder(selectedKeys.target.value)
		},
		[currentOrder]
	)
	useEffect(() => {
		if (currentObject) {
			currentObject.config.setsDisableCollisions = currentObject.config.disableCollisions
		}
	}, [currentObject?.config.disableCollisions])
	return (
		<JMKPanel title={<FormattedMessage id="jmk.objects" />}>
			<div id="ObjectsPanel">
				<Row gutter={[0, 16]}>
					<Col span={24} className="flex-cn disborder">
						{<FormattedMessage id="jmk.objectslist" />}
						{!!treedobjects && (
							<Radio.Group
								className="ordersize"
								size="small"
								value={currentOrder}
								buttonStyle="solid"
								onChange={listorderChange}
							>
								{sortOptions.map(m => {
									return (
										<Radio.Button key={m.value} value={m.value}>
											{m.label}
										</Radio.Button>
									)
								})}
							</Radio.Group>
						)}
					</Col>
				</Row>
				<Tree
					showIcon
					selectedKeys={[currentObjectkey]}
					className="Objectstree"
					showLine
					height={180}
					switcherIcon={<DownOutlined />}
					defaultExpandedKeys={["0-0-0"]}
					onSelect={treedataSelect}
					treeData={currentOrder == "order" ? treedobjects : orderlist}
				/>
				{!!currentObject && (
					<>
						<div className="instancesList">
							<Row gutter={[0, 16]}>
								<Col span={24} className="flex-cn disborder">
									{<FormattedMessage id="jmk.objectsparameters" />}
								</Col>
							</Row>
							<Row gutter={10} align="middle">
								<Col span={12} className="turright">
									{<FormattedMessage id="jmk.faces" />}：
								</Col>
								<Col span={12}>{currentObject._facesCnt}</Col>
								<Col span={12} className="turright">
									{<FormattedMessage id="jmk.lightmapresolution" />}：
								</Col>
								{!currentObject.config.setsLightmapResolution && <Col span={12}>global(75)</Col>}
								{!!currentObject.config.setsLightmapResolution && (
									<Col span={12}>{currentObject.config.lightmapResolution}</Col>
								)}
								<Col span={12} className="turright">
									{<FormattedMessage id="jmk.collisions" />}：
								</Col>
								{!currentObject.config.disableCollisions && <Col span={12}>enabled</Col>}
								{!!currentObject.config.disableCollisions && <Col span={12}>disabled</Col>}
								{!!currentObject.config.isolateShadows && (
									<>
										<Col span={12} className="turright">
											{<FormattedMessage id="jmk.shadowsisolatedwithin" />}：
										</Col>
										<Col span={12}>{currentObject.config.name}</Col>
									</>
								)}
								{currentObject.config.hideInViews != null && currentObject.config.hideInViews.length > 0 && (
									<>
										<Col span={12} className="turright">
											{<FormattedMessage id="jmk.hiddeninviews" />}：
										</Col>
										<Col span={12}>
											{currentObject.config.hideInViews.map((item: any, index: number) => {
												const view = selectList.find(n => n.value === item)
												if (!view) {
													currentObject.config.hideInViews.splice(index, 1)
												} else {
													if (index === 0) {
														return <span>{view.label}</span>
													} else {
														return <span>,{view.label}</span>
													}
												}
											})}
										</Col>
									</>
								)}
							</Row>
						</div>
						<div className="instancesList">
							<Row gutter={[0, 16]}>
								<Col span={24} className="flex-cn">
									{<FormattedMessage id="jmk.objectstype" />}
								</Col>
							</Row>
							<Row gutter={10} align="middle">
								<Col span={12} className="turright">
									{<FormattedMessage id="jmk.type" />}：
								</Col>
								<Col span={12}>{currentObject.config.name}</Col>
							</Row>
							<Row gutter={10} align="middle">
								<Col span={12} className="turright">
									{<FormattedMessage id="jmk.instances" />}：
								</Col>
								<Col span={12}>1</Col>
							</Row>
							<Row gutter={10} align="middle">
								<Col span={12} className="turright">
									{<FormattedMessage id="jmk.objectcustomlightmapresolution" />}：
								</Col>
								<Col span={12}>
									{/* <Checkbox checked={currentObject.config._setsLightmapResolution} onChange={value => {}}></Checkbox> */}
									<ItemSwitch
										size="small"
										forceUpdate={forceUpdate}
										item={currentObject.config}
										valueKey="setsLightmapResolution"
									/>
								</Col>
							</Row>
							{!!currentObject.config.setsLightmapResolution && (
								<Row gutter={10} align="middle">
									<Col span={12} offset={12} className="">
										<NumberInput
											item={currentObject.config}
											valueKey="lightmapResolution"
											forceUpdate={forceUpdate}
											min={0}
											max={2048}
											defaultValue={75}
										/>
									</Col>
								</Row>
							)}
							<Row gutter={10} align="middle">
								<Col span={12} className="turright">
									{<FormattedMessage id="jmk.objectcustomcollisionssettings" />}：
								</Col>
								<Col span={12}>
									{/* <Checkbox checked={currentObject.config._disableCollisions} onChange={value => {}}></Checkbox> */}
									<ItemSwitch
										size="small"
										forceUpdate={forceUpdate}
										item={currentObject.config}
										valueKey="disableCollisions"
									/>
								</Col>
							</Row>
							<Row gutter={10} align="middle">
								<Col span={12} className="turright">
									{<FormattedMessage id="jmk.objectisolateshadows" />}：
								</Col>
								<Col span={12}>
									{/* <Checkbox checked={currentObject.config._isolateShadows} onChange={value => {}}></Checkbox> */}
									<ItemSwitch
										size="small"
										forceUpdate={forceUpdate}
										item={currentObject.config}
										valueKey="_isolateShadows"
									/>
								</Col>
							</Row>
							<Row gutter={10} align="middle">
								<Col span={12} className="turright">
									{<FormattedMessage id="jmk.objectCustomhideinviews" />}：
								</Col>
								<Col span={12}>
									{/* <Checkbox checked={currentObject.config._setsHideInViews} onChange={value => {}}></Checkbox> */}
									<ItemSwitch
										size="small"
										forceUpdate={forceUpdate}
										item={currentObject.config}
										valueKey="_setsHideInViews"
									/>
								</Col>
							</Row>
							{!!currentObject.config.setsHideInViews && (
								<>
									<Row gutter={10} align="middle">
										<Col span={24}>
											<OpationSelect
												item={currentObject.config}
												mode="multiple"
												valueKey="hideInViews"
												forceUpdate={forceUpdate}
												options={selectList}
											/>
										</Col>
									</Row>
								</>
							)}
							<Row gutter={10} align="middle">
								<Col span={12} className="turright">
									{<FormattedMessage id="jmk.y_to_camera" />}：
								</Col>
								<Col span={12}>
									<OpationSelect
										item={currentObject.config}
										valueKey="faceCamera"
										forceUpdate={forceUpdate}
										options={selectOpations}
									/>
								</Col>
							</Row>
						</div>
					</>
				)}
				{!!currentSceneFaces && (
					<div className="instancesList">
						<Row gutter={[0, 16]}>
							<Col span={24} className="flex-cn">
								{<FormattedMessage id="jmk.scenestatistics" />}
							</Col>
						</Row>
						<Row gutter={10} align="middle">
							<Col span={12} className="turright">
								{<FormattedMessage id="jmk.faces" />}：
							</Col>
							<Col span={12}>{currentSceneFaces.geometryFacesCnt}</Col>
						</Row>
					</div>
				)}
			</div>
		</JMKPanel>
	)
}
export default ObjectPanel
