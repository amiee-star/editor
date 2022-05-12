import { Spin } from "antd"
import React from "react"

const PageLoading: React.FC = () => {
	return (
		<div
			style={{
				position: "absolute",
				width: "100%",
				height: "100%",
				display: "flex",
				justifyContent: "center",
				alignItems: "center"
			}}
		>
			<Spin size="large" />
		</div>
	)
}
export default PageLoading
