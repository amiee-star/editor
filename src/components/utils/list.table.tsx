import { baseRes, PageParams } from "@/interfaces/api.interface"
import { Table } from "antd"
import { TableProps } from "antd/lib/table"
import { ColumnsType, ColumnType } from "antd/lib/table/interface"
import React, { useCallback, useEffect, useState, useRef, useMemo } from "react"

interface apiParams extends PageParams {
	[key: string]: any
}

interface Props extends TableProps<any> {
	columns: ColumnsType<any>
	pageSize?: number
	apiService: (params: apiParams) => Promise<baseRes<any>>
	searchParams?: any
	transformData?: (data?: any) => any[]
	exportData?: (data?: any) => void
	excludeCol?: string[]
	exportIndex?: (index?: number) => void
	testData?: any
}
const ListTable: React.FC<Props> = props => {
	const [total, setTotal] = useState(0)
	const pageNum = useRef(1)
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState<any[]>([])
	const {
		columns,
		pageSize = 20,
		apiService,
		searchParams,
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
	const pageChange = useCallback(
		(index: number) => {
			pageNum.current = index
			exportIndex && exportIndex(index)
			getData(index)
		},
		[searchParams]
	)
	const getData = useCallback(
		(index: number) => {
			setLoading(true)
			const { pageNum, ...params } = searchParams
			// const limit = pageSize > 20 ? 20 : pageSize
			// const offset = (index - 1) * (pageSize > 20 ? 20 : pageSize)
			const apiParams = Object.assign({}, params, {
				pageNum: index,
				pageSize
			})
			if (!!apiService) {
				apiService(apiParams)
					.then(res => {
						if (res.code === 200) {
							exportData && exportData(res.data.list || res.data)

							setData(transformData ? transformData(res.data.list || res.data) : res.data.list || res.data)
							setTotal(res.data.count || 0)
						}
					})
					.finally(() => setLoading(false))
			}
		},
		[searchParams]
	)
	useEffect(() => {
		if ("pageNum" in searchParams) {
			pageNum.current = searchParams.pageNum || 1
		} else {
			pageNum.current = 1
		}
		getData(pageNum.current)
	}, [searchParams])

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
				current: pageNum.current,
				showSizeChanger: false
			}}
			{...tableProps}
		/>
	)
}
export default ListTable
