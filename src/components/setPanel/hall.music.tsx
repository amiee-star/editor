import { Form, Checkbox, Input, Col, Row } from "antd"
import React, { useCallback, useContext, useRef } from "react"
import { JMKContext } from "@/components/provider/jmk.context"
import { useEditHook } from "@/components/jmk/jmk.engine"
import { useMini } from "@/utils/use.func"
import serviceLocal from "@/services/service.local"
import { FormattedMessage, useIntl } from "umi"
import FormUploads from "../form/form.uploads"

import CustomUpload from "../utils/custom.upload"
import { UploadOutlined } from "@ant-design/icons"
interface Props {
	showNade: any
	uploadFile: Function
}
const _HallMusic: React.FC<Props> = props => {
	const { showNade, uploadFile } = props
	const { state: JMK, dispatch } = useContext(JMKContext)
	const Intl = useIntl()
	const uploadFileMusic = useCallback(
		e => () => {
			uploadFile(e)
		},
		[]
	)

	return (
		<>
			<Form.Item label={<FormattedMessage id="jmk.minimap.backgroundmusic" />}>
				<Form.Item name="closeMusic" noStyle valuePropName="checked">
					<Checkbox style={{ lineHeight: "28px" }}>
						{<FormattedMessage id="jmk.minimap.Enablebackgroundmusic" />}
					</Checkbox>
				</Form.Item>
				<Row gutter={[10, 10]} align="middle" hidden={!showNade.closeMusic}>
					<Col span={21}>
						<Form.Item
							noStyle
							name="musicName"
							rules={[
								{
									required: showNade.closeMusic,
									message: <FormattedMessage id="jmk.minimap.Pleaseuploadbackgroundmusic" />
								}
							]}
						>
							<Input disabled style={{ borderStyle: "none" }} />
						</Form.Item>
					</Col>
					<Col span={3}>
						<Form.Item noStyle name="musicFile">
							<CustomUpload //上传音乐
								btnicon={<UploadOutlined />}
								accept="audio/*"
								btnProps={{ type: "primary", size: "small" }}
								size={1}
								btnText=""
								apiService={serviceLocal.upload}
								onChange={uploadFileMusic("musicName")}
							></CustomUpload>
						</Form.Item>
					</Col>
				</Row>
			</Form.Item>
		</>
	)
}

const HallMusic = useMini(_HallMusic)
export default HallMusic
