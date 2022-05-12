import SelectMediaModal from "@/components/modal/async/selectMedia.modal"
import { AsyncModal } from "@/components/modal/modal.context"
import { assetData } from "@/interfaces/extdata.interface"
import { useMini } from "@/utils/use.func"
import { Button, List, Space, Typography } from "antd"
import React, { useCallback } from "react"
import { FormattedMessage } from "umi"
interface Props {
	data: assetData
}
const _MainScene: React.FC<Props> = props => {
	const { data } = props
	const { extdata } = data
	const { info } = extdata
	const selectMedia = useCallback(async () => {
		const selectData = await AsyncModal({
			content: SelectMediaModal
		})
	}, [])
	return (
		<Space className="full-w" direction="vertical">
			<Space className="full-w between" direction="horizontal" align="center">
				<Typography.Text strong>
					<FormattedMessage id="jmk.addmaterial.Mainexhibitionarea" />:
				</Typography.Text>
				<Button size="small" type="primary" ghost onClick={selectMedia}>
					<FormattedMessage id="jmk.addmaterial.Choosematerial" />
				</Button>
			</Space>
			<div>
				<List
					grid={{ gutter: 6, column: 4 }}
					dataSource={[{}].concat([])}
					renderItem={item => <List.Item></List.Item>}
				/>
			</div>
		</Space>
	)
}

const MainScene = useMini(_MainScene)

export default MainScene
