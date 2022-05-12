import { Col, InputNumber, InputNumberProps, Row, Switch } from "antd"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import transformFunc from "@/utils/transform.func"
import { useMini } from "@/utils/use.func"
interface Props extends InputNumberProps {
	item: any
	valueKey: string
	forceUpdate?: Function
	defaultValue?: number
	transform?: keyof typeof transformFunc
	type?: string
}
const _ScaleNumber: React.FC<Props> = props => {
	const { item, valueKey, forceUpdate, defaultValue, transform, type, ...numberProps } = props
	const [value, setValue] = useState(item[valueKey])
	const [lock, setLuck] = useState(false)
	const [panelValue, setPanelValue] = useState({
		x: value[0] * 1000,
		y: value[1] * 1000,
		z: value[2] * 1000
	})
	const [lockScale, setLockScale] = useState({
		y: value[1] / value[0],
		z: value[2] / value[0]
	})
	useEffect(() => {
		setValue([panelValue.x / 1000, panelValue.y / 1000, panelValue.z / 1000])
	}, [panelValue, item, valueKey])
	useEffect(() => {
		setLockScale({
			y: value[1] / value[0],
			z: value[2] / value[0]
		})
	}, [value])
	const onChange = useCallback(
		(key: string) => (e: number) => {
			if (lock) {
				const xValue = key === "y" ? e / lockScale.y : key === "z" ? e / lockScale.z : e
				const objValue = {
					x: xValue,
					y: xValue * lockScale.y,
					z: xValue * lockScale.z
				}
				if (
					Math.min(objValue.x, objValue.y, objValue.z) >= 50 &&
					Math.max(objValue.x, objValue.y, objValue.z) <= 20000
				) {
					setPanelValue(objValue)
				}
			} else {
				setPanelValue({ ...panelValue, [key]: e })
			}
			item[valueKey] = [panelValue.x / 1000, panelValue.y / 1000, panelValue.z / 1000]
			forceUpdate && forceUpdate()
		},
		[defaultValue, forceUpdate, valueKey, item, lockScale, panelValue, lock]
	)
	const switchChange = useCallback(checked => {
		setLuck(checked)
	}, [])
	// 长0  高1 宽2
	// 高 0 宽1
	return (
		<>
			<Row gutter={[0, 10]} align="middle">
				<Col span={24} className="flex-cn">
					<Switch checked={lock} onChange={switchChange} size="small" />
				</Col>
			</Row>
			<Row gutter={16}>
				<Col span={type === "PIC" ? 12 : 8} className="flex-cn">
					<Row gutter={2}>
						<Col span={4} className="flex-cn">
							{type === "PIC" ? "高" : "长"}
						</Col>
						<Col span={14} className="flex-cn">
							<InputNumber value={panelValue.x} onChange={onChange("x")} {...numberProps} />
						</Col>
						<Col span={6} className="flex-cn">
							mm
						</Col>
					</Row>
				</Col>
				<Col span={8} className="flex-cn">
					<Row gutter={2}>
						<Col span={4} className="flex-cn">
							{type === "PIC" ? "宽" : "高"}
						</Col>
						<Col span={14} className="flex-cn">
							<InputNumber value={panelValue.y} onChange={onChange("y")} {...numberProps} />
						</Col>
						<Col span={6} className="flex-cn">
							mm
						</Col>
					</Row>
				</Col>
				{type !== "PIC" && (
					<>
						<Col span={type === "PIC" ? 12 : 8} className="flex-cn">
							<Row gutter={2}>
								<Col span={4} className="flex-cn">
									宽
								</Col>
								<Col span={14} className="flex-cn">
									<InputNumber value={panelValue.z} onChange={onChange("z")} {...numberProps} />
								</Col>
								<Col span={6} className="flex-cn">
									mm
								</Col>
							</Row>
						</Col>
					</>
				)}
			</Row>
		</>
	)
}

const ScaleNumber = useMini(_ScaleNumber)
export default ScaleNumber
