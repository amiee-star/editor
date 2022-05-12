import { baseRes, PageParams } from "@/interfaces/api.interface"
import eventBus from "@/utils/event.bus"
import lsFunc from "@/utils/ls.func"
import { Table } from "antd"
import { TableProps } from "antd/lib/table"
import { ColumnsType, ColumnType } from "antd/lib/table/interface"
import React, { useCallback, useEffect, useState, useRef, useMemo, useContext } from "react"
import { JMKContext } from "../provider/jmk.context"

interface apiParams extends PageParams {
	[key: string]: any
}

interface Props extends TableProps<any> {
	columns: ColumnsType<any>
	pageSize?: number
	apiService: (params: apiParams) => Promise<baseRes<any>>
	transformData?: (data?: any) => any[]
	exportData?: (data?: any) => void
	excludeCol?: string[]
	exportIndex?: (index?: number) => void
	testData?: any
}
const ArticListTable: React.FC<Props> = props => {
	const { state, dispatch: JMKSet } = useContext(JMKContext)
	const [total, setTotal] = useState(0)
	const currentPage = useRef(1)
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState<any[]>([])
	const {
		columns,
		pageSize = 10,
		apiService,
		// searchParams,
		transformData,
		exportData,
		excludeCol = [],
		exportIndex,
		testData,
		...tableProps
	} = props
	const renderColumns = useMemo(() => {
		return excludeCol.length
			? columns.filter((m: ColumnType<any>) => !(m.dataIndex && excludeCol.includes(m.dataIndex.toString())))
			: columns
	}, [columns])
	const pageChange = useCallback((index: number) => {
		currentPage.current = index
		exportIndex && exportIndex(index)
		getData(index)
	}, [])
	const getData = useCallback((index: number) => {
		setLoading(true)
		const apiParams = Object.assign({
			pageNum: index,
			pageSize,
			tempId: state.sceneName
		})
		if (!!apiService) {
			apiService(apiParams)
				.then((res: any) => {
					if (res.code == 200) {
						exportData && exportData(res.data.list || res.data)

						setData(transformData ? transformData(res.data.list || res.data) : res.data.list || res.data)
						setTotal(res.data.count || 0)
					}
				})
				.finally(() => setLoading(false))
		}
	}, [])
	useEffect(() => {
		eventBus.on("jmk.assetsAddaudio", e => {
			if (e == 200) {
				getData(currentPage.current)
			}
		})
	}, [])
	useEffect(() => {
		getData(currentPage.current)
	}, [])
	return (
		<Table
			sticky
			rowKey="id"
			loading={loading}
			size="small"
			columns={renderColumns}
			dataSource={testData || data || tableProps.dataSource}
			scroll={{
				x: "100%",
				y: 490,
				scrollToFirstRowOnChange: true
			}}
			pagination={{
				size: "default",
				position: ["bottomCenter"],
				showQuickJumper: true,
				onChange: pageChange,
				showTotal: v => {
					return <>共{v}条数据</>
				},
				total: total,
				pageSize,
				current: currentPage.current,
				showSizeChanger: false
			}}
			{...tableProps}
		/>
	)
}
export default ArticListTable
