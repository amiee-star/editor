import React, { PropsWithChildren, useCallback, useEffect, useRef } from "react"
import Sortable from "sortablejs"
import "./sort.item.less"
interface Props {
	onChange: (data: string[]) => void
	dataIdAttr?: string
	handle?: string
	direction?: "vertical" | "horizontal"
	filter?: string
}

const SortItem = React.forwardRef<Sortable, PropsWithChildren<Props>>((props, ref) => {
	const { onChange, dataIdAttr = "data-id", children, handle, direction, filter } = props
	const sortTableRef = useRef<Sortable>()
	const sortBox = useRef<HTMLDivElement>(null)
	const onEnd = useCallback(
		(event: Sortable.SortableEvent) => {
			if (event.newIndex !== event.oldIndex) {
				onChange && onChange(sortTableRef.current!.toArray())
			}
		},
		[onChange]
	)
	useEffect(() => {
		if (!sortTableRef.current && !!sortBox.current) {
			sortTableRef.current = new Sortable(sortBox.current, {
				handle: handle || ".handle",
				animation: 150,
				dataIdAttr,
				onEnd,
				direction: direction || "vertical",
				forceFallback: true,
				filter: filter || ".ignore-elements" // Selectors that do not lead to dragging (String or Function)
			})
			!!ref && (typeof ref === "function" ? ref(sortTableRef.current) : (ref!.current = sortTableRef.current))
		}
	}, [])
	return (
		<div ref={sortBox} className="SortItem">
			{children}
		</div>
	)
})
export default SortItem
