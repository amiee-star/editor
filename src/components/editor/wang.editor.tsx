import Editor from "@/lib/wangEditor"
import serviceLocal from "@/services/service.local"
import FilesMd5 from "@/utils/files.md5"
import urlFunc from "@/utils/url.func"
import React, { useContext, useEffect, useRef } from "react"
import { JMKContext } from "../provider/jmk.context"

import firstIndentEditor, { menuKey } from "./firstIndent.editor"
interface Props {
	onChange?: (content?: string) => void
	editConf?: Omit<typeof Editor.prototype.config, "onchange">
}
const WangEditor: React.FC<Props> = props => {
	const { onChange, editConf = {} } = props
	const { state } = useContext(JMKContext)
	const editorBox = useRef<HTMLDivElement>()
	const editor = useRef<Editor>()
	useEffect(() => {
		if (!editor.current && !!editorBox.current) {
			editor.current = new Editor(editorBox.current)
			editor.current.config = { ...editor.current.config, ...editConf }
			editor.current.config.onchange = (newContent: string) => {
				!!onChange && onChange(newContent)
			}

			editor.current.config.customUploadImg = (files: File[], insert: (url: string) => void) => {
				// files 是 input 中选中的文件列表
				// insert 是获取图片 url 后，插入到编辑器的方法
				// 上传代码返回结果之后，将图片插入到编辑器中
				for (let index = 0; index < files.length; index++) {
					const file = files[index]
					let form: any = new FormData()
					form.append("file", file)
					FilesMd5.md5(file, (error, md5) => {
						if (!!error) {
						} else {
							// form.append("uuid", md5)
							// form.append("partIndex", 0)
							// form.append("withChunk", false)
							// form.append("partSize", file.size)
							// form.append("totalParts", 1)
							// form.append("totalFileSize", file.size)
							// form.append("fileName", file.name)
							form.append("businessId", state.sceneName)
							form.append("businessType", 0)
							//调用上传接口
							serviceLocal.upload(form).then((res: any) => {
								insert(urlFunc.replaceUrl(res.data, "api"))
							})
							// resolve(
							// 	new Array(totalParts).fill("0").map((v, partIndex) => ({
							// 		file: withChunk ? file.slice(partIndex * partSize, (partIndex + 1) * partSize) : file,
							// 		uuid: md5,
							// 		partIndex,
							// 		withChunk,
							// 		partSize,
							// 		totalParts,
							// 		totalFileSize,
							// 		fileName: filename,
							// 		...extParams
							// 	}))
							// )
						}
					})
				}
			}

			editor.current.menus.extend(menuKey, firstIndentEditor)
			editor.current.config.menus.push(menuKey)
			editor.current.create()
		}
		return () => {
			editor.current && editor.current.destroy()
		}
	}, [])
	return <div ref={editorBox} className="full" style={{ position: "relative" }} />
}

export default WangEditor
