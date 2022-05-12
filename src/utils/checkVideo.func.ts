import fileType from "@/constant/file.type"
import { message } from "antd"
import { RcFile } from "antd/lib/upload"

export const checkVideo = (type?: keyof typeof fileType, maxSize?: number) => (file: RcFile): Promise<RcFile> => {
	return new Promise(async (resolve, reject) => {
		if (!type && maxSize === undefined) {
			resolve(file)
		}
		if (type || maxSize) {
			let error = ""
			const checkType = fileType[type]
			if (!!type && !checkType.some(type => file.name.toLowerCase().includes(type))) {
				error = "暂不支持该视频类型"
			}
			if (maxSize !== undefined && file.size > maxSize * Math.pow(1024, 2)) {
				error = `视频大小超过${maxSize}M`
			}

			error ? reject(error) : resolve(file)
		}
	})
}
export default checkVideo
