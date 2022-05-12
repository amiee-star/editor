import LoginModal from "@/components/modal/login.modal"
import { ModalCustom } from "@/components/modal/modal.context"
import { baseRes } from "@/interfaces/api.interface"
import { message } from "antd"
import Axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import Qs from "qs"
import lsFunc from "./ls.func"

interface RequestOption<D> extends AxiosRequestConfig {
	url: string
	params?: D
}

function creatAxios(config: AxiosRequestConfig) {
	const defaultConf: AxiosRequestConfig = {
		baseURL: process.env.NODE_ENV === "production" ? "" : "/",
		timeout: 30 * 60 * 1000
	}
	const axiosInstance = Axios.create(Object.assign({}, defaultConf, config))
	axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
		// const { headers = {} } = config
		// const userInfo = lsFunc.getItem("user") as userData
		// if (userInfo) {
		// 	headers.Authorization = (lsFunc.getItem("user") as userData).accessToken
		// }
		// return { ...config, headers }
		// return config
		const { headers = {} } = config
		const token = lsFunc.getItem("accessToken")
		if (token) {
			headers.JmAccessToken = token
		}
		return { ...config, headers }
	})
	axiosInstance.interceptors.response.use(value => {
		let result: AxiosResponse<baseRes<any>> = Object.assign({}, value)
		Object.keys(value.data).map(key => {
			result.data[key.toLocaleLowerCase()] = value.data[key]
		})
		const errorMsg = result.data.message
		if (result.data.code == "200" || result.data.code == 200) {
			return result
		} else {
			const { code } = result.data

			if (code == "-1000" || code == -1000) {
				lsFunc.clearItem()
				// location.href = "/auth/login.html"

				// message.error("登陆已失效，请重新打开页面")
				ModalCustom({
					content: LoginModal
				})
			}

			message.error(errorMsg)
			throw { code, errorMsg }
		}
	})
	return axiosInstance
}

export async function get<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		let ajax = await creatAxios(config).get<R>(url, {
			params,
			...config
		})
		return ajax.data
	} catch (error) {
		throw error
	}
}
export async function postJson<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		let ajax = await creatAxios(config).post<R>(url, params, {
			...config
		})
		return ajax.data
	} catch (error) {
		throw error
	}
}

export async function patch<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		config = Object.assign(
			{
				headers: {
					"Access-Control-Allow-Headers": "content-type,x-requested-with,Authorization"
				}
			},
			config
		)
		let ajax = await creatAxios(config).patch<R>(url, {
			...params,
			...config
		})
		return ajax.data
	} catch (error) {
		throw error
	}
}

export async function put<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		let ajax = await creatAxios(config).put<R>(url, {
			...params,
			...config
		})
		return ajax.data
	} catch (error) {
		throw error
	}
}
export async function del<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		let ajax = await creatAxios(config).delete<R>(url, {
			params,
			...config
		})
		return ajax.data
	} catch (error) {
		throw error
	}
}

export async function post<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		config = Object.assign({ headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" } }, config)
		if (!config.headers["Content-Type"].includes("multipart")) {
			config.transformRequest = [data => !!data && Qs.stringify(data)]
		}
		let ajax = await creatAxios(config).post<R>(url, params, {
			...config
		})
		return ajax.data
	} catch (error) {
		throw error
	}
}

export async function postBinary<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		config = Object.assign({ headers: { "Content-Type": "application/binary;", Accept: "application/json;" } }, config)
		let ajax = await creatAxios(config).post<R>(url, params, {
			...config
		})
		return ajax.data
	} catch (error) {
		throw error
	}
}
