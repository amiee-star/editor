import ItemColor from "@/components/form/item.color"
import ItemSlider from "@/components/form/item.slider"
import ItemSwitch from "@/components/form/item.switch"
import NumberInput from "@/components/form/number.input"
import OpationSelect from "@/components/form/select"
import TextInput from "@/components/form/text.input"
import { useEditHook } from "@/components/jmk/jmk.engine"
import { JMKContext } from "@/components/provider/jmk.context"
import { panelContext } from "@/components/provider/panel.context"
import JMKUpload from "@/components/utils/jmk.upload"
import serviceLocal from "@/services/service.local"
import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import { useForceUpdate } from "@/utils/use.func"
import { CloseOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons"
import { Button, Col, List, Row, Tag } from "antd"
import classNames from "classnames"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { FormattedMessage } from "umi"
// import "./materials.panel.less"
interface Props {
	materialsList: any
}
const ModelMayerials: React.FC<Props> = props => {
	const forceUpdate = useForceUpdate()
	const JMKHook = useEditHook()
	const { state: panelState } = useContext(panelContext)
	const { state } = useContext(JMKContext)
	const { materialsList } = props
	const requestFrame = useCallback(() => {
		state.editHook.aniController.requestFrame()
	}, [state])
	// 材质列表
	const [currentMaterial, setCurrentMaterial] = useState(null)

	const selectOpations = [
		{
			label: <FormattedMessage id="jmk.standard" />,
			value: "standard"
		},
		{
			label: <FormattedMessage id="jmk.water" />,
			value: "water"
		}
		// {
		// 	label: <FormattedMessage id="jmk.flashLight" />,
		// 	value: "flashLight"
		// }
	]
	useEffect(() => {
		JMKHook.selectMaterial(currentMaterial)
	}, [currentMaterial])
	useEffect(() => {
		if (materialsList && materialsList.length) {
			setCurrentMaterial(materialsList[0])
		}
	}, [materialsList])
	useEffect(() => {
		eventBus.off("jmk.sceneChanged").on("jmk.sceneChanged", () => {
			setTimeout(() => {
				forceUpdate()
			}, 0)
		})
	}, [])
	// 点击材质
	const clickMaterial = useCallback(
		(item: any) => () => {
			setCurrentMaterial(item)
			// currentMaterial.hasFlash = true
			// currentMaterial._initFlash()
			// currentMaterial.flashColors = [
			// 	{
			// 		r: 0.5,
			// 		g: 0.5,
			// 		b: 0.5,
			// 		mix: 0.5
			// 	},
			// 	{
			// 		r: 0.6,
			// 		g: 0.6,
			// 		b: 0.6,
			// 		mix: 0.6
			// 	},
			// 	{
			// 		r: 0.7,
			// 		g: 0.7,
			// 		b: 0.7,
			// 		mix: 0.7
			// 	}
			// ]
			// JMKHook.seeItem(item)
		},
		[state]
	)
	// 删除文件
	const removeFile = useCallback(
		(name: string) => () => {
			currentMaterial[name] = null
			forceUpdate()
		},
		[currentMaterial]
	)
	// 文件上传
	const uploadFile = useCallback(
		(name: string) => (item: any) => {
			const texture = JMKHook.loadTexture({
				alpha: item[0].alpha,
				id: item[0].id,
				name: item[0].name,
				rawExt: item[0].rawExt,
				stdExt: item[0].stdExt,
				url: urlFunc.replaceUrl(
					"/scenes/" + state.sceneName + "/img/" + item[0].webFormats[0] + "/" + item[0].id + "." + item[0].stdExt
				)
			})
			currentMaterial.setTexture(name, texture)
			currentMaterial.programNeedsUpdate = true
			JMKHook.materialTextureUpdated(currentMaterial, name)
			forceUpdate()
		},
		[currentMaterial, state]
	)
	// 修改材质类型
	const changeType = useCallback(
		(item: string) => {
			const EDitHook = state.editHook
			var newMaterial = EDitHook.replaceMaterial(currentMaterial, item)

			if ("water" === item && null == currentMaterial.normalTexture) {
				let formdata = new FormData()
				formdata.append("type", "uv0")
				formdata.append("materialName", "Black")
				formdata.append("fromTextureLib", true)
				formdata.append("path", "water-waves.jpg")
				serviceLocal.uploadJmkTextures(state.sceneName, formdata).then(res => {
					const item = res.data
					const texture = JMKHook.loadTexture({
						alpha: item.alpha,
						id: item.id,
						name: item.name,
						rawExt: item.rawExt,
						stdExt: item.stdExt,
						url: urlFunc.replaceUrl(
							"/scenes/" + state.sceneName + "/img/" + item.webFormats[0] + "/" + item.id + "." + item.stdExt
						)
					})
					newMaterial.setTexture("normalTexture", texture)
					newMaterial.programNeedsUpdate = true
					JMKHook.materialTextureUpdated(newMaterial, "normalTexture")
					setCurrentMaterial(newMaterial)
				})
			}
			forceUpdate()
		},
		[currentMaterial, state]
	)
	// 删除 闪烁光的颜色
	const closeTag = useCallback(
		index => {
			currentMaterial.flashColors.splice(index, 1)
			forceUpdate()
		},
		[currentMaterial]
	)
	const addTag = useCallback(() => {
		currentMaterial.flashColors.push(currentMaterial.color123 + "80")
		forceUpdate()
	}, [currentMaterial])
	return (
		<div id="MaterialsPanel">
			<List
				size="small"
				bordered
				dataSource={Array.from(new Set(materialsList))}
				renderItem={(item: any) => (
					<List.Item
						className={classNames({ lightsListActive: item === currentMaterial })}
						onClick={clickMaterial(item)}
					>
						{item.name}
					</List.Item>
				)}
			/>
			{!!currentMaterial && (
				<>
					<Row gutter={10} align="middle">
						<Col span={6} className="formLable">
							{<FormattedMessage id="jmk.name" />}：
						</Col>
						<Col span={18}>
							<TextInput
								item={currentMaterial}
								valueKey="name"
								forceUpdate={forceUpdate}
								defaultValue="material"
								maxLength={20}
							/>
						</Col>
					</Row>
					<Row gutter={10} align="middle">
						<Col span={6} className="formLable">
							{<FormattedMessage id="jmk.type" />}：
						</Col>
						<Col span={18}>
							<OpationSelect
								item={currentMaterial}
								valueKey="type"
								options={selectOpations}
								itemChange={changeType}
								setValue={() => {}}
								// disabled={true}
							/>
						</Col>
					</Row>
					{/* PBR 材质 和 闪烁材质 */}
					{currentMaterial.type === "standard" && (
						<>
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.flashLight" />}：
								</Col>
								<Col span={15}>
									<ItemSwitch size="small" forceUpdate={forceUpdate} item={currentMaterial} valueKey="hasFlash" />
								</Col>
							</Row>
							{/* 闪烁的光 */}
							{currentMaterial.hasFlash && (
								<>
									<Row gutter={10} align="middle">
										<Col span={6} className="formLable">
											{<FormattedMessage id="jmk.flash.addColor" />}：
										</Col>
										<Col span={18}>
											<ItemColor item={currentMaterial} valueKey="color123" />
											<Button type="primary" icon={<PlusOutlined />} size="small" onClick={addTag} />
										</Col>
									</Row>
									<Row gutter={10} align="middle">
										<Col span={6} className="formLable">
											{<FormattedMessage id="jmk.flash.color" />}：
										</Col>
										<Col span={18}>
											{currentMaterial.flashColors.map((item: string, index: number) => {
												return (
													<Tag
														closable
														color={item}
														onClose={e => {
															e.preventDefault()
															closeTag(index)
														}}
														key={item + index}
													>
														{item}
													</Tag>
												)
											})}
										</Col>
									</Row>
									<Row gutter={10} align="middle">
										<Col span={6} className="formLable">
											{<FormattedMessage id="jmk.flash.time" />}：
										</Col>
										<Col span={18}>
											<ItemSlider
												min={0.1}
												max={5}
												step={0.1}
												item={currentMaterial}
												valueKey="flashDelay"
											></ItemSlider>
										</Col>
									</Row>
								</>
							)}
							{/* UV动画 */}
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.uv.animated" />}：
								</Col>
								<Col span={15}>
									<ItemSwitch size="small" forceUpdate={forceUpdate} item={currentMaterial} valueKey="hasUvAnimated" />
								</Col>
							</Row>
							{currentMaterial.hasUvAnimated && (
								<>
									<Row gutter={10} align="middle">
										<Col span={6} className="formLable">
											{<FormattedMessage id="jmk.uv.uvMoveSpeed" />}：
										</Col>
										<Col span={8}>
											<NumberInput
												onVal={currentMaterial.uvMoveSpeed.x}
												item={currentMaterial}
												field="uvMoveSpeed"
												valueKey="x"
												forceUpdate={forceUpdate}
												precision={3}
												min={-1}
												max={1}
												step={0.001}
											/>
										</Col>
										<Col span={8}>
											<NumberInput
												onVal={currentMaterial.uvMoveSpeed.y}
												item={currentMaterial}
												field="uvMoveSpeed"
												valueKey="y"
												forceUpdate={forceUpdate}
												precision={3}
												min={-1}
												max={1}
												step={0.001}
											/>
										</Col>
									</Row>
									<Row gutter={10} align="middle">
										<Col span={6} className="formLable">
											{<FormattedMessage id="jmk.uv.uvRotate" />}：
										</Col>
										<Col span={18}>
											<ItemSlider min={0} max={360} step={1} item={currentMaterial} valueKey="uvRotate"></ItemSlider>
										</Col>
									</Row>
									<Row gutter={10} align="middle">
										<Col span={6} className="formLable">
											{<FormattedMessage id="jmk.uv.uvRotateSpeed" />}：
										</Col>
										<Col span={18}>
											<NumberInput
												item={currentMaterial}
												valueKey="uvRotateSpeed"
												defaultValue={0}
												precision={0}
												min={-360}
												max={360}
												step={1}
											/>
										</Col>
									</Row>
									<Row gutter={10} align="middle">
										<Col span={6} className="formLable">
											{<FormattedMessage id="jmk.uv.uvRepeat" />}：
										</Col>
										<Col span={8}>
											<NumberInput
												onVal={currentMaterial.uvRepeat.x}
												item={currentMaterial}
												field="uvRepeat"
												valueKey="x"
												forceUpdate={forceUpdate}
												precision={0}
												min={1}
												step={1}
											/>
										</Col>
										<Col span={8}>
											<NumberInput
												onVal={currentMaterial.uvRepeat.y}
												item={currentMaterial}
												field="uvRepeat"
												valueKey="y"
												forceUpdate={forceUpdate}
												precision={0}
												min={1}
												step={1}
											/>
										</Col>
									</Row>
								</>
							)}
							{/* 通用 */}

							<Row gutter={10} align="middle" style={{ height: "22px", lineHeight: "22px" }}>
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.base_color" />}：
								</Col>
								{currentMaterial.baseColorTexture && (
									<>
										<Col span={currentMaterial.doNotImport.baseColor ? 11 : 15}>
											{currentMaterial.baseColorTexture.name + "." + currentMaterial.baseColorTexture.rawExt}
										</Col>
									</>
								)}
								{!currentMaterial.baseColorTexture && (
									<>
										<Col
											span={currentMaterial.doNotImport.baseColor ? 13 : 15}
											style={{
												pointerEvents: currentMaterial.doNotImport.baseColor ? "auto" : "none"
											}}
										>
											<ItemColor
												item={currentMaterial}
												valueKey="color"
												forceUpdate={forceUpdate}
												onChange={requestFrame}
												transform={"rgbWithHex16"}
											/>
										</Col>
									</>
								)}
								{currentMaterial.baseColorTexture && currentMaterial.doNotImport.baseColor && (
									<>
										<Col span={2}>
											<Button
												type="primary"
												size="small"
												icon={<CloseOutlined />}
												onClick={removeFile("baseColorTexture")}
											/>
										</Col>
									</>
								)}
								{currentMaterial.doNotImport.baseColor && (
									<>
										<Col span={2}>
											<JMKUpload //上传固有色
												btnicon={<UploadOutlined />}
												accept=".png, .jpg, .jpeg"
												btnProps={{ type: "primary", size: "small" }}
												size={1}
												btnText=""
												extParams={{ type: "baseColor", fromTextureLib: false, materialName: currentMaterial.name }}
												apiService={serviceLocal.uploadjmktextures(state.sceneName)}
												onChange={uploadFile("baseColorTexture")}
											></JMKUpload>
										</Col>
									</>
								)}

								<Col span={3}>
									<ItemSwitch
										size="small"
										forceUpdate={forceUpdate}
										item={currentMaterial.doNotImport}
										valueKey="baseColor"
									/>
								</Col>
							</Row>
							{currentMaterial.baseColorTexture && (
								<>
									<Row gutter={10} align="middle">
										<Col span={6} className="formLable">
											{<FormattedMessage id="jmk.correction" />}：
										</Col>
										<Col span={18}>
											<ItemSwitch
												size="small"
												forceUpdate={forceUpdate}
												item={currentMaterial}
												valueKey="baseColorTextureCorrection"
											/>
										</Col>
									</Row>
								</>
							)}
							{currentMaterial.baseColorTexture && currentMaterial.baseColorTextureCorrection && (
								<>
									<Row gutter={10} align="middle">
										<Col span={6} className="formLable">
											{<FormattedMessage id="jmk.contrast" />}：
										</Col>
										<Col span={18}>
											<ItemSlider
												min={-1}
												max={1}
												step={0.01}
												forceUpdate={forceUpdate}
												item={currentMaterial}
												valueKey="baseColorTextureContrast"
											></ItemSlider>
										</Col>
									</Row>
									<Row gutter={10} align="middle">
										<Col span={6} className="formLable">
											{<FormattedMessage id="jmk.offset" />}：
										</Col>
										<Col span={1}>H</Col>
										<Col span={5}>
											<NumberInput
												onVal={currentMaterial.baseColorTextureHslOffset.h}
												item={currentMaterial.baseColorTextureHslOffset}
												valueKey="h"
												forceUpdate={forceUpdate}
												defaultValue={0}
												precision={2}
												min={-1}
												max={1}
												step={0.01}
											/>
										</Col>
										<Col span={1}>L</Col>
										<Col span={5}>
											<NumberInput
												onVal={currentMaterial.baseColorTextureHslOffset.l}
												item={currentMaterial.baseColorTextureHslOffset}
												valueKey="l"
												forceUpdate={forceUpdate}
												defaultValue={0}
												precision={2}
												min={-1}
												max={1}
												step={0.01}
											/>
										</Col>
										<Col span={1}>S</Col>
										<Col span={5}>
											<NumberInput
												onVal={currentMaterial.baseColorTextureHslOffset.s}
												item={currentMaterial.baseColorTextureHslOffset}
												valueKey="s"
												forceUpdate={forceUpdate}
												defaultValue={0}
												precision={2}
												min={-1}
												max={1}
												step={0.01}
											/>
										</Col>
									</Row>
								</>
							)}
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.opacity" />}：
								</Col>
								<Col span={15}>
									<ItemSlider
										min={0}
										max={1}
										step={0.01}
										forceUpdate={forceUpdate}
										item={currentMaterial}
										valueKey="opacity"
										onChange={requestFrame}
										disabled={!currentMaterial.doNotImport.opacity}
									></ItemSlider>
								</Col>
								<Col span={3}>
									<ItemSwitch
										size="small"
										forceUpdate={forceUpdate}
										item={currentMaterial.doNotImport}
										valueKey="opacity"
									/>
								</Col>
							</Row>
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.roughness" />}：
								</Col>
								{currentMaterial.roughnessTexture && (
									<>
										<Col span={13}>
											{currentMaterial.roughnessTexture.name + "." + currentMaterial.roughnessTexture.rawExt}
										</Col>
										<Col span={2}>
											<Button
												type="primary"
												size="small"
												icon={<CloseOutlined />}
												onClick={removeFile("roughnessTexture")}
											/>
										</Col>
									</>
								)}
								{!currentMaterial.roughnessTexture && (
									<>
										<Col span={15}>
											<ItemSlider
												min={0}
												max={1}
												step={0.01}
												forceUpdate={forceUpdate}
												item={currentMaterial}
												onChange={requestFrame}
												valueKey="roughness"
											></ItemSlider>
										</Col>
									</>
								)}

								<Col span={3}>
									<JMKUpload
										btnicon={<UploadOutlined />}
										accept=".png, .jpg, .jpeg"
										// checkType="light"
										btnProps={{ type: "primary", size: "small" }}
										size={1}
										btnText=""
										extParams={{ type: "uv0", fromTextureLib: false, materialName: currentMaterial.name }}
										apiService={serviceLocal.uploadjmktextures(state.sceneName)}
										onChange={uploadFile("roughnessTexture")} //粗糙度
									></JMKUpload>
								</Col>
							</Row>
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.metallic" />}：
								</Col>
								{currentMaterial.metallicTexture && (
									<>
										<Col span={13}>
											{currentMaterial.metallicTexture.name + "." + currentMaterial.metallicTexture.rawExt}
										</Col>
										<Col span={2}>
											<Button
												type="primary"
												size="small"
												icon={<CloseOutlined />}
												onClick={removeFile("metallicTexture")}
											/>
										</Col>
									</>
								)}
								{!currentMaterial.metallicTexture && (
									<>
										<Col span={15}>
											<ItemSlider
												min={0}
												max={1}
												step={0.01}
												forceUpdate={forceUpdate}
												item={currentMaterial}
												valueKey="metallic"
												onChange={requestFrame}
											></ItemSlider>
										</Col>
									</>
								)}
								<Col span={3}>
									<JMKUpload
										btnicon={<UploadOutlined />}
										accept=".png, .jpg, .jpeg"
										// checkType="light"
										btnProps={{ type: "primary", size: "small" }}
										size={1}
										btnText=""
										extParams={{ type: "uv0", fromTextureLib: false, materialName: currentMaterial.name }}
										apiService={serviceLocal.uploadjmktextures(state.sceneName)}
										onChange={uploadFile("metallicTexture")} //金属度
									></JMKUpload>
								</Col>
							</Row>
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.parallaxCorrection" />}：
								</Col>
								<Col span={15}>
									<ItemSwitch
										size="small"
										forceUpdate={forceUpdate}
										item={currentMaterial}
										valueKey="parallaxCorrection"
									/>
								</Col>
							</Row>
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.emissive" />}：
								</Col>
								<Col span={15}>
									<ItemSwitch size="small" forceUpdate={forceUpdate} item={currentMaterial} valueKey="emissive" />
								</Col>
							</Row>
							{currentMaterial.emissive && (
								<>
									<Row gutter={10} align="middle">
										<Col span={6} className="formLable">
											{<FormattedMessage id="jmk.strengh" />}：
										</Col>
										<Col span={18}>
											<ItemSlider
												min={0}
												max={200}
												forceUpdate={forceUpdate}
												item={currentMaterial}
												valueKey="emissionStrength"
												onChange={requestFrame}
											></ItemSlider>
										</Col>
									</Row>
								</>
							)}

							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.bump" />}：
								</Col>
								<Col span={currentMaterial.bumpTexture ? 13 : 15}>
									{currentMaterial.bumpTexture ? (
										currentMaterial.bumpTexture.name + "." + currentMaterial.bumpTexture.rawExt
									) : (
										<FormattedMessage id="jmk.not_selected" />
									)}
								</Col>
								{currentMaterial.bumpTexture && (
									<>
										<Col span={2}>
											<Button
												type="primary"
												size="small"
												icon={<CloseOutlined />}
												onClick={removeFile("bumpTexture")}
											/>
										</Col>
									</>
								)}
								<Col span={3}>
									<JMKUpload
										btnicon={<UploadOutlined />}
										accept=".png, .jpg, .jpeg"
										// checkType="light"
										btnProps={{ type: "primary", size: "small" }}
										size={1}
										btnText=""
										extParams={{ type: "uv0", fromTextureLib: false, materialName: currentMaterial.name }}
										apiService={serviceLocal.uploadjmktextures(state.sceneName)}
										onChange={uploadFile("bumpTexture")} //凹凸
									></JMKUpload>
								</Col>
							</Row>
							{currentMaterial.bumpTexture && (
								<>
									<Row gutter={10} align="middle">
										<Col span={6} className="formLable">
											{<FormattedMessage id="jmk.bumpScale" />}：
										</Col>
										<Col span={18}>
											<ItemSlider
												min={-0.02}
												max={0.02}
												step={0.0001}
												forceUpdate={forceUpdate}
												item={currentMaterial}
												valueKey="bumpScale"
											></ItemSlider>
										</Col>
									</Row>
								</>
							)}
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.double_sided" />}：
								</Col>
								<Col span={18}>
									<ItemSwitch size="small" forceUpdate={forceUpdate} item={currentMaterial} valueKey="doubleSided" />
								</Col>
							</Row>
						</>
					)}
					{/* 水材质 */}
					{currentMaterial.type === "water" && (
						<>
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.water.normal" />}：
								</Col>
								<Col span={currentMaterial.normalTexture ? 13 : 15}>
									{currentMaterial.normalTexture ? (
										currentMaterial.normalTexture.name + "." + currentMaterial.normalTexture.rawExt
									) : (
										<FormattedMessage id="jmk.not_selected" />
									)}
								</Col>
								{currentMaterial.normalTexture && (
									<>
										<Col span={2}>
											<Button
												type="primary"
												size="small"
												icon={<CloseOutlined />}
												onClick={removeFile("normalTexture")}
											/>
										</Col>
									</>
								)}
								<Col span={3}>
									<JMKUpload
										btnicon={<UploadOutlined />}
										accept=".png, .jpg, .jpeg"
										btnProps={{ type: "primary", size: "small" }}
										size={1}
										btnText=""
										extParams={{ type: "uv0", fromTextureLib: false, materialName: currentMaterial.name }}
										apiService={serviceLocal.uploadjmktextures(state.sceneName)}
										onChange={uploadFile("normalTexture")} //发现贴图
									></JMKUpload>
								</Col>
							</Row>
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.water.wavesSpeed" />}：
								</Col>
								<Col span={18}>
									<ItemSlider min={0.1} max={5} step={0.1} item={currentMaterial} valueKey="wavesSpeed"></ItemSlider>
								</Col>
							</Row>
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.water.wavesScale" />}：
								</Col>
								<Col span={18}>
									<ItemSlider min={0} max={5} step={0.1} item={currentMaterial} valueKey="wavesScale"></ItemSlider>
								</Col>
							</Row>
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.color" />}：
								</Col>
								<Col span={18}>
									<ItemColor
										item={currentMaterial}
										valueKey="color"
										forceUpdate={forceUpdate}
										onChange={requestFrame}
										transform={"rgbWithHex16"}
									/>
								</Col>
							</Row>
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.opacity" />}：
								</Col>
								<Col span={18}>
									<ItemSlider min={0} max={1} step={0.1} item={currentMaterial} valueKey="opacity"></ItemSlider>
								</Col>
							</Row>
							<Row gutter={10} align="middle">
								<Col span={6} className="formLable">
									{<FormattedMessage id="jmk.water.refractionFactor" />}：
								</Col>
								<Col span={18}>
									<ItemSlider
										min={0}
										max={1}
										step={0.1}
										item={currentMaterial}
										valueKey="refractionFactor"
									></ItemSlider>
								</Col>
							</Row>
						</>
					)}
				</>
			)}
		</div>
	)
}
export default ModelMayerials
