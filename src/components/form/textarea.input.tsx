import { useMini } from "@/utils/use.func"
import { Input } from "antd"
import { TextAreaProps } from "antd/lib/input"
import React, { useCallback, useEffect, useState } from "react"

interface Props extends TextAreaProps {
	item: any
	valueKey: string
	forceUpdate?: Function
	defaultValue?: string
}

const _TextAreaInput: React.FC<Props> = props => {
	const { item, valueKey, forceUpdate, defaultValue, ...inputProos } = props
	const [value, setValue] = useState(item[valueKey])
	const onChange = useCallback(
		e => {
			setValue(e.currentTarget.value)
			item[valueKey] = e.currentTarget.value
			forceUpdate && forceUpdate()
		},
		[defaultValue, forceUpdate, item]
	)
	const onBlur = useCallback(
		e => {
			if (!e.currentTarget.value) {
				setValue(e.currentTarget.value || defaultValue)
				item[valueKey] = e.currentTarget.value || defaultValue
				forceUpdate && forceUpdate()
			}
		},
		[defaultValue, forceUpdate, item, valueKey]
	)
	// useEffect(() => {
	// 	item[valueKey] = value || defaultValue
	// }, [value])
	useEffect(() => {
		setValue(item[valueKey])
	}, [item])
	return <Input.TextArea value={value} onChange={onChange} {...inputProos} onBlur={onBlur} />
}

const TextAreaInput = useMini(_TextAreaInput)
export default TextAreaInput
