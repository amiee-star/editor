import { JobItem } from "@/interfaces/jmt.interface"
import commonFunc from "@/utils/common.func"
import eventBus from "@/utils/event.bus"
import urlFunc from "@/utils/url.func"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Progress, Skeleton, Space } from "antd"
import { RcFile } from "antd/lib/upload"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { JMKContext } from "../provider/jmk.context"
import { ModalRef } from "./modal.context"
interface Props {
  type:string
  url:string
}

const PreviewModal: React.FC<Props & ModalRef> = props => {
	const { modalRef,type,url} = props
	const { state } = useContext(JMKContext)
  const videoRef = useRef<HTMLVideoElement>()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	useEffect(() => {

	}, [])
	return (
		<Card
			id="PreviewModal"
			title="视频预览"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Space direction="vertical">
				<div style={{ maxWidth: 800, overflowX: "hidden" }}>
          {type == "video" ?<video
							ref={videoRef}
							src={urlFunc.replaceUrl(url)}
              controls
              autoPlay
							controlsList="nodownload nofullscreen"
							disablePictureInPicture
							disableRemotePlayback
							preload="auto"
							width="100%"
						/>:<audio src={urlFunc.replaceUrl(url)}></audio> }
				</div>
			</Space>
		</Card>
	)
}

export default PreviewModal
