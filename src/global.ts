import moment from "moment"
import { getLocale } from "umi"
import { JMTInterface } from "./interfaces/jmt.interface"
declare global {
	const API_ENV: string
	interface Window {
		routerBase: string
		publicPath: string
		JMT: JMTInterface
		openUrlInDetachedWindow: Function
	}
}

//moment跟随全局语言
moment.locale(getLocale())
//监控集成
import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"

Sentry.init({
	dsn: "https://eca7530030254f5ab369711ad2107460@sentry.3dyunzhan.com/7",
	integrations: [new BrowserTracing()],
	tracesSampleRate: 1.0,
	environment: API_ENV || "test"
})
//抛出异常
// try {
// } catch (err) {
// 	Sentry.captureException(err)
// }
//推消息
// Sentry.captureMessage("Something went wrong");
