import { PageProps } from "@/interfaces/app.interface"
import serviceAnimation from "@/services/service.animation"
import { groupBy } from "lodash"
import React, { useCallback, useContext, useEffect, useMemo, useRef } from "react"
import { useEditHook } from "../jmk/jmk.engine"
import { aniContext, aniItem } from "../provider/ani.context"
import { JMKContext } from "../provider/jmk.context"
import Grow from "../transitions/grow"
import FixedUI from "../utils/flexd.ui"
import AssetAni from "./asset.ani"
import ConfigAni from "./config.ani"
import TimeLineAni from "./timeline.ani"
interface trackData {
	time: number
	value: any
}
interface trackItem {
	aid: string
	type: string
	data: trackData[]
}
// 动画编辑器主面板
const MainAni: React.FC = (props: PageProps) => {
	const { state: ANI, dispatch: aniAction } = useContext(aniContext)
	const { state: JMK } = useContext(JMKContext)
	const JMKHook = useEditHook()
	//加载已保存动画
	useEffect(() => {
		serviceAnimation.animation(JMK.sceneName).then(res => {
			if (res.code === "200") {
				const aniList: aniItem[] = JMKHook.loadAnimations(res.data)
				const tackList: trackItem[] = []
				let sample = 60
				res.data.forEach(item => {
					const { channels, sampleFrame, samplers } = item
					sample = sampleFrame
					channels
						.filter(item => aniList.map(m => m.name).includes(item.target.node))
						.forEach(c => {
							const { sampler, target } = c
							const trackData: trackItem = { aid: target.node, type: target.path, data: [] }
							if (target.path == "quaternion") {
								samplers[sampler].input.forEach((i, index) => {
									trackData.data.push({
										time: Math.ceil(i * sampleFrame),
										value: samplers[sampler].output.slice(4 * index, 4 * (index + 1))
									})
								})
							} else {
								samplers[sampler].input.forEach((i, index) => {
									trackData.data.push({
										time: Math.ceil(i * sampleFrame),
										value: samplers[sampler].output.slice(3 * index, 3 * (index + 1))
									})
								})
							}
							tackList.push(trackData)
						})
				})
				aniOld.current = [...aniList]
				aniAction({
					type: "set",
					payload: {
						aniList: [...aniList],
						tackList,
						selectAni: aniList ? aniList[0] : null,
						sample
					}
				})
			}
		})
	}, [])

	//!!与引擎的交互集合start
	const tackOld = useRef<trackItem[]>([...ANI.tackList])
	const aniOld = useRef<aniItem[]>([...ANI.aniList])
	const sampleOld = useRef(ANI.sample)
	const modelOld = useRef(ANI.model)
	useEffect(() => {
		if (
			JSON.stringify(ANI.tackList) !== JSON.stringify(tackOld.current) ||
			sampleOld.current !== ANI.sample ||
			modelOld.current !== ANI.model ||
			(ANI.aniList.length && aniOld.current.length !== ANI.aniList.length)
		) {
			aniOld.current.forEach(item => {
				const hasTack = ANI.tackList.find(t => t.aid === item.name)
				hasTack ? item.channels.splice(0, item.channels.length) : JMKHook.removeAnimation(item)
			})
			ANI.aniList.forEach(item => {
				const tackData = ANI.tackList.filter(m => m.aid === item.name && m.type !== "fix")
				if (tackData.length) {
					tackData.forEach(m => {
						item.addChannel(
							m.type,
							m.data.map(d => d.time / ANI.sample),
							m.data.map(d => d.value).flat(Infinity)
						)
					})
				}
			})
			tackOld.current = JSON.parse(JSON.stringify(ANI.tackList))
			aniOld.current = [...ANI.aniList]
			sampleOld.current = ANI.sample
			modelOld.current = ANI.model
		}
	}, [ANI])
	//!!与引擎的交互集合

	const playTime = useRef(0)
	// 开始播放
	const PlayCallback = useCallback(
		e => {
			if (e.deltaTime >= 0 && !e.isJumpTo) {
				playTime.current = e.time
				let time: number
				time = 0
				if (ANI.model === "2202") {
					const timeData = ANI.tackList
						.filter(m => m.type !== "fix" && m.aid === ANI.selectAni.name)
						.map(m => m.data)
						.flat(1)
						.map(m => m.time)

					time =
						playIndex.current % 2
							? Math.floor(playTime.current * ANI.sample)
							: Math.max(...timeData) - Math.floor(playTime.current * ANI.sample)
				} else {
					time = Math.floor(playTime.current * ANI.sample)
				}

				aniAction({
					type: "set",
					payload: {
						time
					}
				})
			}
		},
		[ANI]
	)
	// 播放结束
	const FinishedCallback = useCallback(
		e => {
			playTime.current = 0
			playIndex.current = 0
			// JMKHook.animationStop(ANI.selectAni?.asset)
			aniAction({
				type: "set",
				payload: {
					isPlay: false
				}
			})
		},
		[ANI]
	)

	useEffect(() => {
		// !!ANI.isPlay && JMKHook.animationPlay(ANI.selectAni?.asset, Number(ANI.model))
		!!ANI.isPlay
			? JMKHook.animationPlay(ANI.selectAni?.asset, Number(ANI.model))
			: (JMKHook.animationStop(ANI.selectAni?.asset), (playIndex.current = 0))
	}, [ANI.isPlay, ANI.model])
	const playIndex = useRef(0)
	useEffect(() => {
		if (JMK.editHook) {
			JMKHook.setAnimationPlayCallback(PlayCallback)
			JMKHook.setAnimationFinishedCallback(FinishedCallback)
			JMKHook.setAnimationLoopEndCallback((e: any) => {
				++playIndex.current
			})
		}
	}, [JMK, ANI])
	return (
		<>
			<FixedUI left={0} bottom={0}>
				<Grow in={ANI.assetShow} unmountOnExit={false}>
					<AssetAni />
				</Grow>
			</FixedUI>
			<TimeLineAni />
			<FixedUI right={0} bottom={0}>
				<Grow in={!!ANI.selectAni} unmountOnExit={false}>
					<ConfigAni />
				</Grow>
			</FixedUI>
		</>
	)
}

export default MainAni
