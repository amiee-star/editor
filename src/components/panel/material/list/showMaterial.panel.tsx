import { JMKContext } from "@/components/provider/jmk.context"
import { panelContext } from "@/components/provider/panel.context"
import Grow from "@/components/transitions/grow"
import { assetData } from "@/interfaces/extdata.interface"
import { useMini } from "@/utils/use.func"
import React, { useContext, useEffect, useMemo, useState } from "react"
import { useIntl } from "umi"
import MaterialEdit from "./material.edit"
import "./material.list.panel.less"
const _ShowMaterialPanel: React.FC = () => {
	const Intl = useIntl()
	const { state } = useContext(panelContext)
	const show = useMemo(() => state.model !== "base" && state.action === "edit" && state.assetAction === "edit", [state])
	const currentAsset = useMemo(() => state.asset, [state])

	return (
		<Grow in={show}>
			<div id="ShowMaterialPanel" className="panel-box">
				<div style={{ overflow: "auto" }}>
					<MaterialEdit data={currentAsset} />
				</div>
			</div>
		</Grow>
	)
}

const ShowMaterialPanel = useMini(_ShowMaterialPanel)
export default ShowMaterialPanel
