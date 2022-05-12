import fileType from "@/constant/file.type"
import { baseRes, PageData, PageParams } from "@/interfaces/api.interface"
import serviceLocal from "@/services/service.local"
import { doTree } from "@/utils/array.fix"
import eventBus from "@/utils/event.bus"
import { useMini } from "@/utils/use.func"
import { Button, Cascader, Col, Form, Input, List, Pagination, Row, Select } from "antd"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "umi"
import MaterialUploadModal from "../modal/async/material.upload"
import { AsyncModal } from "../modal/modal.context"
import { JMKContext } from "@/components/provider/jmk.context"
import lsFunc from "@/utils/ls.func"

interface Props<T> {
	itemRender: (item: T) => JSX.Element
	apiService: (
		params: { [key: string]: any } & PageParams
	) => Promise<
		baseRes<
			PageData & {
				list: T[]
			}
		>
	>
	params?: { [key: string]: any }
	isShowThumbnail: boolean
	fileAccept?: "image/*" | "video/*" | "audio/*" | ".zip,.rar" | ".png, .jpg, .jpeg" | ".ies" | ".gif" | ".jm2"
	checkType?: keyof typeof fileType
	cardTitle?: any
	uploadTip?: any
}
function _MaterialList<T>(props: Props<T>) {
	const Intl = useIntl()
	const [form] = Form.useForm()
	const { state, dispatch: JMKSet } = useContext(JMKContext)
	const { itemRender, apiService, params, isShowThumbnail, fileAccept, checkType, cardTitle, uploadTip } = props
	const [data, setData] = useState<
		PageData & {
			list: T[]
		}
	>({ currentPage: 1, count: 0, pageSize: 20, list: [] })
	const tempId = lsFunc.getItem("sceneName")
	const [currentPage, setCurrentPage] = useState(1)
	const searchValRef = useRef("")
	const onChangeVal = useCallback(e => {
		searchValRef.current = e.target.value
	}, [])
	const tagId = useRef("")
	const handlechange = useCallback(val => {
		tagId.current = val
		getData()
	}, [])
	const pageChange = useCallback((index: number) => getData(index), [])
	const getData = useCallback(
		(index: number = 1) => {
			apiService({
				pageNum: index,
				pageSize: 20,
				// ...params
				fileType: params.fileType,
				tempId: tempId,
				hotIcon: params.fileType == 10 ? true : false,
				keywords: searchValRef.current,
				tagId: tagId.current,
				musicTypeId: tagId.current
			}).then(res => {
				setCurrentPage(index)
				setData(res.data)
			})
		},
		[currentPage, params, state]
	)
	useEffect(() => {
		if (!!params && !!state.sceneName) {
			getData()
		}
	}, [params, state.sceneName])
	const onSearch = useCallback(
		(value, event) => {
			getData()
		},
		[currentPage, params]
	)
	useEffect(() => {
		eventBus.on("jmk.getNewAssets", e => {
			getData()
		})
		return () => {
			eventBus.off("jmk.getNewAssets")
		}
	}, [])
	const [classOptions, setClassOptions] = useState([])
	useEffect(() => {
		if (!!state.sceneName) {
			if (params.fileType == 11) {
				serviceLocal.musicType({ tempId: state.sceneName }).then(res => {
					if (res.code == "200") {
						setClassOptions(res.data)
					}
				})
			} else {
				serviceLocal.assetsClass({ tempId: state.sceneName }).then(res => {
					if (res.code == "200") {
						setClassOptions(res.data)
					}
				})
			}
		}
	}, [state])

	return (
		<>
			{/* {!!state.sceneCofing?.info.category.visible && (
				<Row className="list-filter" align="middle" justify="space-between" gutter={16}>
					<Col span={24}>
						<Cascader
							fieldNames={{ label: "title", value: "key", children: "children" }}
							options={classOptions}
							changeOnSelect={true}
							onChange={changeClass}
						/>
					</Col>
				</Row>
			)} */}

			<Row className="list-filter" align="middle" justify="space-between">
				<Col span={12}>
					<Select dropdownMatchSelectWidth={false} onChange={handlechange} defaultValue="">
						{[{ name: <FormattedMessage id="jmk.all" />, tagId: "", musicTypeId: "" }]
							.concat(classOptions)
							.map(item => (
								<Select.Option
									key={params.fileType == 11 ? item.musicTypeId : item.tagId}
									value={params.fileType == 11 ? item.musicTypeId : item.tagId}
								>
									{item.name}
								</Select.Option>
							))}
					</Select>
				</Col>
				<Col span={12}>
					<Input.Search
						placeholder={Intl.formatMessage({ id: "jmk.setup.searchTip" })}
						onSearch={onSearch}
						onChange={onChangeVal}
					/>
				</Col>
				{/* 原上传素材按钮 */}
				{/* <Col span={8}>
					<Button onClick={uploadMaterial} block style={{ backgroundColor: "#19a0f1", borderRadius: "5px" }}>
						<i
							className="iconfont iconshangchuan"
							style={{ margin: " -20px 20px", display: "block", fontSize: "25px", color: "#eeeeee" }}
						></i>
					</Button>
				</Col> */}
			</Row>
			{/* <Form
				labelCol={{ span: 8 }}
				wrapperCol={{ span: 16 }}
				onValuesChange={onValuesChange}
				onFinish={onFinish}
        form={form}
			>
        <Form.Item label="">
        <Cascader
            fieldNames={{ label: 'title', value: 'key', children: 'children' }}
            // options={classOptions}
            changeOnSelect={true}
          />
				</Form.Item>
        	<Form.Item label="">
					<Form.Item name={["category", "visible"]} noStyle valuePropName="checked" >
          <Input.Search
						placeholder={Intl.formatMessage({ id: "jmk.setup.searchTip" })}
						onSearch={onSearch}
						onChange={onChangeVal}
					/>
					</Form.Item>
           <Button onClick={uploadMaterial} block style={{ backgroundColor: "#19a0f1", borderRadius: "5px" }}>
						<i
							className="iconfont iconshangchuan"
							style={{ margin: " -20px 20px", display: "block", fontSize: "25px", color: "#eeeeee" }}
						></i>
					</Button>
				</Form.Item>
        </Form> */}
			<div className="list-box">
				<List grid={{ gutter: 8, column: 2 }} dataSource={data.list} renderItem={itemRender} />
			</div>
			<div className="page-box flex-cn ">
				<Pagination
					hideOnSinglePage
					onChange={pageChange}
					current={currentPage}
					pageSize={20}
					total={data.count}
					showSizeChanger={false}
				/>
			</div>
		</>
	)
}
const MaterialList = useMini(_MaterialList)
export default MaterialList
