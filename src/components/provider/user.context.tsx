import { Dispatch, createContext, useReducer } from "react"
import React from "react"
import lsFunc from "@/utils/ls.func"

interface StateContext {
	user?: any
}

interface StateAction {
	state: StateContext
	dispatch: Dispatch<userDispatch>
}

type userDispatchType = "set" | "clear"

interface userDispatch {
	type: userDispatchType
	payload?: Partial<StateContext>
}

export const userContext = createContext<StateAction>({ state: {}, dispatch: () => {} })

const reducer = (preState: StateContext, params: userDispatch) => {
	switch (params.type) {
		case "clear":
			lsFunc.removeItem("user")
			return {}
		case "set":
			const newState = { ...preState, ...params.payload }
			lsFunc.setItem("user", newState.user)
			return newState
		default:
			return preState
	}
}

const UserProvider: React.FC = props => {
	const [state, dispatch] = useReducer(reducer, lsFunc.getItem("user") ? { user: lsFunc.getItem("user") } : {})

	return <userContext.Provider value={{ state, dispatch }}>{props.children}</userContext.Provider>
}

export default UserProvider
