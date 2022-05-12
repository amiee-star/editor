import fileType from "@/constant/file.type"
import { message } from "antd"
import { RcFile } from "antd/lib/upload"

export const checkImage = (type?: keyof typeof fileType, maxSize?: number, resolution?: [number, number]) => (
	file: RcFile
): Promise<RcFile> => {
	return new Promise(async (resolve, reject) => {
		if (!type && maxSize === undefined) {
			resolve(file)
		}
		if (type || maxSize || resolution) {
			let error = ""
			const checkType = fileType[type]

			if (!!type && !checkType.some(type => file.name.toLowerCase().includes(type))) {
				error = "暂不支持该类型"
			}
			if (maxSize !== undefined && file.size > maxSize * Math.pow(1024, 2)) {
				if (maxSize >= 1) {
					if (type == "image") {
						error = `图片大小超过${maxSize}M`
					} else {
						error = `视频大小超过${maxSize}M`
					}
				} else {
					if (type == "image") {
						error = `图片大小超过${maxSize * 1024}kb`
					} else {
						error = `视频大小超过${maxSize * 1024}kb`
					}
				}
			}
			//分辨率限制
			if (resolution !== undefined) {
				await new Promise<void>(function (resolve, reject) {
					let width = resolution[0]
					let height = resolution[1]
					let _URL = window.URL || window.webkitURL
					let image = new Image()

					image.onload = function () {
						const valid = image.width == width && image.height == height
						valid ? resolve() : reject()
					}
					image.src = _URL.createObjectURL(file)
				}).then(
					() => {
						return file
					},
					() => {
						error = `上传的图片分辨率需为${resolution[0]}*${resolution[1]}`
					}
				)
			}
			error ? reject(error) : resolve(file)
		}
	})
}

export default checkImage
