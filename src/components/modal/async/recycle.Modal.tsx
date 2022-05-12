import { CheckCircleTwoTone, CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, List, Space } from "antd"
import React, { useCallback, useRef, useState } from "react"
import { FormattedMessage } from "umi"
import { ModalRef } from "../modal.context"
 import RecycleMateriallist from "@/components/utils/recycleMaterial.list"
import { useForceUpdate } from "@/utils/use.func"
import lsFunc from "@/utils/ls.func"
import serviceLocal from "@/services/service.local"
import commonFunc from "@/utils/common.func"
import classNames from "classnames"
import { pictureListItem } from "@/interfaces/api.interface"

interface Props {
	info: any
}

const RecycleModal: React.FC<Props & ModalRef<any>> = props => {
	const { resolve, reject, modalRef, info } = props
	const paramsRef = useRef({
		// fileType: 1,
		token: lsFunc.getItem("token")
	})
  const [Currentcheckbox, setCurrentcheckbox] = useState([])
	const forceUpdate = useForceUpdate()
	const closeModal = useCallback(() => {
		reject()
		modalRef.current.destroy()
  }, [])
	const choiceitem = useCallback(
		item => {
      // const f =  Currentcheckbox?.some((m: { picId: string }) => {
      //   return m.picId === item.picId})
      // if(!!f) {
      //   const arr =  Currentcheckbox.filter(m => m.picId !== item.picId )
      //   setCurrentcheckbox([...arr])
      // } else {
      //   setCurrentcheckbox([...Currentcheckbox,item])
      //   forceUpdate()
      // }
      setCurrentcheckbox([item])
      forceUpdate()
		},
		[Currentcheckbox]
  )

	const itemRender = useCallback(
		(item: pictureListItem) => (
			<List.Item key={item.picId}>
				<div
					className={classNames({
						"item-box": true,
						check: Currentcheckbox?.some((m: { picId: string }) => {
							return m.picId === item.picId
						})
					})}
					onClick={() => {
						choiceitem(item)
					}}
				>
					{Currentcheckbox.some((m: { picId: string }) => {
						return m.picId === item.picId
					}) && <CheckCircleTwoTone style={{ fontSize: 30 }} />}

					<div className="item-pic">
						{item.videoThumb ? (
							<img src={commonFunc.thumb(item?.videoThumb, 150)} />
						) : item.thumbnail ? (
							<img src={commonFunc.thumb(item?.thumbnail, 150)} />
						) : (
							<img src={commonFunc.thumb(item?.picPath, 150)} />
						)}
					</div>
					<div className="item-name">{item.name}</div>
				</div>
			</List.Item>
		),
		[Currentcheckbox]
	)
	const getcentermaterial = useCallback(() => {
    resolve(info.custom.detailAlbum)
		modalRef.current.destroy()
  }, [Currentcheckbox])
	return (
		<Card
			id="RecycleModalModal"
			style={{ width: 800, height: 650 }}
			title={<FormattedMessage id="jmk.setup.recycleMaterial" />}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<RecycleMateriallist
				withFilter
				itemRender={itemRender}
				apiService={serviceLocal.assetsList}
        params={paramsRef.current}
        Currentcheckbox={Currentcheckbox}
			/>
			{/* <div className="pull-right modelfoot">
				<Button onClick={closeModal}>
					<FormattedMessage id="jmk.addmaterial.cancel" />
				</Button>
				<Button type="primary" onClick={getcentermaterial}>
					<FormattedMessage id="jmk.addmaterial.determine" />
				</Button>
			</div> */}
		</Card>
	)
}

export default RecycleModal
