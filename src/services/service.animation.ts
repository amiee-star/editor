import { aniData } from "@/interfaces/ani.interface"
import { baseRes } from "@/interfaces/api.interface"
import { postJson, get } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	animation(sceneName: string) {
		return get<baseRes<aniData[]>>({
			url: `${urlFunc.requestHost("material")}/3d/${sceneName}/animation.json`
		})
	},
	setAnimation(params: { id: string; animation: any }) {
		return postJson<aniData[]>({
			url: `${urlFunc.requestHost("material")}/v1/m/new/template/edit/update/animation.json`,
			params
		})
	}
}
