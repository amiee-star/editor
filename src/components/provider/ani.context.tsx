import { Dispatch, createContext, useReducer } from "react"
import React from "react"
import { assetData } from "@/interfaces/extdata.interface"

export interface ChannelItem {
	name: string
	path: string
	node: string
	times: number[]
	values: number[][]
}

export interface aniItem {
	position: any
	addChannel: Function
	name: string
	asset: assetData
	trigger: any
	channels: ChannelItem[]
	removeChannel: Function
	loop: string
}
export interface trackData {
	time: number
	value: any
}
export interface trackItem {
	aid: string
	type: string
	data: trackData[]
}
export interface StateContext {
	assetShow: boolean
	// 动画列表
	aniList: aniItem[]
	// 选择的动画
	selectAni: aniItem | null
	// 当前动画属性内容
	tackList: trackItem[]
	// 选择的属性内容
	selectTack: trackItem | null
	// 选择属性类型
	selectCofType: string
	speed: number
	sample: number
	time: number
	model: string
	lineType: string
	// 复制的属性
	copyPropData: trackItem | null
	// 复制的动画节点
	copyAniData: trackItem[] | null
	layout: {
		trackBoxEle: HTMLDivElement
		boxHeight: number
		lineIndex: number
		lineWidth: number[]
		topHeight: number
		leftWidth: number
		markIndex: number
		pageFrams: number
		markSpace: number
	}
	isPlay: boolean
}

interface StateAction {
	state: StateContext
	dispatch: Dispatch<panelDispatch>
}

type panelDispatchType = "set" | "clear"

interface panelDispatch {
	type: panelDispatchType
	payload?: Partial<StateContext>
}
const defaultState: StateContext = {
	assetShow: false,
	//动画列表
	aniList: [],
	selectAni: null,
	//点数
	tackList: [],
	selectTack: null,
	selectCofType: "",
	//！
	speed: 1,
	//！
	sample: 60,
	time: 0,
	model: "2200",
	lineType: "time",
	copyPropData: null,
	copyAniData: null,
	layout: {
		trackBoxEle: null,
		markSpace: 1,
		boxHeight: 260,
		lineIndex: 2,
		lineWidth: [6, 10, 14, 21, 31, 46, 68, 99], //帧宽
		topHeight: 160,
		leftWidth: 280,
		markIndex: 0,
		pageFrams: 1
	},
	isPlay: false
}
export const aniContext = createContext<StateAction>({
	state: defaultState,
	dispatch: () => {}
})

const reducer = (preState: StateContext, params: panelDispatch) => {
	switch (params.type) {
		case "set":
			const newState = { ...preState, ...params.payload }
			return newState
		case "clear":
			return defaultState
		default:
			return preState
	}
}

const AniProvider: React.FC = props => {
	const [state, dispatch] = useReducer(reducer, defaultState)
	return <aniContext.Provider value={{ state, dispatch }}>{props.children}</aniContext.Provider>
}

export default AniProvider
