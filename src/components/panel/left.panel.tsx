import React from "react"
import FixedUI from "../utils/flexd.ui"
import "./left.panel.less"
import GIFPanel from "./material/gif.panel"
import HotPanel from "./material/hot.panel"
import ImagePanel from "./material/image.panel"
// import ModelPanel from "./material/model.panel"
import TextPanel from "./material/text.panel"
import VideoPanel from "./material/video.panel"
import AnimationPanel from "./material/animation.panel"
// import RingPanel from "./material/ring.panel"
import MusicPanel from "./material/music.panel"

const LeftPanel: React.FC = () => {
	return (
		<div className="full" id="LeftPanel">
			<FixedUI model="material" current="IMAGE" unmountOnExit={false}>
				<ImagePanel />
			</FixedUI>
			<FixedUI model="material" current="GIF" unmountOnExit={false}>
				<GIFPanel />
			</FixedUI>
			<FixedUI model="material" current="VIDEO" unmountOnExit={false}>
				<VideoPanel />
			</FixedUI>
			<FixedUI model="material" current="MUSIC" unmountOnExit={false}>
				<MusicPanel />
			</FixedUI>
			{/* <FixedUI model="material" current="MODEL" unmountOnExit={false}>
				<ModelPanel />
			</FixedUI> */}
			{/* 环物图 */}
			{/* <FixedUI model="material" current="RING" unmountOnExit={false}>
				<RingPanel />
			</FixedUI> */}
			<FixedUI model="material" current="HOT" unmountOnExit={false}>
				<HotPanel />
			</FixedUI>
			<FixedUI model="material" current="TEXT" unmountOnExit={false}>
				<TextPanel />
			</FixedUI>
			<FixedUI model="material" current="EFFECT" unmountOnExit={false}>
				<AnimationPanel />
			</FixedUI>
		</div>
	)
}

export default LeftPanel
