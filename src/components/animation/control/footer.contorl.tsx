import { aniContext, aniItem } from "@/components/provider/ani.context"
import { Space, Select, InputNumber, message } from "antd"
import { useForceUpdate } from "@/utils/use.func"
import React, { useCallback, useContext, useEffect, useState } from "react"

// 动画编辑器底部
const FooterControl: React.FC = () => {
	const { state: ANI, dispatch: aniAction } = useContext(aniContext)
	const [ currentAni, setCurrentAni ] = useState<object & aniItem>(null)
	const forceUpdate = useForceUpdate()

	useEffect(() => {
		setCurrentAni(ANI.selectAni)
	}, [ANI.selectAni])

	const loopChange = useCallback(
		val => {
			if(!!currentAni){
				currentAni.loop = val;
			}
			forceUpdate();
		},
		[currentAni]
	)

	// 改变modelChange
	const modelChange = useCallback(
		val => {
			const num = ANI.tackList.find(item => item.data.length > 1)
			if (num) {
				aniAction({
					type: "set",
					payload: {
						model: val
					}
				})
			} else {
				message.error("请先编辑动画！")
			}
		},
		[ANI.tackList]
	)
	// 改变sample
	const sampleChange = useCallback((val: number) => {
		aniAction({
			type: "set",
			payload: {
				sample: val
			}
		})
	}, [])
	// 改变speed
	const speedChange = useCallback((val: number) => {
		aniAction({
			type: "set",
			payload: {
				speed: val
			}
		})
	}, [])
	return (
		<>
			<Space direction="horizontal">
				<span>WrapModel</span>
				<Select dropdownMatchSelectWidth={false} size="small" value={'' + currentAni?.loop} onChange={loopChange}>
					{/* <Select.Option value="default">Default</Select.Option> */}
					<Select.Option value="2200">Normal</Select.Option>
					<Select.Option value="2201">Loop</Select.Option>
					<Select.Option value="2202">Pingpong</Select.Option>
					{/* <Select.Option value="reverse">Reverse</Select.Option>
					<Select.Option value="loopreverse">LoopReverse</Select.Option> */}
				</Select>
			</Space>
			<Space direction="horizontal" size="middle">
				<Space direction="horizontal">
					<span>Sample</span>
					<InputNumber size="small" precision={0} min={1} value={ANI.sample} onChange={sampleChange} />
				</Space>
				<Space direction="horizontal">
					<span>Speed</span>
					<InputNumber size="small" precision={0} min={1} value={ANI.speed} onChange={speedChange} />
				</Space>
			</Space>
		</>
	)
}

export default FooterControl
