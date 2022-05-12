import { FormattedMessage } from "@/.umi/plugin-locale/localeExports"
import eventBus from "@/utils/event.bus"
import { useMini } from "@/utils/use.func"
import { ChromeOutlined, FolderAddOutlined, LogoutOutlined } from "@ant-design/icons"
import { Button, Card, Col, Row } from "antd"
import React, { useCallback, useContext, useEffect, useRef } from "react"
import Draggable, { DraggableEventHandler } from "react-draggable"
import { aniContext } from "../provider/ani.context"
import { panelContext } from "../provider/panel.context"
import AniNodeList from "./aninode/aninode.list"
import NodeConfigList from "./aninode/nodeconfig.list"
import FooterControl from "./control/footer.contorl"
import HeightControl from "./control/height.control"
import PlayControl from "./control/play.control"
import TimeControl from "./control/time.control"
import WidthControl from "./control/width.control"
import MarkBgAni from "./markbg.ani"
import MarkTxtAni from "./marktxt.ani"
import "./timeline.ani.less"
import ConfigTrack from "./trackui/config.track"
import NodeTrack from "./trackui/node.track"
// 动画编辑器完整页面
const _TimeLineAni: React.FC = () => {
	const { dispatch } = useContext(panelContext)
	const { state: ANI, dispatch: aniAction } = useContext(aniContext)
	const closeAni = useCallback(() => {
		dispatch({
			type: "set",
			payload: {
				model: "material"
			}
		})
	}, [])
	const onWheel = useCallback(
		(e: React.WheelEvent<HTMLDivElement>) => {
			const data = e.deltaY > 0 ? -1 : 1
			const result = ANI.layout.lineIndex + data
			const nextIndex =
				result < ANI.layout.lineWidth.length ? (result < 0 ? 0 : result) : ANI.layout.lineWidth.length - 1
			aniAction({
				type: "set",
				payload: {
					layout: {
						...ANI.layout,
						lineIndex: nextIndex
					}
				}
			})
		},
		[ANI.layout]
	)
	const keyDown = useCallback(
		(e: KeyboardEvent) => {
			if (
				document.getElementById("TimeLineAni").classList.contains("focused") &&
				e.target["tagName"] !== "INPUT" &&
				["ArrowLeft", "ArrowRight"].includes(e.key)
			) {
				let data = 0
				switch (e.key) {
					case "ArrowLeft":
						data = -1
						break
					case "ArrowRight":
						data = 1
						break
				}

				const result = ANI.time + data
				if (result < 0) return
				aniAction({
					type: "set",
					payload: {
						time: result
					}
				})
			}
		},
		[ANI.time]
	)
	const keyProxy = useCallback(e => eventBus.emit("ani.keypress", e), [])
	useEffect(() => {
		eventBus.off("ani.keypress").on("ani.keypress", keyDown)
	}, [ANI.time])
	useEffect(() => {
		window.addEventListener("keydown", keyProxy)
		return () => {
			window.removeEventListener("keydown", keyProxy)
			eventBus.off("ani.keypress")
		}
	}, [])
	const onFocus = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.currentTarget.classList.add("focused")
	}, [])
	const onBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
		e.currentTarget.classList.remove("focused")
	}, [])
	const assetShow = useCallback(() => {
		aniAction({
			type: "set",
			payload: {
				assetShow: !ANI.assetShow
			}
		})
	}, [ANI.assetShow])

	return (
		<div
			id="TimeLineAni"
			style={{
				width: "100vw",
				paddingLeft: ANI.assetShow ? 260 : 0,
				paddingRight: ANI.selectAni ? 260 : 0
			}}
			onClick={onFocus}
			onBlur={onBlur}
		>
			<Card
				title={
					<Row align="middle">
						<Col>
							<Button type={ANI.assetShow ? "primary" : "default"} icon={<FolderAddOutlined />} onClick={assetShow}>
								{<FormattedMessage id="jmk.animation.resourceMonitor" />}
							</Button>
							<Button type="primary" icon={<ChromeOutlined />}>
								{<FormattedMessage id="jmk.animation.animationEditor" />}
							</Button>
						</Col>
						<Col flex={1}>
							<PlayControl />
						</Col>
					</Row>
				}
				extra={
					<Button size="small" title="退出" type="text" onClick={closeAni}>
						<LogoutOutlined />
					</Button>
				}
				bodyStyle={{
					padding: 0,
					height: ANI.layout.boxHeight
				}}
			>
				<div className="layout-box full">
					<div className="layout-main full-w">
						<div className="layout-left full-h" style={{ width: `${ANI.layout.leftWidth}px` }}>
							<AniNodeList />
							<NodeConfigList />
						</div>
						<div
							className="layout-right full-h"
							onWheel={onWheel}
							style={{ width: `calc(100% - ${ANI.layout.leftWidth}px)` }}
						>
							<div className="track-main full">
								<div className="node-track" style={{ height: `${ANI.layout.topHeight}px` }}>
									<div className="track-top">
										<MarkTxtAni />
									</div>
									<NodeTrack />
								</div>
								<ConfigTrack />
							</div>
							<MarkBgAni />
							<TimeControl />
						</div>
						<HeightControl />
						<WidthControl />
					</div>
					<div className="layout-footer full-w">
						<FooterControl />
					</div>
				</div>
			</Card>
		</div>
	)
}

const TimeLineAni = useMini(_TimeLineAni)
export default TimeLineAni
