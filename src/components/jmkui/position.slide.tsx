import serviceLocal from "@/services/service.local"
import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { DeleteOutlined, InfoCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Col, Modal, Row, Select, Space } from "antd"
import classNames from "classnames"
import _ from "lodash"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { ReactIdSwiperCustomProps } from "react-id-swiper/lib/types"

import "swiper/css/swiper.min.css"
import { FormattedMessage, useIntl } from "umi"
import { useEditHook } from "../jmk/jmk.engine"
import { JMKContext } from "../provider/jmk.context"
import { panelContext } from "../provider/panel.context"
import SortItem from "../utils/sort.item"
import "./position.slide.less"
interface Props {
	// data: any[]
}
const _PositionSlide: React.FC<Props> = props => {
	// const { data } = props
	const Intl = useIntl()
	const { state } = useContext(JMKContext)
	const [filter, setFilter] = useState(false)
	const [filterData, setFilterData] = useState([])
	const [current, setCurrent] = useState(null)
	const JMKHook = useEditHook()
	const swiperRef = useRef<ReactIdSwiperCustomProps & HTMLDivElement>()
	const teleportStarted = useCallback((e: any) => {
		setCurrent(e.view)
	}, [])
	const forceUpdate = useForceUpdate()
	useEffect(() => {
		if (state.editHook) {
			state.editHook.teleport.addEventListener("teleportDone", teleportStarted)
		}
	}, [state])
	const switchView = useCallback(
		view => () => {
			state.editHook.teleport.switchToView(view, 1)
		},
		[state]
	)

	// 增加定位
	const { state: panelState, dispatch } = useContext(panelContext)

	const addPosition = useCallback(() => {
		Modal.confirm({
			content: Intl.formatMessage({ id: "jmk.addPosition.tip" }),
			closable: true,
			onOk: () => {
				state.editHook &&
					dispatch({
						type: "set",
						payload: {
							current: "position",
							model: "material"
						}
					})
			}
		})
	}, [state, panelState])

	const [positionData, setPositionData] = useState([])
	// 获取展厅定位数据
	useEffect(() => {
		getPositionData()
	}, [])
	const [isDone, setDone] = useState(false)
	const getPositionData = useCallback(() => {
		serviceLocal.getExhibitPosition(state.sceneName, "").then(res => {
			if (res.code == "200") {
				res.data.map((m: any, index: number) => ({ ...m, order: m.order || index }))
				setPositionData([...res.data])
				setFilterData([...res.data])
				setDone(true)
			}
		})
	}, [])
	const [currentPos, setCurrentPos] = useState(null)
	// 编辑展品定位
	const editPositionItem = useCallback(
		item => () => {
			setCurrentPos(item)
			dispatch({
				type: "set",
				payload: {
					current: "positionEdit",
					params: item
				}
			})
			if (!!item?.config.tour) {
				const { cameraPos, rotation } = item.config.tour
				state.jmt.getViewer().moveAndHeadTo(cameraPos, rotation)
			}
		},
		[state, positionData]
	)
	// 删除定位
	const [isHasPositionData, setIsHasPositionData] = useState(false)
	const del = useCallback(
		(id: string) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			e.stopPropagation()
			let arr = positionData.filter(item => {
				return item.id !== id
			})
			setPositionData(arr)
			if (!!arr.length) {
				setIsHasPositionData(true)
			} else {
				setIsHasPositionData(false)
			}
		},
		[positionData]
	)
	// 改变位置

	const [sortResult, setSortResult] = useState<string[]>([])
	const sortChange = useCallback(
		(data: string[]) => {
			setSortResult(data)
		},
		[positionData]
	)

	useEffect(() => {
		const checkData = JSON.parse(JSON.stringify(positionData))
		checkData.map((m: any) => {
			m.order = sortResult.findIndex(id => Number(id) === m.id)
		})
		setPositionData(checkData)
	}, [sortResult])
	// 操作定位数据
	useEffect(() => {
		if ((positionData.length || !isHasPositionData) && !filter && !!isDone) {
			serviceLocal.editExhibitPosition(state.sceneName, positionData).then(res => {
				if (res.code == "200") {
				}
			})
		}
	}, [positionData])
	const positionAdd = useCallback(
		item => {
			setPositionData(positionData.concat({ ...item, order: positionData.length }))
		},
		[positionData]
	)
	const positionEdit = useCallback(
		item => {
			let currentItem = positionData.find(m => m.id === item.id)
			if (!!currentItem) {
				currentItem = Object.assign(currentItem, item)
			}
			setPositionData([...positionData])
		},
		[positionData]
	)
	useEffect(() => {
		eventBus.off("position.add").on("position.add", positionAdd)
		eventBus.off("position.edit").on("position.edit", positionEdit)
	}, [positionData])
	useEffect(() => {
		return () => {
			eventBus.off("position.add")
			eventBus.off("position.edit")
		}
	}, [])
	// 获取分类数据
	const [classList, setClassList] = useState([])
	useEffect(() => {
		if (!!state.sceneName) {
			// serviceLocal.getExhibitClass(state.sceneName, "").then(res => {
			// 	if (res.code == "200") {
			// 		setClassList(res.data)
			// 	}
			// })
		}
	}, [state])
	const positionChange = useCallback(
		(value, index) => {
			if (!!value) {
				setFilter(true)
				setFilterData(positionData.filter(item => item.classify === value))
			} else {
				setFilter(false)
			}
		},
		[positionData]
	)
	return (
		<div id="PositionSlide">
			<Row>
				<Col>
					<span className="positionNumTip">
						<FormattedMessage id="jmk.position.hasSet" />
						{!!filter && !!filterData[0] ? filterData.length : positionData.length}
						<FormattedMessage id="jmk.position.num" />
					</span>
					<InfoCircleOutlined className="positionNumTip" />
				</Col>
				<Col>
					<span className="classTip">
						<FormattedMessage id="jmk.position.classify" />
					</span>
					<Select
						dropdownMatchSelectWidth={false}
						defaultValue=""
						options={[{ label: <FormattedMessage id="jmk.all" />, value: "" }].concat(
							classList.map(item => {
								return {
									label: item.name,
									value: item.id
								}
							})
						)}
						onChange={positionChange}
					/>
				</Col>
			</Row>

			<Row>
				<Col>
					{/* className="ignore-elements slide-item" */}
					<div onClick={addPosition} className="addPositionBtn">
						<PlusOutlined
							style={{
								width: "100px",
								height: "114px"
							}}
						/>
					</div>
				</Col>
				<Col>
					<SortItem onChange={sortChange} handle=".slide-item" direction="horizontal">
						{(!!filter && !!filterData[0] ? _.sortBy(filterData, ["order"]) : _.sortBy(positionData, ["order"])).map(
							item => {
								return (
									<div
										key={item.id}
										data-id={item.id}
										className={classNames("slide-item", {
											active: !!currentPos && item.id === currentPos.id ? true : false
										})}
										onClick={editPositionItem(item)}
									>
										<div className="list">
											<div className="top top1">
												{item.cover[0] ? (
													<img src={urlFunc.replaceUrl(item.cover[0])} alt="" />
												) : (
													<img className="thumbnail" src={require("@/assets/image/none.png")} alt="" />
												)}
												{/* className="del" */}
												<div className="del" onClick={del(item.id)}>
													<DeleteOutlined style={{ position: "absolute", top: "4px", left: "4px" }} />
												</div>
												<div className="title noPadding">{item.name}</div>
											</div>
										</div>
									</div>
								)
							}
						)}
					</SortItem>
				</Col>
			</Row>
		</div>
	)
}

const PositionSlide = useMini(_PositionSlide)
export default PositionSlide
