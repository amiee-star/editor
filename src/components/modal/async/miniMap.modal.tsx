import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, Row } from "antd"
import Cropper from "cropperjs"
import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { ModalRef } from "../modal.context"
import "./imagecrop.modal.less"
import "cropperjs/dist/cropper.css"
import { useForm } from "antd/lib/form/Form"
import urlFunc from "@/utils/url.func"
import { useEditHook } from "@/components/jmk/jmk.engine"
interface Props {
	file: string
}
const MiniMapModal: React.FC<Props & ModalRef<any>> = props => {
	const { file, resolve, reject, modalRef } = props
	const JMKHook = useEditHook()

	console.log(file)
	const SceneBBox: any = useMemo(() => JMKHook.getSceneBBox(), [])
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	const imageRef = useRef<HTMLImageElement>()
	const cropperRef = useRef<Cropper>()
	useEffect(() => {
		cropperRef.current = new Cropper(imageRef.current, {
			viewMode: 1,
			dragMode: "move",
			initialAspectRatio: (SceneBBox.max.x - SceneBBox.min.x) / (SceneBBox.max.y - SceneBBox.min.y),
			cropBoxResizable: false,
			toggleDragModeOnDblclick: false,
			crop() {
				const getData = cropperRef.current.getData()
				const totalScale = getData.width / (SceneBBox.max.x - SceneBBox.min.x)
				form.setFields([{ name: "width", value: Math.round(totalScale) }])
			}
		})
	}, [])
	const [form] = useForm()

	const onCancel = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [file])
	const saveFile = useCallback(() => {
		cropperRef.current.getCroppedCanvas().toBlob(blob => {
			const getData = cropperRef.current.getData()
			const cropData = {
				scale: Math.round(getData.width / (SceneBBox.max.x - SceneBBox.min.x)),
				x: Math.round(getData.width / 2),
				y: Math.round(getData.height / 2),
				file: blob
			}
			resolve(cropData)
			modalRef.current.destroy()
		})
	}, [])
	return (
		<Card
			className="banner-modal"
			style={{ width: 800 }}
			title={"小地图设置"}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Row id="ImageCropModal" gutter={[0, 16]}>
				<Col span={24}>
					<img ref={imageRef} src={urlFunc.replaceUrl(file, "obs")} />
				</Col>
				<Col span={18}>
					<Form form={form} layout="inline">
						<Form.Item label="比例尺">
							<Input.Group compact>
								<Form.Item noStyle name="width">
									<Input disabled style={{ width: "30%" }} />
								</Form.Item>
							</Input.Group>
						</Form.Item>
					</Form>
				</Col>
				<Col span={6}>
					<Row justify="end">
						<Col>
							<Button type="text" onClick={onCancel}>
								放弃
							</Button>
						</Col>
						<Col>
							<Button type="primary" onClick={saveFile}>
								保存
							</Button>
						</Col>
					</Row>
				</Col>
			</Row>
		</Card>
	)
}
export default MiniMapModal
