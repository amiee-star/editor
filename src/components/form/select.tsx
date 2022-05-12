import transformFunc from "@/utils/transform.func"
import { useMini } from "@/utils/use.func"
import { Select, SelectProps } from "antd"
import { transform } from "lodash"
import React, { useCallback, useEffect, useState } from "react"

interface Props extends SelectProps<any> {
	item: any
	itemChange?: (val: any) => void
	removeChange?: (val: any) => void
	valueKey: string
	forceUpdate?: Function
	disabled?: boolean
	defaultValue?: string | number
	transform?: keyof typeof transformFunc
	setValue?: (val: any) => void
	onVal?: any
}
const _OpationSelect: React.FC<Props> = props => {
	const {
		item,
		valueKey,
		forceUpdate,
		defaultValue,
		transform,
		itemChange,
		removeChange,
		setValue: propsSetValue,
		onVal,
		...ownProps
	} = props
	const [value, setValue] = useState(
		transform ? transformFunc[transform](item[valueKey] || defaultValue, "in") : item[valueKey] || defaultValue
	)

	const onChange = useCallback(
		e => {
			setValue(e || defaultValue)
			// item[valueKey] = e || defaultValue
			if (propsSetValue) {
				propsSetValue(transform ? transformFunc[transform](e, "out") : e)
			} else {
				item[valueKey] = transform ? transformFunc[transform](e, "out") : e
			}
			itemChange && itemChange(e || defaultValue)
			forceUpdate && forceUpdate()
		},
		[defaultValue, forceUpdate, item, transform, valueKey, itemChange, propsSetValue]
	)
	const onDeselect = useCallback(e => {
		removeChange && removeChange(e)
	}, [])
	// useEffect(() => {
	// 	item[valueKey] = value || defaultValue
	// }, [value])
	useEffect(() => {
		setValue(item[valueKey])
		setData()
	}, [item, valueKey, onVal])
	const setData = useCallback(
		() =>
			setValue(
				transform ? transformFunc[transform](item[valueKey] || defaultValue, "in") : item[valueKey] || defaultValue
			),
		[item, valueKey, transform, defaultValue]
	)
	return (
		<Select
			value={value}
			onDeselect={onDeselect}
			onChange={onChange}
			placeholder="请选择"
			{...ownProps}
			style={{ width: "100%" }}
		></Select>
	)
}

const OpationSelect = useMini(_OpationSelect)
export default OpationSelect
