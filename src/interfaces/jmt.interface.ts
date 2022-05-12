export interface JMTInterface {
	teleport: any
	genUUID: Function
	EDIT_MODE: boolean
	DEBUG: boolean
	DEBUG_SHARED_BUFFERS: boolean
	ALWAYS_RENDER: boolean
	LOG_INFO: boolean
	LOG_TO_SERVER: boolean
	LOG_TIME: boolean
	PROGRESSIVE_LOADER_AFTER_SEC: number
	CONTEXT_LOST_RESTORE_LIMIT: number
	DYNAMIC_LIGHTS: boolean
	HEAD_LIGHT: boolean
	RETRIES_ON_LOAD_ERROR: number
	DEFAULT_ANISOTROPY: number
	NO_ANISOTROPY: number
	FORCE_FXAA: boolean
	FONT_FAMILIES_TO_LOAD: string[]
	CAMERA_WALK_NEAR: string
	CAMERA_ORBIT_NEAR: number
	CAMERA_MIN_FAR: number
	SKY_DISTANCE_TO_SCENE: number
	CAMERA_DEFAULT_FOV: number
	CAMERA_DEFAULT_MOVE_MAX_SPEED: number
	CAMERA_LOOK_SPEED: number
	CAMERA_ARROWS_TURN_SPEED: number
	CAMERA_SCROLL_SPEED: string
	CAMERA_FULL_ACCELERATION_TIME: number
	CAMERA_FULL_DECELERATION_TIME: number
	MAX_GROUND_SEARCH_DEPTH: number
	COVER_JSON_URL: string
	AUTO_TOUR_IN_VIEW_STILL_TIME_MS: number
	CLICK_MOVE_MIN_DISTANCE_TO_OBSTACLE: number
	KEY_MOVE_MIN_DISTANCE_TO_OBSTACLE: number
	MIN_DISTANCE_TO_CEILING: number
	LIGHT_PROBE_MIRROR_SIZE: number
	LIGHT_PROBE_MAX_MIP_SIZE: number
	LIGHT_PROBE_MIN_MIP_SIZE: number
	LIGHT_PROBE_GLOSS_FOR_MIP: number[]
	LIGHT_VISIBILITY_MAP_DOWNSAMPLE: number
	LIGHT_DISTANCE_PROBE_SIZE: number
	DEBUG_LIGHT_PROBE_MIPS: boolean
	ENABLE_AUTO_EXPOSURE_CONTROLS: boolean
	EDITOR_COVER_WIDTH: number
	EDITOR_COVER_HEIGHT: number
	MAX_PANORAMA_SIZE: number
	OBJECT_VISIBILITY_PROBE_SIZE: number
	DEFAULT_SKY_NAME: string
	EDITOR_CONTROLLED_SKY_NAME: string
	EDITOR_SELECTION_COLOR: THREE.Color
	ALLOW_MOBILE_VR: boolean
	VR_FALLBACK_CAMERA_HEIGHT: number
	LOAD_PRIORITY: {
		COLORMAP: number
		CORE_RESOURCE: number
		DIFFUSE: number
		LIGHTMAP: number
		SKY: number
		SPECULARITY: number
		UV0: number
		VIDEO: number
	}
	MERGE_TRANSPARENT_DISABLED: boolean
	urlHashContains: Function
	urlHashGetArgument: Function
	urlHashRemoveArgument: Function
	isLocalhost: Function
	TELEPORT_TO_VIEW_MAX_TIME: number
	TELEPORT_TO_POINT_MAX_TIME: number
	TELEPORT_TO_VIEW_ACCELERATION: number
	GAZE_POINTER_SHOW_LOADING_AFTER_S: number
	GAZE_POINTER_ACTIVATE_AFTER_S: number
	SPRITE_ANCHOR_FONT_SIZE: number
	POINTER_PRIORITY: {
		EDITOR_SELECTOR: number
		INTERACTION_DISPATCHER: number
		TRANSFORM_CONTROLS: number
	}
	BASIS_DECODE_WORKERS: number
	HIDE_MEETING_EXTENSIONS_FROM_EDITOR: boolean
	defer: Function
	iterateAsync: Function
	find: Function
	filter: Function
	indexOfMax: Function
	any: Function
	removeFromArray: Function
	copyProperties: Function
	normalizeRotation: Function
	setTextContent: Function
	getOriginFromUrl: Function
	log2: Function
	mipsCount: Function
	LIGHT_PROBE_MIPS_COUNT: number
	isModifierPressed: Function
	round: Function
	preloadImage: Function
	onVideoDataReady: Function
	cloneObject: Function
	readOnlyCopy: Function
	deepEqual: Function
	getUrlbase: Function
	adjustFont: Function
	getTimeString: Function
	log: Function
	Detector: Function
	EditorHooksApi: Function
	EditorHooks: Function
	ajaxGet: Function
	ajaxPost: Function
	queueAjaxGet: Function
	queueImageGet: Function
	queueVideoGet: Function
	GazeModeObserver: Function
	GAMEPAD_ACTION: {
		BACKWARD: number
		DOWN: number
		FORWARD: number
		LEFT: number
		NEXT: number
		PREVIOUS: number
		RIGHT: number
		TRIGGER: number
		UP: number
	}
	GamepadManager: Function
	MergeConfig: Function
	Frustum: Function
	WebGLState: Function
	createWebGLShader: Function
	WebGLProgramStore: Function
	WebGLTextureSlotter: Function
	WebGLTextureSlotterSequential: Function
	WebGLRenderTarget: Function
	WebGLRenderTargetVR: Function
	Texture: Function
	DataTexture: Function
	WebGLRenderTargetCube: Function
	WebGLRenderer: Function
	AutoClearAlter: Function
	SsaaRenderer: Function
	createGlobalDetector: Function
	createRenderer: Function
	createJMTRenderer: Function
	Renderer: Function
	Extensions: Function
	ExtensionsManager: Function
	VRManager: Function
	VRHeightController: Function
	AnimationController: Function
	Camera: Function
	OrbitControls: Function
	Controls: Function
	ViewerApi: Function
	ClearColorAlter: Function
	SHADERS: Object
	Shader: Function
	InlineShader: Function
	getShader: Function
	BaseMaterial: Function
	ObjectDistanceMaterial: Function
	RaycasterConfig: Function
	RayIntersection: Function
	GpuRaycaster: Function
	View: Function
	VideoTexture: Function
	BufferAttribute: Function
	Geometry: THREE.BufferGeometry
	InstancedGeometry: Function
	SubGeometry: Function
	ParallaxModes: {
		basic: string
		occlusion: string
		relief: string
		steep: string
	}
	StandardMaterial: Function
	AnchorMaterial: Function
	AnchorSpriteMaterial: Function
	ICONS: Object
	Anchor: Function
	Avatar: Function
	Viewer: Function
	ColorUtils: Function
	CutoutTextureDetector: Function
	createMaterialOfType: Function
	Scene: Function
	Timer: Function
	Perf: Function
	DeferringExecutor: Function
	BufferLoader: Function
	LightInstance: Function
	Light: THREE.Light
	Mesh: Function
	MergedMesh: Function
	LightProbe: Function
	CompressedTexture: Function
	CompressedTextureLoader: Function
	KTXLoader: Function
	createBasisLoader: Function
	TextureLoader: Function
	TextureAtlasLoader: Function
	MaterialLoader: Function
	EquirectSkyMaterial: Function
	ProceduralSkyMaterial: Function
	SkyMesh: Function
	SkyLoader: Function
	NodeConfig: Function
	Node: Function
	Math: {
		anyPositiveRootOfQuadraticEquation: Function
		minBytesToHold: Function
		spheresUnion: Function
		toSnorm8: Function
	}
	MeshMaker: Function
	LightmapLoader: Function
	asyncFillIndexedUv0: Function
	asyncFillIndexedUv1: Function
	asyncFillIndexedCoreGeometry: Function
	asyncFillNotIndexedGeometry: Function
	SceneLoader: Function
	LumaMeter: Function
	ExposureController: Function
	PointerEventDispatcher: Function
	movePointTowards: Function
	getViewer: Function
	Collider: Function
	Teleport: Function
	HashChangeTeleport: Function
	AutoTour: Function
	ScreenshotTaker: Function
	GazePointer: Function
	ClickNavigator: Function
	PointerEventHelper: Function
	InteractionDispatcher: Function
	AabbQueryMaterial: Function
	CubeMapFilterShader: Function
	CubeCamera: Function
	OrthoCubeCamera: Function
	LightProbeMaker: Function
	StepsClimber: Function
	USER_MSG: {
		error: Function
		hideInfo: Function
		info: Function
	}
	Euler: Function
	Ruler: Function
	App: Function
	LightMaterial: JMTInterface["BaseMaterial"]
	sunRotationToPosition: Function
	computeNodeBoundingSphere: Function
	LightControls: Function
	WireframeMaterial: Function
	createBoundingBoxMaterial: Function
	LightProbeControls: Function
	CameraVolume: Function
	CameraVolumeControls: Function
	RotateGizmoMaterial: Function
	TRANSFORM_MODE: {
		ROTATE: number
		SCALE: number
		TRANSLATE: number
	}
	TransformGizmo: Function
	TransformControls: Function
	EditorSelector: Function
	DebugMaterial: Function
	ObjectDistanceReader: Function
	ObjectDistanceQuery: Function
	CanvasTexture: Function
	interactionDetector: {
		detectIntersect: Function
		findIntersectionAtPosition: Function
	}
	SceneLoadConfig: FunctionConstructor
	UI: any
	Asset: Function
	ImageAsset: Function
	GIFAsset: Function
	VideoAsset: Function
	TextAsset: Function
	ModelAsset: Function
	AssetsController: Function
	AssetsManager: Function
	AnimateManager: FunctionConstructor
	MeetingOpr: Function
	MeetingList: Function
	MediaPlayer: Function
	PointerHelper: Function
	PubNubHelper: Function
	ConnectManager: Function
	createMeetingNoteFunc: Function
	NoteState: Function
	RTCParticipant: Function
	RTCSelf: Function
	RTCOther: Function
	Room: Function
	colorArray: string[]
	MeetingState: {
		option: {
			uuid: string
			publishKey: string
			subscribeKey: string
			channel: string
			sceneState: string
			avToken: string
			meetingKey?: string
			meetingName?: string
			remainingTimeSeconds: number
			url: string
		}
		valid: boolean
	}
	startMeeting: Function
	Editor: FunctionConstructor
}

export interface viewExtobj {
	id: string
	type: number
	thumb: string
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
	info: {
		custom: {
			detail_audio: {}
			detailArticle: {}
			detailAlbum: {
				delay: []
			}
			tag: { enable: boolean }
		}
	}
	discripe: string
	extdata: viewExtdata
	opacity: number
	name: string
	enable: boolean
	mask?: string
	packTexture?: number
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

export interface viewExtdata {
	contentType?: string
	texture: string
	info: viewExtdataInfo
	Info?: viewExtdataInfo
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

export interface loadTextureParam {
	alpha?: boolean
	id?: string
	name?: string
	rawExt: string
	stdExt: string
	url?: string
	webFormats?: string[]
	video?: boolean
}

export interface coverData {
	engineLogoOn: boolean
	info: coverInfo
}

export interface coverInfo {
	isShare: boolean
	isMessage: boolean
	isLikes: boolean
	sceneObjs: any
	customButton: any
	category: any
	mobileopenVideo: any
	danmu: boolean
	outLine: { show: boolean }
	browseService: boolean
	buttonOptions: coverButtonOptions
	closeMusic: null | boolean
	contact: coverContact
	custService: boolean
	custServiceCode: null | string
	customLogo: null | string
	descFlag: boolean
	description: string
	durationEndTs: null | string
	enLang: boolean
	extobjs: any[]
	floor: number
	hideLogo: boolean
	password: string
	liveService: boolean
	loadingThumb: null | string
	loadingVideo: null | string
	lupt: number
	lut: null | string
	lutName: null | string
	lutid: null | string
	lutsz: null | string
	minimap: coverMinimap
	mobileThumb: null | string
	modelRotate: boolean
	musicAutoPlay: boolean
	musicFile: null | string
	musicId: null | string
	musicName: null | string
	myBrowseService: boolean
	myCustService: boolean
	name: string
	panoImg: null | string
	pluginFlag: boolean
	renderOver: boolean
	sceneId: string
	sceneShare: null | string
	sceneTemplateLive: coverSceneTemplateLive
	scripts: string[]
	showDescFlag: number
	startCamera: string
	tempid: string
	thumb: string
	titleFlag: boolean
	token: null | string
	typeId: string
	usePwd: boolean
	useThumbLoading: boolean
	username: string
	viewCount: number
	openingVideo: {
		show: boolean
		url: string
		name: string
		showSkip: boolean
	}
	openTour: {
		show: boolean
		tour: string
		changeBGM: boolean
	}
	mobileOpeningVideo: {
		show: boolean
		url: string
		name: string
		showSkip: boolean
	}
	customBtnList: customBtnListItems[]
}

export interface customBtnListItems {
	buttonName: string
	key: number
	buttonUrl: string
	buttonType: number
}

export interface coverButtonOptions {
	comment: boolean
	headerLink: boolean
	hideAll: boolean
	hideHeader: boolean
	share: boolean
}

export interface coverContact {
	contactAddress: string
	contactEmail: null | string
	contactName: string
	contactPhone: string
	externalUrl: null | string
	headimgurl: string
	userId: string
	wxQrcode: null | string
}

export interface coverMinimap {
	mapImage: string
	rect: number
	show: boolean
	position: {
		x: number
		y: number
	}
}

export interface coverRect {
	x0: number
	x1: number
	y0: number
	y1: number
}

export interface coverSceneTemplateLive {
	liveEndTime: null | string
	liveOpenType: number
	liveStartTime: null | string
	liveState: boolean
	liveUrl: null | string
	senceTemplateId: null | string
}

export interface devicesData {
	id: string
	type: string
	description: string
}

export interface renderParams {
	cameraPosition: number[]
	cameraRotation: number[]
	cameraFov: number
}

export interface renderSettingsData {
	bgAoDistance: number
	bgAoFactor: number
	bgColor: number[]
	bgMapGamma: number
	bgStrength: number
	bounceCount: number
	floodDarkLimit: number
	height: number
	lightmapResolution: number
	maxDirectSample: number
	maxIndirectSample: number
	maxLightmapCount: number
	sampleCount: number
	transparentBounceCount: number
	useBg: boolean
	useBgAo: boolean
	useBgMap: boolean
	usePostProcessFilters: boolean
	width: number
	devices: string[]
	tileSize: number
	exportLightmapUvs: boolean
}

export interface bakeData {
	floodDarkLimit: number
	bgMapGamma: number
	device: string
	useBgAo: boolean
	width: number
	maxDirectSample: number
	maxIndirectSample: number
	bgStrength: number
	bgColor: number[]
	bgAoDistance: number
	usePostProcessFilters: boolean
	sampleCount: number
	bounceCount: number
	bgAoFactor: number
	lightmapResolution: number
	height: number
	useBg: boolean
	useBgMap: boolean
	devices: string[]
	tileSize: number
	exportLightmapUvs: boolean
	transparentBounceCount: number
}

export interface jobsData {
	stateTag: string
	jobs: JobItem[]
}

export interface JobItem {
	id: number
	type: string
	sceneName: string
	state: string
	timestamp: number
	runningTimestamp: number
	executedTimestamp: number | null
	now: number
	message: null
	progress: JobProgress
	info: any[]
}

export interface JobProgress {
	message: string
	total: number | null
	done: number | null
	elapsed: number | null
}

export interface sceneData {
	name: string
	source: string
	assetsUrl: string
	sceneUrl: string
}

export interface animationData {
	channels: any[]
	samplers: any[]
}
export interface combinScenes {
	name: string
	btName: string
	scenes: {
		scene: string
		thumbnail: string
	}[]
}
