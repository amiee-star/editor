import commonFunc from "@/utils/common.func"
import { Spin } from "antd"
import { debounce, isString } from "lodash"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { animated, useSpring } from "react-spring"
import { useGesture } from "react-use-gesture"
import { Handler } from "react-use-gesture/dist/types"
import "./photo.view.less"

interface Props {
	src: string
	loadEle?: React.ReactNode
	maxScale?: number | "auto"
	onClick?: Function
}
const PhotoView: React.FC<Props> = props => {
	const { src, maxScale = "auto", loadEle = <Spin size="large" /> } = props
	const [imgData, setImgData] = useState({ width: 0, height: 0, sourceWidth: 0, sourceHeight: 0 })
	const mobile = commonFunc.browser().mobile

	const [{ x, y, scale }, setState] = useSpring(() => ({
		scale: 1,
		x: 0,
		y: 0,
		config: {
			tension: 300
		}
	}))
	let countTime: NodeJS.Timeout
	const PhotoBox = useRef<HTMLDivElement>()
	const isMove = useRef(false)
	const dragTime = useRef(0)
	const lastVal = useRef([0, 0])
	const imgRef = useRef<HTMLImageElement>()
	const getBounds = useCallback(() => {
		if (PhotoBox.current) {
			const { width, height } = imgData
			const { offsetWidth: boxW, offsetHeight: boxH } = PhotoBox.current
			const imgW = width * scale.get()
			const imgH = height * scale.get()

			return imgW > boxW && imgH > boxH
				? {
						left: -(imgW - boxW) / 2 - x.get(),
						right: (imgW - boxW) / 2 - x.get(),
						top: -(imgH - boxH) / 2 - y.get(),
						bottom: (imgH - boxH) / 2 - y.get()
				  }
				: {
						left: (imgW - boxW) / 2 - x.get(),
						right: -(imgW - boxW) / 2 - x.get(),
						top: (imgH - boxH) / 2 - y.get(),
						bottom: -(imgH - boxH) / 2 - y.get()
				  }
		} else {
			return { left: 0, right: 0, top: 0, bottom: 0 }
		}
	}, [scale, imgData, x, y])
	const singleTap = useCallback(
		e => {
			if (isMove.current || dragTime.current) return
			props.onClick && props.onClick()
		},
		[countTime]
	)
	const maskHandle = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (e.target === imgRef.current) return
		props.onClick && props.onClick()
	}
	const doubleTap = useCallback(e => {
		if (scale.get() > 1) {
			const val = getPositionOnMoveOrScale(x.get(), y.get(), e.clientX, e.clientY, scale.get(), 1)
			setState(val)
			lastVal.current = [val.x, val.y]
		} else {
			setState({ scale: 2 })
		}
	}, [])
	const withDebounceTap = useCallback((singleTap, doubleTap) => {
		let countClick = 0
		const debounceTap = debounce(e => {
			countClick = 0
			singleTap(e)
			isMove.current = false
		}, 300)
		return (e: any) => {
			e.event.preventDefault()
			countClick += 1
			debounceTap(e)
			if (countClick >= 2) {
				debounceTap.cancel()
				countClick = 0
				doubleTap(e)
				isMove.current = false
			}
		}
	}, [])

	const getPositionOnMoveOrScale = useCallback(
		(
			x: number,
			y: number,
			clientX: number,
			clientY: number,
			fromScale: number,
			toScale: number,
			offsetX?: number,
			offsetY?: number
		) => {
			if (toScale <= 1) {
				return {
					x: 0,
					y: 0,
					scale: toScale
				}
			}
			const { width: innerWidth, height: innerHeight, left, top } = PhotoBox.current.getClientRects()[0]
			const centerClientX = innerWidth / 2 + left
			const centerClientY = innerHeight / 2 + top
			// 坐标偏移
			const lastPositionX = centerClientX + x
			const lastPositionY = centerClientY + y

			// 放大偏移量
			const offsetScale = toScale / fromScale
			// 偏移位置
			const originX = clientX - (clientX - lastPositionX) * offsetScale - centerClientX
			const originY = clientY - (clientY - lastPositionY) * offsetScale - centerClientY
			return {
				x: originX + (offsetX || 0),
				y: originY + (offsetY || 0),
				scale: toScale
			}
		},
		[]
	)
	const getImgSize = useCallback((sourceWidth: number, sourceHeight: number) => {
		let width: number
		let height: number
		const { offsetWidth: innerWidth, offsetHeight: innerHeight } = PhotoBox.current
		const autoWidth = (sourceWidth / sourceHeight) * innerHeight
		const autoHeight = (sourceHeight / sourceWidth) * innerWidth
		if (sourceWidth < innerWidth && sourceHeight < innerHeight) {
			width = sourceWidth
			height = sourceHeight
		} else if (sourceWidth < innerWidth && sourceHeight >= innerHeight) {
			width = autoWidth
			height = innerHeight
		} else if (sourceWidth >= innerWidth && sourceHeight < innerHeight) {
			width = innerWidth
			height = autoHeight
		} else if (sourceWidth / sourceHeight > innerWidth / innerHeight) {
			width = innerWidth
			height = autoHeight
		} else {
			width = autoWidth
			height = innerHeight
		}
		return {
			width: Math.floor(width),
			height: Math.floor(height)
		}
	}, [])
	const imgLoad = useCallback((e: Event) => {
		const imgEle = e.target as HTMLImageElement
		const { naturalWidth: sourceWidth, naturalHeight: sourceHeight } = imgEle
		setImgData({
			sourceWidth,
			sourceHeight,
			...getImgSize(sourceWidth, sourceHeight)
		})
	}, [])

	const imgEvent = useGesture(
		{
			onTouchStartCapture: mobile ? withDebounceTap(singleTap, doubleTap) : () => {},
			onMouseDownCapture: !mobile ? withDebounceTap(singleTap, doubleTap) : () => {},
			onPinch: e => {
				const { delta, pinching, initial } = e
				const { sourceWidth, width } = imgData
				if (e.touches > 1) {
					if (!pinching) return
					const [deltaX] = delta
					const endScale = scale.get() + deltaX / 10 / 2
					// 限制最大倍数和最小倍数
					const toScale = Math.max(
						Math.min(endScale, Math.max(isString(maxScale) ? 50 : maxScale, sourceWidth / width)),
						0.1
					)
					const val = getPositionOnMoveOrScale(
						x.get(),
						y.get(),
						initial[0] + lastVal.current[0],
						initial[1] + lastVal.current[1],
						scale.get(),
						toScale
					)
					setState(val)
					lastVal.current = [val.x, val.y]
				}
			},

			onDrag: e => {
				isMove.current = false
				const { movement, event, dragging, pinching, tap } = e
				countTime = !countTime ? setInterval(() => dragTime.current++, 1) : countTime
				event.preventDefault()
				if (!pinching) {
					const [nx, ny] = movement
					const [ox, oy] = lastVal.current
					const x = ox + nx
					const y = oy + ny
					if (nx || ny) {
						isMove.current = true
					}
					setState({ x, y })
					if (!dragging) {
						clearInterval(countTime)
						countTime = null
						dragTime.current = 0
						lastVal.current = [x, y]
					}
				}
			},
			onWheel: e => {
				const { movement, wheeling, event } = e
				if (!wheeling) return
				const { sourceWidth, width } = imgData
				const [, deltaY] = movement
				const endScale = scale.get() - deltaY / 100 / 2
				// 限制最大倍数和最小倍数
				const toScale = Math.max(
					Math.min(endScale, Math.max(isString(maxScale) ? 50 : maxScale, sourceWidth / width)),
					0.1
				)
				const val = getPositionOnMoveOrScale(x.get(), y.get(), event.clientX, event.clientY, scale.get(), toScale)
				setState(val)
				lastVal.current = [val.x, val.y]
			}
		},
		{
			eventOptions: { passive: false },
			drag: {
				bounds: () => getBounds(),
				rubberband: true,
				filterTaps: !mobile
			},
			pinch: {
				rubberband: true
			},
			domTarget: imgRef.current
		}
	)
	useEffect(() => {
		const loadImg = new Image()
		loadImg.onload = imgLoad
		loadImg.src = src
	}, [])
	return (
		<div className="photo-view">
			<div className="photo-box" ref={PhotoBox} onClickCapture={maskHandle}>
				{!imgData.sourceWidth ? (
					loadEle
				) : (
					<animated.img
						ref={imgRef}
						src={src}
						width={imgData.width}
						height={imgData.height}
						{...imgEvent()}
						style={{
							x,
							y,
							scale
						}}
					/>
				)}
			</div>
		</div>
	)
}

export default PhotoView
