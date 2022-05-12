import MainAni from "@/components/animation/main.ani"
import JMKEngine from "@/components/jmk/jmk.engine"
import LoadingUI from "@/components/jmkui/loading.ui"
import MinMapUI from "@/components/jmkui/minmap.ui"
import TourUI from "@/components/jmkui/tour.ui"
import CenterTopMenus from "@/components/menus/centerTop.menus"
import LeftMenus from "@/components/menus/left.menus"
import LeftPanel from "@/components/panel/left.panel"
import RightPanel from "@/components/panel/right.panel"
import { JMKContext } from "@/components/provider/jmk.context"
import FixedUI from "@/components/utils/flexd.ui"
import { PageProps } from "@/interfaces/app.interface"
import { coverData } from "@/interfaces/jmt.interface"
import serviceLocal from "@/services/service.local"
import lsFunc from "@/utils/ls.func"
import urlFunc from "@/utils/url.func"
import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import "./index.less"
const EditorIndex = (props: PageProps) => {
	const [data, setData] = useState<coverData>(null)
	const { state, dispatch } = useContext(JMKContext)
	const realSceneName = useRef<string>("")
	useEffect(() => {
		const { sceneName, token } = props.location.query
		if (!!sceneName) lsFunc.setItem("sceneName", sceneName.toString())
		if (token) lsFunc.setItem("accessToken", token.toString())
		if (sceneName) {
			realSceneName.current = sceneName.toString()
			serviceLocal.baseScene(realSceneName.current).then(base => {
				if (base.data.check == 2) window.location.href = "https://www.baidu.com"
				Promise.all([serviceLocal.cover(base.data.tempId)]).then(([cover]) => {
					setData(cover.data)
					dispatch({
						type: "set",
						payload: {
							baseInfo: base.data
						}
					})
				})
			})
		}
	}, [])
	return (
		<>
			{data && state.baseInfo && (
				<JMKEngine
					edit
					coverData={data}
					dataUrl={urlFunc.replaceUrl(`/3d/${state.baseInfo.sceneId}/`, "obs")}
					sceneName={realSceneName.current}
				/>
			)}

			<FixedUI left="50%" top="50%">
				<LoadingUI />
			</FixedUI>
			<FixedUI bottom={0} left={0} action="edit" unmountOnExit={false}>
				<TourUI />
			</FixedUI>
			<FixedUI top={0} right={0} action="edit" unmountOnExit={false}>
				<MinMapUI />
			</FixedUI>
			<FixedUI left="50%" top={20} action="edit" unmountOnExit={false}>
				<CenterTopMenus />
			</FixedUI>
			<FixedUI left={0} top={0} action="edit" unmountOnExit={false}>
				<LeftMenus />
			</FixedUI>

			<FixedUI left={60} top={0} action="edit" unmountOnExit={false}>
				<LeftPanel />
			</FixedUI>
			<FixedUI right="0" top="0">
				<RightPanel />
			</FixedUI>
			<FixedUI left={0} bottom={0} model="ani">
				<MainAni />
			</FixedUI>
		</>
	)
}

export default EditorIndex
