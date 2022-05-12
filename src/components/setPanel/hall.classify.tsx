import {  Form, Checkbox, Input, Col, Row, Switch, Button, Divider, Tree, message, Modal } from "antd"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { JMKContext } from "@/components/provider/jmk.context"
import { useEditHook } from "@/components/jmk/jmk.engine"
import { useMini } from "@/utils/use.func"
import serviceLocal from "@/services/service.local"
import { FormattedMessage, useIntl } from "umi"
import { DeleteOutlined, FormOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons"
import { AsyncModal } from "../modal/modal.context"
import { doAlone, doTree } from "@/utils/array.fix"
import AddOneOutLine from "../modal/addOneOutLine.modal"
import editClassModal from "../modal/async/editClass.modal"
interface Props {
  showNade:any
}
const _HallLimits: React.FC<Props> = props => {
  const {
    showNade
	} = props
	const { state: JMK, dispatch } = useContext(JMKContext)
  const Intl = useIntl()
  const [treeData, setTreeData] = useState([])
  const [isDone,setDone] = useState(false)
	useEffect(() => {
		// serviceLocal.getClassify(JMK.sceneName, "").then(res => {
		// 	if (res.code == "200") {
		// 		setTreeData(res.data)
		// 		setDone(true)
		// 	}
		// })
	}, [])
  // 判断树节点
	const getParentId = (data:any, key: number) => {
		for (let i in data) {
			if (data[i].key == key) {
				return [data[i].key]
			}
			if (data[i].children) {
				const tnode: any = getParentId(data[i].children, key)
				if (tnode !== undefined) {
					return tnode.concat(data[i].key)
				}
			}
		}
  }
  // 分类数据
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
						onClick={editClass(treeData.find(m => m.key === nodeData.key))}
					></Button>
					<Button icon={<DeleteOutlined />} onClick={delClass(nodeData)} type="text"></Button>
				</Col>
			</Row>
		),
		[treeData]
	)
	// 添加分类
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
		if (JMK.sceneName && isDone) {
			serviceLocal.editClassify(JMK.sceneName, treeData).then(res => {
				if (res.code == "200") {
				}
			})
		}
	}, [treeData, JMK.sceneName,isDone])
	// 拖拽
	const onDrop = (info: any) => {
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
	// 编辑分类
	const editClass = useCallback(
		item => async () => {
			const code = await AsyncModal({
				content: editClassModal,
				params: {
					classItem: item,
					treeData: treeData
				}
			})
			if (code == "200") {
				serviceLocal.getClassify(JMK.sceneName, "").then(res => {
					if (res.code == "200") {
						setTreeData(res.data)
					}
				})
			}
		},
		[treeData]
	)
	// 删除分类
	const delClass = useCallback(
		(node: any) => () => {
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
	return (
    <>
    <Form.Item label={<FormattedMessage id="jmk.setup.classDefinition" />}>
			<Form.Item name={["category", "visible"]} noStyle valuePropName="checked">
				<Switch
					defaultChecked
					checkedChildren={<FormattedMessage id="jmk.setup.classStartUsing" />}
					unCheckedChildren={<FormattedMessage id="jmk.setup.classClose" />}
				/>
			</Form.Item>

			<Button onClick={addClass(null)} type="primary" style={{ position: "absolute", right: "10px" }}>
				<FormattedMessage id="jmk.outLine.addOneClass" />
			</Button>
			<Divider />
      <Form.Item  noStyle valuePropName="checked" hidden={!showNade.category}>
        <Tree
					className="draggable-tree"
					draggable
					blockNode
					titleRender={titleRender}
					onDrop={onDrop}
					treeData={doTree(treeData, "key", "pid")}
					// onSelect={handleTreeNode}
				/>
			</Form.Item>
		</Form.Item>
  </>
	)
}

const HallLimits = useMini(_HallLimits)
export default HallLimits
