import React, { useEffect } from "react"
import { ConfigProvider } from "antd"
import { getLocale } from "umi"
const ProjectEntry: React.FC = props => {
	useEffect(() => {
		document.getElementById("app").classList.add(getLocale())
	}, [])
	return <ConfigProvider>{props.children}</ConfigProvider>
}
export default ProjectEntry
