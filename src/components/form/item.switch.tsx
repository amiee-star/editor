import commonFunc from "@/utils/common.func"
import { useMini } from "@/utils/use.func"
import { Switch, SwitchProps } from "antd"
import React, { useCallback, useEffect, useState } from "react"

interface Props<T = {}> extends SwitchProps {
	item: T
	valueKey: string
	forceUpdate?: Function
	onChange?: (item?: T) => void
}

const _ItemSwitch: React.FC<Props<any>> = props => {
	const { item, valueKey, forceUpdate, onChange, ...SwitchProps } = props
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
	}, [item])
	return <Switch checked={value} onChange={onChangeSelf} {...SwitchProps} />
}

const ItemSwitch = useMini(_ItemSwitch)
export default ItemSwitch
