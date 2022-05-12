import ItemCheckBox from "@/components/form/item.checkbox"
import ItemColor from "@/components/form/item.color"
import ItemRadio from "@/components/form/item.radio"
import ItemSlider from "@/components/form/item.slider"
import NumberInput from "@/components/form/number.input"
import OpationSelect from "@/components/form/select"
import TextInput from "@/components/form/text.input"
import TextAreaInput from "@/components/form/textarea.input"
import { assetData } from "@/interfaces/extdata.interface"
import commonFunc from "@/utils/common.func"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { AlignLeftOutlined, AlignRightOutlined, AlignCenterOutlined } from "@ant-design/icons"
import { Radio, Space, Typography } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { FormattedMessage, useIntl } from "umi"
import eventBus from "@/utils/event.bus"
import { JMKContext } from "@/components/provider/jmk.context"
interface Props {
	data: assetData
}

const _TextEditPanel: React.FC<Props> = props => {
	const Intl = useIntl()
	const { data } = props
	const forceUpdate = useForceUpdate()
	const changeValue = useCallback(e => {
		eventBus.emit("jmk.name.change")
	}, [])
	// 相机位列表
	const { state } = useContext(JMKContext)
	const viewsList: any[] = useMemo(() => state.editHook?.getViews() || [], [state.editHook])
	const [selectList, setSelectList] = useState([])
	useEffect(() => {
		if (viewsList) {
			let viewObjList: any[] = []
			let idList: any[] = []
			viewsList.forEach(item => {
				viewObjList.push({ label: item.name, value: item.id })
				idList.push(item.id)
			})
			setSelectList(viewObjList)
			data.hideInViews.forEach((item, index) => {
				if (idList.indexOf(item) === -1) {
					data.hideInViews.splice(index, 1)
				}
			})
		}
	}, [viewsList])
	return (
		<div id="TextEditPanel">
			<Space className="full-w" direction="vertical">
				<Space className="full-w" direction="vertical">
					<Space direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.title" />}：</Typography.Text>
						<Typography.Text type="secondary">
							{!!data.extdata.info.custom.tag.title ? data.extdata.info.custom.tag.title.length : 0}/30
						</Typography.Text>
					</Space>
					<div>
						<TextInput
							item={data.extdata.info.custom.tag}
							valueKey="title"
							maxLength={30}
							changeValue={changeValue}
							forceUpdate={forceUpdate}
						/>
					</div>
				</Space>
				<Space className="full-w" direction="vertical">
					<Space className="full-w between" direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.content" />}</Typography.Text>
						<Typography.Text type="secondary">
							{<FormattedMessage id="jmk.addmaterial.Spaceandlinefeedaresupported" />}
						</Typography.Text>
					</Space>
					<div>
						<TextAreaInput
							autoSize={false}
							item={data}
							valueKey="text"
							showCount
							maxLength={1000}
							defaultValue={"请输入文字"}
						/>
					</div>
				</Space>
				<Space className="full-w" direction="vertical">
					<Space className="full-w between" direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.Displaywidth" />}</Typography.Text>
						<Typography.Text type="secondary">
							{<FormattedMessage id="jmk.addmaterial.Beyondthiswidththecontentwillwrap" />}
						</Typography.Text>
					</Space>
					<Space>
						<NumberInput
							min={1}
							transform="mmtoM"
							item={data}
							field="asScale"
							valueKey={"0"}
							precision={0}
							step={100}
						/>
						<sub>mm</sub>
					</Space>
				</Space>
				<Space className="full-w" direction="vertical">
					<Space direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.style" />}</Typography.Text>
						<Typography.Text type="secondary"></Typography.Text>
					</Space>
					<Space direction="horizontal">
						<div>
							<ItemColor item={data} valueKey="fillStyle" />
						</div>
						<div>
							<ItemCheckBox item={data} valueKey="fontBold" children={<FormattedMessage id="jmk.addmaterial.Bold" />} />
						</div>
						<div>
							<ItemCheckBox
								value="italic"
								item={data}
								valueKey="fontStyle"
								children={<FormattedMessage id="jmk.addmaterial.Italics" />}
							/>
						</div>
					</Space>
				</Space>
				<Space className="full-w" direction="vertical">
					<Space direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.Alignment" />}</Typography.Text>
						<Typography.Text type="secondary"></Typography.Text>
					</Space>
					<div>
						<ItemRadio
							item={data}
							valueKey="textAlign"
							children={
								<>
									<Radio.Button value="left">
										<AlignLeftOutlined />
									</Radio.Button>
									<Radio.Button value="center">
										<AlignCenterOutlined />
									</Radio.Button>
									<Radio.Button value="right">
										<AlignRightOutlined />
									</Radio.Button>
								</>
							}
						/>
					</div>
				</Space>
				<Space className="full-w" direction="horizontal">
					<Space direction="vertical">
						<Space direction="horizontal" align="center">
							<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.typeface" />}</Typography.Text>
							<Typography.Text type="secondary"></Typography.Text>
						</Space>
						<div>
							<OpationSelect
								item={data}
								valueKey="fontFamily"
								defaultValue="Noto Sans"
								options={[
									{ value: "Noto Sans", label: <FormattedMessage id="jmk.addmaterial.Siyuanblackbody" /> },
									{ value: "微软雅黑", label: <FormattedMessage id="jmk.addmaterial.MicrosoftYaHei" /> },
									{ value: "黑体", label: <FormattedMessage id="jmk.addmaterial.Blackbody" /> },
									{ value: "宋体", label: <FormattedMessage id="jmk.addmaterial.Songstyle" /> }
								]}
							/>
						</div>
					</Space>
					<Space direction="vertical">
						<Space direction="horizontal" align="center">
							<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.textsize" />}</Typography.Text>
							<Typography.Text type="secondary"></Typography.Text>
						</Space>
						<div>
							<OpationSelect
								item={data}
								valueKey="fontSize"
								defaultValue={-1}
								options={[{ value: -1, label: Intl.formatMessage({ id: "jmk.addmaterial.self-adaption" }) }].concat(
									Array(100)
										.fill(0)
										.map((m, i) => ({ value: 1 + i, label: `${1 + i}px` }))
								)}
							/>
						</div>
					</Space>
					<Space direction="vertical">
						<Space direction="horizontal" align="center">
							<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.rowspacing" />}</Typography.Text>
							<Typography.Text type="secondary"></Typography.Text>
						</Space>
						<div>
							<OpationSelect
								item={data}
								valueKey="lineSpacing"
								defaultValue={1}
								options={Array(8)
									.fill(0)
									.map((m, i) => ({
										value: 0.5 * (i + 1),
										label:
											`${commonFunc.toFixed(0.5 * (i + 1), 1)}` + Intl.formatMessage({ id: "jmk.addmaterial.multiple" })
									}))}
							/>
						</div>
					</Space>
				</Space>

				<Space className="full-w" direction="vertical">
					<Space className="full-w between" direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.Jumplink" />}:</Typography.Text>
						<ItemCheckBox
							defaultValue={2}
							value={3}
							item={data.extdata.info}
							valueKey="target"
							children={
								<Typography.Text type="secondary">
									{<FormattedMessage id="jmk.addmaterial.Anewwindowopens" />}
								</Typography.Text>
							}
						/>
					</Space>
					<div>
						{/* <TextInput addonBefore="http://" item={data.extdata.info} valueKey="url" /> */}
						<TextInput addonBefore="" item={data.extdata.info} valueKey="url" />
					</div>
				</Space>
				<Space className="full-w" direction="vertical">
					<Space direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.characteristic" />}</Typography.Text>
						<Typography.Text type="secondary"></Typography.Text>
					</Space>
					<ItemCheckBox
						item={data}
						valueKey="enableHideInViews"
						children={<FormattedMessage id="jmk.addmaterial.Onlythecurrentcamerabitisvisible" />}
						forceUpdate={forceUpdate}
					/>
					{!!data.enableHideInViews && (
						<OpationSelect
							item={data}
							mode="multiple"
							valueKey="hideInViews"
							forceUpdate={forceUpdate}
							options={selectList}
						/>
					)}
				</Space>
				<Space className="full-w" direction="vertical">
					<Space className="full-w between" direction="horizontal" align="center">
						<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.opacity" />}:</Typography.Text>
					</Space>
					<div>
						<ItemSlider item={data} valueKey="opacity" min={0.1} max={1} step={0.1} />
					</div>
				</Space>
			</Space>
		</div>
	)
}

const TextEditPanel = useMini(_TextEditPanel)
export default TextEditPanel
