import { baseRes } from "@/interfaces/api.interface"
import React, { useCallback, useContext, useState } from "react"
import { UploadRequestOption, RcFile } from "rc-upload/lib/interface"
import FilesMd5 from "@/utils/files.md5"
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface"
import { Button, message, Upload } from "antd"
import { ButtonProps } from "antd/lib/button"
import fileType from "@/constant/file.type"
import { JMKContext } from "../provider/jmk.context"
interface Props {
	// onChange?: (fileList?: upFileItem[], file?: UploadFile<baseRes<upFileItem>>) => void
	onChange?: (file?: UploadFile<baseRes<string>>) => void
	accept?:
		| "image/*"
		| "video/*"
		| "audio/*"
		| ".zip,.rar"
		| ".png, .jpg, .jpeg"
		| ".ies"
		| ".fbx,.dae,.obj,.glb,.glft,.sti,.ply,.zip"
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
	// apiService: (params?: any) => Promise<baseRes<string>>
	apiService?: any
}
interface ParamsItem {
	fileName: string
	filepath: Blob | string
	[key: string]: any
}

const CustomjmkUpload: React.FC<Props> = props => {
	const {
		onChange,
		accept,
		size = 1,
		withChunk = false,
		chunkSize = 2,
		extParams,
		uploadCallTask,
		btnText = "上传",
		btnicon,
		btnProps = {},
		checkType,
		customCheck,
		apiService
	} = props
	const [loading, setLoading] = useState(false)

	const onChangeSelf = useCallback((info: UploadChangeParam<UploadFile<baseRes<string>>>) => {
		!!onChange && onChange(info.file)
	}, [])
	const customCheckType = useCallback(
		async (file: RcFile) => {
			if (checkType === undefined || !checkType) {
				return file
			} else {
				let error = ""
				const checkTypeList = fileType[checkType]
				if (!checkTypeList.some(type => file.name.includes(type))) {
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

	const buildParams = useCallback(
		(file: RcFile, maxChunkSize: number = chunkSize * Math.pow(1024, 2)): Promise<ParamsItem[]> => {
			return new Promise(async (resolve, reject) => {
				const { name: filename, size: totalFileSize } = file
				const partSize = withChunk ? maxChunkSize : totalFileSize
				const totalParts = withChunk ? Math.ceil(totalFileSize / partSize) : 1
				resolve(
					new Array(totalParts).fill("0").map((v, partIndex) => ({
						filepath:
							"path" in file
								? file["path"]
								: withChunk
								? file.slice(partIndex * partSize, (partIndex + 1) * partSize)
								: file,
						file: withChunk ? file.slice(partIndex * partSize, (partIndex + 1) * partSize) : file,
						fileName: filename,
						...extParams
					}))
				)
			})
		},
		[withChunk, chunkSize, extParams]
	)

	return (
		<Upload
			className="sceneUpLoad"
			customRequest={customRequest}
			maxCount={size}
			multiple={size > 1}
			accept={accept}
			onChange={onChangeSelf}
			showUploadList={false}
		>
			<Button icon={btnicon} {...btnProps}>
				{btnText}
			</Button>
		</Upload>
	)
}

export default CustomjmkUpload
