import { ExtDataTag } from "@/interfaces/extdata.interface"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { Col, Popover, Row, Space, Tabs, Typography } from "antd"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "umi"
import ItemCheckBox from "../item.checkbox"
import ItemSwitch from "../item.switch"
import NumberInput from "../number.input"
import "./hotspot.less"
import serviceLocal from "@/services/service.local"
import urlFunc from "@/utils/url.func"
import ItemColor from "../item.color"
import { JMKContext } from "@/components/provider/jmk.context"
import thumFunc from "@/utils/thum.func"
interface Props {
	data: ExtDataTag
}
const _HotSpot: React.FC<Props> = props => {
	const { state, dispatch: JMKSet } = useContext(JMKContext)
	const Intl = useIntl()
	const { data } = props
	const forceUpdate = useForceUpdate()
	// const systemHots = [
	// 	"image/hoticon/hotSystem1.png",
	// 	"image/hoticon/hotSystem2.png",
	// 	"image/hoticon/hotSystem3.png",
	// 	"image/hoticon/hotSystem4.png"
	// ]
	// 系统图标
	const [systemHots, setSystemHots] = useState([])
	const [systemDone, setSystemDone] = useState(false)
	//获取系统图标列表
	const getSystemData = useCallback(() => {
		serviceLocal
			.punlicList({
				hotIcon: true,
				pageNum: 1,
				pageSize: 100
			})
			.then(res => {
				if (res.code === 200) {
					const { list } = res.data
					list.forEach(item => {
						// item["_picPathCompre"] = thumFunc.thumb(urlFunc.replaceUrl(item.picPath,"obs"), 64, 0)
						item["_picPathCompre"] = urlFunc.replaceUrl(item.picPath, "obs")
					})
					setSystemHots(list)
				}
			})
	}, [])

	//获取自定义图标列表
	const [customIcons, setCustomIcon] = useState([])
	const [custonDone, setCustomDone] = useState(false)
	const getData = useCallback((index: number = 1) => {
		serviceLocal
			.assetsList({
				currentPage: index,
				pageSize: 100,
				fileType: 1,
				tempId: state.sceneName,
				hotIcon: true
			})
			.then(res => {
				setCustomIcon(res.data.list)
				setCustomDone(true)
			})
	}, [])
	useEffect(() => {
		getData()
		getSystemData()
	}, [])
	useEffect(() => {
		if (!data.texture) {
			data.length = 0.3
			data.showTitle = false
			data.texture = window.publicPath + "image/hoticon/hotSystem1.png"
			data.visible = false
			data.color = "#ffffff"
		}
	}, [data])
	const { TabPane } = Tabs
	// 切换默认图标
	const changeTexture = useCallback(
		item => () => {
			data.texture = item._picPathCompre
			forceUpdate()
		},
		[data]
	)
	// 切换自定义图标
	const changeCustomTexture = useCallback(
		item => () => {
			data.texture = urlFunc.replaceUrl(item.picPath)
			forceUpdate()
		},
		[data]
	)
	const tagCheck = (
		<Tabs defaultActiveKey="1" centered id="tagTabs">
			<TabPane tab={<FormattedMessage id="jmk.addmaterial.SystemIcon" />} key="1">
				<ul>
					{systemHots.map((item, index) => {
						return (
							<li
								key={index}
								className={data.texture === item._picPathCompre ? "liActive" : null}
								onClick={changeTexture(item)}
							>
								<img src={item._picPathCompre} alt="" />
							</li>
						)
					})}
				</ul>
			</TabPane>
			<TabPane tab={<FormattedMessage id="jmk.addmaterial.CustomIcon" />} key="2">
				{/* 自定义图标区域 */}
				{!!custonDone ? (
					<ul>
						{customIcons?.map((item, index) => {
							return (
								<li
									key={index}
									className={data.texture === window.publicPath + item ? "liActive" : null}
									onClick={changeCustomTexture(item)}
								>
									<img src={urlFunc.replaceUrl(item.picPath, "obs")} alt="" />
								</li>
							)
						})}
					</ul>
				) : (
					<FormattedMessage id="jmk.addmaterial.NoCustomIcon" />
				)}
				{/* {<FormattedMessage id="jmk.addmaterial.NoCustomIcon" />} */}
			</TabPane>
		</Tabs>
	)
	return (
		<div id="TagCheck">
			<Space className="full-w" direction="vertical">
				<Space className="full-w between" direction="horizontal" align="center">
					<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.HotspotIcon" />}:</Typography.Text>
					<ItemSwitch size="small" forceUpdate={forceUpdate} item={data} valueKey="enable" />
				</Space>
				{data.enable && (
					<>
						<Space className="full-w" direction="horizontal">
							<Space className="full-w" direction="vertical" style={{ flexGrow: 1 }}>
								<Popover content={tagCheck} trigger="click" placement="topLeft">
									<div className="tagChecked">
										<img src={data.texture} alt="" />
									</div>
								</Popover>
							</Space>
							<Space className="full-w" direction="vertical" style={{ flexGrow: 3 }}>
								<Space className="full-w" direction="horizontal">
									{/* <Space className="full-w" direction="vertical" style={{ flexGrow: 1 }}>
										<ItemCheckBox
											item={data}
											valueKey="visible"
											children={
												<Typography.Text type="secondary">
													{<FormattedMessage id="jmk.addmaterial.Markingline" />}
												</Typography.Text>
											}
										/>
									</Space> */}
									<Space className="full-w" direction="vertical" style={{ flexGrow: 1 }}>
										<ItemCheckBox
											item={data}
											valueKey="showTitle"
											forceUpdate={forceUpdate}
											children={
												<Typography.Text type="secondary">
													{<FormattedMessage id="jmk.addmaterial.showheading" />}
												</Typography.Text>
											}
										/>
									</Space>
								</Space>
								<Space className="full-w" direction="horizontal">
									<Typography.Text>{<FormattedMessage id="jmk.addmaterial.distance" />}：</Typography.Text>
									<NumberInput
										item={data}
										valueKey="length"
										defaultValue={0}
										precision={0}
										transform="mmtoM"
										min={0}
										max={2000}
										step={1}
									/>
								</Space>
							</Space>
						</Space>
						<Row gutter={10} align="middle">
							{/* <Col span={6} className="flex-cn">
								图标大小：
							</Col>
							<Col span={6} className="flex-cn">
								<NumberInput item={data} valueKey="size" precision={0} min={0} step={1} />
							</Col> */}
							<Col span={6} className="flex-cn">
								{<FormattedMessage id="jmk.addmaterial.headerSize" />}:
							</Col>
							<Col span={6} className="flex-cn">
								<NumberInput item={data} valueKey="height" transform="mmtoM" step={1} defaultValue={500} />
							</Col>
						</Row>
						<Row gutter={10} align="middle">
							<Col span={6} className="flex-cn">
								{<FormattedMessage id="jmk.addmaterial.headerColor" />}:
							</Col>
							<Col span={6} className="flex-cn">
								<ItemColor item={data} valueKey="color" forceUpdate={forceUpdate} />
							</Col>
						</Row>
						{/* 热点线粗细 颜色区域 */}
						{/* <Row gutter={10} align="middle">
							<Col span={6} className="flex-cn">
								{<FormattedMessage id="jmk.addmaterial.lineSize" />}:
							</Col>
							<Col span={6} className="flex-cn">
								<NumberInput
									item={data}
									valueKey="lineSize"
									// transform="mmtoM"
									defaultValue={1}
									precision={0}
									min={1}
									step={1}
								/>
							</Col>
							<Col span={6} className="flex-cn">
								{<FormattedMessage id="jmk.addmaterial.lineColor" />}:
							</Col>
							<Col span={6} className="flex-cn">
								<ItemColor item={data} valueKey="lineColor" forceUpdate={forceUpdate} />
							</Col>
						</Row> */}
					</>
				)}
			</Space>
		</div>
	)
}

const HotSpot = useMini(_HotSpot)

export default HotSpot
