import { Button, Typography, Space } from "antd"
import React, { useContext, useState } from "react"
import { useForceUpdate, useMini } from "@/utils/use.func"
import ItemSwitch from "@/components/form/item.switch"
import { JMKContext } from "../provider/jmk.context"
import { ModalCustom } from "@/components/modal/modal.context"
import AddDetailsModal from "@/components/modal/addDetails.modal"
import Item from "antd/lib/list/Item"
import { assetData } from "@/interfaces/extdata.interface"
import { FormattedMessage } from "umi"
interface Props {
	data: assetData
}

const _detailsPanel: React.FC<Props> = () => {
	const addDetails = (item: any) => () => {
		ModalCustom({
			content: AddDetailsModal,
			params: {
				id: item.id,
				userinfo: item.belongerTelephone || item.belonger
			}
		})
	}
	const forceUpdate = useForceUpdate()
	const [outAll] = useState({ outDetails: true })
	return (
		<div>
			<Space className="full-w" direction="vertical">
				<Space className="full-w between" direction="horizontal" align="center">
					<Typography.Text strong>
						<FormattedMessage id="jmk.info" />：
					</Typography.Text>
					<Typography.Text type="secondary">
						<ItemSwitch size="small" forceUpdate={forceUpdate} item={outAll} valueKey="outDetails" />
					</Typography.Text>
				</Space>
				<Space className="full-w between">
					<Typography.Text type="secondary">
						<FormattedMessage id="jmk.addmaterial.Mainexhibitionarea" />:
					</Typography.Text>
					<Typography.Text type="secondary">
						<Button type="dashed" size="small" block onClick={addDetails(Item)}>
							<FormattedMessage id="jmk.addmaterial.Choosematerial" />
						</Button>
					</Typography.Text>
				</Space>
			</Space>
		</div>
	)
}
const DetailsPanel = useMini(_detailsPanel)
export default DetailsPanel
