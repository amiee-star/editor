import commonFunc from "@/utils/common.func"
import eventBus from "@/utils/event.bus"
import { useMini } from "@/utils/use.func"
import { Slider, SliderSingleProps } from "antd"
import { SliderRangeProps } from "antd/lib/slider"
import React, { useCallback, useEffect, useState } from "react"

interface SingleProps extends SliderSingleProps {
	item: any
	valueKey: string
	forceUpdate?: Function
	type?: string
}
interface RangeProps extends SliderRangeProps {
	item: any
	valueKey: string
	forceUpdate?: any
	type?: string
}

const _ItemSliderModal: React.FC<SingleProps | RangeProps> = props => {
	const { item, valueKey, forceUpdate, onChange, type, ...sliderProps } = props
	const [value, setValue] = useState(item[valueKey])
	const onChangeSelf = useCallback(
		e => {
			eventBus.emit("jmk.modal.opacity", e, type)
			setValue(e)
			item[valueKey] = e
			onChange && onChange(e)
			forceUpdate && forceUpdate()
		},
		[forceUpdate, item, valueKey]
	)
	// useEffect(() => {
	// 	item[valueKey] = value
	// }, [value])
	useEffect(() => {
		setValue(item[valueKey])
	}, [item, valueKey])
	const formatter = useCallback(val => {
		return `${val}%`
	}, [])
	return (
		<>
			<Slider value={value} tipFormatter={formatter} onChange={onChangeSelf} {...sliderProps} />
			<span style={{ marginLeft: 18 }}>{`${value}%`}</span>
		</>
	)
}

const ItemSliderModal = useMini(_ItemSliderModal)
export default ItemSliderModal
