import { useMini } from "@/utils/use.func"
import { CheckboxProps, Checkbox } from "antd"
import { CheckboxChangeEvent } from "antd/lib/checkbox"
import React, { useCallback, useEffect, useState } from "react"

interface Props extends CheckboxProps {
	item: any
	valueKey: string
	forceUpdate?: Function
	defaultValue?: string | number
}

const _ItemCheckBox: React.FC<Props> = props => {
	const { item, valueKey, forceUpdate, defaultValue = "", value: propsValue, ...inputProsp } = props
	const [value, setValue] = useState(propsValue ? item[valueKey] === propsValue : item[valueKey])
	const onChange = useCallback(
		(e: CheckboxChangeEvent) => {
			setValue(e.target.checked)
			item[valueKey] = propsValue ? (e.target.checked ? propsValue : defaultValue) : e.target.checked
			forceUpdate && forceUpdate()
		},
		[defaultValue, forceUpdate, item, valueKey, propsValue]
	)
	useEffect(() => {
		setValue(propsValue ? item[valueKey] === propsValue : item[valueKey])
	}, [item, valueKey, propsValue])
	return <Checkbox checked={value} onChange={onChange} {...inputProsp} />
}

const ItemCheckBox = useMini(_ItemCheckBox)
export default ItemCheckBox
