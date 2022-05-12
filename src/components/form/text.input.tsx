import eventBus from "@/utils/event.bus"
import { useMini } from "@/utils/use.func"
import { Input, InputProps } from "antd"
import React, { useCallback, useEffect, useState } from "react"

interface Props extends InputProps {
	item: any
	valueKey: string
	forceUpdate?: Function
	defaultValue?: string
	changeValue?: Function
	onVal?: any
}

const _TextInput: React.FC<Props> = props => {
	const { item, valueKey, forceUpdate, changeValue, defaultValue, onVal, ...inputProsp } = props
	const [value, setValue] = useState(item[valueKey])
	const onChange = useCallback(
		e => {
			setValue(e.currentTarget.value)
			item[valueKey] = e.currentTarget.value
			changeValue && changeValue()
			forceUpdate && forceUpdate()
		},
		[defaultValue, forceUpdate, item, valueKey]
	)
	const onBlur = useCallback(
		e => {
			if (!e.currentTarget.value) {
				setValue(e.currentTarget.value || defaultValue || "")
				item[valueKey] = e.currentTarget.value || defaultValue || ""
				changeValue && changeValue()
				forceUpdate && forceUpdate()
			}
			// setValue(e.currentTarget.value || defaultValue)
			// item[valueKey] = e.currentTarget.value || defaultValue
			// forceUpdate && forceUpdate()
		},
		[defaultValue, forceUpdate, item, valueKey]
	)

	// const onBlur = e => {
	//
	// }
	// useEffect(() => {
	// 	item[valueKey] = value || defaultValue
	// }, [value])
	useEffect(() => {
		setValue(item[valueKey])
	}, [item, valueKey, onVal])
	return <Input value={value} onChange={onChange} {...inputProsp} onBlur={onBlur} />
}

const TextInput = useMini(_TextInput)
export default TextInput
