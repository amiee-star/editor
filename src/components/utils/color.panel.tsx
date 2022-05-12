import { SketchPicker, ColorResult } from "react-color"
import React, { useCallback, useEffect, useState } from "react"
import { Popover, Tag } from "antd"
import { useMini } from "@/utils/use.func"
interface Props {
	onChange?: (color: string) => void
	value?: string
}
const _ColorPanel: React.FC<Props> = props => {
	const { value, onChange } = props
	const [show, setShow] = useState(false)
	const [color, setColor] = useState(value)
	const onVisibleChange = useCallback((visible: boolean) => setShow(visible), [])
	const onChangeComplete = useCallback(
		(color: ColorResult) => {
			!!onChange && onChange(color.hex)
		},
		[onChange]
	)
	const colorChange = useCallback((color: ColorResult) => setColor(color.hex), [])
	useEffect(() => setColor(value), [value])
	return (
		<Popover
			placement="bottom"
			content={
				<div style={{ color: "#000" }}>
					<SketchPicker disableAlpha color={color} onChangeComplete={onChangeComplete} onChange={colorChange} />
				</div>
			}
			title=""
			trigger="click"
			visible={show}
			onVisibleChange={onVisibleChange}
		>
			<Tag
				style={{
					cursor: "pointer",
					minWidth: 65
				}}
				color={color}
			>
				{color || "null"}
			</Tag>
		</Popover>
	)
}
const ColorPanel = useMini(_ColorPanel)
export default ColorPanel
