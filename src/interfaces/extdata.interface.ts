import { Vector3 } from "three"

export interface ExtData {
	info: {
		btnText: string
		custom: {
			btnColor: string
			detailAlbum: any
			detailAlbumEye: boolean
			detailArticle: {
				id: string
				title: string
			}
			triggerPlay: {
				distance: number
				isLoop: boolean
				ranges: any[]
				triggerType: number
				volume: number
				isShowNarrator: boolean
				narratorLyrics: boolean
				narratorLyricsUrl: any
				narratorSize: string
				narratorUrl: string
				narratorLyricsName: string
			}
			detailAudio: {
				musicId: string
				musicFile: string
				name: string
				musicType: string
				musicTypeId: string
				singer: string
				size: number
				time: number
			}
			normal: {
				x: number
				y: number
				z: number
			}
			tag: ExtDataTag
			portal: boolean
			portalWebsite: string
			materialSwitch: boolean
			materialPicType: string
			targetMaterial: string | []
			replaceMaterial: string
			distanceTrigger: boolean
			videoRange: number
			playShow: boolean
			eventControl: string
			openMode: string
			_openWidthRatio: string
		}
		discripe: string
		hot: any
		linkType: number
		music: string
		sweep: string
		swiperList: string[]
		target: number
		url: string
		urlName: string
		thumb: string
		frameVisible: boolean
	}
	contentType: number
	placeholder: string
	texture: string
}
export interface ExtDataTag {
	color: string
	enable: boolean
	length: number
	showTitle: boolean
	texture: string
	visible: boolean
	fillColor: string | number
	fontFamily: string
	fontSize: number
	height: number
	isGIF: boolean
	lineColor: string | number
	lineSize: number
	offsetH: number
	opacity: number
	radius: number
	shadowBlur: number
	shadowColor: string | number
	size: number
	style: string
	textAlign: string
	textBaseline: string
	textMargin: number
	title: string
}
export interface assetData {
	updatedCallback: Function
	animations: any[]
	materials: any[]
	addEventListener: Function
	removeEventListener: Function
	config: {
		color: string
		contentType: number
		height: number
		index: number
		lightProbeId: number
		name: string
		normal: any[]
		object: any
		position: any[]
		radius: number
		scale: number
		style: string
		texture: string
		textureLoader: any
		thumb: string
		type: number
		width: number
		time: string
	}
	type: number
	contentType: number
	enable: true
	extdata: ExtData
	id: string
	info: {
		target: number
		url: string
	}
	name: string
	opacity: number
	position: Vector3
	rotatio: [number, number, number, string]
	scale: number[]
	texture: string
	normal: number[]
	thumb: string
	x0: number
	y0: number
	x1: number
	y1: number
	restoreScale: Function
	frameVisible: boolean
	frameId: string
	bannerImage: string
	cornerImage: string
	poleH: number
	uuid: string
	followCamera: boolean
	enableHideInViews: boolean
	hideInViews: number[]
}
