import { InputNumberProps } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import transformFunc from "@/utils/transform.func"
import { useMini } from "@/utils/use.func"

import DragInput from "../utils/drag.input"
interface Props extends InputNumberProps {
	item: any
	valueKey: string
	field?: string
	forceUpdate?: Function
	defaultValue?: number
	transform?: keyof typeof transformFunc
	onVal?: any
	valueChange?: (item?: any) => void
}
const _NumberInput: React.FC<Props> = props => {
	const { item, valueKey, forceUpdate, defaultValue, transform, field, onVal, valueChange, ...numberProps } = props
	const realItem = field ? item[field] : item
	const [value, setValue] = useState(
		transform ? transformFunc[transform](realItem[valueKey], "in") : realItem[valueKey]
	)
	const onChange = useCallback(
		e => {
			if (e === undefined || e === null) {
				e = defaultValue
			}
			setValue(e)
			valueChange && valueChange(item)
			realItem[valueKey] = transform ? transformFunc[transform](e, "out") : e
			if (field) {
				//某些修改需要传入整个对象才能生效
				item[field] = Object.assign(Object.create(realItem), realItem)
			}
			forceUpdate && forceUpdate()
		},
		[defaultValue, forceUpdate, valueKey, transform, item, field, realItem]
	)
	const onBlur = useCallback(
		e => {
			if (e.target.defaultValue == "") {
				setValue(defaultValue)
				realItem[valueKey] = transform ? transformFunc[transform](defaultValue, "out") : defaultValue
				if (field) {
					//某些修改需要传入整个对象才能生效
					item[field] = Object.assign(Object.create(realItem), realItem)
				}
				forceUpdate && forceUpdate()
			}
		},
		[defaultValue, forceUpdate, valueKey, transform, item, field, realItem]
	)
	const setData = useCallback(() => {
		setValue(transform ? transformFunc[transform](realItem[valueKey], "in") : realItem[valueKey])
	}, [item, field, transform, realItem, onVal])
	useEffect(() => {
		setData()
	}, [onVal, item, transform, field])

	return (
		<div className="NumberInput">
			<DragInput value={value} onChange={onChange} {...numberProps} onBlur={onBlur} />
		</div>
	)
}

const NumberInput = useMini(_NumberInput)
export default NumberInput
