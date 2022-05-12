import { baseRes } from "@/interfaces/api.interface"
import { loginCode, loginPassword, tokenInfo, userInfo } from "@/interfaces/user.interface"
import { get, post, postJson } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	//验证码登录
	codeLogin(params: loginCode) {
		return postJson<baseRes<tokenInfo>>({
			url: `${urlFunc.requestHost("material")}/v1/api/index/phone/login`,
			params
		})
	},
	//密码登录
	passLogin(params: loginPassword) {
		return postJson<baseRes<tokenInfo>>({
			url: `${urlFunc.requestHost("material")}/v1/api/index/login`,
			params
		})
	},
	//发送验证码
	sendCode(phone: string) {
		return get<baseRes>({
			url: `${urlFunc.requestHost("material")}/v1/api/index/send/${phone}`
		})
	},
	//获取用户信息
	getUserInfo(params: { token: string; _quiet: boolean }) {
		return get<baseRes<userInfo>>({
			url: `${urlFunc.requestHost("material")}/v1/api/account/detail`,
			params
		})
	},
	//验证码验证
	checkCode(params: { code: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost("material")}/scene-portal/xcx/checkCode`
		})
	}
}
