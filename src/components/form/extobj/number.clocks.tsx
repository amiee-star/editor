import transformFunc from "@/utils/transform.func"
import { useMini } from "@/utils/use.func"
import { DisconnectOutlined, LinkOutlined } from "@ant-design/icons"
import { Button, Form, InputNumber, InputNumberProps } from "antd"
import { useForm } from "antd/es/form/Form"
import classNames from "classnames"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FormattedMessage } from "umi"
import "./number.clocks.less"
interface Props<T = any> extends Omit<InputNumberProps, "onChange"> {
	item: T
	keyNames: (keyof T)[]
	labels?: { [key: string]: string | JSX.Element }
	field?: string
	forceUpdate?: Function
	transform?: keyof typeof transformFunc
	withLock?: boolean
	reset?: (event?: any) => void
}
const _NumberClocks: React.FC<Props> = props => {
	const { item, keyNames, field, forceUpdate, transform, withLock, min, max, labels, reset, ...inputProps } = props
	const realItem = useMemo(() => (field ? item[field] : item), [item, field])

	const [form] = useForm()
	const [lock, setLock] = useState(!!withLock)
	const baseVal = useRef(realItem[keyNames[0]])
	const ratioRef = useRef<number[]>(keyNames.map(k => realItem[k] / baseVal.current))
	const mathVal = useCallback(
		(itemData: any, allData: any) => {
			const currentKey = Object.keys(itemData)[0]
			keyNames.forEach((k: string, i) => {
				allData[k] = k === currentKey ? Number(itemData[k]) : ratioRef.current[i] * allData[currentKey]
			})

			return allData
		},
		[keyNames]
	)
	const onValuesChange = useCallback(
		data => {
			if (
				form
					.getFieldsError()
					.map(m => m.errors.length)
					.includes(1)
			) {
				return false
			}
			for (const key in data) {
				data[key] = Number(data[key])
			}
			const currentVal = form.getFieldsValue()
			let realVal = Object.assign(Object.create(currentVal), currentVal)
			if (lock) {
				realVal = mathVal(data, realVal)
				form.setFields(keyNames.map((k: string) => ({ name: k, value: realVal[k] || min || 0 })))
			}
			if (field) {
				item[field] = transform ? transformItems(realVal, "out") : realVal
			}
		},
		[form, field, keyNames, transform, lock]
	)
	const toggleLock = useCallback(() => setLock(!lock), [lock])
	const onFocus = useCallback(
		(key: string) => () => {
			const currentVal = form.getFieldsValue()
			baseVal.current = currentVal[key]
			ratioRef.current = keyNames.map(k => {
				return Number(currentVal[k]) / Number(baseVal.current)
			})
		},
		[keyNames, form]
	)
	const transformItems = useCallback(
		(data: any, type: "in" | "out") => {
			const newData = Object.assign(Object.create(data), data)
			for (const key in newData) {
				newData[key] = transform ? transformFunc[transform](newData[key], type) : newData[key]
			}
			return newData
		},
		[keyNames, transform]
	)

	useEffect(() => {
		if (item[field]) {
			form.setFieldsValue(transformItems(item[field], "in"))
		}
	}, [item[field]])
	return (
		<div id="NumberClocks">
			<Form form={form} onValuesChange={onValuesChange} initialValues={transformItems(realItem, "in")}>
				{Object.keys(realItem).map((key: string) => {
					return (
						<Form.Item
							hidden={!keyNames.includes(key)}
							label={(!!labels && labels[key]) || ""}
							name={key}
							key={key}
							rules={[
								{
									type: "number",
									min: !min && min != 0 ? Infinity : Number(min),
									max: !max && max != 0 ? Infinity : Number(max),
									message: <FormattedMessage id="jmk.size.dataerror" />
								}
							]}
						>
							<InputNumber {...inputProps} min={min} max={max} onFocus={onFocus(key)} />
						</Form.Item>
					)
				})}
			</Form>
			{!!withLock && (
				<div className="fix-ui">
					<div className="btn-clock">
						<Button
							size="small"
							type="link"
							onClick={toggleLock}
							icon={lock ? <DisconnectOutlined /> : <LinkOutlined />}
						/>
					</div>
					{keyNames.map((m: string) => (
						<div
							className={classNames({
								"fix-line": true,
								show: lock
							})}
							key={m}
						/>
					))}
				</div>
			)}
			{!!reset && (
				<div>
					<Button size="small" type="primary" ghost onClick={reset}>
						<FormattedMessage id="jmk.size.Resetsize" />
					</Button>
				</div>
			)}
		</div>
	)
}
const NumberClocks = useMini(_NumberClocks)
export default NumberClocks
