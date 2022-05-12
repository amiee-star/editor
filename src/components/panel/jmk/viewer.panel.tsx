import { JMKContext } from "@/components/provider/jmk.context"
import "./viewer.panel.less"
import { FormattedMessage, useIntl } from "umi"
import { Button, List, Row, Col, Checkbox, message, Modal, Divider } from "antd"
import {
	PlusOutlined,
	CloseOutlined,
	ToTopOutlined,
	CaretUpOutlined,
	CaretDownOutlined,
	ColumnHeightOutlined,
	FieldTimeOutlined,
	EditOutlined,
	ExclamationCircleOutlined
} from "@ant-design/icons"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import JMKPanel from "./jmk.panel"
import classNames from "classnames"
import { useEditHook } from "@/components/jmk/jmk.engine"
import eventBus from "@/utils/event.bus"
import { useForceUpdate } from "@/utils/use.func"
import ItemSwitch from "@/components/form/item.switch"
import { CheckboxChangeEvent } from "antd/lib/checkbox"
import { panelContext } from "@/components/provider/panel.context"
import Grow from "@/components/transitions/grow"
import { AsyncModal } from "@/components/modal/modal.context"
import ScreenModal from "@/components/modal/async/screen.modal"
import urlFunc from "@/utils/url.func"
import NumberInput from "@/components/form/number.input"
import SettingViewerModal from "@/components/modal/async/settingViewer.modal"
import ItemSlider from "@/components/form/item.slider"

const ViewerPanel: React.FC = () => {
	const Intl = useIntl()
	const forceUpdate = useForceUpdate()
	const JMKHook = useEditHook()
	const { state } = useContext(JMKContext)
	const { state: panelState, dispatch } = useContext(panelContext)
	// 相机位列表
	const viewsList: any[] = useMemo(() => state.editHook?.getViews() || [], [state.editHook])
	const tourList: any[] = useMemo(() => state.editHook?.getTours() || [], [state.editHook])
	const [panelStatus, setPanelStatus] = useState({
		edit: false,
		move: false,
		setTime: false,
		editTour: null
	})
	const [currentView, setCurrentView] = useState(null)
	const [currentTour, setCurrentTour] = useState(null)
	const switchStart = useCallback(
		item => {
			tourList.filter(m => m.id !== item.id && !!m.startOnSceneLoad).forEach(m => (m.startOnSceneLoad = false))
		},
		[tourList]
	)
	const show = useMemo(
		() => panelState.model === "base" && panelState.current === "viewer" && panelState.action === "edit",
		[panelState, state]
	)
	useEffect(() => {
		if (state.editHook) {
			JMKHook.disableSelection()
		}
	}, [state.editHook])
	useEffect(() => {
		if (tourList) {
			setCurrentTour(tourList[0])
		}
	}, [tourList])
	useEffect(() => {
		if (viewsList) {
			setCurrentView(viewsList.filter(m => !m.internal)[0])
		}
	}, [viewsList])
	const sceneChanged = useCallback(() => {
		setTimeout(() => {
			forceUpdate()
		}, 0)
	}, [])
	useEffect(() => {
		eventBus.off("jmk.sceneChanged", sceneChanged).on("jmk.sceneChanged", sceneChanged)
		return () => {
			eventBus.off("jmk.sceneChanged", sceneChanged)
		}
	}, [])
	useEffect(() => {
		eventBus.off("jmk.view.change", setCurrentView).on("jmk.view.change", setCurrentView)
	}, [])

	// 点击view
	const clickView = useCallback(
		(item: any) => () => {
			setCurrentView(item)
			JMKHook.switchToView(item)
		},
		[state]
	)
	// 添加view
	const addView = useCallback(
		(type: string, viewName?: string, view?: any) => async (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			const nameList: string[] = []
			viewsList.forEach((item: any) => {
				if (!viewName || viewName !== item.name) {
					nameList.push(item.name)
				}
			})
			const info = { name: viewName, nameList: nameList, type: viewName ? 4 : 3 }
			const aaaa: any = await AsyncModal({
				content: SettingViewerModal,
				params: { info }
			})
			if (!!viewName) {
				view.name = aaaa
				forceUpdate()
			} else {
				setCurrentView(JMKHook.addViewFromCamera(aaaa, type))
			}
		},
		[state, viewsList]
	)
	// 删除视图
	const [reView, setReView] = useState(null)
	const removeView = useCallback(
		(item: any, index) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			Modal.confirm({
				icon: <ExclamationCircleOutlined />,
				content: "删除视图会解除和传送门的绑定关系，删除后不可恢复,是否确认删除？",
				okText: "确认",
				okType: "danger",
				cancelText: "取消",
				onOk() {
					const list = viewsList.filter(a => !a.internal)
					const newIndex = list.findIndex(i => i === currentView)
					if (list.length === 1) {
						setCurrentView(null)
					} else if (list.length > 1 && index === newIndex && index === 0) {
						setCurrentView(list[1])
					} else if (list.length > 1 && index === newIndex && index !== 0) {
						setCurrentView(list[index - 1])
					}
					// 在tour中删除对应的view
					tourList.forEach(item1 => {
						const indexNumber = Array.from(item1.views).findIndex((a: any) => a.id === item.id)
						console.log(indexNumber)
						if (indexNumber >= 0) {
							item1.views.splice(indexNumber, 1)
						}
					})
					setReView(item)
					viewsList.splice(index + 1, 1)
					//
				}
			})
		},
		[state, currentView, viewsList]
	)
	//移动视图  type  0置顶  1上移  2下移
	const moveView = useCallback(
		(item: any, type: number) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			const list = viewsList.filter(a => !a.internal)
			const newIndex = list.findIndex(i => i === item)
			let moveIndex = 0
			if (type === 1) {
				moveIndex = viewsList.findIndex(j => j === list[newIndex - 1])
			} else if (type === 2) {
				moveIndex = viewsList.findIndex(j => j === list[newIndex + 1])
			}
			forceUpdate()
			JMKHook.shiftView(item, moveIndex)
			eventBus.emit("tour.change")
		},
		[state, forceUpdate]
	)
	// 重置view 相机方向
	const resetView = useCallback(() => {
		JMKHook.resetViewFromCamera(currentView)
		eventBus.emit("tour.change")
	}, [state, currentView])
	// 点击导览路径
	const clickTour = useCallback(
		(item: any) => () => {
			if (panelStatus.edit || panelStatus.move) {
				message.error("当前修改尚未保存")
			} else {
				setCurrentTour(item)
			}
		},
		[state, panelStatus]
	)
	// 添加tour 修改
	const addTour = useCallback(
		(tourName: any) => async () => {
			const nameList: string[] = ["topView", "fpsView", "orbitView"]
			tourList.forEach((item: any) => {
				if (!tourName || tourName !== item.name) {
					nameList.push(item.name)
				}
			})
			const info = { name: tourName, nameList: nameList, type: tourName ? 2 : 1 }
			const aaaa: any = await AsyncModal({
				content: SettingViewerModal,
				params: { info }
			})
			if (!!tourName) {
				currentTour.name = aaaa
				forceUpdate()
			} else {
				setCurrentTour(JMKHook.addTour({ name: aaaa }))
			}
		},
		[currentTour, tourList]
	)
	// 删除tour
	const removeTour = useCallback(
		(item: any, index: number) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			Modal.confirm({
				icon: <ExclamationCircleOutlined />,
				content: "删除导览路径会解除和传送门的绑定关系，删除后不可恢复,是否确认删除？",
				okText: "确认",
				okType: "danger",
				cancelText: "取消",
				onOk() {
					const newIndex = tourList.findIndex(i => i === currentTour)
					if (tourList.length === 1) {
						setCurrentTour(null)
					} else if (tourList.length > 1 && index === newIndex && index === 0) {
						setCurrentTour(tourList[1])
					} else if (tourList.length > 1 && index === newIndex && index !== 0) {
						setCurrentTour(tourList[index - 1])
					}
					JMKHook.removeTour(item)
				}
			})
		},
		[state, currentTour, tourList]
	)
	// 修改tour里边的view
	const editTourView = useCallback(
		(item: any, type: number) => (e: React.MouseEvent<HTMLDivElement>) => {
			// type  1 添加 tourView   2 移动tourView  3 设置时间
			e.stopPropagation()
			setPanelStatus({
				edit: type == 1 ? true : false,
				move: type == 2 ? true : false,
				setTime: type == 3 ? true : false,
				editTour: { ...item, id: item.id, views: [...item.views] }
			})
		},
		[currentTour]
	)
	// 复选框 修改
	const checkView = useCallback(
		(id: number) => (e: CheckboxChangeEvent) => {
			e.stopPropagation()
			const viewsOld: any[] = panelStatus.editTour.views
			setPanelStatus({
				...panelStatus,
				editTour: {
					...panelStatus.editTour,
					views: e.target.checked
						? viewsOld.concat([{ id: id, moveTime: 1, stopTime: 1, evenMove: false }])
						: viewsOld.filter(m => m.id !== id)
				}
			})
		},
		[panelStatus]
	)
	// 移动 tour里边的view type  0置顶  1上移  2下移
	const moveTourView = useCallback(
		(index: number, type: number) => () => {
			if (type === 0) {
				panelStatus.editTour.views.unshift(panelStatus.editTour.views.splice(index, 1)[0])
			} else if (type === 1) {
				panelStatus.editTour.views[index] = panelStatus.editTour.views.splice(
					index - 1,
					1,
					panelStatus.editTour.views[index]
				)[0]
			} else if (type === 2) {
				panelStatus.editTour.views[index] = panelStatus.editTour.views.splice(
					index + 1,
					1,
					panelStatus.editTour.views[index]
				)[0]
			}
			forceUpdate()
		},
		[panelStatus]
	)
	// 取消
	const cancel = useCallback(() => {
		setPanelStatus({
			edit: false,
			move: false,
			setTime: false,
			editTour: null
		})
	}, [])
	// 确认
	const addViewOK = useCallback(() => {
		tourList[tourList.findIndex(m => m.id === panelStatus.editTour.id)].views = panelStatus.editTour.views
		setPanelStatus({
			edit: false,
			move: false,
			setTime: false,
			editTour: null
		})
		eventBus.emit("tour.change")
	}, [panelStatus, tourList])
	// 截图
	const setViewThumb = useCallback(async () => {
		dispatch({
			type: "set",
			payload: {
				action: "screen"
			}
		})
		JMKHook.markScreenshotArea(document.body.clientWidth / document.body.clientHeight)
		const data = await AsyncModal({
			content: ScreenModal,
			mask: false,
			params: {
				type: 2
			}
		})
		if (data) {
			currentView.thumb = data
			eventBus.emit("jmk.pic.change")
		}
	}, [state, currentView])
	const changeSwitch = useCallback(() => {
		eventBus.emit("jmk.showMenu.change")
	}, [state, currentView])
	const addThreeView = useCallback(
		(type, name) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			const newView = JMKHook.addViewFromCamera(name, type)
			newView.internal = true
			setCurrentView(newView)
			initThreeView()
		},
		[]
	)
	const removeThreeView = useCallback(
		item => (e: React.MouseEvent<HTMLDivElement>) => {
			e.stopPropagation()
			const index = viewsList.findIndex(a => a === item)
			viewsList.splice(index, 1)
			initThreeView()
		},
		[]
	)
	const [threeView, setThreeView] = useState([])
	const initThreeView = useCallback(() => {
		if (viewsList.length > 0) {
			const topView = viewsList.find(a => a.name === "topView")
			const fpsView = viewsList.find(a => a.name === "fpsView")
			const orbitView = viewsList.find(a => a.name === "orbitView")
			let threeList = []
			!!topView && threeList.push(topView)
			!!fpsView && threeList.push(fpsView)
			!!orbitView && threeList.push(orbitView)
			setThreeView(threeList)
		}
	}, [])
	useCallback(() => {
		initThreeView()
	}, [])
	const nameList = {
		topView: "鸟瞰视图",
		fpsView: "漫游视图",
		orbitView: "三维视图"
	}
	return (
		<Grow in={show}>
			<div>
				<JMKPanel title={<FormattedMessage id="jmk.viewer" />}>
					<div id="ViewerPanel">
						<Row gutter={[0, 10]} align="middle">
							<Col span={24} className="flex-cn">
								{<FormattedMessage id="jmk.tour_list" />}
							</Col>
							<Col span={24} className="flex-cn">
								<Button type="dashed" size="small" icon={<PlusOutlined />} block onClick={addTour("")}>
									{<FormattedMessage id="jmk.tour" />}
								</Button>
							</Col>
						</Row>
						<List
							size="small"
							bordered
							dataSource={tourList}
							renderItem={(item: any, index: number) => (
								<List.Item
									className={classNames({ lightsListActive: item === currentTour })}
									actions={[]
										.concat(
											item === currentTour
												? [
														<Button size="small" type="link" icon={<PlusOutlined />} onClick={editTourView(item, 1)} />,
														<Button
															size="small"
															type="link"
															icon={<ColumnHeightOutlined />}
															onClick={editTourView(item, 2)}
														/>,
														<Button
															size="small"
															type="link"
															icon={<FieldTimeOutlined />}
															onClick={editTourView(item, 3)}
														/>,
														<Button size="small" type="link" icon={<EditOutlined />} onClick={addTour(item.name)} />
												  ]
												: []
										)
										.concat(
											!panelStatus.edit && !panelStatus.move
												? [
														<Button
															size="small"
															type="link"
															icon={<CloseOutlined />}
															onClick={removeTour(item, index)}
														/>
												  ]
												: []
										)}
									onClick={clickTour(item)}
								>
									{item.name}
								</List.Item>
							)}
						/>

						{/* tour添加view组件 */}
						{panelStatus.edit && !panelStatus.setTime && !panelStatus.move && (
							<>
								<Row gutter={[0, 10]} align="middle" style={{ marginTop: "20px", marginBottom: "10px" }}>
									<Col span={24} className="flex-cn">
										{<FormattedMessage id="jmk.views" />}
									</Col>
								</Row>
								<List
									size="small"
									bordered
									dataSource={viewsList.filter(m => !m.internal)}
									renderItem={item => (
										<List.Item
											actions={[
												<Checkbox
													checked={!!Array.from(panelStatus.editTour.views).find((a: any) => a.id === item.id)}
													onChange={checkView(item.id)}
												></Checkbox>
											]}
										>
											{item.name}
										</List.Item>
									)}
								/>
								<Row gutter={[0, 10]} align="middle">
									<Col span={12} className="flex-cn">
										<Button type="dashed" size="small" block onClick={addViewOK}>
											{<FormattedMessage id="jmk.confirm" />}
										</Button>
									</Col>
									<Col span={12} className="flex-cn">
										<Button type="dashed" size="small" block onClick={cancel}>
											{<FormattedMessage id="jmk.cancel" />}
										</Button>
									</Col>
								</Row>
							</>
						)}
						{/* tour移动view组件 */}
						{!panelStatus.edit && !panelStatus.setTime && panelStatus.move && (
							<>
								<Row gutter={[0, 10]} align="middle" style={{ marginTop: "20px", marginBottom: "10px" }}>
									<Col span={24} className="flex-cn">
										{<FormattedMessage id="jmk.views" />}
									</Col>
								</Row>
								<List
									size="small"
									bordered
									dataSource={panelStatus.editTour.views}
									renderItem={(item: any, index) => (
										<List.Item
											actions={[]
												.concat(
													index === 0
														? []
														: [
																<Button
																	size="small"
																	type="link"
																	icon={<ToTopOutlined />}
																	onClick={moveTourView(index, 0)}
																/>, // 置顶
																<Button
																	size="small"
																	type="link"
																	icon={<CaretUpOutlined />}
																	onClick={moveTourView(index, 1)}
																/> // 上移
														  ]
												)
												.concat(
													index === viewsList.filter(m => !m.internal).length - 1
														? []
														: [
																<Button
																	size="small"
																	type="link"
																	icon={<CaretDownOutlined />}
																	onClick={moveTourView(index, 2)}
																/>
														  ] // 下移
												)}
										>
											{viewsList.find(m => m.id === item.id)?.name}
										</List.Item>
									)}
								/>
								<Row gutter={[0, 10]} align="middle">
									<Col span={12} className="flex-cn">
										<Button type="dashed" size="small" block onClick={addViewOK}>
											{<FormattedMessage id="jmk.confirm" />}
										</Button>
									</Col>
									<Col span={12} className="flex-cn">
										<Button type="dashed" size="small" block onClick={cancel}>
											{<FormattedMessage id="jmk.cancel" />}
										</Button>
									</Col>
								</Row>
							</>
						)}
						{/* tour里view修改时间 */}
						{!panelStatus.edit && panelStatus.setTime && !panelStatus.move && (
							<>
								<Row gutter={[0, 10]} align="middle" style={{ marginTop: "20px", marginBottom: "10px" }}>
									<Col span={9} className="flex-cn">
										{<FormattedMessage id="jmk.views" />}
									</Col>
									<Col span={4} className="flex-cn">
										跳转时间
									</Col>
									<Col span={1} className="flex-cn"></Col>
									<Col span={4} className="flex-cn">
										停留时间
									</Col>
									<Col span={1} className="flex-cn"></Col>
									<Col span={4} className="flex-cn">
										匀速跳转
									</Col>
								</Row>
								{panelStatus.editTour.views.map((item: any, index: number) => {
									return (
										<Row key={item.id} style={{ marginBottom: "10px" }}>
											<Col span={9} className="flex-cn">
												{viewsList.find(m => m.id === item.id)?.name}
											</Col>
											<Col span={4} className="flex-cn">
												<NumberInput
													item={item}
													valueKey="moveTime"
													defaultValue={1}
													precision={1}
													min={0.1}
													max={1000}
													step={0.1}
												/>
											</Col>
											<Col span={1} className="flex-cn"></Col>
											<Col span={4} className="flex-cn">
												<NumberInput
													item={item}
													valueKey="stopTime"
													defaultValue={1}
													precision={1}
													min={0}
													max={1000}
													step={0.1}
												/>
											</Col>
											<Col span={1} className="flex-cn"></Col>
											<Col span={4} className="flex-cn">
												<ItemSwitch size="small" forceUpdate={forceUpdate} item={item} valueKey="evenMove" />
											</Col>
										</Row>
									)
								})}
								<Row gutter={[0, 10]} align="middle">
									<Col span={12} className="flex-cn">
										<Button type="dashed" size="small" block onClick={addViewOK}>
											{<FormattedMessage id="jmk.confirm" />}
										</Button>
									</Col>
									<Col span={12} className="flex-cn">
										<Button type="dashed" size="small" block onClick={cancel}>
											{<FormattedMessage id="jmk.cancel" />}
										</Button>
									</Col>
								</Row>
							</>
						)}
						<Divider />
						{!panelStatus.edit && !panelStatus.move && !panelStatus.setTime && (
							<>
								<Row gutter={[0, 10]} align="middle">
									<Col span={24} className="flex-cn">
										{<FormattedMessage id="jmk.views" />}
									</Col>
									<Col span={8} className="flex-cn">
										<Button
											size="small"
											block
											onClick={addThreeView("fps", "fpsView")}
											disabled={threeView.find(a => a.name === "fpsView")}
										>
											{<FormattedMessage id="jmk.view.manyou" />}
										</Button>
									</Col>
									<Col span={8} className="flex-cn">
										<Button
											size="small"
											block
											onClick={addThreeView("top", "topView")}
											disabled={threeView.find(a => a.name === "topView")}
										>
											{<FormattedMessage id="jmk.view.niaokan" />}
										</Button>
									</Col>
									<Col span={8} className="flex-cn">
										<Button
											size="small"
											block
											onClick={addThreeView("orbit", "orbitView")}
											disabled={threeView.find(a => a.name === "orbitView")}
										>
											{<FormattedMessage id="jmk.view.sanwei" />}
										</Button>
									</Col>
									<Col span={24} className="flex-cn">
										<List
											size="small"
											bordered
											dataSource={threeView}
											renderItem={(item: any, index) => (
												<List.Item
													actions={[
														<Button size="small" type="link" icon={<CloseOutlined />} onClick={removeThreeView(item)} />
													]}
													onClick={clickView(item)}
												>
													{nameList[item.name]}
												</List.Item>
											)}
										/>
									</Col>
									<Divider />
									<Col span={8} className="flex-cn">
										<Button type="dashed" size="small" icon={<PlusOutlined />} block onClick={addView("fps")}>
											{<FormattedMessage id="jmk.fps" />}
										</Button>
									</Col>
									<Col span={8} className="flex-cn">
										<Button type="dashed" size="small" icon={<PlusOutlined />} block onClick={addView("top")}>
											{<FormattedMessage id="jmk.top" />}
										</Button>
									</Col>
									<Col span={8} className="flex-cn">
										<Button type="dashed" size="small" icon={<PlusOutlined />} block onClick={addView("orbit")}>
											{<FormattedMessage id="jmk.orbit" />}
										</Button>
									</Col>
								</Row>
								<List
									size="small"
									bordered
									dataSource={viewsList.filter(m => !m.internal)}
									renderItem={(item, index) => (
										<List.Item
											className={classNames({ lightsListActive: item === currentView })}
											actions={[]
												.concat(
													index === 0
														? []
														: [
																<Button
																	size="small"
																	type="link"
																	icon={<ToTopOutlined />}
																	onClick={moveView(item, 0)}
																/>, // 置顶
																<Button
																	size="small"
																	type="link"
																	icon={<CaretUpOutlined />}
																	onClick={moveView(item, 1)}
																/> // 上移
														  ]
												)
												.concat(
													index === viewsList.filter(m => !m.internal).length - 1
														? []
														: [
																<Button
																	size="small"
																	type="link"
																	icon={<CaretDownOutlined />}
																	onClick={moveView(item, 2)}
																/>
														  ] // 下移
												)
												.concat([
													<Button
														size="small"
														type="link"
														icon={<EditOutlined />}
														onClick={addView("fps", item.name, item)}
													/>,
													<Button size="small" type="link" icon={<CloseOutlined />} onClick={removeView(item, index)} />
												])}
											onClick={clickView(item)}
										>
											{item.name}
										</List.Item>
									)}
								/>
							</>
						)}
						{!!currentView && !panelStatus.move && !panelStatus.edit && !panelStatus.setTime && (
							<>
								<Row gutter={[0, 10]} align="middle" style={{ marginTop: "10px" }}>
									<Col span={6} className="formLable">
										{<FormattedMessage id="jmk.navigation" />}：
									</Col>
									<Col span={18}>
										{currentView.isTop() ? (
											<FormattedMessage id="jmk.top" />
										) : currentView.isOrbit() ? (
											<FormattedMessage id="jmk.orbit" />
										) : (
											<FormattedMessage id="jmk.fps" />
										)}
									</Col>
									<Col span={6} className="formLable">
										{<FormattedMessage id="jmk.camera_orientation" />}：
									</Col>
									<Col span={18}>
										<Button size="small" onClick={resetView}>
											{<FormattedMessage id="jmk.set_current" />}
										</Button>
									</Col>
									<Col span={6} className="formLable">
										{<FormattedMessage id="jmk.view_thumb" />}：
									</Col>
									{currentView.thumb && (
										<>
											<Col span={6}>
												<img src={urlFunc.replaceUrl(currentView.thumb, "obs")} alt="" style={{ width: "100%" }} />
											</Col>
											<Col span={2}></Col>
										</>
									)}
									<Col span={currentView.thumb ? 10 : 18}>
										<Button size="small" onClick={setViewThumb}>
											{<FormattedMessage id="jmk.view_thumb" />}
										</Button>
									</Col>
									{!!currentView.isOrbit() && (
										<>
											<Col span={6} className="formLable">
												{<FormattedMessage id="jmk.angle_limit" />}：
											</Col>
											<Col span={18}>
												<ItemSlider
													min={-90}
													max={90}
													range={true}
													forceUpdate={forceUpdate}
													item={currentView}
													valueKey="upAngle"
												></ItemSlider>
											</Col>
										</>
									)}

									<Col span={6} className="formLable">
										{<FormattedMessage id="jmk.hide_from_menu" />}：
									</Col>
									<Col span={18}>
										<ItemSwitch
											size="small"
											forceUpdate={forceUpdate}
											item={currentView}
											valueKey="hideFromMenu"
											onChange={changeSwitch}
										/>
									</Col>
								</Row>
							</>
						)}
					</div>
				</JMKPanel>
			</div>
		</Grow>
	)
}
export default ViewerPanel
