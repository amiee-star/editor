import { ExtData } from "@/interfaces/extdata.interface"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { Button, Col, Popover, Row, Space, Tabs, Typography } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { FormattedMessage, useIntl } from "umi"
import ItemCheckBox from "../item.checkbox"
import ItemSwitch from "../item.switch"
import NumberInput from "../number.input"
import "./modalSetting.less"
import serviceLocal from "@/services/service.local"
import urlFunc from "@/utils/url.func"
import ItemColor from "../item.color"
import { ModalCustom } from "@/components/modal/modal.context"
import ViewModal from "../../modal/viewer.modal"
interface Props {
	data: any
}
const _ModalSetting: React.FC<Props> = props => {
	const Intl = useIntl()
	const { data } = props
	const forceUpdate = useForceUpdate()
	const [currentSize, setCurrentSize] = useState("")
	const [newWidth, setNewWidth] = useState(0)
	const [newHeight, setNewHeight] = useState(0)
	const embeddedSizeList: any[] = [
		{
			val: Intl.formatMessage({ id: "jmk.addmaterial.embeddedSize960" }),
			width: 960,
			height: 540,
			boxWidth: 62,
			boxHeight: 35
		},
		{
			val: Intl.formatMessage({ id: "jmk.addmaterial.embeddedSize1280" }),
			width: 1280,
			height: 720,
			boxWidth: 76,
			boxHeight: 43
		},
		{
			val: Intl.formatMessage({ id: "jmk.addmaterial.embeddedSize1920" }),
			width: 1920,
			height: 1080,
			boxWidth: 96,
			boxHeight: 54
		}
	]
	useEffect(() => {
		setCurrentSize(
			!!data.custom.openWidthRatio
				? data.custom.openWidthRatio
				: Intl.formatMessage({ id: "jmk.addmaterial.embeddedSize1280" })
		)
	}, [])
	const changeEmbeddeSize = useCallback(
		item => () => {
			setCurrentSize(item.val)
			setNewWidth(item.width)
			setNewHeight(item.height)
			data.custom.openWidthRatio = item.val
			forceUpdate()
		},
		[data]
	)

	//设置透明度
	const handleTransparent = useCallback(
		item => () => {
			ModalCustom({
				content: ViewModal,
				params: {
					data: data,
					url: data.url,
					width: item.width,
					height: item.height
				}
			})
		},
		[currentSize, newWidth, newWidth]
	)
	return (
		<div id="modalSettingBox">
			<Space className="full-w" direction="vertical">
				<div className="embeddedSizeBox">
					{embeddedSizeList.map((item, index) => {
						return (
							<div key={item.index}>
								<div className="embeddedSize" onClick={changeEmbeddeSize(item)} key={item.index}>
									<div
										className="embeddedSizeColor"
										key={item.index}
										style={{
											width: item.boxWidth,
											height: item.boxHeight,
											backgroundColor: currentSize == item.val ? "#177DDC" : "#919191",
											position: "relative"
										}}
									>
										<span className="embeddedSizeVal" key={item.index}>
											{item.val}
										</span>
									</div>
								</div>
								<div
									className={currentSize == item.val ? "setTransparent" : "noTransparent"}
									onClick={handleTransparent(item)}
									key={item.index}
								>
									<span>{<FormattedMessage id="jmk.addmaterial.transparent" />}</span>
								</div>
							</div>
						)
					})}
				</div>
			</Space>
		</div>
	)
}

const ModalSetting = useMini(_ModalSetting)

export default ModalSetting
