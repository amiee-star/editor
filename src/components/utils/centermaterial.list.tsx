import { baseRes, PageData, PageParams } from "@/interfaces/api.interface"
import serviceScene from "@/services/service.scene"
import lsFunc from "@/utils/ls.func"
import { useMini } from "@/utils/use.func"
import { Col, Input, List, Pagination, Row, Select, Radio } from "antd"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { FormattedMessage } from "umi"
import { JMKContext } from "../provider/jmk.context"
import "./centermaterial.list.less"
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
	withFilter?: boolean
	params?: { [key: string]: any }
}
function _Materiallist<T>(props: Props<T>) {
	const { itemRender, apiService, withFilter, params } = props
	const [data, setData] = useState<
		PageData & {
			list: T[]
		}
	>({ currentPage: 1, count: 0, pageSize: 16, list: [] })
	const { state, dispatch: JMKSet } = useContext(JMKContext)
	const [currentPage, setCurrentPage] = useState(1)

	const [options, setOptions] = useState<{ label: string; value: string }[]>([])
	const tagIdRef = useRef("1")
	const keywordsRef = useRef("")
	const onChange = useCallback(value => {
		tagIdRef.current = value.target.value
		getData(1)
	}, [])
	// const keywordsChange = useCallback(value => ((keywordsRef.current = value.target.value), getData(1)), [])
	const pageChange = useCallback((index: number) => getData(index), [])
	// useEffect(() => {
	// 	if (withFilter) {
	// 		serviceScene.getPictureTags().then(res => {
	// 			setOptions(
	// 				res.data
	// 					.map(m => ({ label: m.name, value: m.tagId }))
	// 					.concat([{ label: "全部", value: "全部" }])
	// 					.reverse()
	// 			)
	// 		})
	// 	}
	// }, [withFilter])
	const getData = useCallback(
		(index: number = 1) => {
			let p = {
				// subType: tagIdRef.current === "5" ? 1 : 0,
				// fileType: tagIdRef.current === "5" ? "4" : tagIdRef.current,
				fileType: tagIdRef.current,
				tempId: state.sceneName,
				tagId: keywordsRef.current,
				currentPage: index,
				pageNum: index,
				pageSize: 16,
				...params
			}
			apiService(p).then(res => {
				setCurrentPage(index)
				setData(res.data)
			})
		},

		[currentPage, params]
	)
	useEffect(() => {
		getData()
	}, [params])
	return (
		<>
			{withFilter && (
				<Row className="list-filter" align="middle" justify="space-between" gutter={16}>
					<Col span={24} className="marbtm">
						<Radio.Group onChange={onChange} defaultValue="1">
							<Radio.Button value="1">
								<FormattedMessage id="jmk.left.img" />
							</Radio.Button>
							<Radio.Button value="2">
								<FormattedMessage id="jmk.left.gif" />
							</Radio.Button>
							<Radio.Button value="3">
								<FormattedMessage id="jmk.left.video" />
							</Radio.Button>
							{/* <Radio.Button value="4">
								<FormattedMessage id="jmk.left.model" />
							</Radio.Button>
							<Radio.Button value="15">
								<FormattedMessage id="jmk.left.ring" />
							</Radio.Button> */}
						</Radio.Group>
					</Col>
					{/* <Col span={24}>
						标签：
						<Radio.Group onChange={keywordsChange} defaultValue="全部">
							{options.map(m => {
								return (
									<Radio.Button key={m.value} value={m.value}>
										{m.label}
									</Radio.Button>
								)
							})}
						</Radio.Group>
					</Col> */}
				</Row>
			)}
			<div className="list-box centerlist-box">
				<List grid={{ gutter: 8, column: 4 }} dataSource={data.list} renderItem={itemRender} />
			</div>
			<div className="page-box flex-cn ">
				<Pagination
					hideOnSinglePage
					onChange={pageChange}
					current={currentPage}
					pageSize={16}
					total={data.count}
					showSizeChanger={false}
				/>
			</div>
		</>
	)
}
const Materiallist = useMini(_Materiallist)
export default Materiallist
