// 接口返回需要的基础字段

import ex from "umi/dist"

export interface baseRes<D = {}> {
	code: string | number
	msg: string
	errorMsg: string
	data: D //返回的数据字段
}

export interface viewInfoData {
	hasPublish: boolean
	ispreview: boolean
	info: viewInfo
}

export interface authorizeItem {
	userId: string
	phone: string
	nickname: string
	tokens: string
	authid: string
	isBind: boolean
}

export interface authorizeInfoItem {
	appid: string
}

export interface viewInfo {
	myBrowseService: number
	title: string
	sceneId: string
	tempId: string
	readonly: boolean
	thumb: string
	descripe: string
	lupt: number
	renderOver: boolean
	fileServer: string
	lockY?: number
	lockYAngle?: number
	lockZoom?: number
	plugin: boolean
	isLocalize: boolean
	imageServer: string
	modelUrl: string
	usePwd: boolean
	enLang: boolean
	lut: string
	lutsz: string
	lutid: string
	extobjs: viewExtobj[]
	check: number
	checkNote: string
	validSz: string
	systemTime: number
}

export interface viewExtobj {
	id: string
	type: number
	position: viewPosition
	scale: viewPosition
	mtl: string
	obj: string
	texture: string
	quaternion: viewPosition
	followCamera?: boolean
	text?: InfoText
	gif: string
	contentType: number
	x0: number
	y0: number
	x1: number
	y1: number
	music: string
	info: string
	discripe: string
	extdata: viewExtdata
	opacity: number
	name: string
	enable: boolean
	mask?: string
	packTexture?: number
}

export interface viewExtdata {
	contentType?: string
	texture: string
	info: viewExtdataInfo
	placeholder?: {
		index: string
		user: string
	}
}

export interface viewExtdataInfo {
	urlName?: string
	url: string
	discripe: string
	target: number
	type: number
	music: string
	sweep?: string
	custom: string
	btnText: string
	swiperList?: string
	hot?: string
}

export interface viewPosition {
	x: number
	y: number
	z: number
	w?: number
}

export interface envConfigData {
	apiHost: string
	fileHost: string
	imageServer: string
	modelUrl: string
	eventCommit: string
	matterPort: string
}
export interface InfoData {
	custServiceCode: any
	myCustService: number
	liveService: number
	sceneTemplateLive: any
	liveUrl: string
	token?: string
	tempid: string
	name: string
	description: string
	contact: InfoContact
	username: string
	musicId: string
	musicFile: string
	musicName: string
	viewCount: number
	closeMusic: boolean
	lutid: string
	lut: string
	lutsz: string
	lutName: string
	modelRotate: boolean
	extobjs: viewExtobj[]
	sceneId: string
	thumb: string
	mobileThumb: string
	lupt: number
	renderOver: boolean
	startCamera: string
	typeId: string
	scripts: string[]
	showDescFlag: number
	loadingVideo: string
	loadingThumb: string
	floor: number
	customLogo: string
	titleFlag: boolean
	descFlag: boolean
	pluginFlag: boolean
	hideLogo: boolean
	usePwd: boolean
	enLang: boolean
	musicAutoPlay: boolean
	useThumbLoading: boolean
	durationEndTs: number
	buttonOptions: InfoButtonOptions
	sceneShare: string
	panoImg?: string
}
export interface viewInfo {
	custServiceCode: string
	myCustService: number
	liveService: number
	sceneTemplateLive: any
	liveUrl: string
	token?: string
	tempid: string
	name: string
	description: string
	contact: InfoContact
	username: string
	musicId: string
	musicFile: string
	musicName: string
	viewCount: number
	closeMusic: boolean
	lutid: string
	lut: string
	lutsz: string
	lutName: string
	modelRotate: boolean
	extobjs: viewExtobj[] //TODO: 此处应该为Json，传给引擎
	sceneId: string
	thumb: string
	mobileThumb: string
	lupt: number
	renderOver: boolean
	startCamera: string
	typeId: string
	scripts: string[]
	showDescFlag: number
	loadingVideo: string
	loadingThumb: string
	floor: number
	customLogo: string
	titleFlag: boolean
	descFlag: boolean
	pluginFlag: boolean
	hideLogo: boolean
	usePwd: boolean
	enLang: boolean
	musicAutoPlay: boolean
	useThumbLoading: boolean
	durationEndTs: number
	buttonOptions: InfoButtonOptions
	sceneShare: string
	panoImg?: string
	readonly: boolean
	tempId: string
	lockY?: number
	lockZoom?: number
	title: string
	fileServer: string
	plugin: boolean
	isLocalize: boolean
	imageServer: string
	modelUrl: string
	descripe: string
}

export interface InfoButtonOptions {
	hideAll: boolean
	comment: boolean
	share: boolean
	hideHeader: boolean
	headerLink: boolean
}

export interface InfoContact {
	contactEmail?: string
	externalUrl?: string
	contactPhone: string
	contactName: string
	headimgurl?: string
	userId: string
	wxQrcode?: string
	contactAddress: string
}

export interface InfoText {
	text: string
	align: string
	fillStyle: string
	fontFamily: string
	fontSize: number
	fontStyle: string
	fontVariant: string
	fontWeight: string
	strokeStyle: string
	strokeWidth: number
	lineSpacing: number
	shadow: boolean
	url: string
}
// extobj的contentType
export enum FILETYEP {
	PIC = 1,
	GIF = 2,
	MP4 = 3,
	GLTF = 4,
	ZIPGIF = 5,
	PICGIF = 6,
	V3D = 9
}

//extobj的type
export enum PicType {
	OBJ = 0,
	PIC = 1,
	FBX = 2,
	TEXT = 3,
	GLTF = 4,
	WATER = 5,
	EFFECT = 8,
	V3D = 9,
	hotPoint = 12,
	skyTexture = 13
}

export interface sceneEventParams {
	app: string
	event: string
	obj: string
	ds: string
	t: number | string
	page: string
}

export interface wordFilter {
	content: string
}

export interface objInfoData {
	tempid: string
	sceneName: string
	sceneThumbnail: string
	objId: string
	thumbnail: string
	thumbnailSize: string
	name: string
	description: string
	musicUrl?: string
	isfavorite: boolean
	extData: viewExtdata
	browserCount: number
	favoriteCount: number
	commentCount: number
	shareCount: number
	likeCount: number
	username?: string
	headimgurl: string
	userId: string
	pictures: extPicture[]
	objStatus: boolean
	link: string
	fileType: number
	videoThumb?: string
	delay?: {
		delay: number[]
		ext?: any
		w?: number
		h?: number
	}
	template?: string
}

export interface EXTData {
	contentType?: number
	texture?: string
	info: viewExtdataInfo
	placeholder?: string
}

export interface extPicture {
	extData: viewExtdata
	objId: string
	url: string
}

export interface InfoCustom {
	detail_audio?: CustomAudio
	version?: number
	normal?: CustomNormal
	detail_article?: CustomArticle
	detail_album?: CustomAlbum[]
	detail_album_eye?: boolean
	tag?: CustomTag
	btnColor?: string
}

export interface CustomAlbum {
	picPathCompre?: string
	fileType: number
	picId: string
	picPath?: string
	delay?: CustomDelay
	link?: string
}

export interface CustomDelay {
	delay: number[]
	w: null
	h: null
	ext: null
}

export interface CustomArticle {
	title: string
	id: number
}

export interface CustomAudio {
	musicFile: string
	name: string
}

export interface CustomNormal {
	x: number
	y: number
	z: number
}

export interface CustomTag {
	enable: boolean
	length: number
	visible: boolean
	texture: string
	showTitle: boolean
}

export interface getArtical {
	author?: string
	content: string
	createTs: string
	downid: number
	downtitle: string
	id: number
	image?: string
	summary?: string
	title: string
	upid?: string
	uptitle?: string
}
export interface gifDelay {
	delay: number[]
	w: number | null
	h: number | null
	ext: number | null
}
export interface pictureInfo {
	picId: string
	url: string
	name: string
	discripe: string
	enable: boolean
	width: number | null
	height: number | null
	picPath: string
	tags: string | null
	edgUrl: string | null
	fileType: number
	delay?: gifDelay | null
	target: number
	picks?: string
	mp3?: string
	useMp3?: boolean
	videoThumb?: string
	videoThumbName?: string
}

export interface getSceneImageListItem {
	sid: string
	width: number
	index: number
	is_highlight: boolean
	vision_generated_label?: string
	vision_generated_name?: string
	vision_image_index?: number
	category: string
	metadata: string
	height: number
	is_hero?: boolean
	url: string
	name?: string
	tempId: string
	overrides: string
	thumbnail_signed_src: string
}

export interface saveInfoItem {
	userId: string
	tempId: string
	phone: string
	nickname: string
	dataSource: number
}

export interface getUserInfoByCode {
	data: string
}

export interface getMessageCode {
	data: string
}

export interface censusInfo {
	likeCount: number
	viewCount: number
}
export interface serveItem {
	price: number
	id: number
	name: string
}
export interface getBuyServe {
	balance: number
	totalPrices: number
	serverList: serveItem[]
}

export interface payCode {
	qrCodeUrl: string
	outTradeNo: string
}
