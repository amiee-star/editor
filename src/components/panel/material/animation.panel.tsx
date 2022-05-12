import { useEditHook } from "@/components/jmk/jmk.engine"
import { JMKContext } from "@/components/provider/jmk.context"
import { panelContext } from "@/components/provider/panel.context"
import eventBus from "@/utils/event.bus"
import { useMini } from "@/utils/use.func"
import { FlagOutlined, FireOutlined, DeploymentUnitOutlined, RocketOutlined } from "@ant-design/icons"
import { Row, Col, Button } from "antd"

import React, { useCallback, useContext } from "react"
import { FormattedMessage, useIntl } from "umi"

const _AnimationPanel: React.FC = () => {
	const Intl = useIntl()
	const { state: JMK } = useContext(JMKContext)
	const { state: Pannel, dispatch } = useContext(panelContext)
	const JMKHook = useEditHook()
	const onDragStart = useCallback(
		(contentType: number) => () => {
			JMKHook.addAsset({
				texture: window.publicPath + `image/fire/${contentType}.png`,
				contentType,
				type: 8
			}).then(e => {
				// e.extdata.info.custom.tag.title = item.name
				eventBus.emit("jmk.assetAdd", e.asset)
			})
		},
		[JMK]
	)
	const openAni = useCallback(() => {
		dispatch({
			type: "set",
			payload: {
				model: "ani",
				current: ""
			}
		})
	}, [])
	return (
		<div id="HotPanel" className="panel-box">
			<div className="list-box">
				<Row>
					<Col span={11}>
						<div className="item-box">
							<div className="item-pic">
								<FlagOutlined onDragStart={onDragStart(7)} draggable="true" style={{ fontSize: 80 }} />
								{/* <img
									onDragStart={onDragStart}
									draggable="true"
									src={window.publicPath + "image/fire/f.png"}
									width="100"
									height="100"
								/> */}
							</div>
							<div className="item-label">{<FormattedMessage id="jmk.addmaterial.Flag" />}</div>
						</div>
					</Col>
					<Col span={2}></Col>
					<Col span={11}>
						<div className="item-box">
							<div className="item-pic">
								<FireOutlined onDragStart={onDragStart(8)} draggable="true" style={{ fontSize: 80 }} />
								{/* <img
									onDragStart={onDragStart2}
									draggable="true"
									src={window.publicPath + "image/fire/f.png"}
									width="100"
									height="100"
								/> */}
							</div>
							<div className="item-label">{<FormattedMessage id="jmk.addmaterial.Flame" />}</div>
						</div>
					</Col>
					<Col span={11} style={{ margin: "16px 0 0 0" }}>
						<div className="item-box">
							<div className="item-pic">
								<RocketOutlined onDragStart={onDragStart(10)} draggable="true" style={{ fontSize: 80 }} />
								{/* <img
									onDragStart={onDragStart}
									draggable="true"
									src={window.publicPath + "image/fire/f.png"}
									width="100"
									height="100"
								/> */}
							</div>
							<div className="item-label">{<FormattedMessage id="jmk.addmaterial.beam" />}</div>
						</div>
					</Col>
					<Col span={24} style={{ bottom: 20, position: "absolute", width: "60%", left: "20%" }}>
						<Button onClick={openAni} block type="primary" size="middle" icon={<DeploymentUnitOutlined />}>
							{<FormattedMessage id="jmk.animation.openAnimationEditor" />}
						</Button>
					</Col>
				</Row>
			</div>
		</div>
	)
}

const AnimationPanel = useMini(_AnimationPanel)
export default AnimationPanel
