import { useMini } from "@/utils/use.func"
import { Radio, RadioChangeEvent, RadioProps } from "antd"
import React, { useCallback, useEffect, useState } from "react"

interface Props extends RadioProps {
	item: any
	valueKey: string
	forceUpdate?: Function
  defaultValue?: string
  getChangeValue?:Function
}

const _ItemRadio: React.FC<Props> = props => {
	const { item, valueKey, forceUpdate, defaultValue, ...inputProsp } = props
	const [value, setValue] = useState(item[valueKey])
	const onChange = useCallback(
		(e: RadioChangeEvent) => {
			setValue(e.target.value)
      item[valueKey] = e.target.value
      props.getChangeValue(e.target.value)
      forceUpdate && forceUpdate()

		},
		[defaultValue, forceUpdate, item, valueKey]
	)
	useEffect(() => {
		setValue(item[valueKey])
	}, [item, valueKey])
	return <Radio.Group value={value} onChange={onChange} {...inputProsp} />
}

const ItemRadio = useMini(_ItemRadio)
export default ItemRadio
