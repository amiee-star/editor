import { useIntl, addLocale, getLocale, setLocale } from "umi"
import { event, LANG_CHANGE_EVENT } from "@@/plugin-locale/locale"
import zhCN from "@/locales/zh-CN"
import enUS from "@/locales/en-US"
type langKey = keyof typeof zhCN | keyof typeof enUS




export default {
	 //动态添加语言
	addLocaleSync: (lang: "zh-CN" | "en-US" | string, message: Object) => {
		addLocale(
			lang,
			{ ...message },
			{
				momentLocale: lang,
				antd: ""
			}
		)
		event.emit(LANG_CHANGE_EVENT, getLocale())
	},
	setLocale: (key: "en-US" | "zh-CN", realReload: boolean = true) => setLocale(key, realReload)
}
