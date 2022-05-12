import PanelType from "@/constant/panel.type"
import Icon, {
	AimOutlined,
	AlertOutlined,
	ArrowLeftOutlined,
	BulbOutlined,
	CameraOutlined,
	CloudOutlined,
	CodeSandboxOutlined,
	DeploymentUnitOutlined,
	FileGifOutlined,
	FileTextOutlined,
	PictureOutlined,
	SettingOutlined,
	VideoCameraOutlined,
	AndroidOutlined,
	MacCommandOutlined,
	CoffeeOutlined,
	EyeOutlined,
	SearchOutlined,
	PlayCircleOutlined
} from "@ant-design/icons"

import { Switch, Divider, Space } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useMemo } from "react"
import { getLocale, useIntl, FormattedMessage } from "umi"
import { JMKContext } from "../provider/jmk.context"
import { panelContext } from "../provider/panel.context"
import Grow from "../transitions/grow"
import { logoSvg } from "../utils/svg.icon"
import localesFunc from "@/utils/locales.func"
import "./left.menus.less"
import setupModal from "@/components/modal/async/setup.Modal"
import { ModalCustom } from "../modal/modal.context"
import { useEditHook } from "../jmk/jmk.engine"

const LeftMenus: React.FC = () => {
	const Intl = useIntl()
	const btnList = useMemo(
		() => ({
			material: [
				{
					key: PanelType.IMAGE,
					name: <FormattedMessage id="jmk.left.img" />,
					group: "main",
					icon: <PictureOutlined />
				},
				{
					key: PanelType.GIF,
					name: <FormattedMessage id="jmk.left.gif" />,
					group: "main",
					icon: <FileGifOutlined />
				},
				{
					key: PanelType.VIDEO,
					name: <FormattedMessage id="jmk.left.video" />,
					group: "main",
					icon: <VideoCameraOutlined />
				},
				// 音频
				{
					key: PanelType.MUSIC,
					name: <FormattedMessage id="jmk.left.music" />,
					group: "main",
					icon: (
						<i
							className={"iconfont iconyinyue"}
							style={{ width: "24px", height: "26px", fontSize: "22px", fontWeight: 500 }}
						></i>
					)
				},
				// {
				// 	key: PanelType.MODEL,
				// 	name: <FormattedMessage id="jmk.left.model" />,
				// 	group: "main",
				// 	icon: <CodeSandboxOutlined />
				// },
				// 环物图
				// {
				// 	key: PanelType.RING,
				// 	name: <FormattedMessage id="jmk.left.ring" />,
				// 	group: "main",
				// 	icon: <CodeSandboxOutlined />
				// },
				{
					key: PanelType.TEXT,
					name: <FormattedMessage id="jmk.left.text" />,
					group: "main",
					icon: <FileTextOutlined />
				},
				{
					key: PanelType.EFFECT,
					name: <FormattedMessage id="jmk.left.animation" />,
					group: "main",
					icon: <AndroidOutlined />
				},
				{
					key: PanelType.SETUP,
					name: <FormattedMessage id="jmk.left.setup" />,
					group: "other",
					icon: <SettingOutlined />
				},
				{
					key: PanelType.HOT,
					name: <FormattedMessage id="jmk.left.hotspot" />,
					group: "main",
					icon: <AimOutlined />
				},
				{
					key: "switch",
					name: <FormattedMessage id="jmk.left.jmk" />,
					group: "other",
					icon: <DeploymentUnitOutlined />
				}
			],
			base: [
				// {
				// 	key: "bake",
				// 	name: <FormattedMessage id="jmk.baking" />,
				// 	group: "main",
				// 	icon: <CoffeeOutlined />
				// },
				// {
				// 	key: PanelType.LIGHTS,
				// 	name: <FormattedMessage id="jmk.lights" />,
				// 	group: "main",
				// 	icon: <BulbOutlined />
				// },
				// {
				// 	key: PanelType.LIGHTPORBES,
				// 	name: <FormattedMessage id="jmk.reflex" />,
				// 	group: "main",
				// 	icon: <AlertOutlined />
				// },
				// {
				// 	key: "materials",
				// 	name: <FormattedMessage id="jmk.materials" />,
				// 	group: "main",
				// 	icon: <MacCommandOutlined />
				// },
				// {
				// 	key: PanelType.SKY,
				// 	name: <FormattedMessage id="jmk.skys" />,
				// 	group: "main",
				// 	icon: <CloudOutlined />
				// },
				// {
				// 	key: PanelType.OBJECTS,
				// 	name: <FormattedMessage id="jmk.objects" />,
				// 	group: "main",
				// 	icon: <DeploymentUnitOutlined />
				// },
				// {
				// 	key: PanelType.CAMERA,
				// 	name: <FormattedMessage id="jmk.camera.camera" />,
				// 	group: "main",
				// 	icon: <CameraOutlined />
				// },
				{
					key: PanelType.VIEWER,
					name: <FormattedMessage id="jmk.viewer" />,
					group: "main",
					icon: <EyeOutlined />
				},
				// 定位
				// {
				// 	key: PanelType.POSITION,
				// 	name: <FormattedMessage id="jmk.position" />,
				// 	group: "main",
				// 	icon: <SearchOutlined />
				// },
				{
					key: "switch",
					name: <FormattedMessage id="jmk.switch" />,
					group: "other",
					icon: <ArrowLeftOutlined />
				}
			]
		}),
		[]
	)
	const { state, dispatch } = useContext(panelContext)
	const { state: JMK } = useContext(JMKContext)
	const JMKHook = useEditHook()
	const itemClick = useCallback(
		(key: string) => () => {
			// 设置弹窗
			if (key == "setup") {
				return ModalCustom({
					content: setupModal
				})
			}
			JMK.editHook &&
				dispatch({
					type: "set",
					payload: {
						model:
							key === "switch"
								? state.model === "material"
									? "base"
									: "material"
								: key === "ani"
								? "ani"
								: state.model,
						current: [state.current, "switch", "ani"].includes(key) ? "" : key
					}
				})
		},
		[state, JMK]
	)
	const switchChange = useCallback(checked => {
		checked ? localesFunc.setLocale("en-US", false) : localesFunc.setLocale("zh-CN", false)
		dispatch({
			type: "set"
		})
	}, [])
	const show = useMemo(() => state.model !== "ani", [state])
	return (
		<div id="LeftMenus" hidden={!show}>
			<div className="changelanguage">
				<Switch
					size="small"
					checkedChildren="中文"
					unCheckedChildren="EN"
					defaultChecked={getLocale() === "en-US" ? true : false}
					onChange={switchChange}
				/>
			</div>
			{/* <Space direction="vertical" align="center" split={<Divider type="horizontal" />}> */}
			<div className="logo">
				<Icon component={logoSvg} />
			</div>
			<div className="btn-box">
				<Divider type="horizontal" />
				<div className="main-btn" hidden={state.selectState}>
					<Space direction="vertical" size="large">
						{btnList[state.model === "ani" ? "material" : state.model]
							.filter(m => m.group === "main")
							.map(m => {
								return (
									<Grow in key={m.key + state.model}>
										<div
											className={classNames("btn-item", { current: state.current === m.key })}
											onClick={itemClick(m.key)}
										>
											{m.icon}
											{m.name}
										</div>
									</Grow>
								)
							})}
					</Space>
				</div>

				{!state.selectState && <Divider type="horizontal" />}
				<div className="other-btn" hidden={state.selectState}>
					<Space direction="vertical" size="large">
						{btnList[state.model === "ani" ? "material" : state.model]
							.filter(m => m.group === "other")
							.map(m => {
								return (
									<Grow in key={m.key + state.model}>
										<div
											className={classNames("btn-item", { current: state.current === m.key })}
											onClick={itemClick(m.key)}
										>
											{m.icon}
											{m.name}
										</div>
									</Grow>
								)
							})}
					</Space>
				</div>
				{/* <div style={{ height: "40px", width: "100%" }}></div> */}
			</div>
			{/* <div className="other-btn">
					<Space direction="vertical" size="large">
						{btnList[state.model === "ani" ? "material" : state.model]
							.filter(m => m.group === "other")
							.map(m => {
								return (
									<Grow in key={m.key + state.model}>
										<div
											className={classNames("btn-item", { current: state.current === m.key })}
											onClick={itemClick(m.key)}
										>
											{m.icon}
											{m.name}
										</div>
									</Grow>
								)
							})}
					</Space>
				</div> */}
			{/* </Space> */}
		</div>
	)
}

export default LeftMenus
