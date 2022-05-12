import { Form, Checkbox, Input } from "antd"
import React, { useCallback, useContext, useRef } from "react"
import { JMKContext } from "@/components/provider/jmk.context"
import { useEditHook } from "@/components/jmk/jmk.engine"
import { useMini } from "@/utils/use.func"
import serviceLocal from "@/services/service.local"
import { FormattedMessage, useIntl } from "umi"
import FormUploads from "../form/form.uploads"
import TextArea from "antd/lib/input/TextArea"
import { regxEmail, regxPhone } from "@/utils/regexp.func"
interface Props {
	showNade: any
}
const _HallInfo: React.FC<Props> = props => {
	const { showNade } = props
	const { state: JMK, dispatch } = useContext(JMKContext)
	const Intl = useIntl()
	return (
		<>
			<Form.Item label={<FormattedMessage id="jmk.minimap.Halllogo" />}>
				<Form.Item name="hideLogo" noStyle valuePropName="checked">
					<Checkbox style={{ lineHeight: "28px" }}>{<FormattedMessage id="jmk.minimap.showHalllogo" />}</Checkbox>
				</Form.Item>
				<Form.Item noStyle name={["contact", "headimgurl"]} hidden={!showNade.hideLogo}>
					<FormUploads
						size={1}
						accept=".png, .jpg, .jpeg"
						extParams={{
							businessId: JMK.sceneName,
							businessType: 1003
						}}
						apiService={serviceLocal.upload}
						baseUrl="obs"
					/>
				</Form.Item>
			</Form.Item>
			<Form.Item
				label={<FormattedMessage id="jmk.minimap.Hallname" />}
				name="name"
				rules={[{ required: true, message: <FormattedMessage id="jmk.minimap.Pleaseenteraname" /> }]}
			>
				<Input maxLength={20} />
			</Form.Item>
			<Form.Item label={<FormattedMessage id="jmk.minimap.describe" />}>
				<Form.Item name="descFlag" noStyle valuePropName="checked">
					<Checkbox style={{ lineHeight: "28px" }}>
						{<FormattedMessage id="jmk.minimap.ShowGallerydescriptionwhenloading" />}
					</Checkbox>
				</Form.Item>
				<Form.Item
					noStyle
					name="description"
					rules={[
						{
							// required: showNade.descFlag,
							message: <FormattedMessage id="jmk.minimap.Pleaseenteradescription" />
						}
					]}
					hidden={!showNade.descFlag}
				>
					<TextArea showCount maxLength={100} />
				</Form.Item>
			</Form.Item>
			<Form.Item
				label={<FormattedMessage id="jmk.minimap.contacts" />}
				name={["contact", "contactName"]}
				rules={[
					{
						message: <FormattedMessage id="jmk.minimap.Pleaseenteraname" />
					}
				]}
			>
				<Input maxLength={20} />
				{/* <Row gutter={5}>
  <Col span={20}><Input maxLength={20} /></Col>
  <Col span={4}>
    <Typography.Text strong>{contactLength}/20</Typography.Text>
  </Col>
</Row> */}
			</Form.Item>
			<Form.Item
				label={<FormattedMessage id="jmk.minimap.Exhibitionhalladdress" />}
				name={["contact", "contactAddress"]}
			>
				<Input maxLength={50} />
			</Form.Item>
			<Form.Item
				label={<FormattedMessage id="jmk.minimap.phone" />}
				name={["contact", "contactPhone"]}
				rules={[
					{},
					{
						validator: (rule, value, callback) => {
							if (value && !regxPhone.test(value)) {
								callback(Intl.formatMessage({ id: "jmk.minimap.Pleaseinputthecorrectmobilephonenumber" }))
							} else {
								callback()
							}
						}
					}
				]}
			>
				<Input addonBefore="+86" />
			</Form.Item>
			<Form.Item
				label={<FormattedMessage id="jmk.minimap.email" />}
				name={["contact", "contactEmail"]}
				rules={[
					{},
					{
						validator: (rule, value, callback) => {
							if (value && !regxEmail.test(value)) {
								callback(Intl.formatMessage({ id: "jmk.minimap.Pleaseenterthecorrectemailaddress" }))
							} else {
								callback()
							}
						}
					}
				]}
			>
				<Input />
			</Form.Item>
		</>
	)
}

const HallInfo = useMini(_HallInfo)
export default HallInfo
