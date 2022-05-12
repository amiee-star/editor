import { JobItem } from "@/interfaces/jmt.interface"
import serviceLocal from "@/services/service.local"
import eventBus from "@/utils/event.bus"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Progress, Skeleton, Space } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { JMKContext } from "../provider/jmk.context"
import { ModalRef } from "./modal.context"
interface Props {
	jobsId: number
}
const BakeRenderModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, jobsId } = props
	const [jobsList, setJobsList] = useState<JobItem[]>([])
	const { state } = useContext(JMKContext)
	const taskQueen = useRef<NodeJS.Timeout>()
	const getImage = useCallback(() => {
		serviceLocal.renderResult(jobsId).then(res => {
			try {
				viewer.current && viewer.current.update(res)
				taskQueen.current = setTimeout(getImage, 1000)
			} catch (error) {
				taskQueen.current = setTimeout(getImage, 1000)
			}
		})
	}, [jobsId, state])
	const imgRef = useRef<HTMLCanvasElement>()
	const viewer = useRef<{ update: Function }>()
	useEffect(() => {
		eventBus.on("jmk.jobs.task", setJobsList)
		getImage()
		return () => {
			clearTimeout(taskQueen.current)
			taskQueen.current = undefined
			eventBus.off("jmk.jobs.task", setJobsList)
		}
	}, [])
	useEffect(() => {
		viewer.current = state.editHook && imgRef.current && state.editHook.getStaticRenderViewer(imgRef.current)
	}, [state])
	const closeModal = useCallback(() => {
		serviceLocal.cancleJob(jobsId).then(() => {
			modalRef.current.destroy()
		})
	}, [jobsId])
	const currentJob = useMemo(() => jobsList.find(m => m.id === jobsId), [jobsList, jobsId])
	useEffect(() => {
		if (currentJob && currentJob.state !== "RUNNING" && taskQueen.current) {
			clearTimeout(taskQueen.current)
			taskQueen.current = undefined
			modalRef.current.destroy()
		}
	}, [jobsList])
	return (
		<Card
			id="BakeRenderModal"
			title="预渲染"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Space direction="vertical">
				<div style={{ maxWidth: 800, overflowX: "hidden" }}>
					<canvas
						ref={imgRef}
						hidden={!currentJob?.progress?.done}
						width="800"
						style={{ minHeight: 400, background: "#000" }}
					/>
					{!currentJob?.progress?.done && <Skeleton.Image style={{ width: 800, height: 400 }} />}
				</div>

				<Progress
					size="small"
					strokeColor={{
						"0%": "#108ee9",
						"100%": "#87d068"
					}}
					showInfo={false}
					percent={
						!!currentJob && !!currentJob.progress && !!currentJob.progress.done
							? (currentJob.progress.done / currentJob.progress.total) * 100
							: 0
					}
				/>
			</Space>
		</Card>
	)
}

export default BakeRenderModal
