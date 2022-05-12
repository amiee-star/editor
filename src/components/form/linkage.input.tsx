import { InputNumber, InputNumberProps, Button } from "antd"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import transformFunc from "@/utils/transform.func"
import { useMini } from "@/utils/use.func"
import { LinkOutlined, DisconnectOutlined } from "@ant-design/icons"
interface Props extends InputNumberProps {
	item: any
	field?: string
	howmany?: number
	forceUpdate?: Function
	defaultValue?: number
	transform?: keyof typeof transformFunc
	onVal?: any
}
const _LinkageInput: React.FC<Props> = props => {
	const { item, forceUpdate, defaultValue, transform, field, onVal, howmany, ...numberProps } = props
	const realItem = useMemo(() => {
		return field ? item[field] : item
	}, [field, item])
	const [link, setLink] = useState(true)
	const [linkScale, setLinkscale] = useState({
		scalef: realItem[0] && realItem[1] ? realItem[1] / realItem[0] : 1,
		scalec: realItem[0] && realItem[2] ? realItem[2] / realItem[0] : 1
	})
	const [value0, setValue0] = useState(transform ? transformFunc[transform](realItem[0], "in") : realItem[0])

	const [value1, setValue1] = useState(transform ? transformFunc[transform](realItem[1], "in") : realItem[1])

	const [value2, setValue2] = useState(transform ? transformFunc[transform](realItem[2], "in") : realItem[2])
	const onChange0 = useCallback(
		(e, mands) => {
			if (e === undefined || e === null) {
				e = defaultValue
			}
			if (mands === "master") {
				if (!link) {
					setValue0(e)
					setLinkscale({
						scalef: realItem[0] && realItem[1] ? realItem[1] / realItem[0] : 1,
						scalec: realItem[0] && realItem[2] ? realItem[2] / realItem[0] : 1
					})
				} else {
					setValue0(e)
					onChange1(e * linkScale.scalef, "")
					onChange2(e * linkScale.scalec, "")
				}
			} else {
				setValue0(e)
			}

			realItem[0] = transform ? transformFunc[transform](e, "out") : e
			if (field) {
				//某些修改需要传入整个对象才能生效
				item[field] = { ...realItem }
			}
			forceUpdate && forceUpdate()
		},
		[defaultValue, forceUpdate, transform, item, field, link, linkScale]
	)
	const onChange1 = useCallback(
		(e, mands) => {
			if (e === undefined || e === null) {
				e = defaultValue
			}
			if (mands === "master") {
				if (!link) {
					setValue1(e)
					setLinkscale({
						scalef: realItem[0] && realItem[1] ? realItem[1] / realItem[0] : 1,
						scalec: realItem[0] && realItem[2] ? realItem[2] / realItem[0] : 1
					})
				} else {
					setValue1(e)
					onChange0(e / linkScale.scalef, "")
					onChange2((e / linkScale.scalef) * linkScale.scalec, "")
				}
			} else {
				setValue1(e)
			}
			realItem[1] = transform ? transformFunc[transform](e, "out") : e
			if (field) {
				//某些修改需要传入整个对象才能生效
				item[field] = { ...realItem }
			}
			forceUpdate && forceUpdate()
		},
		[defaultValue, forceUpdate, transform, item, field, link, linkScale]
	)
	const onChange2 = useCallback(
		(e, mands) => {
			if (e === undefined || e === null) {
				e = defaultValue
			}
			if (mands === "master") {
				if (!link) {
					setValue2(e)
					setLinkscale({
						scalef: realItem[0] && realItem[1] ? realItem[1] / realItem[0] : 1,
						scalec: realItem[0] && realItem[2] ? realItem[2] / realItem[0] : 1
					})
				} else {
					setValue2(e)
					onChange0(e / linkScale.scalec, "")
					onChange1((e / linkScale.scalec) * linkScale.scalef, "")
				}
			} else {
				setValue2(e)
			}
			realItem[2] = transform ? transformFunc[transform](e, "out") : e
			if (field) {
				//某些修改需要传入整个对象才能生效
				item[field] = { ...realItem }
			}
			forceUpdate && forceUpdate()
		},
		[defaultValue, forceUpdate, transform, item, field, link, linkScale]
	)
	const changeLink = useCallback(() => {
		setLink(!link)
		setLinkscale({
			scalef: realItem[0] && realItem[1] ? realItem[1] / realItem[0] : 1,
			scalec: realItem[0] && realItem[2] ? realItem[2] / realItem[0] : 1
		})
	}, [link, linkScale])
	useEffect(() => setData0(), [item, transform, field])
	const setData0 = useCallback(() => setValue0(transform ? transformFunc[transform](realItem[0], "in") : realItem[0]), [
		item,
		field,
		transform
	])
	useEffect(() => setData1(), [item, transform, field])
	const setData1 = useCallback(() => setValue1(transform ? transformFunc[transform](realItem[1], "in") : realItem[1]), [
		item,
		field,
		transform
	])
	useEffect(() => setData2(), [item, transform, field])
	const setData2 = useCallback(() => setValue2(transform ? transformFunc[transform](realItem[2], "in") : realItem[2]), [
		item,
		field,
		transform
	])
	useEffect(() => {
		if ("onVal" in props) {
			setData0()
			setData1()
			setData2()
		}
	}, [onVal])

	// return <InputNumber value={value} onChange={onChange} {...numberProps} />

	return (
		<div className="linkInput">
			<InputNumber
				value={value0}
				onChange={e => {
					onChange0(e, "master")
				}}
				formatter={value => `长 ${value}`}
				{...numberProps}
			/>
			<br />
			<InputNumber
				value={value2}
				onChange={e => {
					onChange2(e, "master")
				}}
				formatter={value => `高 ${value}`}
				{...numberProps}
			/>
			<br />
			{/* {howmany === 3 && ( */}
			<InputNumber
				value={value1}
				onChange={e => {
					onChange1(e, "master")
				}}
				formatter={value => `宽 ${value}`}
				{...numberProps}
			/>
			{/* )} */}
			<div className="linkInputicon">
				{!!link && <Button type="link" size="small" onClick={changeLink} icon={<LinkOutlined />} />}
				{!link && <Button type="link" size="small" onClick={changeLink} icon={<DisconnectOutlined />} />}
			</div>
		</div>
	)
}

const LinkageInput = useMini(_LinkageInput)
export default LinkageInput
