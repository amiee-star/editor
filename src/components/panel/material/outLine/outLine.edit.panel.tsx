import { useMini } from "@/utils/use.func"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { Button, Card, Col, Drawer, Empty, Form, Input, Modal, Row, Space, Switch, Tree } from "antd"
import { FormattedMessage, useIntl } from "umi"
import { DeleteOutlined, FormOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons"
import { AsyncModal, ModalCustom } from "@/components/modal/modal.context"
import AddOneOutLine from "../../../modal/addOneOutLine.modal"
import form from "antd/lib/form"
import { panelContext } from "@/components/provider/panel.context"
import { useEditHook } from "@/components/jmk/jmk.engine"
import ScreenModal from "@/components/modal/async/screen.modal"
import { JMKContext } from "@/components/provider/jmk.context"
import serviceLocal from "@/services/service.local"
import { doAlone, doTree } from "@/utils/array.fix"
import Grow from "@/components/transitions/grow"
import { DataNode } from "antd/lib/tree"
import urlFunc from "@/utils/url.func"
import { JMTInterface } from "@/interfaces/jmt.interface"
import "./outLine.edit.panel.less"
interface Props {
	isShowOutLine?: boolean
}
interface Item {
	key: number
	pid: number
	title: string
	config: {
		tour: any
		pic: string
	}
}
interface treeNodeInfo {
	dropToGap: any
	dropPosition: number
	dragNode: any
	node: any
}
interface TreeItem extends Item {
	children?: TreeItem[]
}
const _OutLineEdit: React.FC<Props> = props => {
	const Intl = useIntl()
	const JMTRef = useRef<JMTInterface>(null)
	const JMKHook = useEditHook()
	const [form] = Form.useForm()
	const { state } = useContext(JMKContext)
	const { state: panelState, dispatch } = useContext(panelContext)
	const [treeData, setTreeData] = useState<TreeItem[]>([])
	const [done, setDone] = useState(false)
	useEffect(() => {
		serviceLocal.getOutLine(state.sceneName, "").then(res => {
			if (res.code == "200") {
				setTreeData(res.data)
				setDone(true)
				setIsPic(true)
			}
		})
	}, [])

	const show = useMemo(() => panelState.current === "outline" && panelState.action === "edit", [panelState, state])

	// 是否显示大纲面板
	const [ShowOutLine, setShowOutLine] = useState(true)
	// 是否显示大纲树
	const [isShowTree, setShowTree] = useState(true)
	// 隐藏面板
	const onClose = useCallback(() => {
		if (!isShowTree) {
			setShowTree(true)
		} else {
			setShowOutLine(false)
			dispatch({
				type: "set",
				payload: {
					current: ""
				}
			})
		}
	}, [isShowTree, ShowOutLine])

	// 判断树节点
	const getParentId = (data: (TreeItem & { children?: TreeItem[] })[], key: number) => {
		for (let i in data) {
			if (data[i].key == key) {
				return [data[i].key]
			}
			if (data[i].children) {
				const tnode = getParentId(data[i].children, key)
				if (tnode !== undefined) {
					return tnode.concat(data[i].key)
				}
			}
		}
	}
	const titleRender = useCallback(
		nodeData => (
			<Row justify="space-between" align="middle">
				<Col className={"nodeTitle"}>{nodeData.title}</Col>
				<Col>
					<Button
						icon={<PlusOutlined />}
						type="text"
						onClick={addClass(nodeData)}
						disabled={getParentId(doTree(treeData, "key", "pid"), nodeData.key)?.length == 3 ? true : false}
					></Button>
					<Button
						icon={<FormOutlined />}
						type="text"
						// onClick={editClass(treeData.find(m => m.key === nodeData.key))}
						onClick={editClass(nodeData)}
					></Button>
					<Button icon={<DeleteOutlined />} onClick={delClass(nodeData)} type="text"></Button>
				</Col>
			</Row>
		),
		[treeData]
	)
	// 添加大纲
	const addClass = useCallback(
		item => async () => {
			const newData = await AsyncModal({
				content: AddOneOutLine,
				params: {
					pid: item ? item.key : 0
				}
			})
			if (newData) {
				setTreeData(treeData.concat(newData))
			}
		},
		[treeData]
	)

	useEffect(() => {
		if (done && state.sceneName) {
			serviceLocal.editOutLine(state.sceneName, treeData).then(res => {
				if (res.code == "200") {
				}
			})
		}
	}, [treeData, state, done])
	const [outLineItem, setOutLineItem] = useState<Item>()
	// 编辑大纲
	const editClass = useCallback(
		(node: Item) => () => {
			setShowTree(false)
			setOutLineItem(node)
			form.setFieldsValue({ name: node.title })
		},
		[outLineItem]
	)
	// 删除大纲
	const delClass = useCallback(
		(node: DataNode) => () => {
			Modal.confirm({
				title: Intl.formatMessage({ id: "jmk.deleteOutLine" }),
				content: Intl.formatMessage({ id: "jmk.deleteOutLine.tip" }),
				closable: true,
				onOk: () => {
					const list = doAlone([node], "children")
					setTreeData(treeData.filter(m => !list.map(m => m.key).includes(m.key)))
				}
			})
		},
		[treeData]
	)

	// 提交
	const onFinish = useCallback(
		data => {
			// const m = treeData.find(item => item.key == outLineItem.key)
			let item = {}
			let list = doAlone(treeData, "children")
			item = list.find(m => m.key === outLineItem.key)
			item.title = data.name
			item.config.tour = outLineItem.config.tour
			let newTreeData = doTree(list, "key", "pid")
			setTreeData(newTreeData)
			if (done && state.sceneName) {
				serviceLocal.editOutLine(state.sceneName, newTreeData).then(res => {
					if (res.code == "200") {
						setShowTree(true)
					}
				})
			}
		},
		[treeData, state, done, outLineItem]
	)
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
			outLineItem.config.pic = data
			setOutLineItem(outLineItem)
			setIsPic(true)
			// const m = treeData.find(item => item.key == outLineItem.key)
			let item = {}
			let list = doAlone(treeData, "children")
			item = list.find(m => m.key === outLineItem.key)
			item.config.pic = data
			// setTreeData(treeData)
			setTreeData(doTree(list, "key", "pid"))
		}
	}, [state, outLineItem])

	const resetView = useCallback(() => {
		setViewThumb()
		const cameraPos = JMKHook.getCameraPosition()
		const rotation = JMKHook.getCameraRotation()
		outLineItem.config.tour = {
			cameraPos,
			rotation
		}
		setOutLineItem(outLineItem)
		// const m = treeData.find(item => item.key == outLineItem.key)
		let item = {}
		let list = doAlone(treeData, "children")
		item = list.find(m => m.key === outLineItem.key)

		item.config.tour = {
			cameraPos,
			rotation
		}
		setTreeData(doTree(list, "key", "pid"))
	}, [state, outLineItem, treeData])

	// 拖拽
	const onDrop = (info: treeNodeInfo) => {
		const dropKey = info.node.key
		const dragKey = info.dragNode.key
		const dropPos = info.node.pos.split("-")
		const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

		const loop = (data: string | any[], key: any, callback: any) => {
			for (let i = 0; i < data.length; i++) {
				if (data[i].key === key) {
					return callback(data[i], i, data)
				}
				if (data[i].children) {
					loop(data[i].children, key, callback)
				}
			}
		}
		const data = doTree(treeData, "key", "pid")

		let dragObj: any
		loop(data, dragKey, (item: any, index: any, arr: any[]) => {
			arr.splice(index, 1)
			dragObj = item
		})

		if (!info.dropToGap) {
			loop(data, dropKey, (item: { children: any[] }) => {
				item.children = item.children || []
				item.children.unshift(dragObj)
			})
		} else if ((info.node.props.children || []).length > 0 && info.node.props.expanded && dropPosition === 1) {
			loop(data, dropKey, (item: { children: any[] }) => {
				item.children = item.children || []
				item.children.unshift(dragObj)
			})
		} else {
			let ar: any[] = []
			let i = 0
			loop(data, dropKey, (item: any, index: number, arr: any[]) => {
				ar = arr
				i = index
			})
			if (dropPosition === -1) {
				ar.splice(i, 0, dragObj)
			} else {
				ar.splice(i + 1, 0, dragObj)
			}
		}

		setTreeData(data)
	}

	// 点击树节点
	const handleTreeNode = useCallback(
		(key: number[]) => {
			let item = {}
			let list = doAlone(treeData, "children")
			item = list.find(m => m.key === key[0])
			if (!!item?.config?.tour) {
				const { cameraPos, rotation } = item.config.tour
				// const [x, y, z] = cameraPos
				// state.editHook.teleport.switchToPoint({
				// 	x,
				// 	y,
				// 	z
				// })
				// editor 对象moveAndHeadTo方法
				state.jmt.getViewer().moveAndHeadTo(cameraPos, rotation)
			}
			setTreeData(doTree(list, "key", "pid"))
		},
		[treeData, state]
	)
	// 点击图片
	const getView = useCallback(() => {
		if (!!outLineItem?.config.tour) {
			const { cameraPos, rotation } = outLineItem.config.tour
			// editor 对象moveAndHeadTo方法
			// state.app.moveAndHeadTo(cameraPos, rotation)
			state.jmt.getViewer().moveAndHeadTo(cameraPos, rotation)
		}
	}, [outLineItem, state])
	return (
		<Grow in={show}>
			<Card
				id="outLine-Tree"
				className="panel-box"
				bordered={false}
				title={<FormattedMessage id="jmk.minimap.Halloutline" />}
				extra={<Button onClick={onClose} type="ghost" shape="circle" icon={<RightOutlined />} />}
				style={{ width: 320 }}
			>
				<div>
					{!!isShowTree ? (
						<div>
							<Row>
								<Button style={{ marginLeft: 220 }} type="primary" onClick={addClass(null)}>
									{<FormattedMessage id="jmk.outLine.addOneClass" />}
								</Button>
							</Row>
							<div>
								<Tree
									className="draggable-tree"
									draggable
									blockNode
									titleRender={titleRender}
									onDrop={onDrop}
									treeData={doTree(treeData, "key", "pid")}
									onSelect={handleTreeNode}
								/>
							</div>
						</div>
					) : (
						<div>
							<Form
								labelCol={{ span: 6 }}
								wrapperCol={{ span: 18 }}
								onFinish={onFinish}
								form={form}
								initialValues={outLineItem}
							>
								{/* "jmk.title" */}
								<Form.Item
									name="name"
									label={<FormattedMessage id="jmk.title" />}
									rules={[
										{ required: true, message: <FormattedMessage id="jmk.outLine.titleTip" /> },
										{ message: "请输入1-30个文字", max: 30 }
									]}
								>
									<Input />
								</Form.Item>
								<Form.Item name="view" label={<FormattedMessage id="jmk.outLine.choice" />}>
									<Button onClick={resetView}>{<FormattedMessage id="jmk.outLine.PerspectiveChoice" />}</Button>
								</Form.Item>
								<Form.Item name="pic">
									{!!isPic && !!outLineItem?.config.pic ? (
										<>
											<Col span={24}>
												<img
													src={urlFunc.replaceUrl(outLineItem?.config.pic)}
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
					)}
				</div>
			</Card>
		</Grow>
	)
}

const OutLineEdit = useMini(_OutLineEdit)
export default OutLineEdit
