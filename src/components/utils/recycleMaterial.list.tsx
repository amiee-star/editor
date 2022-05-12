import { baseRes, PageData, PageParams } from "@/interfaces/api.interface"
import serviceLocal from "@/services/service.local"
import serviceScene from "@/services/service.scene"
import { doTree } from "@/utils/array.fix"
import eventBus from "@/utils/event.bus"
import lsFunc from "@/utils/ls.func"
import { useMini } from "@/utils/use.func"
import { Col, Input, List, Pagination, Row, Select, Radio, Tabs, Button, Modal, Cascader } from "antd"
import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "umi"
import { JMKContext } from "../provider/jmk.context"
import "./recycleMaterial.list.less"
interface Props<T> {
	itemRender: (item: T) => JSX.Element
	apiService: (
		params: { [key: string]: any } & PageParams
	) => Promise<
		baseRes<
			PageData & {
				entities: T[]
			}
		>
	>
	withFilter?: boolean
  params?: { [key: string]: any }
  Currentcheckbox:[]
}
function _RecycleMateriallist<T>(props: Props<T>) {
  const { itemRender, apiService, withFilter, params,Currentcheckbox } = props
  const { TabPane } = Tabs
  const Intl = useIntl()
  const { state, dispatch: JMKSet } = useContext(JMKContext)
	const [data, setData] = useState<
		PageData & {
			entities: T[]
		}
	>({ currentPage: 1, count: 0, pageSize: 16, entities: [] })
	const [currentPage, setCurrentPage] = useState(1)

	const [options, setOptions] = useState<{ label: string; value: string }[]>([])
	const tagIdRef = useRef("1")
	const keywordsRef = useRef("")
	const onChange = useCallback(value => {
    tagIdRef.current = value
		getData(1)
	}, [])
  const searchValRef = useRef("")
  const onChangeVal = useCallback(
		e => {
      searchValRef.current = e.target.value
		},
		[]
  )
  const category_1 = useRef("")
  const category_2 = useRef("")
  const category_3 = useRef("")
  const changeClass = useCallback((category, selectedOptions)=>{
    if(category.length == 0) {
      category_1.current = ""
      category_2.current =""
      category_3.current=""
    } else if(category.length == 1){
      category_1.current = category[0]
      category_2.current =""
      category_3.current=""
    } else if(category.length == 2){
      category_1.current = category[0]
      category_2.current =category[1]
      category_3.current=""
    } else if(category.length == 3){
      category_1.current = category[0]
      category_2.current =category[1]
      category_3.current=category[2]
    }
    getData()
  },[])
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
        inRecycleBin:1,
        wd:searchValRef.current,
				fileType: tagIdRef.current,
				currentPage: index,
				// page: index,
        pageSize: 12,
        category_1:category_1.current,
        category_2:category_2.current,
        category_3:category_3.current,
				// ...params
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
  const handleRestore = useCallback(()=>{
    const id = Currentcheckbox.length&&Currentcheckbox[0].picId
    const type = Currentcheckbox.length&&Currentcheckbox[0].fileType
    // const paramsData  = {id:id,type:type}
    Modal.confirm({
      title: Intl.formatMessage({ id: "jmk.outLine.tip" }),
      content: Intl.formatMessage({ id: "jmk.setup.restoreTip"  }),
      closable: true,
      onOk: () => {
        const paramsData  = {id:id,type:type}
        serviceLocal.restoreAsset(paramsData).then(res => {
          if (res.code == "200") {
            getData()
            eventBus.emit("jmk.getNewAssets","200")
          }
        })

      },
      onCancel() {

      },
    })

  },[Currentcheckbox])
  const onSearch = useCallback((value, event)=>{
    getData(1)
  },[currentPage, params])
  const [classOptions,setClassOptions] = useState([])
  useEffect(()=>{
    serviceLocal.getClassify(state.sceneName, "").then(res => {
			if (res.code == "200") {
				setClassOptions(doTree(res.data, "key", "pid"))
			}
		})
  },[])
  const OperationsSlot =
        <div className="action-bar">
          <Button type="primary" className={"desterilize-btn"} onClick={handleRestore}>{<FormattedMessage id="jmk.setup.recycleDesterilize" />}</Button>
          {!!state.sceneCofing?.info.category.visible && (
            <Cascader
            fieldNames={{ label: 'title', value: 'key', children: 'children' }}
            options={classOptions}
            changeOnSelect={true}
            onChange={changeClass}
          />
          )}
          <Input.Search
          style={{width:180,marginLeft:10}}
          placeholder={Intl.formatMessage({ id: "jmk.setup.searchTip" })}
          onSearch={onSearch}
          onChange={onChangeVal}/>
        </div>


	return (
		<>
    <div id="recycleMaterial-box">
			{withFilter && (
        <>
				<Row className="list-filter" align="middle" justify="space-between" gutter={16}>
					<Col span={24} className="marbtm">
						{/* <Radio.Group onChange={onChange} defaultValue="1">
							<Radio.Button value="1">
								<FormattedMessage id="jmk.left.img" />
							</Radio.Button>
							<Radio.Button value="2">
								<FormattedMessage id="jmk.left.gif" />
							</Radio.Button>
							<Radio.Button value="3">
								<FormattedMessage id="jmk.left.video" />
							</Radio.Button>
							<Radio.Button value="4">
								<FormattedMessage id="jmk.left.model" />
							</Radio.Button>
							<Radio.Button value="15">
								<FormattedMessage id="jmk.left.ring" />
							</Radio.Button>
						</Radio.Group> */}

        <Tabs tabBarExtraContent={OperationsSlot} onChange={onChange} defaultActiveKey="1">
          <TabPane tab={<FormattedMessage id="jmk.left.img" />} key="1">
          </TabPane>
          <TabPane tab={<FormattedMessage id="jmk.left.gif" />} key="2">
          </TabPane>
          <TabPane tab={<FormattedMessage id="jmk.left.video" />} key="3">
          </TabPane>
          <TabPane tab={<FormattedMessage id="jmk.left.model" />} key="4">
          </TabPane>
          <TabPane tab={<FormattedMessage id="jmk.left.ring" />} key="15">
          </TabPane>
        </Tabs>
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

        </>
			)}
			<div className="list-box centerlist-box">
				<List grid={{ gutter: 8, column: 4 }} dataSource={data.entities} renderItem={itemRender} />
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
      </div>
		</>
	)
}
const RecycleMateriallist = useMini(_RecycleMateriallist)
export default RecycleMateriallist
