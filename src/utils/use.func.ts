import { memo, useState } from "react"
import deepEqual from "react-fast-compare"
export const useForceUpdate = () => {
	const forceUpdate = useState(0)[1]
	return () => forceUpdate(x => x + 1)
}
export const useMini = <T>(Component: React.ComponentType<T>) => memo(Component, (prev, next) => deepEqual(prev, next))
