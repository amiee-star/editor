import commonFunc from "@/utils/common.func"
import { useMini } from "@/utils/use.func"
import { Slider, SliderSingleProps } from "antd"
import { SliderRangeProps } from "antd/lib/slider"
import React, { useCallback, useEffect, useState } from "react"

interface SingleProps extends SliderSingleProps {
	item: any
	valueKey: string
	forceUpdate?: Function
}
interface RangeProps extends SliderRangeProps {
	item: any
	valueKey: string
	forceUpdate?: any
}

const _ItemSlider: React.FC<SingleProps | RangeProps> = props => {
	const { item, valueKey, forceUpdate, onChange, ...sliderProps } = props
	const [value, setValue] = useState(item[valueKey])
	const onChangeSelf = useCallback(
		e => {
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
	return <Slider value={value} onChange={onChangeSelf} {...sliderProps} />
}

const ItemSlider = useMini(_ItemSlider)
export default ItemSlider
