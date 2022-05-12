import { JobItem, jobsData } from "@/interfaces/jmt.interface"
import serviceLocal from "@/services/service.local"
import eventBus from "@/utils/event.bus"
import lsFunc from "@/utils/ls.func"
import {
	CheckCircleOutlined,
	CloseCircleOutlined,
	ExclamationCircleOutlined,
	MinusCircleOutlined,
	SyncOutlined
} from "@ant-design/icons"
import { Badge, Button, List, Progress, Space, Tag, Tooltip, Typography } from "antd"
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { FormattedMessage, useIntl } from "umi"
import { useEditHook } from "../jmk/jmk.engine"
import BakeRenderModal from "../modal/bakeRender.modal"
import { ModalCustom } from "../modal/modal.context"
import { JMKContext } from "../provider/jmk.context"

const JobsBake: React.FC = () => {
	const Intl = useIntl()
	const [jobsList, setJobsList] = useState<jobsData>({ jobs: [], stateTag: "" })
	const { state } = useContext(JMKContext)
	const JMKHook = useEditHook()
	const taskQueen = useRef<NodeJS.Timeout>()
	const runTask = useCallback((stateTag: string) => {
		serviceLocal.jobsList({ stateTag }).then(res => {
			const nextTask = res.data.jobs.find(m => ["RUNNING", "WAITING"].includes(m.state))
			eventBus.emit("jmk.jobs.task", res.data.jobs)
			if (nextTask) {
				taskQueen.current = setTimeout(() => {
					runTask(res.data.stateTag)
				}, 1000)
			} else {
				!!taskQueen.current && clearTimeout(taskQueen.current)
				taskQueen.current = undefined
			}
			setJobsList(res.data)
		})
	}, [])

	useEffect(() => {
		serviceLocal.jobsList().then(res => {
			setJobsList(res.data)
			const nextTask = res.data.jobs.find(m => ["RUNNING", "WAITING"].includes(m.state))
			!!nextTask && runTask(res.data.stateTag)
		})
	}, [])
	const startTask = useCallback(() => {
		!taskQueen.current && !!jobsList.stateTag && runTask(jobsList.stateTag)
	}, [jobsList])
	const previewRender = useCallback(() => {
		serviceLocal
			.renderEditor(state.sceneName, {
				cameraFov: JMKHook.getCamera().fov,
				cameraPosition: JMKHook.getCameraPosition(),
				cameraRotation: [...JMKHook.getCameraRotation(), 0]
			})
			.then(res => {
				startTask()
				ModalCustom({
					content: BakeRenderModal,
					params: {
						jobsId: res.data.id
					}
				})
			})
	}, [state, jobsList])
	const bakeEditor = useCallback(() => {
		serviceLocal.renderSettingsEdit(state.sceneName, lsFunc.getItem("bake")).then(() => {
			serviceLocal.bakeEditor(state.sceneName).then(startTask)
		})
	}, [state, jobsList])
	const status = useMemo(
		() => ({
			DONE: {
				color: "success",
				icon: <CheckCircleOutlined />,
				cancle: false,
				text: <FormattedMessage id="jmk.success" />
			},
			CANCELED: {
				color: "default",
				icon: <MinusCircleOutlined />,
				cancle: false,
				text: <FormattedMessage id="jmk.default" />
			},
			RUNNING: {
				color: "processing",
				icon: <SyncOutlined spin />,
				cancle: true,
				text: <FormattedMessage id="jmk.processing" />
			},
			WAITING: {
				color: "warning",
				icon: <ExclamationCircleOutlined />,
				cancle: true,
				text: <FormattedMessage id="jmk.warning" />
			},
			FAILED: {
				color: "error",
				icon: <CloseCircleOutlined />,
				cancle: false,
				text: <FormattedMessage id="jmk.error" />
			}
		}),
		[]
	)
	const cancleItem = useCallback((id: number) => () => serviceLocal.cancleJob(id), [])
	const postProcess = useCallback(() => serviceLocal.postProcess(state.sceneName).then(startTask), [state, jobsList])
	const renderItem = useCallback((item: JobItem) => {
		return (
			<List.Item>
				<Space direction="vertical" className="full-w">
					<Space className="full-w between">
						<Typography.Text>{item.type}</Typography.Text>
						<div>
							<Tag icon={status[item.state].icon} color={status[item.state].color}>
								{status[item.state].text}
							</Tag>
							{status[item.state].cancle && (
								<Button type="link" icon={<CloseCircleOutlined />} size="small" onClick={cancleItem(item.id)} />
							)}
						</div>
					</Space>
					{item.state === "RUNNING" && !!item.progress && (
						<Tooltip
							title={`已完成${Math.round((item.progress.done / item.progress.total) * 100)}%; 距离完成还剩${Math.round(
								((item.progress.total - item.progress.done) / item.progress.done) * item.progress.elapsed
							)}秒`}
						>
							<Progress
								size="small"
								strokeColor={{
									"0%": "#108ee9",
									"100%": "#87d068"
								}}
								percent={Math.round((item.progress.done / item.progress.total) * 100)}
								showInfo={false}
							/>
						</Tooltip>
					)}
				</Space>
			</List.Item>
		)
	}, [])
	return (
		<Space direction="vertical" className="full-w">
			<Space direction="vertical" className="full-w" style={{ marginTop: 10 }}>
				<Button type="primary" block onClick={bakeEditor}>
					{<FormattedMessage id="jmk.baking" />}
				</Button>
				<div className="flex-cn">
					<Button type="dashed" block onClick={previewRender}>
						{<FormattedMessage id="jmk.preview" />}
					</Button>
					<Button type="dashed" block onClick={postProcess}>
						{<FormattedMessage id="jmk.PostTreatment" />}
					</Button>
				</div>
			</Space>
			{!!jobsList?.jobs.length && (
				<List
					size="small"
					header={<div>{<FormattedMessage id="jmk.TaskList" />}</div>}
					bordered
					dataSource={jobsList?.jobs}
					renderItem={renderItem}
				/>
			)}
		</Space>
	)
}

export default JobsBake
