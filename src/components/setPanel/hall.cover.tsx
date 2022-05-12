import { Form, Checkbox, Row } from "antd"
import React, { useContext } from "react"
import { JMKContext } from "@/components/provider/jmk.context"
import { useMini } from "@/utils/use.func"
import serviceLocal from "@/services/service.local"
import { FormattedMessage, useIntl } from "umi"
import FormUploads from "../form/form.uploads"

interface Props {
	showNade: any
}
const _HallCover: React.FC<Props> = props => {
	const { showNade } = props
	const { state: JMK, dispatch } = useContext(JMKContext)
	const Intl = useIntl()
	return (
		<>
			<Form.Item label={<FormattedMessage id="jmk.minimap.cover" />}>
				<Form.Item name="useThumbLoading" noStyle valuePropName="checked">
					<Checkbox style={{ lineHeight: "28px" }}>
						{<FormattedMessage id="jmk.minimap.Coverasloadingbackgroundimage" />}
					</Checkbox>
				</Form.Item>
				<Form.Item noStyle name="thumb" hidden={!showNade.useThumbLoading}>
					<FormUploads
						size={1}
						accept=".png, .jpg, .jpeg"
						extParams={{
							businessId: JMK.sceneName,
							businessType: 1001
						}}
						apiService={serviceLocal.upload}
						btnTxt={<FormattedMessage id="jmk.minimap.PCcover" />}
						imgAction={{ crop: true, aspectRatio: [1920, 1080] }}
						baseUrl="obs"
					/>
				</Form.Item>
				<p>{Intl.formatMessage({ id: "jmk.setup.coverPCTip" })}</p>

				<Form.Item noStyle name="mobileThumb" hidden={!showNade.useThumbLoading}>
					<FormUploads
						size={1}
						extParams={{
							businessId: JMK.sceneName,
							businessType: 1004
						}}
						accept=".png, .jpg, .jpeg"
						apiService={serviceLocal.upload}
						btnTxt={<FormattedMessage id="jmk.minimap.Mobilephonecover" />}
						imgAction={{ crop: true, aspectRatio: [1242, 2016] }}
						baseUrl="obs"
					/>
				</Form.Item>
				<p>{Intl.formatMessage({ id: "jmk.setup.coverMobileTip" })}</p>
				{/* </Space> */}
			</Form.Item>
			{/* pc前置视频 */}
			<Form.Item label={<FormattedMessage id="jmk.minimap.openVideo" />}>
				<Form.Item name={["openingVideo", "show"]} noStyle valuePropName="checked">
					<Checkbox style={{ lineHeight: "28px" }}>{<FormattedMessage id="jmk.minimap.EnableopenVideo" />}</Checkbox>
				</Form.Item>
				{/* 可能问题@ */}

				<Row gutter={[10, 10]} align="middle" hidden={!showNade.openVideo}>
					<Form.Item
						noStyle
						name={["openingVideo", "url"]}
						hidden={!showNade.openVideo}
						extra={Intl.formatMessage({ id: "jmk.setup.openVideoPCTip" })}
					>
						<FormUploads
							apiService={serviceLocal.upload}
							size={1}
							extParams={{
								businessId: JMK.sceneName,
								businessType: 1005
							}}
							accept={"video/*"}
							checkType={"video"}
							imgAction={{ videoCover: false }}
							baseUrl="obs"
						/>
					</Form.Item>
					<p>{Intl.formatMessage({ id: "jmk.setup.openVideoPCTip" })}</p>
					<Form.Item name={["openingVideo", "showSkip"]} noStyle valuePropName="checked">
						<Checkbox style={{ lineHeight: "28px" }}>{<FormattedMessage id="jmk.minimap.isShowButton" />}</Checkbox>
					</Form.Item>
				</Row>
			</Form.Item>

			{/* 移动端前置视频 */}
			<Form.Item label={<FormattedMessage id="jmk.minimap.mobileopenVideo" />}>
				<Form.Item name={["mobileOpeningVideo", "show"]} noStyle valuePropName="checked">
					<Checkbox style={{ lineHeight: "28px" }}>{<FormattedMessage id="jmk.minimap.EnableopenVideo" />}</Checkbox>
				</Form.Item>
				<Row gutter={[10, 10]} align="middle" hidden={!showNade.mobileOpeningVideo}>
					<Form.Item noStyle name={["mobileOpeningVideo", "url"]} hidden={!showNade.mobileOpeningVideo}>
						<FormUploads
							apiService={serviceLocal.upload}
							size={1}
							extParams={{
								businessId: JMK.sceneName,
								businessType: 1006
							}}
							accept={"video/*"}
							checkType={"video"}
							imgAction={{ videoCover: false }}
							baseUrl="obs"
						/>
					</Form.Item>
					<p style={{ width: "100%" }}>{Intl.formatMessage({ id: "jmk.setup.openVideoMobileTip" })}</p>
					<Form.Item name={["mobileOpeningVideo", "showSkip"]} noStyle valuePropName="checked">
						<Checkbox style={{ lineHeight: "28px" }}>{<FormattedMessage id="jmk.minimap.isShowButton" />}</Checkbox>
					</Form.Item>
				</Row>
			</Form.Item>
		</>
	)
}

const HallCover = useMini(_HallCover)
export default HallCover
