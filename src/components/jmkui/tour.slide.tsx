import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import { useForceUpdate, useMini } from "@/utils/use.func"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import ReactIdSwiper from "react-id-swiper"
import { ReactIdSwiperCustomProps } from "react-id-swiper/lib/types"

import "swiper/css/swiper.min.css"
import { useEditHook } from "../jmk/jmk.engine"
import { JMKContext } from "../provider/jmk.context"
import "./tour.slide.less"
interface Props {
	data: any[]
}
const _TourSlide: React.FC<Props> = props => {
	const { data } = props
	const { state } = useContext(JMKContext)
	const [current, setCurrent] = useState(null)
	const JMKHook = useEditHook()
	const swiperRef = useRef<ReactIdSwiperCustomProps & HTMLDivElement>()
	const teleportStarted = useCallback((e: any) => {
		setCurrent(e.view)
	}, [])
	const forceUpdate = useForceUpdate()
	useEffect(() => {
		if (state.editHook) {
			state.editHook.teleport.addEventListener("teleportDone", teleportStarted)
		}
	}, [state])
	const switchView = useCallback(
		view => () => {
			eventBus.emit("jmk.view.change", view)
			state.editHook.teleport.switchToView(view, 1)
		},
		[state]
	)
	useEffect(() => {
		eventBus.off("jmk.pic.change", forceUpdate).on("jmk.pic.change", forceUpdate)
		//!
		eventBus.off("jmk.showMenu.change", forceUpdate).on("jmk.showMenu.change", forceUpdate)
	}, [])

	return (
		<div id="TourSlide">
			{!!data.length && (
				<ReactIdSwiper rebuildOnUpdate ref={swiperRef} spaceBetween={10} slidesPerView="auto">
					{data.map((m, i) => {
						return (
							<div key={m.id}>
								<div
									className={classNames({
										full: true,
										"flex-cn": true,
										active: current ? m === current : !i
									})}
									onClick={switchView(m)}
								>
									<img src={m.thumb ? urlFunc.replaceUrl(m.thumb, "obs") : require("@/assets/image/none.png")} />
								</div>
							</div>
						)
					})}
				</ReactIdSwiper>
			)}
		</div>
	)
}

const TourSlide = useMini(_TourSlide)
export default TourSlide
