import { Dispatch, createContext, useReducer } from "react"
import React from "react"
import { coverData, JMTInterface } from "@/interfaces/jmt.interface"
import { baseData } from "@/interfaces/api.interface"

interface StateContext {
	app: any
	jmt: JMTInterface
	editHook: any
	sceneName: string
	sceneCofing: coverData
	baseInfo: baseData
}

interface StateAction {
	state: StateContext
	dispatch: Dispatch<JMKDispatch>
}

type JMKDispatchType = "set" | "clear"

interface JMKDispatch {
	type: JMKDispatchType
	payload?: Partial<StateContext>
}
const defaultState: StateContext = {
	app: null,
	jmt: null,
	editHook: null,
	sceneName: null,
	sceneCofing: null,
	baseInfo: null
}
export const JMKContext = createContext<StateAction>({
	state: defaultState,
	dispatch: () => {}
})

const reducer = (preState: StateContext, params: JMKDispatch) => {
	switch (params.type) {
		case "set":
			const newState = { ...preState, ...params.payload }
			return newState
		default:
			return preState
	}
}

const JMKProvider: React.FC = props => {
	const [state, dispatch] = useReducer(reducer, defaultState)
	return <JMKContext.Provider value={{ state, dispatch }}>{props.children}</JMKContext.Provider>
}

export default JMKProvider
