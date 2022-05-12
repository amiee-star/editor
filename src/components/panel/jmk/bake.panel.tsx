import { useEditHook } from "@/components/jmk/jmk.engine"
import JobsBake from "@/components/jmkui/jobs.bake"
import { JMKContext } from "@/components/provider/jmk.context"
import ColorPanel from "@/components/utils/color.panel"
import { bakeData, devicesData } from "@/interfaces/jmt.interface"
import serviceLocal from "@/services/service.local"
import lsFunc from "@/utils/ls.func"
import transformFunc from "@/utils/transform.func"
import { FormattedMessage, useIntl } from "umi"
import { Checkbox, Descriptions, Form, InputNumber, Radio } from "antd"
import { useForm } from "antd/es/form/Form"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import JMKPanel from "./jmk.panel"
import DragInput from "@/components/utils/drag.input"
const BakePanel: React.FC = () => {
	const Intl = useIntl()
	const JMKHook = useEditHook()
	const [form] = useForm()
	const { state } = useContext(JMKContext)
	const [skyShow, setSkyShow] = useState(null)
	const [filtersShow, setFiltersShow] = useState(null)
	const [occlusionShow, setOcclusionShow] = useState(null)
	const getData = useCallback(() => {
		return new Promise<{ devices: devicesData[]; settings: bakeData }>(resolve => {
			const devices = lsFunc.getItem("devices")
			const settings = lsFunc.getItem("bake")
			// resolve({
			// 	devices,
			// 	settings
			// })
			if (!devices || !settings) {
				Promise.all([serviceLocal.renderSettings(state.sceneName), serviceLocal.devices()]).then(
					([renderSettings, devices]) => {
						lsFunc.setItem("bake", renderSettings.data)
						lsFunc.setItem("devices", devices.data)
						resolve({
							devices: devices.data,
							settings: renderSettings.data
						})
					}
				)
			} else {
				resolve({
					devices,
					settings
				})
			}
		})
	}, [state])

	const onValuesChange = useCallback((data: Partial<bakeData & { quality: number }>) => {
		if ("quality" in data) {
			form.setFields([
				{ name: "sampleCount", value: { draft: 100, medium: 400, high: 800, super: 1200 }[data.quality] }
			])
		} else if ("sampleCount" in data) {
			if (data.sampleCount < 400) {
				form.setFields([{ name: "quality", value: "draft" }])
			} else if (data.sampleCount < 800) {
				form.setFields([{ name: "quality", value: "medium" }])
			} else if (data.sampleCount < 1200) {
				form.setFields([{ name: "quality", value: "high" }])
			} else {
				form.setFields([{ name: "quality", value: "super" }])
			}
		}
		const color = form.getFieldValue("bgColor") as string
		const colorJSON = transformFunc.rgbWithHex16(color) as any
		lsFunc.setItem("bake", {
			...form.getFieldsValue(),
			bgColor: [colorJSON.r, colorJSON.g, colorJSON.b],
			maxDirectSample: 0,
			maxIndirectSample: 0,
			useBgMap: false,
			bgMapGamma: 1,
			width: 1024,
			height: 768,
			transparentBounceCount: 8
		})

		if ("useBg" in data) {
			setSkyShow(data.useBg)
		}
		if ("usePostProcessFilters" in data) {
			setFiltersShow(data.usePostProcessFilters)
		}
		if ("useBgAo" in data) {
			setOcclusionShow(data.useBgAo)
		}
	}, [])
	useEffect(() => {
		if (state.editHook) {
			JMKHook.disableSelection()
		}
	}, [state])
	const [devices, setDevices] = useState<devicesData[]>([])

	const setquality = useCallback(num => {
		if (num < 400) {
			return "draft"
		} else if (num < 800) {
			return "medium"
		} else if (num < 1200) {
			return "high"
		} else {
			return "super"
		}
	}, [])
	useEffect(() => {
		getData().then(res => {
			res.devices && setDevices(res.devices)
			res.settings && setSkyShow(res.settings.useBg)
			res.settings && setOcclusionShow(res.settings.useBgAo)
			res.settings && setFiltersShow(res.settings.usePostProcessFilters)
			res.settings &&
				form.setFieldsValue({
					quality: setquality(res.settings.sampleCount),
					...res.settings,
					bgColor: transformFunc.rgbWithHex16({
						r: res.settings.bgColor?.[0] || 0,
						g: res.settings.bgColor?.[1] || 0,
						b: res.settings.bgColor?.[2] || 0
					}) as any
				})
		})
	}, [state])
	return (
		<JMKPanel title={<FormattedMessage id="jmk.baking" />}>
			<Form
				form={form}
				onValuesChange={onValuesChange}
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				layout="horizontal"
			>
				<Form.Item label={<FormattedMessage id="jmk.quality" />} name="quality">
					<Radio.Group>
						<Radio.Button value="draft">{<FormattedMessage id="jmk.low" />}</Radio.Button>
						<Radio.Button value="medium">{<FormattedMessage id="jmk.middle" />}</Radio.Button>
						<Radio.Button value="high">{<FormattedMessage id="jmk.high" />}</Radio.Button>
						<Radio.Button value="super">{<FormattedMessage id="jmk.superhigh" />}</Radio.Button>
					</Radio.Group>
				</Form.Item>
				<Form.Item label={<FormattedMessage id="jmk.sampling" />} name="sampleCount">
					<DragInput min={1} type="number" step={1} precision={0} max={50000} />
				</Form.Item>
				<Form.Item label={<FormattedMessage id="jmk.reflex" />} name="bounceCount">
					<DragInput min={0} type="number" max={16} />
				</Form.Item>
				<Form.Item label={<FormattedMessage id="jmk.ResolutionOfLightMap" />} name="lightmapResolution">
					<DragInput min={0} type="number" max={200} />
				</Form.Item>
				<Form.Item label={<FormattedMessage id="jmk.NumberOfLightMaps" />} name="maxLightmapCount">
					<DragInput min={1} type="number" max={8} />
				</Form.Item>
				<Form.Item label={<FormattedMessage id="jmk.sky" />} valuePropName="checked" name="useBg">
					<Checkbox />
				</Form.Item>

				<Form.Item hidden={!skyShow} label={<FormattedMessage id="jmk.strength" />} name="bgStrength">
					<DragInput min={0} type="number" max={100} precision={1} step={0.1} />
				</Form.Item>

				<Form.Item hidden={!skyShow} label={<FormattedMessage id="jmk.color" />} name="bgColor">
					<ColorPanel />
				</Form.Item>

				<Form.Item
					hidden={!skyShow}
					label={<FormattedMessage id="jmk.AmbientOcclusion" />}
					valuePropName="checked"
					name="useBgAo"
				>
					<Checkbox />
				</Form.Item>

				<Form.Item hidden={!skyShow || !occlusionShow} label={<FormattedMessage id="jmk.factor" />} name="bgAoFactor">
					<DragInput min={0} step={0.01} max={10} type="number" precision={2} />
				</Form.Item>

				<Form.Item
					hidden={!skyShow || !occlusionShow}
					label={<FormattedMessage id="jmk.distance" />}
					name="bgAoDistance"
				>
					<DragInput min={0} step={0.1} max={10} type="number" />
				</Form.Item>

				<Form.Item
					name="usePostProcessFilters"
					label={<FormattedMessage id="jmk.EnableFiltering" />}
					valuePropName="checked"
				>
					<Checkbox />
				</Form.Item>
				<Form.Item
					hidden={!filtersShow}
					name="floodDarkLimit"
					label={<FormattedMessage id="jmk.FalseShadowThreshold" />}
				>
					<DragInput min={0} step={0.001} max={0.2} precision={3} type="number" />
				</Form.Item>
				<Form.Item name={["devices", 0]} noStyle>
					<Radio.Group>
						<Descriptions column={1} title={<FormattedMessage id="jmk.DeviceInformation" />} bordered>
							{devices.map(m => {
								return (
									<Descriptions.Item key={m.id} label={<Radio value={m.id}>{m.type}</Radio>}>
										{m.description}
									</Descriptions.Item>
								)
							})}
						</Descriptions>
					</Radio.Group>
				</Form.Item>
			</Form>
			<JobsBake />
		</JMKPanel>
	)
}

export default BakePanel
