import { ModalRef } from "../modal.context"
import React, { useCallback, useState } from "react"
import { Button, Card, Col, Input, Row, Select } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import { useForceUpdate } from "@/utils/use.func"
import "./CenterSelectMedia.Modal.less"
import { regxOnlyNumEnUnline } from "@/utils/regexp.func"
interface Props {
	info: any
}
const AddSCENEModal: React.FC<Props & ModalRef<any>> = props => {
	const { resolve, reject, modalRef, info } = props
	const forceUpdate = useForceUpdate()
	const [CurrentTips, setTips] = useState(false)
	const scaleOpations = [
		{
			label: "1 m",
			value: 1
		},
		{
			label: "1 cm",
			value: 0.01
		},
		{
			label: "1 mm",
			value: 0.001
		},
		{
			label: "1 inch",
			value: 0.0254
		},
		{
			label: "1 foot",
			value: 0.3048
		}
	]
	const upaxisOpations = [
		{
			label: "Y",
			value: "Y"
		},
		{
			label: "Z",
			value: "Z"
		}
	]
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])

	const getcentermaterial = useCallback(() => {
		if (!info.scenename && "scenename" in info/* && !regxOnlyNumEnUnline.test(info.scenename)*/) {
			setTips(true)
		} else {
			setTips(false)
			resolve(info)
			modalRef.current.destroy()
		}
		// resolve(info)
		// modalRef.current.destroy()
	}, [])
	const changeScale = useCallback(v => {
		info.inputScale = v
		forceUpdate()
	}, [])
	const changeUpaxis = useCallback(v => {
		info.inputupAxis = v
		forceUpdate()
	}, [])
	const changeName = useCallback(v => {
		info.scenename = v.target.value
		forceUpdate()
	}, [])
	return (
		<Card
			id="SelectMediaModal"
			style={{ width: 330 }}
			title={"scenename" in info ? "创建展厅" : "更新展厅"}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<div className="filename">
				<Row gutter={10} align="middle" className="chuseany">
					<Col span={7} className="turright">
						导入文件：
					</Col>
					{typeof info.fileName == "string" && <Col span={18}>{info.fileName}</Col>}
				</Row>
			</div>
			{"scenename" in info && (
				<Row gutter={10} align="middle" className="chuseany">
					<Col span={7} className="turright">
						<span className="redcolor">*</span>展厅名称：
					</Col>
					<Col span={17}>
						<Input placeholder="展厅名字（英文、数字、下划线）" onChange={changeName} />
					</Col>
					{CurrentTips && (
						<Col span={17} offset={7} className="redcolor">
							请输入场景名称(只可输入数字,英文,下划线)!
						</Col>
					)}
				</Row>
			)}
			<Row gutter={10} align="middle" className="chuseany">
				<Col span={9} className="turright">
					<span className="redcolor">*</span>模型单位比例：
				</Col>
				<Col span={15}>
					<Select
						value={info.inputScale}
						style={{ width: 120 }}
						options={scaleOpations}
						onChange={changeScale}
					></Select>
				</Col>
			</Row>
			<Row gutter={10} align="middle" className="chuseany">
				<Col span={7} className="turright">
					<span className="redcolor">*</span>朝上轴：
				</Col>
				<Col span={17}>
					<Select
						value={info.inputupAxis}
						style={{ width: 120 }}
						options={upaxisOpations}
						onChange={changeUpaxis}
					></Select>
				</Col>
			</Row>
			<div className="overfollow">
				<div className="pull-right modelfoot ">
					<Button onClick={closeModal}>取消</Button>
					<Button type="primary" onClick={getcentermaterial}>
						确定
					</Button>
				</div>
			</div>
		</Card>
	)
}

export default AddSCENEModal
