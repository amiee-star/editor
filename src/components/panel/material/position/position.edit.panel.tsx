import { useMini } from "@/utils/use.func"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Button, Card, Col, Form, Input, Radio, Row, Select, Space, Switch, TreeSelect } from "antd"
import { FormattedMessage, useIntl } from "umi"
import { CloseCircleOutlined, RightOutlined } from "@ant-design/icons"
import { AsyncModal, ModalCustom } from "@/components/modal/modal.context"
import { panelContext } from "@/components/provider/panel.context"
import { useEditHook } from "@/components/jmk/jmk.engine"
import ScreenModal from "@/components/modal/async/screen.modal"
import { JMKContext } from "@/components/provider/jmk.context"
import serviceLocal from "@/services/service.local"
import { doAlone, doTree } from "@/utils/array.fix"
import Grow from "@/components/transitions/grow"
import urlFunc from "@/utils/url.func"
import { JMTInterface } from "@/interfaces/jmt.interface"
import FormUploads from "@/components/form/form.uploads"
import fileType from "@/constant/file.type"
import eventBus from "@/utils/event.bus"
const { Option } = Select
interface Props {
	isShowOutLine?: boolean

	checkType?: keyof typeof fileType
}
interface Item {
	cover?: any[]
	id: any
	pid?: number
	key?: number
	name?: string
	value?: number
	config: {
		tour: any
		pic: string
	}
	order?: number
}
interface TreeItem extends Item {
	children?: TreeItem[]
}
const _PositionEdit: React.FC<Props> = props => {
	const Intl = useIntl()
	const JMTRef = useRef<JMTInterface>(null)
	const JMKHook = useEditHook()
	const [form] = Form.useForm()
	const { state } = useContext(JMKContext)
	const { state: panelState, dispatch } = useContext(panelContext)
	const [treeData, setTreeData] = useState<TreeItem[]>([])
	const [done, setDone] = useState(false)
	// 获取大纲数据
	useEffect(() => {
		serviceLocal.getOutLine(state.sceneName, "").then(res => {
			if (res.code == "200") {
				res.data = JSON.parse(JSON.stringify(res.data).replace(/title/g, "title").replace(/key/g, "value"))
				setTreeData(doTree(res.data, "value", "pid"))
				setIsPic(true)
			}
		})
	}, [])
	const [hasDefClass, setHasDefClass] = useState(false)
	const [hasClassList, setHasClassList] = useState(false)
	// 获取分类数据
	useEffect(() => {
		// serviceLocal.getExhibitClass(state.sceneName, "").then(res => {
		// 	if (res.code == "200") {
		// 		setClassList(res.data)
		// 		setHasDefClass(true)
		// 		setHasClassList(true)
		// 	}
		// })
	}, [])
	const [positionData, setPositionData] = useState([])
	// 获取展厅定位数据
	useEffect(() => {
		serviceLocal.getExhibitPosition(state.sceneName, "").then(res => {
			if (res.code == "200") {
				setPositionData(res.data)
			}
		})
	}, [])

	const show = useMemo(() => panelState.current === "positionEdit" && panelState.action === "edit", [panelState, state])
	// 隐藏定位面板
	const onClose = useCallback(() => {
		dispatch({
			type: "set",
			payload: {
				current: ""
			}
		})
	}, [])
	const [positionItem, setPositionItem] = useState<Item>()
	useEffect(() => {
		setPositionItem(panelState.params)
		setDone(true)
	}, [panelState])

	useEffect(() => {
		// form.setFieldsValue({ cover: !!positionItem ? [positionItem?.cover[0]] : [] })
		form.setFieldsValue({ ...positionItem })
		setDone(true)
	}, [positionItem])

	// 选择视角截图
	const [isPic, setIsPic] = useState(false)
	const setViewThumb = useCallback(async () => {
		setIsPic(false)
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
			positionItem.config.pic = data
			setPositionItem(positionItem)
			setIsPic(true)
		}
	}, [state, positionItem])
	const resetView = useCallback(() => {
		setViewThumb()
		const cameraPos = JMKHook.getCameraPosition()
		const rotation = JMKHook.getCameraRotation()
		positionItem.config.tour = {
			cameraPos,
			rotation
		}
	}, [state, positionItem])

	// 点击图片
	const getView = useCallback(() => {
		if (!!positionItem?.config.tour) {
			const { cameraPos, rotation } = positionItem.config.tour
			// editor 对象moveAndHeadTo方法
			state.jmt.getViewer().moveAndHeadTo(cameraPos, rotation)
		}
	}, [positionItem, state])
	// 大纲选择树
	const [selectValue, setSelectValue] = useState()
	const onChangeTree = useCallback(value => {
		setSelectValue(value)
	}, [])
	// 添加分类
	const [classList, setClassList] = useState([])
	const [hasClass, setHasClass] = useState(false)
	const addClass = useCallback(() => {
		let name = form.getFieldValue("class")
		if (!!name) {
			setClassList(classList.concat({ name: name, id: new Date().getTime() }))
			setHasClass(true)
		}
	}, [classList])
	// 改变分类
	const changeClassList = useCallback(e => {
		//
	}, [])
	// 删除分类
	const deleteClassList = useCallback(
		item => () => {
			const newClassList = classList.filter(c => c.id !== item.id)
			setClassList(newClassList)
		},
		[classList]
	)
	// 分类输入框
	const [classContent, setClassContent] = useState("")
	const changeClassInput = useCallback(e => {}, [classContent])
	// 操作分类数据
	useEffect(() => {
		if (!!hasClassList) {
			serviceLocal.editExhibitClass(state.sceneName, classList).then(res => {
				if (res.code == "200") {
				}
			})
		}
	}, [classList])
	// 提交
	const onFinish = useCallback(
		data => {
			const { name, outLine, classify, cover } = data
			let item = {
				name: name,
				outLine: outLine,
				classify: classify,
				cover: cover,
				config: { pic: positionItem.config?.pic, tour: positionItem.config.tour },
				id: positionItem.id
			}

			eventBus.emit("position.edit", item)
			// for (let m in positionData) {
			// 	if (positionData[m].id == positionItem.id) {
			// 		positionData[m] = item
			// 		break
			// 	}
			// }
			// serviceLocal.editExhibitPosition(state.sceneName, positionData).then(res => {
			// 	if (res.code == "200") {
			//
			// 	}
			// })
		},
		[positionItem, positionData]
	)
	return (
		!!done && (
			<Grow in={show}>
				<Card
					className="panel-box"
					bordered={false}
					title={<FormattedMessage id="jmk.left.setup" />}
					extra={<Button onClick={onClose} type="ghost" shape="circle" icon={<RightOutlined />} />}
					style={{ width: 320 }}
				>
					<div id="OutLineEdit">
						<div>
							<Form
								labelCol={{ span: 6 }}
								wrapperCol={{ span: 18 }}
								onFinish={onFinish}
								form={form}
								initialValues={positionItem}
							>
								<Form.Item
									name="name"
									label={<FormattedMessage id="jmk.title" />}
									rules={[{ message: "请输入1-30个文字", max: 30 }]}
								>
									<Input />
								</Form.Item>
								<Form.Item name="outLine" label={<FormattedMessage id="jmk.outLine" />} rules={[]}>
									<TreeSelect
										style={{ width: "100%" }}
										value={selectValue}
										dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
										treeData={treeData}
										placeholder={<FormattedMessage id="jmk.selectOutLine" />}
										treeDefaultExpandAll
										onChange={onChangeTree}
									/>
								</Form.Item>

								<Form.Item name="classify" label="" rules={[]}>
									<Radio.Group buttonStyle="solid" onChange={changeClassList} style={{ width: 300 }}>
										{!!hasDefClass &&
											classList.map(c => (
												<Radio.Button value={c.id} style={{ margin: 10 }} key={c.id}>
													{c.name}
													<Button
														type="text"
														icon={<CloseCircleOutlined />}
														style={{ position: "absolute", top: "-15px", right: "4px", width: 0, height: 0 }}
														onClick={deleteClassList(c)}
													></Button>
												</Radio.Button>
											))}
									</Radio.Group>
								</Form.Item>

								<Form.Item name="class" label={<FormattedMessage id="jmk.position.class" />} rules={[]}>
									<Row>
										<Col span={16}>
											<Input onChange={changeClassInput} />
										</Col>
										<Col span={4}>
											<Button onClick={addClass}>{<FormattedMessage id="jmk.position.addClass" />}</Button>
										</Col>
									</Row>
								</Form.Item>
								<Form.Item
									name="cover"
									label={<FormattedMessage id="jmk.position.cover" />}
									rules={[{ required: true, message: <FormattedMessage id="jmk.position.coverTip" /> }]}
								>
									<FormUploads
										apiService={serviceLocal.upload}
										size={1}
										accept={".png, .jpg, .jpeg"}
										checkType="image"
										imgAction={{ crop: true, aspectRatio: [200, 200] }}
									/>
								</Form.Item>
								<Form.Item name="name" label={<FormattedMessage id="jmk.outLine.choice" />}>
									<Button onClick={resetView}>{<FormattedMessage id="jmk.outLine.PerspectiveChoice" />}</Button>
								</Form.Item>
								<Form.Item
									name="pic"
									// rules={[{ required: true, message: <FormattedMessage id="jmk.position.viewTip" /> }]}
								>
									{!!isPic && !!positionItem?.config.pic ? (
										<>
											<Col span={24}>
												<img
													src={urlFunc.replaceUrl(positionItem.config.pic)}
													alt=""
													style={{ width: 220, height: 150, padding: 20, marginLeft: 45 }}
													onClick={getView}
												/>
											</Col>
										</>
									) : (
										<div
											style={{
												opacity: 0.5,
												backgroundColor: "#4D4B4B",
												width: 200,
												height: 120,
												padding: 20,
												marginLeft: 45
											}}
										>
											{/* <span>
											请漫游到场景中合适位置，单击<span style={{ color: "#67B2F5" }}>“选择当前视角”</span>
											，配置当前导航位跳转视角
										</span> */}
											<span>{<FormattedMessage id="jmk.outLine.PerspectiveTip" />}</span>
										</div>
									)}
								</Form.Item>
								{/* <Form.Item label={<FormattedMessage id="jmk.outLine.transitions" />}>
									<Space direction="horizontal">
										<Switch defaultChecked />
									</Space>
								</Form.Item> */}
								<Button
									type="primary"
									htmlType="submit"
									style={{ width: "100%", height: "45px", position: "absolute", bottom: 0, left: 0 }}
								>
									{<FormattedMessage id="jmk.outLine.saveSettings" />}
								</Button>
							</Form>
						</div>
					</div>
				</Card>
			</Grow>
		)
	)
}

const OutLineEdit = useMini(_PositionEdit)
export default OutLineEdit
