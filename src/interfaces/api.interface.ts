// 接口返回需要的基础字段
export interface baseRes<D = {}> {
	code: string
	errorMsg: string
	msg: string
	data: D //返回的数据字段
}
export interface PageParams {
	currentPage?: number
	pageNum?: number
	pageSize?: number
	page?: number
}
export interface PageData<D = {}> {
	currentPage: number
	page?: number
	pageSize: number
	count: number
	list?: D[]
}
export interface upFileItem {
	filePreviewUrl: string
	fileSaveUrl: string
	fileSize: number
}
export interface withToken {
	token: string
}
export interface pictureListParams extends withToken, PageParams {
	fileType: number
	tagId: string
	keywords: string
}

export interface PictureFrameData extends PageData {
	entities: getPictureFrameData[]
}

export interface pictureListItem {
	musicId: any
	musicFile: string
	thumbnail: string
	picId: string
	url?: string
	name: string
	discripe?: string
	enable: boolean
	width?: number
	height?: number
	picPath: string
	tags: pictureListTag[]
	edgUrl?: string
	fileType: number
	delay?: number[]
	delayImage?: string
	target: number
	picks?: string[]
	mp3?: string
	useMp3: boolean
	videoThumb?: string
	videoThumbName?: string
	glbThumb?: string
	playType?: number
	isIcon: boolean
	size: number
	vcount: number
	time: string
}

export interface musicListItem {
	fileType: number
	isGood: any
	musicFile: string
	musicId: string
	musicName: string
	musicType: string
	musicTypeId: string
	name: string
	singer: string
	size: number
	time: string
	type: false
}

export interface articleListParams {
	// picId: string
	// url?: string
	// name: string
	// discripe?: string
	// enable: boolean
	// width?: number
	// height?: number
	// picPath: string
	// tags: pictureListTag[]
	// edgUrl?: string
	// fileType: number
	// delay?: number
	// target: number
	// picks?: string[]
	// mp3?: string
	// useMp3: boolean
	// videoThumb?: string
	// videoThumbName?: string
	// glbThumb?: string
	// playType?: number
	// isIcon: boolean
	// size: number
	// vcount: number
}

export interface pictureListTag {
	name: string
	tagId: string
}
export interface getPictureFrameData {
	name: string
	tagId: string
	id?: string
}

export interface userLoginParams {
	phone: string
	password: string
}

export interface getPictureTagsData {
	name: string
	tagId: string
}

export interface infoData {
	myBrowseService: boolean
}

export interface infoData {
	myBrowseService: boolean
}

export interface infoData {
	myBrowseService: boolean
}

export interface modelListParams extends PageParams {
	login: string
}

export interface modelListItem {
	fileType: number
	picId: string
	arType: number
	brand?: string
	browseCount: number
	code: string
	downloadCount: number
	fansUserId: string
	favorite: boolean
	favoriteCount: number
	featured: boolean
	identification: string
	isFavorite: boolean
	jiaedaType: number
	likeCount: number
	modelConfig: string
	modelFile: string
	modelTypeCode: string
	name: string
	price: string
	process: number
	public: boolean
	showType: number
	thumbnail: string
	type: string
	uploadTime: string
	userName: string
	userPic: string
	subType?: number
}

export interface modelListData extends PageData {
	entities: modelListItem[]
}

export interface modelConfigData {
	display: modelDisplay
	showLight: boolean
	material: modelMaterial[]
	environment: modelActionStates
	background: boolean
	backgroundType: number
	backgroundImage: string
	playbackSpeed: number
	actionStates: modelActionStates
	camera: string
	skeleton: boolean
	grid: boolean
	lights: modelLights
	effectLights: modelEffectLight[]
	restoredCameras: any[]
	showPOI: boolean
	cameraPosition: modelCameraPosition
	sceneRotationAngle: number
	lightsEnabled: boolean
	savedTime: string
	version: string
}

export interface modelActionStates {}

export interface modelCameraPosition {
	x: number
	y: number
	z: number
}

export interface modelDisplay {
	autoRotate: boolean
	autoRotateSpeed: number
	autoRotateMaxSpeed: number
	screenSpacePanning: boolean
	floorGround: boolean
	useDefalutFloorGround: boolean
	shadowIntensity: number
	shadowBorderFade: number
	deltaFloorHeight: number
	floorGroundMaxSize: number
	floorGroundSize: number
	floorGroundImage: string
	floorIsWater: boolean
	shadows: boolean
	bgColor1: string
	bgColor2: string
	playClips: boolean
	stereo: boolean
	antialias: boolean
	wireframe: boolean
	depthPeel: boolean
}

export interface modelEffectLight {
	uuid: string
	enabled: boolean
	type: string
	intensity: number
	color: string
	phi: number
	theta: number
	radius: number
}

export interface modelLights {
	gammaOutput: boolean
	textureEncoding: string
	toneMapping: string
	exposure: number
	whitePoint: number
	hdr: modelHdr
	hdrIntensity: number
}
export interface modelHdr {
	name: string
	negx: string
	negy: string
	negz: string
	posx: string
	posy: string
	posz: string
	thumbnail: string
}
export interface modelMaterial {
	name: string
	uniforms: modelUniforms
}

export interface modelUniforms {
	saveMatName: string
	class: string
	materialName: string
	color: string
	flatShading: boolean
	opacity: number
	refractionRatio: number
	side: number
	roughness: number
	metalness: number
	aoMapIntensity: number
	bumpScale: number
	normalScale: modelNormalScale
	map: string
	aoMap: string
	metalnessMap: string
	normalMap: string
	alphaMap: string
	bumpMap: string
	uvdata: number[]
	emissiveIntensity: number
}

export interface modelNormalScale {
	x: number
	y: number
}

export interface baseData {
	check: number
	tempId: string
	sceneId: string
	thumbnail: string
}

export interface myMaterialItem {
	thumbnail: any
	showPlay: boolean
	_active?: boolean
	_picPathCompre?: string
	_picPath?: string
	backLucency: boolean
	createTs: string
	delay: string[]
	delayStr: string
	discripe: string
	edgUrl: string
	enable: boolean
	extData: any
	fileType: number
	glbThumb: string
	height: number
	isIcon: boolean
	mp3: string
	name: string
	narrateMan: false
	picId: string
	picPath: string
	picks: string
	picturesName: string
	playType: string
	size: number
	tags: string
	target: number
	url: string
	useMp3: boolean
	vcount: number
	videoThumb: string
	videoThumbName: string
	width: string
}
