import { JMKContext } from "@/components/provider/jmk.context"
import ColorPanel from "@/components/utils/color.panel"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { useMini } from "@/utils/use.func"
import transformFunc from "@/utils/transform.func"

interface Props {
	item: any
	valueKey: string
	forceUpdate?: Function
	onChange?: (val?: any) => void
	transform?: keyof typeof transformFunc
}

const _ItemColor: React.FC<Props> = props => {
	const { item, valueKey, forceUpdate, transform, onChange } = props
	const [value, setValue] = useState(transform ? transformFunc[transform](item[valueKey], "in") : item[valueKey])
	const onChangeSelf = useCallback(
		e => {
			setValue(e)
			item[valueKey] = transform ? transformFunc[transform](e, "out") : e
			onChange && onChange(e)
			forceUpdate && forceUpdate()
		},
		[forceUpdate, item, valueKey, transform, onChange]
	)
	// useEffect(() => {
	// 	item[valueKey] = value
	// }, [value])
	useEffect(() => {
		setValue(transform ? transformFunc[transform](item[valueKey], "in") : item[valueKey])
	}, [item, transform, item, valueKey])
	return <ColorPanel value={value} onChange={onChangeSelf} />
}

const ItemColor = useMini(_ItemColor)
export default ItemColor
