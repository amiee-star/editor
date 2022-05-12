import {
	baseRes,
	getPictureTagsData,
	pictureListData,
	pictureListParams,
	articleListParams,
	modelListData,
	modelListParams,
	getPictureFrameData,
	userLoginParams,
	upFileItem,
	withToken
} from "@/interfaces/api.interface"
import { get, post, postBinary, postJson } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	pictureList(params: pictureListParams) {
		return get<baseRes<pictureListData>>({
			url: `${urlFunc.requestHost()}/scene-portal/api/v1/picture/list`,
			params
		})
	},
	articleList(params: articleListParams) {
		return get<baseRes<pictureListData>>({
			url: `${urlFunc.requestHost("api")}/scene-portal/home/news/list`,
			params
		})
	},
	audioList(params: articleListParams) {
		return get<baseRes<pictureListData>>({
			url: `${urlFunc.requestHost("api")}/scene-portal/api/v1/scene/userMusic`,
			params
		})
	},
	modelList(params: modelListParams) {
		return get<baseRes<modelListData>>({
			url: `${urlFunc.requestHost("model")}/model-center-portal/user/modelsBySize`,
			params
		})
	},

	getPictureTags(params: withToken) {
		return get<baseRes<getPictureTagsData[]>>({
			url: `${urlFunc.requestHost()}/scene-portal/api/v1/picture/getPictureTags`,
			params
		})
	},

	getPictureframe(params: withToken) {
		return get<baseRes<getPictureFrameData[]>>({
			url: `${urlFunc.requestHost()}/assets/frame/list`,
			params
		})
	},

	userLogin(params: userLoginParams) {
		return post<baseRes<string>>({
			url: `${urlFunc.requestHost()}/scene-portal/xcx/register/login`,
			params
		})
	},
	fileupload(params: FormData) {
		return post<baseRes<upFileItem>>({
			url: `${urlFunc.requestHost("api")}/v1/m/file`,
			params,
			headers: {
				"Content-Type": "multipart/form-data;"
			}
		})
	},
	file3dupload(params: FormData) {
		return post<baseRes<upFileItem>>({
			url: `${urlFunc.requestHost("api")}/scene-portal/api/v1/picture/uploadPicture`,
			params,
			headers: {
				"Content-Type": "multipart/form-data;"
			}
		})
	},
	screenShot(params: { sceneName: string; width: number; height: number; fileName: string; data: ArrayBuffer }) {
		const { sceneName, width, height, fileName, data } = params
		return postBinary<baseRes<upFileItem>>({
			url: `${urlFunc.requestHost(
				"jmkApi"
			)}/scenes/${sceneName}/screenshot?width=${width}&height=${height}&fileName=${fileName}`,
			params: data
		})
	},
	iesProfile(params: { sceneName: string }) {
		const { sceneName } = params
		return postBinary<baseRes<string>>({
			url: `${urlFunc.requestHost("jmkApi")}/scenes/${sceneName}/photometry`
		})
	}
}
