import { panelContext } from "@/components/provider/panel.context"
import React, { useCallback, useContext, useMemo } from "react"
import { JMKContext } from "@/components/provider/jmk.context"
import { Col, Row } from "antd"
import { contentType, materialType } from "@/constant/jmk.type"
import { useEditHook } from "@/components/jmk/jmk.engine"
import { useMini } from "@/utils/use.func"
import eventBus from "@/utils/event.bus"
import { FormattedMessage, useIntl } from "umi"

const _TextPanel: React.FC = () => {
	const Intl = useIntl()
	const { state: JMK } = useContext(JMKContext)
	const JMKHook = useEditHook()
	const onDragStart = useCallback(() => {
		JMKHook.addAsset({
			contentType: contentType.PIC,
			type: materialType.TEXT
		}).then(e => eventBus.emit("jmk.assetAdd", e.asset))
	}, [JMK])

	return (
		<div id="TextPanel" className="panel-box">
			<div className="list-box">
				<Row>
					<Col span={12}>
						<div className="item-box">
							<div className="item-pic">
								<img src={require("@/assets/image/text.png")} draggable="true" onDragStart={onDragStart} />
							</div>
							<div className="item-label">{<FormattedMessage id="jmk.addmaterial.Texttemplate" />}</div>
						</div>
					</Col>
				</Row>
			</div>
		</div>
	)
}

const TextPanel = useMini(_TextPanel)
export default TextPanel
