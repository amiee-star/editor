import {
	baseData,
	baseRes,
	myMaterialItem,
	PageData,
	PageParams,
	PictureFrameData,
	withToken
} from "@/interfaces/api.interface"
import {
	bakeData,
	combinScenes,
	coverData,
	devicesData,
	JobItem,
	jobsData,
	renderParams,
	sceneData
} from "@/interfaces/jmt.interface"
import { myMaterialParams } from "@/interfaces/params.interface"
import { del, get, post, postJson } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	upload(params: FormData) {
		return postJson<baseRes<any>>({
			url: `${urlFunc.requestHost("material")}/v1/m/file/upload/new`,
			params
		})
	},
	uploadlighties(sceneName: string) {
		return (params: any) =>
			postJson<baseRes<string>>({
				url: `${urlFunc.requestHost()}/scenes/${sceneName}/photometry/`,
				params
			})
	},
	uploadjmktextures(sceneName: string) {
		return (params: any) =>
			postJson<any>({
				url: `${urlFunc.requestHost()}/scenes/${sceneName}/textures/`,
				params
			})
	},
	uploadJmkTextures(sceneName: string, params: any) {
		return postJson<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/textures/`,
			params
		})
	},
	assetsAdd(params: {
		name: string
		type: number
		file: string
		thumbnail: string
		unit: string
		link: string
		subType?: number
		category_1: string
		category_2: string
		category_3: string
		tag: string
	}) {
		return post<baseRes<string>>({
			url: `${urlFunc.requestHost()}/assets/add`,
			params
		})
	},
	assetsAddarticle(params: { type: number; title: string; content?: string; pdf?: string }) {
		return post<baseRes<string>>({
			url: `${urlFunc.requestHost()}/assets/add`,
			params
		})
	},
	assetsAddaudio(params: {
		type: number
		name: string
		musicFile: string
		time?: string
		category_1: string
		category_2: string
		category_3: string
	}) {
		return post<baseRes<string>>({
			url: `${urlFunc.requestHost()}/assets/add`,
			params
		})
	},

	//素材标签
	assetsClass(params: { tempId: string }) {
		return get<baseRes<any>>({
			// url: `${urlFunc.requestHost()}/assets/list`,
			url: `${urlFunc.requestHost("material")}/v1/m/template/edit/getPictureTags`,
			params
		})
	},
	// 图片 动图 视频 热点素材列表
	assetsList(params: { fileType: number; tempId: string; hotIcon: boolean } & PageParams) {
		return get<baseRes<any>>({
			// url: `${urlFunc.requestHost()}/assets/list`,
			url: `${urlFunc.requestHost("material")}/v1/m/scene/picture/pictureList`,
			params
		})
	},

	// 音乐分类
	musicType(params: any) {
		return get<baseRes<any>>({
			// url: `${urlFunc.requestHost()}/assets/list`,
			url: `${urlFunc.requestHost("material")}/v1/m/scene/music/getMusicType`,
			params
		})
	},
	// 音乐素材列表
	musicList(params: { fileType: number } & PageParams) {
		return get<baseRes<any>>({
			// url: `${urlFunc.requestHost()}/assets/list`,
			url: `${urlFunc.requestHost("material")}/v1/m/scene/music/userMusic`,
			params
		})
	},

	// 文章列表
	articleList(params: { type: number } & PageParams) {
		return get<baseRes<any>>({
			// url: `${urlFunc.requestHost()}/assets/list`,
			url: `${urlFunc.requestHost("material")}/v1/m/scene/news/newsList`,
			params
		})
	},

	// 系统图标
	punlicList(params: myMaterialParams) {
		return get<baseRes<PageData<myMaterialItem>>>({
			url: `${urlFunc.requestHost("material")}/v1/m/scene/picture/punlicList`,
			params
		})
	},
	// 删除素材
	deleteAssets(params: any) {
		return post<baseRes<PictureFrameData>>({
			url: `${urlFunc.requestHost()}/assets/delete`,
			params
		})
	},
	// 恢复素材
	restoreAsset(params: any) {
		return post<baseRes<PictureFrameData>>({
			url: `${urlFunc.requestHost()}/assets/recover`,
			params
		})
	},
	// 编辑素材EditAssets
	editAssets(params: any) {
		return post<baseRes<PictureFrameData>>({
			url: `${urlFunc.requestHost()}/assets/update`,
			params
		})
	},
	getShowroomData() {
		return get<baseRes<PictureFrameData>>({
			url: `${urlFunc.requestHost()}/tours/`
		})
	},
	getPictureframe(params: withToken) {
		return get<baseRes<PictureFrameData>>({
			url: `${urlFunc.requestHost()}/assets/frame/list`,
			params
		})
	},
	pictureframeadd(params: { name: string[]; corner: string[]; banner: string[] }) {
		return post<baseRes<string>>({
			url: `${urlFunc.requestHost()}/assets/frame/add`,
			params
		})
	},
	pictureframedelete(params: { id: string[] }) {
		return post<baseRes<string>>({
			url: `${urlFunc.requestHost()}/assets/frame/delete`,
			params
		})
	},
	cover(id: string) {
		return get<baseRes<coverData>>({
			url: `${urlFunc.requestHost("material")}/3d/${id}/cover.json`
		})
	},
	scene(id: string) {
		return get<baseRes<coverData>>({
			url: `${urlFunc.requestHost("material")}/3d/${id}/scene.json`
		})
	},
	setCover(params: { id: string; cover: coverData }) {
		return postJson<coverData>({
			// url: `${urlFunc.requestHost()}/scenes/${sceneName}/settings/cover`,
			url: `${urlFunc.requestHost("material")}/v1/m/new/template/edit/update/cover.json`,
			params
		})
	},

	// 组合展厅列表
	combinScenes() {
		return get<baseRes<combinScenes[]>>({
			url: `${urlFunc.requestHost()}/scenes/combinScenes.json`
		})
	},
	setCombinScenes(combinScenesJson: combinScenes[]) {
		return postJson<combinScenes[]>({
			url: `${urlFunc.requestHost()}/scenes/combinScenes.json`,
			params: combinScenesJson
		})
	},
	buffToImg(sceneName: string, params: any) {
		return post<any>({
			url: `${urlFunc.requestHost()}/screenshot/${sceneName}/upload`,
			params: params
		})
	},
	baseToImg(sceneName: string, width: number, height: number, params: any) {
		return postJson<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/screenshot?width=${width}&height=${height}`,
			headers: {
				"Content-Type": "application/binary"
			},
			params: params
		})
	},
	addIES(sceneName: string, params: any) {
		return post<any>({
			url: `${urlFunc.requestHost()}/screenshot/${sceneName}/upload`,
			params: params
		})
	},
	devices() {
		return get<baseRes<devicesData[]>>({
			url: `${urlFunc.requestHost()}/devices/`
		})
	},
	renderEditor(sceneName: string, params: renderParams) {
		return postJson<baseRes<JobItem>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/editor/render/`,
			params
		})
	},
	bakeEditor(sceneName: string) {
		return postJson<baseRes<JobItem>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/editor/bake/`
		})
	},
	postProcess(sceneName: string) {
		return postJson<baseRes<JobItem>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/editor/post-process/`
		})
	},
	uploadScene(sceneName: string) {
		return postJson<baseRes<JobItem>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/upload/`
		})
	},
	renderSettings(sceneName: string) {
		return get<baseRes<bakeData>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/settings/render`
		})
	},
	sceneEditor(sceneName: string, params: renderParams) {
		return post<baseRes<devicesData[]>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/scene`,
			params
		})
	},
	getCoverJson(sceneName: string, params: renderParams) {
		return post<baseRes<devicesData[]>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/scene`,
			params
		})
	},
	coverEditor(sceneName: string, params: renderParams) {
		return post<baseRes<devicesData[]>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/cover.json`,
			params
		})
	},
	renderSettingsEdit(sceneName: string, params: bakeData) {
		return postJson<baseRes<string>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/settings/render`,
			params
		})
	},
	sceneJsonEdit(sceneName: string, params: any) {
		return postJson<baseRes<devicesData[]>>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/scene.json`,
			params
		})
	},
	jobsList(params?: { stateTag: string }) {
		return get<baseRes<jobsData>>({
			url: `${urlFunc.requestHost()}/jobs/`,
			params
		})
	},
	cancleJob(id: number) {
		return postJson({
			url: `${urlFunc.requestHost()}/jobs/${id}/cancel`
		})
	},
	sceneList() {
		return get<baseRes<sceneData[]>>({
			url: `${urlFunc.requestHost()}/scenes`
		})
	},
	sceneDelete(sceneName: string) {
		return del<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/`
		})
	},
	sceneStatement(params: any) {
		return postJson<any>({
			url: `${urlFunc.requestHost()}/scenes/`,
			params
		})
	},
	sceneImport(sceneName: string, params: any) {
		return postJson<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/import-foreign`,
			params
		})
	},
	jobsStateTag(params: any) {
		return get<baseRes<jobsData>>({
			url: `${urlFunc.requestHost()}/jobs/`,
			params
		})
	},
	renderResult(jobId: number) {
		return get<Uint8Array>({
			url: `${urlFunc.requestHost()}/jobs/${jobId}/result`,
			responseType: "arraybuffer"
		})
	},
	getOutLine(sceneName: string, params: any) {
		return get<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/outline.json`,
			params
		})
	},
	editOutLine(sceneName: string, params: any) {
		return postJson<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/outline.json`,
			params
		})
	},
	getExhibitPosition(sceneName: string, params: any) {
		return get<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/exhibit.json`,
			params
		})
	},
	editExhibitPosition(sceneName: string, params: any) {
		return postJson<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/exhibit.json`,
			params
		})
	},
	getExhibitClass(sceneName: string, params: any) {
		return get<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/classify.json`,
			params
		})
	},
	editExhibitClass(sceneName: string, params: any) {
		return postJson<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/classify.json`,
			params
		})
	},
	//分类
	getClassify(sceneName: string, params: any) {
		return get<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/category.json`,
			params
		})
	},
	editClassify(sceneName: string, params: any) {
		return postJson<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/category.json`,
			params
		})
	},
	//自定义按钮
	getCustomButton(sceneName: string, params: any) {
		return get<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/customButton.json`,
			params
		})
	},
	editCustomButton(sceneName: string, params: any) {
		return postJson<any>({
			url: `${urlFunc.requestHost()}/scenes/${sceneName}/customButton.json`,
			params
		})
	},

	//网络版 获取展厅信息
	getSceneInfo(saceneId: string) {
		return get<any>({
			url: `${urlFunc.requestHost()}/v1/m/new/template/edit/info/${saceneId}`
			// params
		})
	},
	baseScene(sceneName: string) {
		return get<baseRes<baseData>>({
			url: `${urlFunc.requestHost("material")}/3d/${sceneName}/view/base.json`
			// params
		})
	}
}
