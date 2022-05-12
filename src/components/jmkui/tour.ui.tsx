import eventBus from "@/utils/event.bus"
import { useForceUpdate, useMini } from "@/utils/use.func"
import {
	DeleteOutlined,
	DownOutlined,
	PauseCircleOutlined,
	PlayCircleOutlined,
	UpOutlined,
	UpSquareOutlined
} from "@ant-design/icons"
import { Card, Select, Space, Typography, Button, Tabs, Row, Col, Input, Modal } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "umi"
import { useEditHook } from "../jmk/jmk.engine"
import { JMKContext } from "../provider/jmk.context"
import { panelContext } from "../provider/panel.context"
import Slide from "../transitions/slide"
import Swiper from "react-id-swiper"
import "swiper/css/swiper.min.css"
import TourSlide from "./tour.slide"
import PositionSlide from "./position.slide"
import SortItem from "../utils/sort.item"
import urlFunc from "@/utils/url.func"
import serviceLocal from "@/services/service.local"

const _TourUI: React.FC = () => {
	const { state, dispatch } = useContext(panelContext)
	const forceUpdate = useForceUpdate()
	const JMKHook = useEditHook()
	const { state: JMK } = useContext(JMKContext)
	const [tourIndex, setTourIndex] = useState(-1)
	const [classList, setClassList] = useState([])
	const [positionList, setPositionList] = useState([])
	const [positionNum, setPositionNum] = useState(0)
	// 相机位列表
	const tourList: any[] = useMemo(() => JMK.editHook?.getTours() || [], [JMK.editHook])
	const viewsList: any[] = useMemo(() => JMK.editHook?.getViews() || [], [JMK.editHook])
	const [currentTour, setCurrentTour] = useState(null)
	const [isRunning, setIsRunning] = useState(false)
	const paddingLeft = useMemo(() => {
		return state.model === "material" &&
			state.current !== "setup" &&
			state.current !== "outline" &&
			state.current !== "position" &&
			state.current !== "positionEdit" &&
			state.current
			? 410
			: 60
	}, [state])

	const paddingRight = useMemo(() => {
		return (state.model === "material" && state.assetAction !== "none") ||
			(state.model && state.model == "base" && !!state.current) ||
			(state.current === "outline" && state.action === "edit")
			? 320
			: 0
	}, [state])
	const show = useMemo(() => state.model !== "ani", [state])

	const sceneChanged = useCallback(() => {
		setTimeout(() => {
			forceUpdate()
		}, 0)
	}, [])

	useEffect(() => {
		eventBus.off("jmk.sceneChanged", sceneChanged).on("jmk.sceneChanged", sceneChanged)
		eventBus.off("tour.change", sceneChanged).on("tour.change", sceneChanged)
		//!
		eventBus.off("jmk.showMenu.change", sceneChanged).on("jmk.showMenu.change", sceneChanged)
		return () => {
			eventBus.off("jmk.sceneChanged", sceneChanged)
			eventBus.off("tour.change", sceneChanged)
			//!
			eventBus.off("jmk.showMenu.change", sceneChanged)
		}
	}, [])
	const changeStatus = useCallback(
		isRunning => () => {
			setIsRunning(isRunning)
		},
		[]
	)
	useEffect(() => {
		JMK.editHook && JMKHook.getAutoTour().addEventListener("tourStopped", changeStatus(false))
		JMK.editHook && JMKHook.getAutoTour().addEventListener("tourStarted", changeStatus(true))
	}, [JMK])
	// 下拉选择tour
	const tourChange = useCallback(
		(value, index) => {
			JMKHook.getAutoTour().stop()
			setCurrentTour(tourList.find(item => item.id === value))
			if (!!value) {
				setTourIndex(tourList.findIndex(item => item.id === value))
			} else {
				setTourIndex(-1)
			}
		},
		[tourList]
	)

	// 播放
	const play = useCallback(() => {
		JMKHook.getAutoTour().start(tourIndex)
	}, [JMK, tourIndex])
	const stopTour = useCallback(() => {
		JMKHook.getAutoTour().stop()
	}, [JMK])
	const uiStyle = useMemo(
		() => ({
			box: { width: "100vw", paddingLeft, paddingRight, transition: "all .3s", zIndex: 0 },
			body: { padding: 0 }
		}),
		[state]
	)
	const [showBody, setShowBody] = useState(false)
	const toggleBody = useCallback(() => setShowBody(!showBody), [showBody])
	const currentViews = currentTour
		? currentTour.views.map((m: any) => viewsList.find(n => n.id === m.id))
		: viewsList.filter(m => !m.internal)

	// !!!
	const [currentTab, setCurrentTab] = useState("tour")
	const { TabPane } = Tabs
	const tabChange = useCallback(key => setCurrentTab(key), [])
	// 获取分类数据
	useEffect(() => {
		if (JMK.sceneCofing && !!JMK.sceneCofing.info.sceneObjs) {
			const sceneObjs = {
				views: JMK.sceneCofing.info.sceneObjs.views,
				tours: JMK.sceneCofing.info.sceneObjs.tours
			}
			JMKHook.loadViewsAndTours(sceneObjs)
		}
		if (!!JMK.sceneName) {
			// serviceLocal.getExhibitClass(JMK.sceneName, "").then(res => {
			// 	if (res.code == "200") {
			// 		setClassList(res.data)
			// 	}
			// })
		}
	}, [JMK])
	const changeSelectState = useCallback(() => {
		Modal.confirm({
			content: "是否确认退出范围指定模式？",
			onOk() {
				dispatch({
					type: "set",
					payload: {
						selectState: false
					}
				})
			},
			onCancel() {}
		})
	}, [])
	return (
		<div hidden={!show} id="TourUI" style={uiStyle.box}>
			{/* <Card
				title={
					<Space direction="horizontal">
						<Typography.Text>导览路径</Typography.Text>
						{!isRunning && (
							<>
								<Button type="link" icon={<PlayCircleOutlined />} onClick={play} />
							</>
						)}
						{isRunning && (
							<>
								<Button type="link" icon={<PauseCircleOutlined />} onClick={stopTour} />
							</>
						)}
					</Space>
				}
				bodyStyle={uiStyle.body}
				extra={
					<Space>
						<Select
							dropdownMatchSelectWidth={false}
							defaultValue=""
							options={[{ label: "所有", value: "" }].concat(
								tourList.map(item => {
									return {
										label: item.name,
										value: item.id
									}
								})
							)}
							onChange={tourChange}
						/>
						<Button onClick={toggleBody} ghost icon={showBody ? <DownOutlined /> : <UpOutlined />} />
					</Space>
				}
			>
				<Slide direction="up" in={showBody} unmountOnExit={!currentViews.length}>
					<TourSlide data={currentViews.filter((m: { hideFromMenu: boolean }) => !m.hideFromMenu)} />
				</Slide>
			</Card> */}

			{/* !!!!!!!! */}
			<Card hidden={state.selectState}>
				<Tabs
					defaultActiveKey={currentTab}
					onChange={tabChange}
					type="card"
					tabBarExtraContent={
						<Space>
							<Select
								style={currentTab === "tour" ? { display: "block" } : { display: "none" }}
								dropdownMatchSelectWidth={false}
								defaultValue=""
								options={[{ label: <FormattedMessage id="jmk.all" />, value: "" }].concat(
									tourList.map(item => {
										return {
											label: item.name,
											value: item.id
										}
									})
								)}
								onChange={tourChange}
							/>
							<Button onClick={toggleBody} ghost icon={showBody ? <DownOutlined /> : <UpOutlined />} />
						</Space>
					}
				>
					<TabPane
						tab={
							<Space direction="horizontal">
								<Typography.Text>
									<FormattedMessage id="jmk.tour" />
								</Typography.Text>
								{!isRunning && (
									<>
										<Button type="link" icon={<PlayCircleOutlined />} onClick={play} />
									</>
								)}
								{isRunning && (
									<>
										<Button type="link" icon={<PauseCircleOutlined />} onClick={stopTour} />
									</>
								)}
							</Space>
						}
						key="tour"
					>
						<Slide direction="up" in={showBody} unmountOnExit={!currentViews.length}>
							<TourSlide data={currentViews.filter((m: { hideFromMenu: boolean }) => !m.hideFromMenu)} />
						</Slide>
					</TabPane>
					{/* <TabPane tab={<FormattedMessage id="jmk.exhibits.position" />} key="position">
						<Slide direction="up" in={showBody} unmountOnExit={!currentViews.length}>
							<PositionSlide />
						</Slide>
					</TabPane> */}
				</Tabs>
			</Card>
			<div
				style={{ width: "100%", height: "50px", background: "#1e1e1e", textAlign: "center" }}
				hidden={!state.selectState}
			>
				<Button type="primary" style={{ marginTop: "11px" }} onClick={changeSelectState}>
					<FormattedMessage id="jmk.addmaterial.rangeChoose" />
				</Button>
			</div>
		</div>
	)
}
const TourUI = useMini(_TourUI)

export default TourUI
