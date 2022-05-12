import { AsyncModal, ModalRef } from "../modal.context"
import NewAudioMediaModal from "@/components/modal/async/newAudioMedia.modal"
import React, { useCallback, useState } from "react"
import { Button, Card } from "antd"
import { CloseOutlined, PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons"
import AudioListTable from "@/components/utils/audiolist.table"
import serviceLocal from "@/services/service.local"
import { useForceUpdate } from "@/utils/use.func"
import { FormattedMessage } from "umi"
interface Props {
	info: any
}
let musicAudio: HTMLAudioElement = null
const AudioMediaModal: React.FC<Props & ModalRef<any>> = props => {
	const { resolve, reject, modalRef, info } = props
	const forceUpdate = useForceUpdate()
	const [Currentcheckbox, setCurrentcheckbox] = useState({
		musicFile: info.custom.detailAudio.musicFile,
		name: info.custom.detailAudio.name
		// musicId: info.custom.detailAudio.musicId,
		// musicType: info.custom.detailAudio.musicType,
		// musicTypeId: info.custom.detailAudio.musicTypeId,
		// singer: info.custom.detailAudio.singer,
		// size: info.custom.detailAudio.size,
		// time: info.custom.detailAudio.time
	})
	const [CurrentMusicAudio, setCurrentMusicAudio] = useState({
		musicFile: null,
		name: null
		// musicId: null,
		// musicType: null,
		// musicTypeId: null,
		// singer: null,
		// size: null,
		// time: null
	})
	const closeModal = useCallback(() => {
		if (!!musicAudio) {
			musicAudio.pause()
			musicAudio = null
		}

		reject()
		modalRef.current.destroy()
	}, [])
	const getArticle = useCallback(() => {
		if (!!musicAudio) {
			musicAudio.pause()
			musicAudio = null
		}
		resolve(Currentcheckbox)
		modalRef.current.destroy()
	}, [Currentcheckbox])
	// const newModal = useCallback(async () => {
	// 	const selectData: any = await AsyncModal({
	// 		content: NewAudioMediaModal,
	// 		params: { info }
	// 	})
	// 	forceUpdate()
	// }, [])
	const playaudio = useCallback(
		e => {
			if (CurrentMusicAudio.musicFile == e.musicFile) {
				if (musicAudio != null) {
					musicAudio.pause()
					musicAudio = null
				}
				setCurrentMusicAudio({
					musicFile: null,
					name: null
					// musicId: null,
					// musicType: null,
					// musicTypeId: null,
					// singer: null,
					// size: null,
					// time: null
				})
			} else {
				if (musicAudio != null) {
					musicAudio.pause()
					musicAudio = null
					musicAudio = new Audio(e.musicFile)
					musicAudio.play()
				} else {
					musicAudio = new Audio(e.musicFile)
					musicAudio.play()
				}
				setCurrentMusicAudio(e)
			}
		},
		[CurrentMusicAudio]
	)

	const columns = [
		{
			title: <FormattedMessage id="jmk.type" />,
			dataIndex: <FormattedMessage id="jmk.addmaterial.audio" />,
			key: "musicFile",
			render: () => {
				return <FormattedMessage id="jmk.addmaterial.audio" />
			}
		},
		{
			title: <FormattedMessage id="jmk.name" />,
			dataIndex: "name",
			key: "name"
		},
		{
			title: <FormattedMessage id="jmk.operation" />,
			dataIndex: "",
			key: "",
			render: (e: any) => {
				return (
					<Button
						type="link"
						size="small"
						icon={CurrentMusicAudio.musicFile == e.musicFile ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
						onClick={even => {
							playaudio(e)
						}}
					>
						{CurrentMusicAudio.musicFile == e.musicFile ? (
							<FormattedMessage id="jmk.addmaterial.suspend" />
						) : (
							<FormattedMessage id="jmk.addmaterial.play" />
						)}
					</Button>
				)
			}
		}
	]
	return (
		<Card
			id="SelectMediaModal"
			style={{ width: 800 }}
			title={<FormattedMessage id="jmk.addmaterial.Selectaudio" />}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<AudioListTable
				columns={columns}
				rowKey="musicFile"
				apiService={serviceLocal.musicList}
				rowSelection={{
					selectedRowKeys: [Currentcheckbox.musicFile],
					onChange: (keys: any, data: string | any[]) => {
						if (data.length) {
							setCurrentcheckbox(data[data.length - 1])
						} else {
							setCurrentcheckbox({
								musicFile: null,
								name: null
								// musicId: null,
								// musicType: null,
								// musicTypeId: null,
								// singer: null,
								// size: null,
								// time: null
							})
						}
					},
					hideSelectAll: true
				}}
			/>
			<div className="pull-right">
				{/* <Button size="small" onClick={newModal}>
					<FormattedMessage id="jmk.newlightprobes" />
				</Button> */}
				<Button size="small" onClick={closeModal}>
					<FormattedMessage id="jmk.cancel" />
				</Button>
				<Button size="small" type="primary" onClick={getArticle}>
					<FormattedMessage id="jmk.confirm" />
				</Button>
			</div>
		</Card>
	)
}

export default AudioMediaModal
