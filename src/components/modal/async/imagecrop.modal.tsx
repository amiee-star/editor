import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, Row, Switch } from "antd"
import { RcFile } from "antd/lib/upload"
import Cropper from "cropperjs"
import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { ModalRef } from "../modal.context"
import "./imagecrop.modal.less"
import "cropperjs/dist/cropper.css"
import { useForm } from "antd/lib/form/Form"
import commonFunc from "@/utils/common.func"
interface Props {
	file: RcFile
	// add
	aspectRatio?: number[]
}
const ImageCropModal: React.FC<Props & ModalRef<RcFile>> = props => {
	const { file, resolve, reject, modalRef } = props

	const fileRead = useMemo(() => {
		return commonFunc.getUrl(file)
	}, [file])
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	const imageRef = useRef<HTMLImageElement>()
	const cropperRef = useRef<Cropper>()

	useEffect(() => {
		// !!!!
		let aspectRatio = 0
		const { naturalHeight, naturalWidth } = imageRef.current

		if (props.aspectRatio) {
			aspectRatio = props.aspectRatio[0] / props.aspectRatio[1]
		} else {
			aspectRatio = naturalWidth / naturalHeight
		}
		//!!!
		cropperRef.current = new Cropper(imageRef.current, {
			viewMode: 1,
			//
			aspectRatio,
			//
			crop(event) {
				const { detail } = event
				form.setFields([
					{ name: "width", value: Math.floor(detail.width) },
					{ name: "height", value: Math.floor(detail.height) }
				])
			},
			//
			ready(e) {
				const { naturalHeight, naturalWidth } = imageRef.current
				cropperRef.current.setAspectRatio(aspectRatio)

				if (props.aspectRatio) {
					if (naturalWidth >= props.aspectRatio[0] && naturalHeight >= props.aspectRatio[1]) {
						cropperRef.current.setCropBoxData({ width: props.aspectRatio[0] })
					} else {
						cropperRef.current.setAspectRatio(props.aspectRatio[0] / props.aspectRatio[1])
					}
				}
			}
			//
		})
	}, [])
	const [form] = useForm()
	const onValuesChange = useCallback(data => {
		if ("ratio" in data) {
			const { naturalHeight, naturalWidth } = imageRef.current
			cropperRef.current.setAspectRatio(data.ratio ? naturalWidth / naturalHeight : null)
		}
	}, [])
	const resetCrop = useCallback(() => {
		cropperRef.current.reset()
	}, [])
	const onCancel = useCallback(() => {
		modalRef.current.destroy()
		resolve(file)
	}, [file])
	const saveFile = useCallback(() => {
		cropperRef.current.getCroppedCanvas().toBlob(blob => {
			const { type, name, uid } = file
			const newFile = new File([blob], name, { type })
			//antd验证文件唯一标示符UID
			newFile["uid"] = uid
			resolve(newFile as RcFile)
			modalRef.current.destroy()
		}, file.type)
	}, [])
	return (
		<Card
			className="banner-modal"
			style={{ width: 800 }}
			title={"图片裁剪"}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Row id="ImageCropModal" gutter={[0, 16]}>
				<Col span={24}>
					<img ref={imageRef} src={fileRead} />
				</Col>
				<Col span={24}>
					<Form form={form} layout="inline" onValuesChange={onValuesChange}>
						<Form.Item label="比例" name="ratio" valuePropName="checked">
							<Switch checkedChildren="锁定" unCheckedChildren="释放" />
						</Form.Item>
						<Form.Item label="尺寸">
							<Input.Group compact>
								<Form.Item noStyle name="width">
									<Input disabled style={{ width: "30%" }} />
								</Form.Item>
								<Form.Item noStyle name="height">
									<Input disabled style={{ width: "30%" }} />
								</Form.Item>
							</Input.Group>
						</Form.Item>
					</Form>
				</Col>
				<Col span={24}>
					<Row justify="end">
						<Col>
							<Button type="text" onClick={closeModal}>
								重选
							</Button>
						</Col>
						<Col>
							<Button type="text" onClick={onCancel}>
								放弃裁剪并保存
							</Button>
						</Col>
						<Col>
							<Button type="link" onClick={resetCrop}>
								重置裁剪区
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
export default ImageCropModal
