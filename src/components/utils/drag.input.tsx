import { useMini } from "@/utils/use.func"
import { InputNumber, InputNumberProps } from "antd"
import { isNumber } from "lodash"
import React, { useCallback, useEffect } from "react"
import { useState } from "react"
import { useGesture } from "react-use-gesture"
import "./drag.input.less"
interface Props extends InputNumberProps {}
const _DragInput: React.FC<Props> = props => {
	const { value: propsVal, onBlur: propsBlur, onChange: propsChange, ...numberProps } = props
	const [model, setModel] = useState(0)
	const [value, setValue] = useState(Number(propsVal) || Number(numberProps.min) || 0)
	const onChange = useCallback(
		e => {
			setValue(e)
			propsChange && propsChange(e)
		},
		[propsChange]
	)
	const onBlur = useCallback(
		e => {
			setModel(0)
			propsBlur && propsBlur(e)
		},
		[propsBlur]
	)
	const dragEvent = useGesture(
		{
			onDrag: e => {
				if (numberProps.disabled) return
				const newVal =
					Number(value.toFixed(numberProps.precision)) + (e.values[0] - e.previous[0]) * (Number(numberProps.step) || 1)
				if (isNumber(numberProps.min) && newVal < numberProps.min) return
				if (isNumber(numberProps.max) && newVal > numberProps.max) return

				onChange(newVal)
			},
			onDoubleClick: () => {
				setModel(1)
			}
		},
		{
			eventOptions: { passive: false },
			drag: {
				rubberband: true,
				filterTaps: true
			}
		}
	)
	useEffect(() => setValue(Number(propsVal) || Number(numberProps.min) || 0), [propsVal])
	return (
		<div className="DragInput">
			<div className="drag-input" {...dragEvent()} hidden={!!model} />
			<InputNumber value={value} onChange={onChange} {...numberProps} onBlur={onBlur} />
		</div>
	)
}
const DragInput = useMini(_DragInput)
export default DragInput
