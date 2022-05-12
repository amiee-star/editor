import { ModalRef } from "../modal.context"
import React, { useCallback, useEffect, useState } from "react"
import { useForm } from "antd/es/form/Form"
import { Button, Card, Col, Form, Input, Row, Typography } from "antd"
import { CheckCircleFilled, CheckCircleOutlined, CloseOutlined, DeleteFilled } from "@ant-design/icons"
import serviceLocal from "@/services/service.local"
import urlFunc from "@/utils/url.func"
import { useForceUpdate } from "@/utils/use.func"
import "./setScene.Modal.less"
import classNames from "classnames"
import Sortable from "sortablejs"
import SortItem from "@/components/utils/sort.item"

interface Props {}
const SetSceneModal: React.FC<Props & ModalRef<{ name?: string; scenes?: []; btName: string }>> = props => {
	const { resolve, reject, modalRef, name, btName, scenes } = props
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	const [currentStep, setCurrentStep] = useState(false)
	const forceUpdate = useForceUpdate()
	// 单个展厅列表
	const [sceneLists, setScenelists] = useState([])
	const getSceneList = useCallback(() => {
		serviceLocal.sceneList().then(res => {
			setScenelists(res.data)
		})
	}, [])
	useEffect(() => {
		getSceneList()
	}, [])
	useEffect(() => {
		if (name) {
			setCurrentScenes(scenes)
			form.setFieldsValue({
				name: name,
				btName: btName
			})
		}
	}, [])
	const [currentScenes, setCurrentScenes] = useState([])
	const checkScene = useCallback(
		item => () => {
			const isCheck = currentScenes.find(a => a.scene === item.name)
			if (!isCheck) {
				let newList = [...currentScenes]
				newList.push({
					scene: item.name,
					thumbnail: urlFunc.replaceUrl(item.assetsUrl + "thumbnail.jpg")
				})
				setCurrentScenes(newList)
			}
		},
		[currentScenes]
	)
	const deleteScene = useCallback(
		item => () => {
			let newList = [...currentScenes]
			const isCheck = newList.findIndex(a => a.scene === item.scene)
			newList.splice(isCheck, 1)
			setCurrentScenes(newList)
		},
		[currentScenes]
	)
	const nextStep = useCallback(
		item => () => {
			setCurrentStep(item)
		},
		[]
	)
	// 表单操作
	const [form] = useForm()
	const layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 }
	}
	const tailLayout = {
		wrapperCol: { offset: 8, span: 16 }
	}
	const onReset = () => {
		setCurrentStep(false)
	}
	const onFinish = useCallback(
		values => {
			const newScene = {
				name: values.name,
				btName: values.btName,
				scenes: currentScenes
			}
			resolve(newScene)
			modalRef.current.destroy()
		},
		[currentScenes]
	)
	const [sotrList, setSotrList] = useState([])
	const sortChange = useCallback((data: any[]) => {
		setSotrList(data)
	}, [])
	useEffect(() => {
		let newScenes: any[] = []
		sotrList.forEach(item => {
			let newScene = sceneLists.find(a => a.name === item)
			newScenes.push({
				scene: newScene.name,
				thumbnail: urlFunc.replaceUrl(newScene.assetsUrl + "thumbnail.jpg")
			})
		})
		if (newScenes.length > 0) {
			setCurrentScenes(newScenes)
		}
	}, [sotrList, sceneLists])
	return (
		<Card
			id="SetSceneModal"
			style={{ width: 800 }}
			title="组合展厅"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			{!currentStep && !!sceneLists && (
				<>
					<Row gutter={40}>
						<Col span={18}>
							<Row gutter={10} className="overHeight">
								{sceneLists.map((item, index) => {
									return (
										<Col span={8} className="sceneListcard" key={item.name}>
											<div
												onClick={checkScene(item)}
												className={classNames({
													listImg: true,
													sceneChecked: currentScenes.find(a => a.scene === item.name)
												})}
											>
												<img src={urlFunc.replaceUrl(item.assetsUrl + "thumbnail.jpg")} />
												{currentScenes.find(a => a.scene === item.name) && (
													<p>
														<CheckCircleFilled style={{ color: "#52c41a", fontSize: "20px" }} />
													</p>
												)}
												<Typography.Text strong className="listScene">
													{item.name}
												</Typography.Text>
											</div>
										</Col>
									)
								})}
							</Row>
						</Col>
						<Col span={6}>
							<Row className="overHeight">
								<SortItem handle=".slide-item" direction="vertical" onChange={sortChange}>
									{currentScenes.map((item, index) => {
										return (
											<Col key={item.scene} className="listCkeck slide-item" data-id={item.scene}>
												<div>
													<img src={item.thumbnail} />
													<p onClick={deleteScene(item)}>
														<DeleteFilled style={{ color: "#1890ff", fontSize: "16px" }} />
													</p>
												</div>
												<Typography.Text strong className="listScene">
													{item.scene}
												</Typography.Text>
											</Col>
										)
									})}
								</SortItem>
							</Row>
						</Col>
					</Row>
					<div className="buttontype">
						{currentScenes.length > 0 && (
							<Button type="primary" onClick={nextStep(true)}>
								下一步
							</Button>
						)}
					</div>
				</>
			)}
			{!!currentStep && (
				<div>
					<Form
						{...layout}
						name="basic"
						form={form}
						initialValues={{ btName: "展厅导览" }}
						onFinish={onFinish}
						style={{ width: "600px" }}
					>
						<Form.Item label="组合展厅名称" name="name" rules={[{ required: true, message: "请输入组合展厅名称" }]}>
							<Input maxLength={15} />
						</Form.Item>

						<Form.Item label="按钮名称" name="btName" rules={[{ required: true, message: "请输入按钮名称" }]}>
							<Input maxLength={6} />
						</Form.Item>
						<Form.Item {...tailLayout}>
							<Button htmlType="button" onClick={onReset} style={{ marginRight: "60px" }}>
								上一步：选择展厅
							</Button>
							<Button type="primary" htmlType="submit" style={{ width: "120px" }}>
								提交
							</Button>
						</Form.Item>
					</Form>
				</div>
			)}
		</Card>
	)
}

export default SetSceneModal
