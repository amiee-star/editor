import CenterSelectMediaModal from "@/components/modal/async/CenterSelectMedia.Modal"
import { AsyncModal } from "@/components/modal/modal.context"
import { assetData } from "@/interfaces/extdata.interface"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { Button, List, Space, Typography } from "antd"
import React, { useCallback, useEffect } from "react"
import commonFunc from "@/utils/common.func"
import "./centermain.scene.less"
import { DeleteOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons"
import { FormattedMessage, useIntl } from "umi"
import urlFunc from "@/utils/url.func"
interface Props {
	data: assetData
}
const _CenterMainScene: React.FC<Props> = props => {
	const Intl = useIntl()
	const { data } = props
	const { extdata } = data
	const { info } = extdata
	const forceUpdate = useForceUpdate()
	const selectMedia = useCallback(async () => {
		const selectData = await AsyncModal({
			content: CenterSelectMediaModal,
			params: { info }
		})
		info.custom.detailAlbum = selectData
		forceUpdate()
	}, [info])
	const removecentermain = useCallback(
		item => () => {
			info.custom.detailAlbum.forEach((d: any, index: any) => {
				if (info.custom.detailAlbum[index].picId === item.picId) {
					info.custom.detailAlbum.splice(index, 1)
					if (!info.custom.detailAlbum.length) {
						info.custom.detailAlbumEye = true
					}
				}
			})
			forceUpdate()
		},
		[data]
	)
	useEffect(() => {
		if (!info.custom.detailAlbum.length) {
			info.custom.detailAlbumEye = true
		}
	}, [info.custom.detailAlbum])

	return (
		<Space className="full-w" direction="vertical">
			<Space className="full-w between" direction="horizontal" align="center">
				<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.Mainexhibitionarea" />}:</Typography.Text>
				<Button size="small" type="primary" ghost onClick={selectMedia}>
					{<FormattedMessage id="jmk.addmaterial.Choosematerial" />}
				</Button>
			</Space>
			<div>
				<div>
					<div className="check item-box item-selfimg-thumb">
						<div className="item-pic">
							{/* <img src={commonFunc.thumb(data.thumb, 150)} /> */}
							{!!data.thumb && <img src={commonFunc.thumb(data.thumb, 150)} />}
							{!!data.texture && !data.thumb && <img src={urlFunc.replaceUrl(data.texture, "obs")} />}

							{/* {!!data.texture && !data.thumb && (
								<img src={commonFunc.thumb(urlFunc.replaceUrl(data.picPath, "obs"), 150)} />
							)} */}
						</div>

						<div
							className="item-del-icon"
							hidden={!info.custom.detailAlbum.length}
							onClick={() => {
								info.custom.detailAlbumEye = !info.custom.detailAlbumEye
								forceUpdate()
							}}
						>
							{!!info.custom.detailAlbumEye && <EyeOutlined />}
							{!info.custom.detailAlbumEye && <EyeInvisibleOutlined />}
						</div>
					</div>
				</div>
			</div>
			<div hidden={!info.custom.detailAlbum.length}>
				<List
					rowKey="picId"
					grid={{ gutter: 6, column: 4 }}
					dataSource={info.custom.detailAlbum}
					renderItem={(item: any) => (
						<List.Item key={item.picId}>
							<div className="check item-box">
								<div className="item-pic">
									{/* {item.videoThumb ? (
										<img src={commonFunc.thumb(urlFunc.replaceUrl(item.videoThumb, "obs"), 150)} />
									) : item.thumbnail ? (
										<img src={commonFunc.thumb(urlFunc.replaceUrl(item.thumbnail, "obs"), 150)} />
									) : (
										<img src={commonFunc.thumb(urlFunc.replaceUrl(item.picPath, "obs"), 150)} />
									)} */}

									{item.videoThumb ? (
										<img src={urlFunc.replaceUrl(item.videoThumb, "obs")} />
									) : item.thumbnail ? (
										<img src={urlFunc.replaceUrl(item.thumbnail, "obs")} />
									) : (
										<img src={urlFunc.replaceUrl(item.picPath, "obs")} />
									)}
								</div>
								<div className="item-del-icon" onClick={removecentermain(item)}>
									<DeleteOutlined />
								</div>
							</div>
						</List.Item>
					)}
				/>
			</div>
		</Space>
	)
}

const CenterMainScene = useMini(_CenterMainScene)

export default CenterMainScene
