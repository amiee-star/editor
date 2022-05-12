import { aniContext, trackItem } from "@/components/provider/ani.context"
import { PlusOutlined } from "@ant-design/icons"
import { Button, Dropdown, Menu } from "antd"
import React, { useCallback, useContext, useMemo, useRef } from "react"
import Draggable, { DraggableEventHandler } from "react-draggable"
import { MenuClickEventHandler } from "node_modules/rc-menu/lib/interface"
import { FormattedMessage } from "@/.umi/plugin-locale/localeExports"
//动画编辑器属性列表
const HeightControl: React.FC = () => {
	const { state: ANI, dispatch: aniAction } = useContext(aniContext)
	const domRef = useRef<HTMLDivElement>(null)
	const onDrag: DraggableEventHandler = useCallback(
		(e, data) => {
			aniAction({
				type: "set",
				payload: {
					layout: {
						...ANI.layout,
						topHeight: data.lastY
					}
				}
			})
		},
		[ANI.layout]
	)
	const configAdd: MenuClickEventHandler = useCallback(
		info => {
			if (ANI.selectAni) {
				const { key } = info
				const newTrack: trackItem = { aid: ANI.selectAni?.name, type: key.toString(), data: [] }
				// ANI.selectAni.addChannel(key.toString(), [], [])
				aniAction({
					type: "set",
					payload: {
						tackList: ANI.tackList.concat([newTrack])
					}
				})
			}
		},
		[ANI.selectAni, ANI.tackList]
	)
	const trackList = useMemo(() => {
		return ANI.tackList.filter(m => m.aid === ANI.selectAni?.name) || []
	}, [ANI.tackList, ANI.selectAni])
	return (
		<Draggable
			axis="y"
			handle=".control-y"
			defaultPosition={{ x: 0, y: ANI.layout.topHeight }}
			bounds={{ top: 60, bottom: domRef.current?.parentElement.offsetHeight - 30 }}
			onDrag={onDrag}
		>
			<div className="control control-y" ref={domRef}>
				<div
					className="node-config-title"
					style={{
						width: `${ANI.layout.leftWidth}px`
					}}
				>
					{<FormattedMessage id="jmk.animation.attributeList" />}
					<Dropdown
						trigger={["click"]}
						overlay={
							<Menu onClick={configAdd}>
								<Menu.Item key="position" disabled={trackList.map(m => m.type).includes("position")}>
									{<FormattedMessage id="jmk.animation.position" />}
								</Menu.Item>
								<Menu.Item key="quaternion" disabled={trackList.map(m => m.type).includes("quaternion")}>
									{<FormattedMessage id="jmk.animation.quaternion" />}
								</Menu.Item>
								<Menu.Item key="scale" disabled={trackList.map(m => m.type).includes("scale")}>
									{<FormattedMessage id="jmk.animation.scale" />}
								</Menu.Item>
							</Menu>
						}
					>
						<Button type="text" size="small" icon={<PlusOutlined />} />
					</Dropdown>
				</div>
			</div>
		</Draggable>
	)
}

export default HeightControl
