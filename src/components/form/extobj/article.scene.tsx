import ArticleMediaModal from "@/components/modal/async/articleMedia.modal"
import { AsyncModal } from "@/components/modal/modal.context"
import { assetData } from "@/interfaces/extdata.interface"
import { useForceUpdate, useMini } from "@/utils/use.func"
import { FileTextOutlined } from "@ant-design/icons"
import { Button, Space, Typography } from "antd"
import { remove } from "lodash"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "umi"

interface Props {
	data: assetData
}
const _MainScene: React.FC<Props> = props => {
	const Intl = useIntl()
	const { data } = props
	const { extdata } = data
	const { info } = extdata
	const forceUpdate = useForceUpdate()
	const removeArticle = useCallback(async () => {
		info.custom.detailArticle.title = undefined
		info.custom.detailArticle.id = undefined
		forceUpdate()
	}, [])
	const selectMedia = useCallback(async () => {
		const selectData = await AsyncModal({
			content: ArticleMediaModal,
			params: { info }
		})
		info.custom.detailArticle.title = selectData.title || undefined
		info.custom.detailArticle.id = selectData.id || undefined
		forceUpdate()
	}, [])
	return (
		<Space className="full-w" direction="vertical">
			<Space className="full-w between" direction="horizontal" align="center">
				<Typography.Text strong>{<FormattedMessage id="jmk.addmaterial.Detaileddescription" />}:</Typography.Text>
				<Button size="small" type="primary" ghost onClick={selectMedia}>
					{<FormattedMessage id="jmk.addmaterial.Selectarticles" />}
				</Button>
			</Space>
			<div
				hidden={!info.custom.detailArticle.id}
				style={{ background: "#000", padding: "5px 10px", boxShadow: "0 0 6px -2px #aaa inset" }}
			>
				<Space className="full-w" direction="horizontal">
					<FileTextOutlined style={{ fontSize: 40 }} />
					<Space direction="vertical" align="center">
						<Typography.Text>{info.custom.detailArticle.title}</Typography.Text>
						<Button type="link" onClick={removeArticle}>
							{<FormattedMessage id="jmk.addmaterial.delete" />}
						</Button>
					</Space>
				</Space>
			</div>
		</Space>
	)
}

const MainScene = useMini(_MainScene)

export default MainScene
