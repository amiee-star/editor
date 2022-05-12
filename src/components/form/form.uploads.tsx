import React, { useCallback, useState, useMemo, useEffect, useRef } from "react"
import { Upload, Typography, Space, message, ButtonProps } from "antd"
import {
	PlusOutlined,
	LoadingOutlined,
	FilePdfTwoTone,
	FileExcelTwoTone,
	FileWordTwoTone,
	PictureTwoTone,
	PaperClipOutlined,
	VideoCameraTwoTone,
	AudioTwoTone,
	FileZipTwoTone
} from "@ant-design/icons"
import { UploadChangeParam } from "antd/lib/upload"
import { UploadFile, UploadListType } from "antd/lib/upload/interface"
import { AsyncModal, ModalCustom } from "../modal/modal.context"
import { baseRes, upFileItem } from "@/interfaces/api.interface"
import FilesMd5 from "@/utils/files.md5"
import { UploadRequestOption, RcFile } from "rc-upload/lib/interface"
import fileType from "@/constant/file.type"
import ImageCropModal from "../modal/async/imagecrop.modal"
import VideoCoverModal from "../modal/async/videocover.modal"
import proxyConfig from "config/proxy"
import urlFunc from "@/utils/url.func"
import { FormattedMessage, useIntl } from "umi"
import ReactAudioPlayer from "react-audio-player"
import { Any } from "@alloc/types"
import eventBus from "@/utils/event.bus"
interface Props {
	value?: string[]
	btnTxt?: JSX.Element
	baseUrl?: keyof typeof proxyConfig
	onChange?: (fileList?: string[], file?: UploadFile<baseRes<string>>) => void
	onChangeProps?: (fileList?: string[], file?: UploadFile<baseRes<string>>) => void
	accept?: "image/*" | "video/*" | "audio/*" | ".zip,.rar" | ".png, .jpg, .jpeg" | ".ies" | ".gif" | ".jm2" | ".pdf"
	size?: number //多文件上传的个数
	extParams?: object //上传接口需要的其他参数
	chunkSize?: number //分片包大小,以M为单位,不传默认为2M
	withChunk?: boolean //是否启用分片上传
	checkType?: keyof typeof fileType //强制检查类型
	customCheck?: (file: RcFile) => Promise<RcFile> // 文件验证function
	uploadCallTask?: (res?: baseRes<string>, item?: ParamsItem) => Promise<any> //每个文件上传完成后的操作
	btnText?: React.ReactNode
	btnicon?: React.ReactNode
	btnProps?: Omit<ButtonProps, "disabled"> //按钮ui
	apiService: (params?: any) => Promise<baseRes<string>>
	imgAction?: {
		crop?: boolean //是否裁剪
		videoCover?: boolean //是否视频封面截图,
		aspectRatio?: number[] // 裁切比例
	}
	getMusicTime?: Function
	oldVideo?: string
	showTime?: boolean
}
interface ParamsItem {
	partIndex: number
	partSize: number
	totalParts: number
	totalFileSize: number
	fileName: string
	uuid: string
	file: Blob
	withChunk: boolean
	[key: string]: any
}

const FormUploads: React.FC<Props> = props => {
	const Intl = useIntl()
	const {
		onChange,
		onChangeProps,
		accept,
		btnTxt,
		baseUrl,
		size = 1,
		value,
		withChunk = false,
		chunkSize = 2,
		extParams,
		imgAction,
		apiService,
		checkType,
		oldVideo,
		showTime
	} = props
	const checkUrlType = useCallback((url: string) => {
		return (
			Object.keys(fileType).filter(key => {
				const data: string[] = fileType[key]
				return data.includes(url.substr(url.lastIndexOf(".")))
			})[0] || "image"
		)
	}, [])
	const defaultFileList = useMemo<UploadFile<baseRes<string>>[]>(() => {
		// return !!value
		return !!Array.isArray(value)
			? value.map(item => ({
					url: urlFunc.replaceUrl(item, baseUrl) + `?time=${new Date().getTime()}`,
					name: item.split("/").splice(-1)[0],
					type: checkUrlType(item),
					size: 0,
					uid: item.split("/").splice(-1)[0],
					status: "done",
					response: {
						data: item,
						code: "200",
						errorMsg: "",
						msg: ""
					}
			  }))
			: []
	}, [value])
	const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList)
	useEffect(() => {
		setFileList(defaultFileList)
	}, [defaultFileList])
	const customCheck = useCallback(
		async (file: RcFile): Promise<RcFile> => {
			if (!props.customCheck) return file
			const checkResult = props.customCheck(file)
			if (checkResult instanceof Promise) {
				return checkResult as Promise<RcFile>
			} else {
				if (checkResult) {
					return file
				} else {
					throw "未知错误"
				}
			}
		},
		[props.customCheck]
	)
	const customCheckType = useCallback(
		async (file: RcFile) => {
			if (checkType === undefined || !checkType) {
				return file
			} else {
				let error = ""
				const checkTypeList = fileType[checkType]
				if (!checkTypeList.some(type => file.name.toLowerCase().includes(type))) {
					error = "暂不支持该类型"
				}
				if (error) {
					throw error
				} else {
					return file
				}
			}
		},
		[checkType]
	)
	const beforeUpload = useCallback(async (file: RcFile) => {
		try {
			let result = file
			result = await customCheckType(file)
			if (!!imgAction?.videoCover) {
				result = await AsyncModal<RcFile>({
					content: VideoCoverModal,
					params: { file: result, crop: !!imgAction?.crop, aspectRatio: imgAction?.aspectRatio }
				})
			}
			if (!imgAction?.videoCover && !!imgAction?.crop) {
				result = await AsyncModal<RcFile>({
					content: ImageCropModal,
					params: { file: result, aspectRatio: imgAction?.aspectRatio }
				})
			}
			result = await customCheck(result)
			return result
		} catch (error) {
			if (error != undefined) {
				message.error(error)
			}
		}
		//!
		return Upload.LIST_IGNORE as RcFile
	}, [])

	const onChangeSelf = useCallback((info: UploadChangeParam<UploadFile<baseRes<string>>>) => {
		// info.fileList.forEach(m => {
		// 	m.url = m.response ? urlFunc.replaceUrl(m.response.data, baseUrl || "material") : ""
		// })
		// setFileList(
		// 	info.fileList.map(m => {
		// 		return {
		// 			...m,
		// 			url: m.response?.data ? urlFunc.replaceUrl(m.response.data, baseUrl || "material") : "",
		// 			thumbUrl: m.response?.data ? urlFunc.replaceUrl(m.response.data, baseUrl || "material") : ""
		// 		}
		// 	})
		// )

		setFileList(
			info.fileList.map(m => ({
				...m,
				url: m.response?.fileSaveUrl
					? urlFunc.replaceUrl(m.response.fileSaveUrl, baseUrl || "api") + `?time=${new Date().getTime()}`
					: ""
			}))
		)

		if (!info.fileList.some(m => m.status !== "done")) {
			!!onChangeProps &&
				onChangeProps(
					info.fileList.map(m => m.response.fileSaveUrl),
					info.file
				)
			onChange(
				info.fileList.map(item => {
					return item.response.fileSaveUrl
				})
			)
		}
	}, [])
	useEffect(() => {
		if (!!value && !value?.length && !!fileList.length && !fileList.some(m => m.status !== "done")) {
			setFileList([])
		}
	}, [value])

	const uploadBtn = useMemo(() => {
		return (
			<Space direction="vertical">
				<PlusOutlined />
				<Typography.Text>{btnTxt || <FormattedMessage id="jmk.minimap.upload" />}</Typography.Text>
			</Space>
		)
	}, [])

	const iconRender = useCallback((file: UploadFile, listType?: UploadListType) => {
		const fileSufIconList = [
			{ type: <FilePdfTwoTone />, suf: [".pdf"] },
			{ type: <FileExcelTwoTone />, suf: [".xlsx", ".xls", ".csv"] },
			{ type: <FileWordTwoTone />, suf: [".doc", ".docx"] },
			{
				type: <PictureTwoTone />,
				suf: [".webp", ".svg", ".png", ".gif", ".jpg", ".jpeg", ".jfif", ".bmp", ".dpg"]
			},
			{
				type: <VideoCameraTwoTone />,
				suf: [".mp4", ".3gp", ".mkv", ".rm", ".wmv", ".avi"]
			},
			{
				type: <AudioTwoTone />,
				suf: [".mp3", ".wav", ".wma", ".ogg"]
			},
			{
				type: <FileZipTwoTone />,
				suf: [".zip", ".rar", ".7z", ".ios"]
			},
			{
				type: <FileZipTwoTone />,
				suf: [".jm2"]
			}
		]
		let icon = file.status === "uploading" ? <LoadingOutlined /> : <PaperClipOutlined />
		if (listType === "picture" || listType === "picture-card") {
			if (listType === "picture-card" && file.status === "uploading") {
				icon = <LoadingOutlined />
			} else {
				fileSufIconList.forEach(item => {
					if (item.suf.includes(file.name.substr(file.name.lastIndexOf(".")))) {
						icon = item.type
					}
				})
			}
		}
		return icon
	}, [])
	const isImageUrl = useCallback((file: UploadFile) => {
		// if (accept === "image/*" || accept === ".png, .jpg, .jpeg" || accept === ".gif") {
		// 	return true
		// } else {
		// 	return false
		// }
		return checkUrlType(file.name || "") === "image"
	}, [])
	const onPreview = useCallback((file: UploadFile<baseRes<string>>) => {
		if (file.status === "done") {
			// const url = file.response.data?.match("http")
			// 	? file.response.data
			// 	: baseUrl
			// 	? urlFunc.replaceUrl(file.response.data, baseUrl)
			// 	: "/" + file.response.data
			const url = file.response.data?.match("http")
				? file.response.data
				: urlFunc.replaceUrl(file.response.data, baseUrl || "api")
			if (!!file.type.match("image")) {
				return ModalCustom({
					content: () => <img src={urlFunc.replaceUrl(file.response.data)} width={800} />,
					maskClosable: true
				})
			}
			if (!!file.type.match("video")) {
				return ModalCustom({
					content: () => <video controls src={url} width={800} />,
					maskClosable: true
				})
			}
			if (!!file.type.match("audio")) {
				return ModalCustom({
					content: () => <audio src={url} controls />,
					maskClosable: true
				})
			}
			if (!!file.type.match("pdf")) {
				return ModalCustom({
					content: () => (
						<iframe
							frameBorder="0"
							width="980"
							height="600"
							src={`${window.publicPath}pdf/web/viewer.html?file=${encodeURIComponent(url)}`}
						/>
					),
					maskClosable: true
				})
			}
			return window.open(url, "_blank")
		}
	}, [])
	const customRequest = useCallback(
		async (options: UploadRequestOption) => {
			const { onSuccess, onError, onProgress, file } = options
			const params = await buildParams(file as RcFile)
			let res: baseRes<string>
			let success = 0

			try {
				for (const item of params) {
					const FormPost = new FormData()
					Object.keys(item).forEach(key => {
						typeof item[key] === "object" && "uid" in item[key]
							? FormPost.append(key, item[key], item[key]["name"])
							: FormPost.append(key, item[key])
					})
					res = !withChunk ? await apiService(FormPost) : await apiService(FormPost)

					onProgress(Object.create({ percent: Math.floor((++success / params.length) * 100) }))
				}

				onSuccess(res.data, null)
			} catch (error) {
				onError(error)
			}
		},
		[withChunk]
	)
	const buildParams = useCallback(
		(file: RcFile, maxChunkSize: number = chunkSize * Math.pow(1024, 2)): Promise<any[]> => {
			return new Promise(async (resolve, reject) => {
				const { name: filename, size: totalFileSize } = file
				const partSize = withChunk ? maxChunkSize : totalFileSize
				const totalParts = withChunk ? Math.ceil(totalFileSize / partSize) : 1
				FilesMd5.md5(file, (error, md5) => {
					if (!!error) {
						reject(error)
					} else {
						resolve(
							new Array(totalParts).fill("0").map((v, partIndex) => ({
								file: withChunk ? file.slice(partIndex * partSize, (partIndex + 1) * partSize) : file,
								// uuid: md5,
								// partIndex,
								// withChunk,
								// partSize,
								// totalParts,
								// totalFileSize,
								// fileName: filename,
								...extParams
							}))
						)
					}
				})
			})
		},
		[withChunk, chunkSize, extParams]
	)
	const audioRef = useRef(null)
	const onCanPlay = useCallback(() => {
		let enDuration = Math.round(audioRef.current.audioEl.current.duration)
		setDuration(enDuration)
	}, [])
	const setDuration = (sec: any) => {
		let min = 0
		sec = sec <= 10 ? "0" + sec : sec
		if (sec >= 60) {
			min = (sec / 60).toFixed()
			sec = sec % 60 >= 10 ? sec % 60 : "0" + (sec % 60)
		}
		min = min >= 10 ? min : "0" + min
		let time = min + ":" + sec
		props?.getMusicTime(time)
		return time
	}
	return (
		<>
			<Upload
				customRequest={customRequest}
				maxCount={size}
				fileList={fileList}
				defaultFileList={defaultFileList}
				multiple={size > 1 && !imgAction?.crop && !imgAction?.videoCover}
				accept={!imgAction?.videoCover ? accept : "video/*"}
				listType="picture-card"
				onPreview={onPreview}
				isImageUrl={isImageUrl}
				beforeUpload={beforeUpload}
				onChange={onChangeSelf}
				iconRender={iconRender}
			>
				{fileList.length >= size ? null : uploadBtn}
			</Upload>
			{!!fileList[0] && accept == "audio/*" && showTime ? ( //判断是否已有音频 url
				<ReactAudioPlayer ref={audioRef} src={fileList[0].url} onCanPlay={onCanPlay} />
			) : null}
		</>
	)
}

export default FormUploads
