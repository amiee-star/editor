import React from "react"
import FixedUI from "../utils/flexd.ui"
import BakePanel from "./jmk/bake.panel"
import LightporbesPanel from "./jmk/lightporbes.panel"
import LightsPanel from "./jmk/lights.panel"
import MaterialsPanel from "./jmk/materials.panel"
import SkyPanel from "./jmk/sky.panel"
import ViewerPanel from "./jmk/viewer.panel"
import MaterialListPanel from "./material/list/material.list.panel"
import ObjectsPanel from "./jmk/objects.panel"
import CameraPanel from "./jmk/camera.panel"
import "./right.panel.less"
import SetUpPanel from "./material/setup.panel"
import OutLineDrawer from "../panel/material/outLine/outLine.edit.panel"
import AddPositionPanel from "./material/position/position.add.panel"
import EditPositionPanel from "./material/position/position.edit.panel"
import ShowMaterialPanel from "./material/list/showMaterial.panel"
import PosiMaterialPanel from "./material/list/posiMaterial.panel"
const RightPanel: React.FC = () => {
	return (
		<div id="RightPanel">
			<FixedUI model="base" current="BAKE">
				<BakePanel />
			</FixedUI>
			<FixedUI model="base" current="LIGHTS">
				<LightsPanel />
			</FixedUI>
			<FixedUI model="base" current="LIGHTPORBES">
				<LightporbesPanel />
			</FixedUI>
			<FixedUI model="base" current="CAMERA">
				<CameraPanel />
			</FixedUI>

			<FixedUI model="base" current="SKY">
				<SkyPanel />
			</FixedUI>
			<FixedUI model="base" current="OBJECTS">
				<ObjectsPanel />
			</FixedUI>
			<FixedUI model="base" current="VIEWER">
				<ViewerPanel />
			</FixedUI>
			<FixedUI model="material">
				<MaterialListPanel />
			</FixedUI>
			<FixedUI model="material">
				<ShowMaterialPanel />
			</FixedUI>
			<FixedUI model="material">
				<PosiMaterialPanel />
			</FixedUI>
			<FixedUI model="base" current="MATERIALS">
				<MaterialsPanel />
			</FixedUI>
			<FixedUI model="material" current="SETUP" zIndex={2}>
				<SetUpPanel />
			</FixedUI>
			{/* 大纲 */}
			<FixedUI model="material" current="OUTLINE">
				<OutLineDrawer />
			</FixedUI>
			{/* 定位新增 */}
			{/* <FixedUI model="material" current="POSITION">
				<AddPositionPanel />
			</FixedUI> */}
			{/* 定位编辑 */}
			{/* <FixedUI model="material" current="POSITIONEDIY">
				<EditPositionPanel />
			</FixedUI> */}
		</div>
	)
}
export default RightPanel
