export interface materialParams {
	fileType?: number | string
	tagId?: string
	tag?: string
	keywords?: string
	keyword?: string
	showType?: number
	process?: number
}
export interface pageParams {
	currentPage?: number
	pageNum?: number
	pageSize?: number
}
export interface hallInfoParams {
	tempid: string
	name: string
	typeId: string
	discripe: string
	contactEmail: string
	contactPhone: string
	contactName: string
	contactAddress: string
	wxQrcode: string
	titleFlag: boolean
	descFlag: boolean
	usePwd: boolean
	hideHeader: boolean
	enLang: boolean
	tempToUser: boolean
	share: boolean
	comment: boolean
	likeSetting: boolean
	birdEyeSetting: boolean
	threeSetting: boolean
	tempMapSetting: boolean
	musicAutoPlay: boolean
	password: string
	logo: string
	mobilethumb: string
	pcthumb: string
	loadingVideo: string
	mobileLoadingVideo: string
	musicId: string
	liveOpenType: number
	liveUrl: string
	liveStartTime: string
	liveEndTime: string
	liveService: number
	custServiceCode: string
	myCustService: number
	skinSetting: number
	varLook: number
	varUserJson: []
	lookStartTimeStr: string
	lookEndTimeStr: string
	deleteCover: string
	deleteWxQrcode: string
	deleteMobileCover: string
	deleteVideo: string
	deleteMobileVideo: string
	powerList?: string[]
	buttons?: string[]
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
	music?: string
	info?: string
	discripe: string
	extdata?: viewExtdata
	opacity: number
	name: string
	enable: boolean
	mask?: string
	packTexture?: number
  occupiedFodder?: boolean
  picturesId?: string
  scaling?: string
  location?: string
}

export interface viewPosition {
	x: number
	y: number
	z: number
	w?: number
}
export interface viewExtdata {
	contentType?: string
	texture?: string
	info?: viewExtdataInfo
	placeholder?: {
		index: string
		user: string
	}
}
export interface viewExtdataInfo {
	urlName?: string
	url?: string
	discripe?: string
	target?: number
	type?: number
	music?: string
	sweep?: string
	custom?: string
	btnText?: string
	swiperList?: string
	hot?: string
}

export interface hallInfoParams {
	tempid: string
	name: string
	typeId: string
	discripe: string
	contactEmail: string
	contactPhone: string
	contactName: string
	contactAddress: string
	wxQrcode: string
	titleFlag: boolean
	descFlag: boolean
	usePwd: boolean
	hideHeader: boolean
	enLang: boolean
	tempToUser: boolean
	share: boolean
	comment: boolean
	likeSetting: boolean
	birdEyeSetting: boolean
	threeSetting: boolean
	tempMapSetting: boolean
	musicAutoPlay: boolean
	password: string
	logo: string
	mobilethumb: string
	pcthumb: string
	loadingVideo: string
	mobileLoadingVideo: string
	musicId: string
	liveOpenType: number
	liveUrl: string
	liveStartTime: string
	liveEndTime: string
	liveService: number
	custServiceCode: string
	myCustService: number
	skinSetting: number
	varLook: number
	varUserJson: []
	lookStartTimeStr: string
	lookEndTimeStr: string
	deleteCover: string
	deleteWxQrcode: string
	deleteMobileCover: string
	deleteVideo: string
	deleteMobileVideo: string
	powerList?: string[]
	buttons?: string[]
}

export interface addCompereParams {
	tempId: string
	accid: string
	nickname: string
}

export interface compereListParams {
	pageNum: number
	pageSize: number
	keyword: string
	tempId: string
}

export interface publicMusicParams {
	name: string
	pageNum: number
	pageSize: number
	musicTypeId?: string
}

export interface myMaterialParams {
	fileType?: string | number
	tempId?: string
	pageSize: number
	pageNum?: number
	hotIcon?: boolean
}

export interface modelsBySizeParams {
	type?: number
	tempId?: string
	name?: string
	pageSize: number
	pageNum: number
}

export interface imgMaterialParams {
	name?: string
	enable?: boolean
	file?: any
	setHot?: boolean
	tags?: string
	tempId?: string
	_capcity?: number
	time?: number
	title?: string
	content?: string
}

export interface insertImg {
	picId?: string
	tempId?: string
	data: any
	oldpicId?: string
	extObjId?: string
}

export interface ModelInfoParams {
	modelPath: string
	name: string
	fileType: number
}
export interface guideAttr {
  imagreAuto: number
  imagreFor: number
  viewAuto: number
  viewAutoTime: number
  vrExplain: number
  tempId: string
}
