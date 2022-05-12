import commonFunc from "@/utils/common.func"
import { CloseOutlined, CameraOutlined } from "@ant-design/icons"
import { Card, Button, Row, Col, Input, Form, Switch } from "antd"
import { RcFile } from "antd/lib/upload/interface"
import "cropperjs/dist/cropper.css"
import "./videocover.modal.less"
import Cropper from "cropperjs"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { ModalRef } from "../modal.context"
import { useForm } from "antd/lib/form/Form"
import eventBus from "@/utils/event.bus"
interface Props {
	file: RcFile
	crop?: boolean
}
const VideoCoverModal: React.FC<Props & ModalRef<RcFile>> = props => {
	const { file: video, resolve, reject, modalRef, crop } = props
	const [cover, setCover] = useState<Blob>()
	const videoRead = useMemo(() => {
		return commonFunc.getUrl(video)
	}, [video])
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	const imageRef = useRef<HTMLImageElement>()
	const videoRef = useRef<HTMLVideoElement>()
	const cropperRef = useRef<Cropper>()
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
	const saveFile = useCallback(() => {
		const { uid } = video
		let newName = uid + "-cover.png"
		if (cropperRef.current) {
			cropperRef.current.getCroppedCanvas().toBlob(blob => {
				const newFile = new File([blob], newName, { type: "image/png" })
				//antd验证文件唯一标示符UID
				newFile["uid"] = uid + "-cover"

				resolve(newFile as RcFile)
			})
		} else {
			const newFile = new File([cover], newName, { type: "image/png" })
			//antd验证文件唯一标示符UID
			newFile["uid"] = uid + "-cover"

			resolve(newFile as RcFile)
		}

		modalRef.current.destroy()
	}, [cover])
	const coverVideo = useCallback(() => {
		const canvas = document.createElement("canvas")
		const { clientWidth, clientHeight } = videoRef.current
		canvas.width = clientWidth
		canvas.height = clientHeight
		canvas.getContext("2d").drawImage(videoRef.current, 0, 0, clientWidth, clientHeight)
		canvas.toBlob(bolb => {
			setCover(bolb)
		}, "image/png")
	}, [video])
	const imgUrl = useMemo(() => commonFunc.getUrl(new File([cover], "", { type: "image/png" })), [cover])
	useEffect(() => {
		if (!!cover) {
			if (!!crop) {
				if (!!cropperRef.current) {
					cropperRef.current.replace(imgUrl)
				} else {
					cropperRef.current = new Cropper(imageRef.current, {
						viewMode: 1,
						highlight: true,
						crop(event) {
							const { detail } = event
							form.setFields([
								{ name: "width", value: detail.width },
								{ name: "height", value: detail.height }
							])
						}
					})
				}
			}
		}
	}, [cover, crop])
	return (
		<Card
			style={{ width: 980 }}
			title={"视频封面"}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Row id="VideoCoverModal" gutter={16}>
				<Col span={12}>
					<div className="video-box">
						<video
							ref={videoRef}
							src={videoRead}
							muted
							controls
							controlsList="nodownload nofullscreen"
							disablePictureInPicture
							disableRemotePlayback
							preload="auto"
							width="100%"
						/>
						<div className="video-cover-action">
							<Button type="dashed" ghost size="large" color="inherit" icon={<CameraOutlined />} onClick={coverVideo}>
								截屏
							</Button>
						</div>
					</div>
				</Col>
				<Col span={12}>
					<Row id="ImageCropModal" gutter={[0, 16]}>
						<Col span={24}>
							<div className="img-box">
								<img
									ref={imageRef}
									src={imgUrl || require("@/assets/image/videoCover.jpg")}
									width="100%"
									height="100%"
									onError={e => {
										e.currentTarget.src = require("@/assets/image/videoCover.jpg")
									}}
								/>
							</div>
						</Col>
						<Col span={24} hidden={!crop}>
							<Form form={form} layout="inline" onValuesChange={onValuesChange}>
								<Form.Item label="比例" name="ratio" valuePropName="checked">
									<Switch checkedChildren="锁定" unCheckedChildren="释放" />
								</Form.Item>
								<Form.Item label="尺寸">
									<Input.Group compact>
										<Form.Item noStyle name="width">
											<Input disabled style={{ width: 100 }} />
										</Form.Item>
										<Form.Item noStyle name="height">
											<Input disabled style={{ width: 100 }} />
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
									<Button type="text" onClick={closeModal}>
										放弃
									</Button>
								</Col>
								<Col>
									<Button type="link" onClick={resetCrop}>
										重置
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
				</Col>
			</Row>
		</Card>
	)
}

export default VideoCoverModal
