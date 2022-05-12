import { aniContext } from "@/components/provider/ani.context"
import { Dropdown, Menu, Space } from "antd"
import React, { useCallback, useContext, useMemo } from "react"
import { groupBy } from "lodash"
import classNames from "classnames"
import { MenuUnfoldOutlined } from "@ant-design/icons"
import { useEditHook } from "@/components/jmk/jmk.engine"
const NodeConfigList: React.FC = () => {
  const { state: ANI, dispatch: aniAction } = useContext(aniContext)
  const JMKHook = useEditHook()
	const menu = useCallback(
		(key: string) => {
			return (
				<Menu>
					<Menu.Item onClick={removeProp(key)}>移除当前属性</Menu.Item>
					<Menu.Item onClick={copyProp(key)}>复制当前属性</Menu.Item>
					<Menu.Item onClick={removeFrame(key)}>清空关键帧</Menu.Item>
					{!!ANI.copyPropData && ANI.copyPropData.aid !== ANI.selectAni?.name && (
						<Menu.Item onClick={pasteProp(key)}>粘贴属性</Menu.Item>
					)}
				</Menu>
			)
		},
		[ANI.copyPropData, ANI.selectAni, ANI.tackList, ANI.layout]
	)
	const currentTackList = useMemo(() => {
		return groupBy(ANI.tackList.filter(m => m.aid === ANI.selectAni?.name && m.type !== "fix") || [], m => {
			return m.type
		})
	}, [ANI.tackList, ANI.selectAni])
	const selectType = useCallback(
		(type: string) => () => {
			aniAction({
				type: "set",
				payload: {
					selectCofType: type
				}
			})
		},
		[]
	)
	// 移除当前属性
	const removeProp = useCallback(
		type => () => {
      ANI.tackList = ANI.tackList.filter(m=>m !== currentTackList[type][0])
			ANI.selectTack = null
			ANI.selectCofType = ""
			aniAction({
				type: "set",
				payload: ANI
			})
		},
		[ANI.tackList, ANI.selectAni, ANI.layout]
  )
	// 清空关键帧
	const removeFrame = useCallback(
		type => () => {
      // JMKHook.setAnimationFinishedCallback(FinishedCallback)
      JMKHook.animationStop(ANI.selectAni?.asset)
			currentTackList[type][0].data = []
			aniAction({
				type: "set",
				payload: ANI
      })
		},
		[ANI.copyPropData, ANI.selectAni, ANI.tackList, ANI.layout]
  )
  // 播放结束
	const FinishedCallback = useCallback(
		e => {
			// playTime.current = 0
			// playIndex.current = 0
			aniAction({
				type: "set",
				payload: {
					isPlay: false
				}
			})
		},
		[ANI]
	)

	// 复制当前属性
	const copyProp = useCallback(
		type => () => {
			ANI.copyPropData = JSON.parse(JSON.stringify(currentTackList[type][0]))
			aniAction({
				type: "set",
				payload: ANI
			})
		},
		[ANI]
	)

	// 粘贴属性
	const pasteProp = useCallback(
		type => () => {
			if (type === ANI.copyPropData.type) {
				const currentTackItem = ANI.tackList.filter(m => m.aid === ANI.selectAni?.name && m.type == type)[0]
				currentTackItem.data = ANI.copyPropData.data
				aniAction({
					type: "set",
					payload: ANI
				})
			}
		},
		[ANI]
	)

	const frameAction = useCallback(
		(type: string) => () => {
			let trackData = currentTackList[type][0].data
			const hasData = trackData.find(m => m.time === ANI.time)
			const currentTrack = ANI.tackList.filter(m => m.aid === ANI.selectAni?.name && m.type === type)
			// const currentChannel = ANI.selectAni.channels.find(m => m.path === type)
			if (hasData) {
				trackData = trackData.filter(m => m.time !== ANI.time)
				// const timeIndex = currentChannel.times.findIndex(time => time === ANI.time / ANI.sample)
				// currentChannel.times = currentChannel.times.splice(timeIndex, 1)
				// currentChannel.values = currentChannel.values.splice(timeIndex, 1)
			} else {
				const value = ANI.selectAni.asset[type].toArray()
				trackData = trackData.concat([{ time: ANI.time, value }])
				// currentChannel.times = currentChannel.times.concat([ANI.time / ANI.sample])
				// currentChannel.values = currentChannel.values.concat([...value])
			}
			currentTrack[0].data = trackData
			aniAction({
				type: "set",
				payload: ANI
			})
		},
		[ANI]
	)
	return (
		<div className="node-config-list">
			{Object.keys(currentTackList).map(m => {
				return (
					<Dropdown overlay={menu(m)} key={m} trigger={["contextMenu"]}>
						<div
							onClick={selectType(m)}
							className={classNames({
								"config-item": true,
								selected: ANI.selectCofType === m
							})}
						>
							{m}
							<Space direction="horizontal" align="center" className="config-ext">
								<i
									onClick={frameAction(m)}
									className={classNames({
										frame: true,
										plus: currentTackList[m][0]?.data.find(m => m.time === ANI.time)
									})}
								/>
								<Dropdown overlay={menu(m)} key={m} trigger={["click"]}>
									<MenuUnfoldOutlined />
								</Dropdown>
							</Space>
						</div>
					</Dropdown>
				)
			})}
		</div>
	)
}

export default NodeConfigList
