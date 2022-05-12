import { Dispatch, createContext, useReducer } from "react"
import React from "react"

interface StateContext {
	model: "material" | "base" | "ani"
	current: string
	action: "edit" | "screen" | "add"
	params: any
	asset: any
	assetAction: "edit" | "position" | "none"
	selectState: boolean
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
	model: "material",
	// model: "ani",
	current: "",
	action: "edit",
	params: {},
	asset: {},
	assetAction: "none",
	selectState: false
}
export const panelContext = createContext<StateAction>({
	state: defaultState,
	dispatch: () => {}
})

const reducer = (preState: StateContext, params: panelDispatch) => {
	switch (params.type) {
		case "set":
			const newState = { ...preState, ...params.payload }
			return newState
		default:
			return preState
	}
}

const PanelProvider: React.FC = props => {
	const [state, dispatch] = useReducer(reducer, defaultState)
	return <panelContext.Provider value={{ state, dispatch }}>{props.children}</panelContext.Provider>
}

export default PanelProvider
