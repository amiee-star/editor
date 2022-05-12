import { Form, Checkbox, Input, Col, Row, Switch, Button, Divider, Tree, message, Modal } from "antd"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { JMKContext } from "@/components/provider/jmk.context"
import { useEditHook } from "@/components/jmk/jmk.engine"
import { useMini } from "@/utils/use.func"
import serviceLocal from "@/services/service.local"
import { FormattedMessage, useIntl } from "umi"
import { DeleteOutlined, FormOutlined, UploadOutlined } from "@ant-design/icons"
import { AsyncModal } from "../modal/modal.context"
import addButtonModal from "../modal/async/addButton.modal"
import { doAlone } from "@/utils/array.fix"
import editButtonModal from "../modal/async/editButton.modal"
import eventBus from "@/utils/event.bus"
interface Props {
	showNade: any
}
const _HallLimits: React.FC<Props> = props => {
	const { showNade } = props
	const { state: JMK, dispatch } = useContext(JMKContext)
	const Intl = useIntl()
	const [buttonData, setButtonData] = useState([])
	const [isButtonDone, setIsButtonDone] = useState(false)
	useEffect(() => {
		// serviceLocal.getCustomButton(JMK.sceneName, "").then(res => {
		// 	if (res.code == "200") {
		// 		setButtonData(res.data)
		// 		setIsButtonDone(true)
		// 	}
		// })
	}, [])
	useEffect(() => {
		if (JMK.sceneName && isButtonDone) {
			serviceLocal.editCustomButton(JMK.sceneName, buttonData).then(res => {
				if (res.code == "200") {
				}
			})
		}
	}, [buttonData, JMK.sceneName, isButtonDone])
	// 添加自定义按钮
	const addButton = useCallback(
		item => async () => {
			if (buttonData.length >= 1) {
				message.info(Intl.formatMessage({ id: "jmk.setup.addCustomButtonTip" }))
			} else {
				const newData = await AsyncModal({
					content: addButtonModal,
					params: {
						pid: item ? item.key : 0
					}
				})
				if (newData) {
					eventBus.emit("jmk.ButtonList", buttonData.concat(newData))
					setButtonData(buttonData.concat(newData))
				}
			}
			// const newData = await AsyncModal({
			// 	content: addButtonModal,
			// 	params: {
			// 		pid: item ? item.key : 0
			// 	}
			// })
			// if (newData) {
			// 	setButtonData(buttonData.concat(newData))
			// }
		},
		[buttonData]
	)
	// 编辑按钮
	const editButton = useCallback(
		item => async () => {
			const code = await AsyncModal({
				content: editButtonModal,
				params: {
					buttonItem: item,
					buttonData: buttonData
				}
			})
			if (code == "200") {
				// serviceLocal.getCustomButton(JMK.sceneName, "").then(res => {
				// 	if (res.code == "200") {
				// 		setButtonData(res.data)
				// 	}
				// })
			}
		},
		[buttonData]
	)
	// 删除分类
	const delButton = useCallback(
		(node: any) => () => {
			Modal.confirm({
				title: Intl.formatMessage({ id: "jmk.setup.delbutton" }),
				content: Intl.formatMessage({ id: "jmk.deleteOutLine.tip" }),
				closable: true,
				onOk: () => {
					const list = doAlone([node], "children")
					setButtonData(buttonData.filter(m => !list.map(m => m.key).includes(m.key)))
				}
			})
		},
		[buttonData]
	)
	// 自定义按钮
	const buttonRender = useCallback(
		nodeData => (
			<Row justify="space-between" align="middle">
				<Col className={"nodeTitle"}>{nodeData.buttonName}</Col>
				<Col>
					<Button
						icon={<FormOutlined />}
						type="text"
						onClick={editButton(buttonData.find(m => m.key === nodeData.key))}
					></Button>
					<Button icon={<DeleteOutlined />} onClick={delButton(nodeData)} type="text"></Button>
				</Col>
			</Row>
		),
		[buttonData]
	)
	return (
		<>
			<Form.Item label={<FormattedMessage id="jmk.minimap.Accesspassword" />}>
				<Form.Item name="usePwd" noStyle valuePropName="checked">
					<Checkbox style={{ lineHeight: "32px" }}>
						{<FormattedMessage id="jmk.minimap.Enableaccesspassword" />}
					</Checkbox>
				</Form.Item>
				<Form.Item
					noStyle
					name="password"
					rules={[{ required: showNade.usePwd, message: <FormattedMessage id="jmk.minimap.Pleasesetthepassword" /> }]}
					hidden={!showNade.usePwd}
				>
					<Input.Password />
				</Form.Item>
			</Form.Item>
			{/* 自定义按钮 */}
			<Form.Item label={<FormattedMessage id="jmk.setup.customButton" />}>
				<Form.Item name={["customButton", "visible"]} noStyle valuePropName="checked">
					<Switch
						defaultChecked
						checkedChildren={<FormattedMessage id="jmk.setup.classStartUsing" />}
						unCheckedChildren={<FormattedMessage id="jmk.setup.classClose" />}
					/>
				</Form.Item>

				<Button
					onClick={addButton(null)}
					type="primary"
					style={{ position: "absolute", right: "10px", display: showNade.customButton ? "inline-block" : "none" }}
				>
					<FormattedMessage id="jmk.setup.addCustomButton" />
				</Button>
				<Divider />
				<Form.Item noStyle valuePropName="checked" hidden={!showNade.customButton}>
					<Tree
						className="draggable-tree"
						draggable
						blockNode
						titleRender={buttonRender}
						// onDrop={onDrop}
						treeData={buttonData}
						// onSelect={handleTreeNode}
					/>
				</Form.Item>
			</Form.Item>
		</>
	)
}

const HallLimits = useMini(_HallLimits)
export default HallLimits
