import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, InputNumber, message, Select, Tabs } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import serviceScene from "@/services/service.scene"
const cardStyle = { width: 600 }
const { TabPane } = Tabs
import eventBus from "@/utils/event.bus"
const Option = Select

let timeout: NodeJS.Timeout
let currentValue: string

function fetch(value: string = "", callback: Function) {
	if (timeout) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = value

	function fake() {
		// serviceScene.searchUsers({ keyword: value }).then(rslt => {
		// 	if (currentValue === value) {
		// 		callback(rslt.data.list)
		// 	}
		// })
	}

	timeout = setTimeout(fake, 300)
}

interface Props {
	id: string
	userinfo: string
}
interface details {
	name: string
	key: number
	detailList: number[]
}

const AddDetailsModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [searchValue, setSearchValue] = useState("")
	const [form] = Form.useForm()
	useEffect(() => {}, [])
	const Tabsoption = [
		{
			name: "图片",
			key: 1,
			detailList: [] as any[]
		}
	]
	//  提交
	const onFinish = useCallback(data => {
		const { name, validSz, userId } = data
	}, [])
	//  select搜索事件
	const handleSearch = (value: string) => {
		if (value) {
		} else {
		}
	}
	// select change事件
	const handleChange = (value: string) => {
		setSearchValue(value)
	}
	// 关闭弹窗
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	return (
		<Card
			style={cardStyle}
			title="我的素材"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			{/* <Tabs defaultActiveKey="1" onChange={handleChange}>
				<TabPane tab="Tab 1" key="1">
					Content of Tab Pane 1
				</TabPane>
				<TabPane tab="Tab 2" key="2">
					Content of Tab Pane 2
				</TabPane>
				<TabPane tab="Tab 3" key="3">
					Content of Tab Pane 3
				</TabPane>
			</Tabs> */}
		</Card>
	)
}

export default AddDetailsModal
