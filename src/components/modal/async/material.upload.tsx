import FormUploads from "@/components/form/form.uploads"
import { JMKContext } from "@/components/provider/jmk.context"
import fileType from "@/constant/file.type"
import serviceLocal from "@/services/service.local"
import { doTree } from "@/utils/array.fix"
import checkImage from "@/utils/checkImage.func"
import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Card, Cascader, Col, Form, Input, Row, Select, Space, Typography, Upload } from "antd"
import CheckableTag from "antd/lib/tag/CheckableTag"
import { RcFile } from "antd/lib/upload"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "umi"
import { AsyncModal, ModalRef } from "../modal.context"
import VideoCoverModal from "./videocover.modal"
interface Props {
	fileType: number
	isShowThumbnail?: boolean
	fileAccept?:
		| "image/*"
		| "video/*"
		| "audio/*"
		| ".zip,.rar"
		| ".png, .jpg, .jpeg"
		| ".ies"
		| ".gif"
		| ".jm2"
		| ".pdf"
		| string
	checkType?: keyof typeof fileType
	cardTitle: any
	uploadTip: any
}
const MaterialUploadModal: React.FC<Props & ModalRef<{ name: string; file: string }>> = props => {
	const { reject, modalRef, resolve, fileType, isShowThumbnail, fileAccept, checkType, cardTitle, uploadTip } = props
	const Intl = useIntl()
	const { state, dispatch: JMKSet } = useContext(JMKContext)
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
	}, [])
	const [isRing, setIsRing] = useState(".jm2")
	const [form] = Form.useForm()
	const [musicTime, setMusicTime] = useState()
	const [nameLength, setNaameLength] = useState(0)
	const [oldVideo, setOldVideo] = useState("")
	const [tag, setTag] = useState(false)
	// 分类数据
	const onValuesChange = useCallback(data => {
		if (!!data.type) {
			if (data.type === "3d") {
				setIsRing(".jm2")
			} else if (data.type === "ring") {
				setIsRing(".zip,.rar")
			}
		}
		if (!!data.name) {
			setNaameLength(data.name.length)
		} else {
			setNaameLength(0)
		}
	}, [])
	const getMusicTime = useCallback(n => {
		setMusicTime(n)
	}, [])
	const tagsData = [Intl.formatMessage({ id: "jmk.upload.commentator" })]
	// const selectedTags: string | string[] = []
	const [selectedTags, setSelectedTags] = useState([])
	const handleChange = useCallback((tag, checked) => {
		const nextSelectedTags = checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag)
		setSelectedTags(nextSelectedTags)
	}, [])
	const onFinish = useCallback(
		data => {
			const { name, file, thumbnail, unit, link, category } = data
			let category_1 = ""
			let category_2 = ""
			let category_3 = ""
			if (category?.length == 0) {
				category_1 = ""
				category_2 = ""
				category_3 = ""
			} else if (category?.length == 1) {
				category_1 = category[0]
				category_2 = ""
				category_3 = ""
			} else if (category?.length == 2) {
				category_1 = category[0]
				category_2 = category[1]
				category_3 = ""
			} else if (category?.length == 3) {
				category_1 = category[0]
				category_2 = category[1]
				category_3 = category[2]
			}
			if (fileAccept == "audio/*") {
				serviceLocal
					.assetsAddaudio({
						name,
						type: fileType,
						musicFile: urlFunc.replaceUrl(file[0], "api"),
						time: !!musicTime ? musicTime : "",
						category_1: category_1,
						category_2: category_2,
						category_3: category_3
					})
					.then(res => {
						resolve({ name, file: file[0] })
						modalRef.current.destroy()
					})
			} else if (fileAccept == ".jm2") {
				serviceLocal
					.assetsAdd({
						name,
						// type:isRing==".zip,.rar"?15:isRing==".jm2"?4:  fileType,
						type: isRing == ".zip,.rar" ? 15 : 4,
						file: file[0],
						thumbnail: !!isShowThumbnail ? thumbnail[0] : "",
						unit: unit ? unit : "",
						link: link ? link : "",
						subType: fileType === 15 ? 15 : 0,
						category_1: category_1,
						category_2: category_2,
						category_3: category_3,
						tag: selectedTags?.length ? selectedTags[0] : ""
					})
					.then(res => {
						resolve({ name, file: file[0] })
						modalRef.current.destroy()
					})
			} else {
				serviceLocal
					.assetsAdd({
						name,
						type: fileType,
						file: file[0],
						thumbnail: !!isShowThumbnail ? thumbnail[0] : "",
						unit: unit ? unit : "",
						link: link ? link : "",
						subType: fileType === 15 ? 15 : 0,
						category_1: category_1,
						category_2: category_2,
						category_3: category_3,
						tag: selectedTags?.length ? selectedTags[0] : ""
					})
					.then(res => {
						resolve({ name, file: file[0] })
						modalRef.current.destroy()
					})
			}
		},
		[fileType, isRing, musicTime, selectedTags]
	)
	const onReset = useCallback(() => {
		form.resetFields()
	}, [])
	const { Option } = Select
	const [classOptions, setClassOptions] = useState([])
	useEffect(() => {
		serviceLocal.getClassify(state.sceneName, "").then(res => {
			if (res.code == "200") {
				setClassOptions(doTree(res.data, "key", "pid"))
			}
		})
	}, [])

	return (
		<Card
			style={{ width: 300 }}
			// title={<FormattedMessage id="jmk.material.upload" />}
			title={cardTitle}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				onValuesChange={onValuesChange}
				onFinish={onFinish}
				form={form}
			>
				<Form.Item
					name="name"
					label={<FormattedMessage id="jmk.material.name" />}
					rules={[{ required: true, message: <FormattedMessage id="jmk.material.Pleasefillinthematerialname" /> }]}
				>
					{/* <Input maxLength={20} /> */}

					<Row gutter={5}>
						<Col span={20}>
							<Input maxLength={20} />
						</Col>
						<Col span={4}>
							<Typography.Text strong>{nameLength}/20</Typography.Text>
						</Col>
					</Row>
				</Form.Item>
				{/* 根据展厅是否开启分类  控制 */}
				<Form.Item
					name="category"
					label={<FormattedMessage id="jmk.position.classify" />}
					hidden={!state.sceneCofing?.info.category.visible}
					// rules={[{ required: true, message: <FormattedMessage id="jmk.material.Pleasefillinthematerialname" /> }]}
				>
					<Cascader
						fieldNames={{ label: "title", value: "key", children: "children" }}
						options={classOptions}
						changeOnSelect={true}
					/>
				</Form.Item>
				{/* 3D模型 环物图选择 表单项 */}
				{fileAccept === ".jm2" && (
					<>
						<Form.Item name="type" label={<FormattedMessage id="jmk.material.type" />} initialValue="3d">
							<Select style={{ width: 120 }}>
								<Option value="3d">
									<FormattedMessage id="jmk.material.3d" />
								</Option>
								<Option value="ring">
									<FormattedMessage id="jmk.material.RingMaterial" />
								</Option>
							</Select>
						</Form.Item>
					</>
				)}
				{/* 环物图原型1 */}
				{fileAccept === ".jm2" ? (
					<>
						<Form.Item
							label={<FormattedMessage id="jmk.material.sourcefile" />}
							name="file"
							rules={[{ required: true, message: <FormattedMessage id="jmk.material.Pleaseuploadthesourcefile" /> }]}
							extra={isRing == ".zip,.rar" ? <FormattedMessage id="jmk.upload.ringTip" /> : uploadTip}
						>
							<FormUploads apiService={serviceLocal.upload} size={1} accept={isRing} checkType={checkType} />
						</Form.Item>
					</>
				) : (
					<>
						<Form.Item
							label={<FormattedMessage id="jmk.material.sourcefile" />}
							name="file"
							rules={[{ required: true, message: <FormattedMessage id="jmk.material.Pleaseuploadthesourcefile" /> }]}
							extra={isRing == ".zip,.rar" ? <FormattedMessage id="jmk.upload.ringTip" /> : uploadTip}
						>
							<FormUploads
								getMusicTime={getMusicTime}
								showTime={true}
								apiService={serviceLocal.upload}
								size={1}
								accept={fileAccept}
								checkType={checkType}
								imgAction={{ crop: fileAccept == ".png, .jpg, .jpeg" ? true : false, aspectRatio: [4096, 4096] }}
							/>
						</Form.Item>
					</>
				)}

				{/* gif文件时 是否为解说员标签 */}
				{fileAccept === ".gif" && (
					<>
						<Form.Item
							label={<FormattedMessage id="jmk.upload.tag" />}
							name="tag"
							extra={<FormattedMessage id="jmk.upload.commentatorTip" />}
							// rules={[{ required: true, message: <FormattedMessage id="jmk.material.Pleaseuploadthethumbnail" /> }]}
						>
							{tagsData.map(tag => (
								<CheckableTag
									key={tag}
									checked={selectedTags.indexOf(tag) > -1}
									onChange={checked => handleChange(tag, checked)}
								>
									{tag}
								</CheckableTag>
							))}
						</Form.Item>
					</>
				)}
				{/* 音频素材时长  */}
				{fileAccept === "audio/*" && (
					<Form.Item label={<FormattedMessage id="jmk.addmaterial.duration" />}>{musicTime}</Form.Item>
				)}
				{/* 视频，模型素材封面图 */}

				{!!isShowThumbnail && (
					<>
						<Form.Item
							label={
								fileAccept == "video/*" ? (
									<FormattedMessage id="jmk.upload.videoCover" />
								) : (
									<FormattedMessage id="jmk.material.thumbnail" />
								)
							}
							name="thumbnail"
							rules={[{ required: true, message: <FormattedMessage id="jmk.material.Pleaseuploadthethumbnail" /> }]}
						>
							<FormUploads
								accept={fileAccept == "video/*" ? "video/*" : ".png, .jpg, .jpeg"}
								//  customCheck={checkImage("image", 5)}
								customCheck={checkImage("image", 5)}
								apiService={serviceLocal.upload}
								size={1}
								imgAction={{ crop: true, videoCover: fileAccept == "video/*" ? true : false, aspectRatio: [796, 448] }}
							/>
						</Form.Item>
					</>
				)}
				{fileAccept === ".jm2" && (
					<>
						{isRing === ".jm2" && (
							<Form.Item
								label={<FormattedMessage id="jmk.material.Company" />}
								name="unit"
								rules={[{ required: true, message: <FormattedMessage id="jmk.material.Pleasechooseacompany" /> }]}
							>
								<Select placeholder={<FormattedMessage id="jmk.material.Pleasechooseacompany" />} allowClear>
									<Option value="mm">
										<FormattedMessage id="jmk.material.millimeter" />
									</Option>
									<Option value="m">
										<FormattedMessage id="jmk.material.metre" />
									</Option>
								</Select>
							</Form.Item>
						)}

						<Form.Item
							label={<FormattedMessage id="jmk.material.link" />}
							name="link"
							// rules={[{ required: true, message: <FormattedMessage id="jmk.material.Pleasefillinthelink" /> }]}
						>
							<Input />
						</Form.Item>
					</>
				)}

				{fileAccept === ".zip,.rar" && (
					<>
						<Form.Item label={<FormattedMessage id="jmk.material.link" />} name="link">
							<Input />
						</Form.Item>
					</>
				)}

				<Form.Item wrapperCol={{ span: 16, offset: 8 }}>
					<Space direction="horizontal">
						<Button type="primary" htmlType="reset" onClick={onReset}>
							<FormattedMessage id="jmk.material.Reset" />
						</Button>
						<Button type="primary" htmlType="submit">
							<FormattedMessage id="jmk.material.add" />
						</Button>
					</Space>
				</Form.Item>
			</Form>
		</Card>
	)
}

export default MaterialUploadModal
