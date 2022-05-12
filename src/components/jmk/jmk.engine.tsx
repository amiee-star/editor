import { coverData, JMTInterface, loadTextureParam } from "@/interfaces/jmt.interface"
import serviceAnimation from "@/services/service.animation"
import eventBus from "@/utils/event.bus"
import { useMini } from "@/utils/use.func"
import React, { useCallback, useContext, useEffect, useRef } from "react"
import { aniItem } from "../provider/ani.context"
import { JMKContext } from "../provider/jmk.context"

interface Props {
	dataUrl: string
	sceneName: string
	edit?: boolean
	coverData: coverData
}
const _JMKEngine: React.FC<Props> = props => {
	const { dataUrl, sceneName, coverData } = props
	const JMTRef = useRef<JMTInterface>(null)
	const AppRef = useRef<any>(null)
	const { dispatch } = useContext(JMKContext)
	const engineBox = useRef<HTMLDivElement>(null)
	const loadProgress = useCallback((n: any) => {
		const percent = n.totalDone() / n.total
		eventBus.emit("jmk.loading", percent)
	}, [])
	const onSceneLoaded = useCallback(
		n => {
			n.setSceneChangedCallback((e: any) => eventBus.emit("jmk.sceneChanged", e))
			n.setAssetSelectCallback((e: any) => eventBus.emit("jmk.assetSelected", e))
			n.setAssetsLoadedCallback((e: any) => eventBus.emit("jmk.assetsLoaded", e))
			n.setCamaraPositionRotationChangedCallback((e: any) => eventBus.emit("jmk.camara.change", e))
			n.loadAssets(coverData.info?.extobjs || [])

			serviceAnimation.animation(sceneName).then(res => {
				if (res.code === "200") {
					const aniList: aniItem[] = n.loadAnimations(res.data)
					aniList.forEach(item => {
						item.asset.animations = []
						item.asset.animations.push(item)
					})
				}
			})

			n.coverModified(coverData)
			dispatch({
				type: "set",
				payload: {
					app: AppRef.current,
					jmt: JMTRef.current,
					editHook: n,
					sceneName,
					sceneCofing: coverData
				}
			})
		},
		[props]
	)
	const frameLoad = useCallback((e: Event) => {
		const iframe = e.currentTarget as HTMLIFrameElement
		const { JMT } = iframe.contentWindow
		JMTRef.current = JMT
		const app: any = new JMT.Editor()
		AppRef.current = app
		app.ui.loadProgress = loadProgress
		const config: any = new JMT.SceneLoadConfig()
		config.el = "s3d-canvas"
		config.assetsUrl = dataUrl
		config.YUp = true
		config.onSceneLoaded = onSceneLoaded
		app.start(config)
	}, [])
	useEffect(() => {
		const iframe = document.createElement("iframe")
		iframe.frameBorder = "0"
		iframe.allowFullscreen = true
		iframe.id = "f3d-canvas"
		iframe.width = "100%"
		iframe.height = "100%"
		iframe.src = `${window.publicPath}jmk-editor/index.html#autoplay`
		iframe.onload = frameLoad
		engineBox.current.appendChild(iframe)
	}, [])
	return <div ref={engineBox} className="full hidden" />
}
const JMKEngine = useMini(_JMKEngine)
export default JMKEngine

export const useEditHook = () => {
	const { state } = useContext(JMKContext)
	/**
	 * 获取插件管理器
	 */
	const getExtensionManager = useCallback(() => state.editHook.getExtensionManager(), [state])
	/**
	 * 获取相机位置
	 */
	const getCameraPosition = useCallback(() => state.editHook.getCameraPosition(), [state])
	/**
	 * 获取相机旋转对象
	 */
	const getCameraRotation = useCallback(() => state.editHook.getCameraRotation(), [state])
	/**
	 * 获取相机对象
	 */
	const getCamera = useCallback(() => state.editHook.getCamera(), [state])
	/**
	 * 获取相机旋转对象
	 */
	const getSceneStats = useCallback(() => state.editHook.getSceneStats(), [state])
	/**
	 * 获取全部材质对象
	 */
	const getMaterials = useCallback(() => state.editHook.getMaterials(), [state])
	/**
	 * 获取全部灯光对象
	 */
	const getLights = useCallback(() => state.editHook.getLights(), [state])

	/**
	 * 获取全部反射球对象
	 */
	const getLightProbes = useCallback(() => state.editHook.getLightProbes(), [state])

	/**
	 * 获取全部相机体对象
	 */
	const getCameraVolumes = useCallback(() => state.editHook.getCameraVolumes(), [state])

	/**
	 * 获取全部节点对象
	 */
	const getNodes = useCallback(() => state.editHook.getNodes(), [state])
	/**
	 * 获取全部相机位
	 */
	const getViews = useCallback(() => state.editHook.getViews(), [state])
	/**
	 * 获取相机体对象类型
	 */
	const getCameraVolumeTypes = useCallback(() => state.editHook.getCameraVolumeTypes(), [state])
	/**
	 * 获取场景Json
	 */
	const getSceneJson = useCallback(() => state.editHook.getSceneJson(), [state])
	/**
	 * 获取封面Json
	 */
	const getCoverJson = useCallback(() => state.editHook.getCoverJson(), [state])
	/**
	 * 获取路径播放对象
	 */
	const getAutoTour = useCallback(() => state.editHook.getAutoTour(), [state])
	/**
	 * 获取全部导航路径
	 */
	const getAutoTours = useCallback(() => state.editHook.getAutoTours(), [state])
	/**
	 * 获取全部素材
	 */
	const getAssets = useCallback(() => state.editHook.getAssets(), [state])
	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * 添加灯对象
	 */
	const addLight = useCallback(
		(name: string, type: string, position) => state.editHook.addLight(name, type, position),
		[state]
	)
	/**
	 * 移除灯对象
	 */
	const removeLight = useCallback(light => state.editHook.removeLight(light), [state])
	/**
	 * 添加灯实例对象
	 */
	const addLightInstance = useCallback((light, instance) => state.editHook.addLightInstance(light, instance), [state])
	/**
	 * 移除灯实例对象
	 */
	const removeLightInstance = useCallback((light, instance) => state.editHook.removeLightInstance(light, instance), [
		state
	])
	/**
	 * 添加反射球对象
	 */
	const addLightProbe = useCallback((position?: any[]) => state.editHook.addLightProbe(position), [state])

	/**
	 * 移除反射球对象
	 */
	const removeLightProbe = useCallback(lightProbe => state.editHook.removeLightProbe(lightProbe), [state])
	/**
	 * 添加相机体对象
	 */
	const addCameraVolume = useCallback((type: string, name?: string) => state.editHook.addCameraVolume(type, name), [
		state
	])
	/**
	 * 移除相机体对象
	 */
	const removeCameraVolume = useCallback(cameraVolume => state.editHook.removeCameraVolume(cameraVolume), [state])
	/**
	 * 排序相机体对象
	 */
	const shiftCameraVolume = useCallback(
		(cameraVolume: string, toIndex: number) => state.editHook.shiftCameraVolume(cameraVolume, toIndex),
		[state]
	)
	/**
	 * 移除导览路径对象
	 */
	const addAutoTour = useCallback((name?: string) => state.editHook.addAutoTour(name), [state])
	/**
	 * 移除导览路径对象
	 */
	const removeAutoTour = useCallback(autoTour => state.editHook.removeAutoTour(autoTour), [state])
	/**
	 * 添加素材对象
	 */
	const addAsset = useCallback((config?: any): Promise<any> => state.editHook.addAsset(config), [state])
	/**
	 * 移除素材对象
	 */
	const removeAsset = useCallback(asset => state.editHook.removeAsset(asset), [state])
	/**
	 * 获取导览路径集合
	 */
	const getTours = useCallback(() => state.editHook.getTours(), [state])
	/**
	 * 移除导览路径
	 */
	const removeTour = useCallback(tour => state.editHook.removeTour(tour), [state])
	/**
	 * 添加导览路径
	 */
	const addTour = useCallback((config?: any) => state.editHook.addTour(config), [state])
	/**
	 * 标记截图区域
	 */
	const markScreenshotArea = useCallback((scale?: number) => state.editHook.markScreenshotArea(scale), [state])
	/**
	 * 取消截图区域标记
	 */
	const unmarkScreenshotArea = useCallback(() => state.editHook.unmarkScreenshotArea(), [state])
	/**
	 * 保存屏幕到缓存
	 */
	const screenToBuffer = useCallback(
		(isPano: boolean, width: number, height: number) => state.editHook.screenToBuffer(isPano, width, height),
		[state]
	)
	/**
	 * 添加相机位
	 */
	const addViewFromCamera = useCallback((name: string, mode: string) => state.editHook.addViewFromCamera(name, mode), [
		state
	])
	/**
	 * 重置相机位
	 */
	const resetViewFromCamera = useCallback(view => state.editHook.resetViewFromCamera(view), [state])
	/**
	 * 移除相机位
	 */
	const removeView = useCallback(view => state.editHook.removeView(view), [state])
	/**
	 * 调整相机位顺序
	 */
	const shiftView = useCallback((view, index: number) => state.editHook.shiftView(view, index), [state])
	/**
	 * 激活相机位天空盒
	 */
	const activateSkyForView = useCallback(sky => state.editHook.activateSkyForView(sky), [state])
	/**
	 * 切换相机位视角
	 */
	const switchToView = useCallback(view => state.editHook.switchToView(view), [state])
	/**
	 * 重命名相机位
	 */
	const renameView = useCallback((view, name?: string) => state.editHook.renameView(view, name), [state])
	/**
	 * 更新隐藏Mesh
	 */
	const updateHiddenMeshes = useCallback((node?: any) => state.editHook.updateHiddenMeshes(node), [state])
	/**
	 * 获取默认天空盒
	 */
	const getSky = useCallback(() => state.editHook.getSky(), [state])
	/**
	 * 获取全部天空盒
	 */
	const getSkys = useCallback(() => state.editHook.getSkys(), [state])
	/**
	 * 加载纹理
	 */
	const loadTexture = useCallback((param: loadTextureParam) => state.editHook.loadTexture(param), [state])
	/**
	 * 更新材质纹理
	 */
	const materialTextureUpdated = useCallback(
		(material, textureType?: string) => state.editHook.materialTextureUpdated(material, textureType),
		[state]
	)
	/**
	 * 改变天空盒纹理
	 */
	const changeSkyTexture = useCallback((url: loadTextureParam) => state.editHook.changeSkyTexture(url), [state])
	/**
	 * 移除天空盒纹理
	 */
	const removeSkyTexture = useCallback(() => state.editHook.removeSkyTexture(), [state])
	/**
	 * 获取颜色贴图名称
	 */
	const getColorMapName = useCallback(() => state.editHook.getColorMapName(), [state])
	/**
	 * 加载颜色贴图
	 */
	const loadColorMap = useCallback((url: loadTextureParam) => state.editHook.loadColorMap(url), [state])
	/**
	 * 关闭选择状态
	 */
	const disableSelection = useCallback(() => state.editHook.disableSelection(), [state])
	/**
	 * 启用材质选择状态
	 */
	const enableMaterialSelection = useCallback(() => state.editHook.enableMaterialSelection(), [state])
	/**
	 * 启用灯光选择状态
	 */
	const enableLightSelection = useCallback(() => state.editHook.enableLightSelection(), [state])
	/**
	 * 启用反射球选择状态
	 */
	const enableLightProbeSelection = useCallback(() => state.editHook.enableLightProbeSelection(), [state])
	/**
	 * 启用插件选择状态
	 */
	const enableExtensionSelection = useCallback(() => state.editHook.enableExtensionSelection(), [state])
	/**
	 * 启用位置选择状态
	 */
	const enablePositionSelection = useCallback((distance?: number) => state.editHook.enablePositionSelection(distance), [
		state
	])
	/**
	 * 启用节点选择状态
	 */
	const enableNodeSelection = useCallback(() => state.editHook.enableNodeSelection(), [state])
	/**
	 * 启用相机体选择状态
	 */
	const enableCameraVolumeSelection = useCallback(() => state.editHook.enableCameraVolumeSelection(), [state])
	/**
	 * 启用素材选择状态
	 */
	const enableAssetSelection = useCallback(() => state.editHook.enableAssetSelection(), [state])

	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	/**
	 * 选择材质
	 */
	const selectMaterial = useCallback(material => state.editHook.selectMaterial(material), [state])
	/**
	 * 替换材质
	 */
	const replaceMaterial = useCallback(
		(material, typeOfMaterial: string) => state.editHook.replaceMaterial(material, typeOfMaterial),
		[state]
	)
	/**
	 * 选择灯光
	 */
	const selectLight = useCallback(light => state.editHook.selectLight(light), [state])
	/**
	 * 选择灯光实例
	 */
	const selectLightInstance = useCallback(lightInstance => state.editHook.selectLightInstance(lightInstance), [state])
	/**
	 * 选择反射球
	 */
	const selectLightProbe = useCallback(lightProbe => state.editHook.selectLightProbe(lightProbe), [state])
	/**
	 * 选择相机体
	 */
	const selectCameraVolume = useCallback(cameraVolume => state.editHook.selectCameraVolume(cameraVolume), [state])
	/**
	 * 选择插件
	 */
	const selectExtension = useCallback(extension => state.editHook.selectExtension(extension), [state])
	/**
	 * 选择节点
	 */
	const selectNodes = useCallback(
		(nodesPrimary, nodesSecondary?: any) => state.editHook.selectNodes(nodesPrimary, nodesSecondary),
		[state]
	)
	/**
	 * 选择素材
	 */
	const selectAsset = useCallback(asset => state.editHook.selectAsset(asset), [state])
	/**
	 * 加载素材
	 */
	const loadAssets = useCallback(json => state.editHook.loadAssets(json), [state])
	/**
	 * 保存素材
	 */
	const saveAssets = useCallback(() => state.editHook.saveAssets(), [state])

	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	type Cb = (item?: any) => void
	/**
	 * 设置要素更新回调
	 */
	const setUpdateCallback = useCallback((callback: Cb) => state.editHook.setUpdateCallback(callback), [state])
	/**
	 * 设置材质选择回调
	 */
	const setMaterialSelectedCallback = useCallback(
		(callback: Cb) => state.editHook.setMaterialSelectedCallback(callback),
		[state]
	)
	/**
	 * 设置材质选择回调
	 */
	const setLightInstanceSelectedCallback = useCallback(
		(callback: Cb) => state.editHook.setLightInstanceSelectedCallback(callback),
		[state]
	)
	/**
	 * 设置节点选择回调
	 */
	const setNodeSelectedCallback = useCallback((callback: Cb) => state.editHook.setNodeSelectedCallback(callback), [
		state
	])
	/**
	 * 设置插件选择回调
	 */
	const setExtensionSelectedCallback = useCallback(
		(callback: Cb) => state.editHook.setExtensionSelectedCallback(callback),
		[state]
	)
	/**
	 * 设置位置选择回调
	 */
	const setPositionSelectedCallback = useCallback(
		(callback: Cb) => state.editHook.setPositionSelectedCallback(callback),
		[state]
	)
	/**
	 * 设置Item改变回调
	 */
	const setItemModifiedCallback = useCallback((callback: Cb) => state.editHook.setItemModifiedCallback(callback), [
		state
	])
	/**
	 * 设置相机位选择回调
	 */
	const setViewSelectedCallback = useCallback((callback: Cb) => state.editHook.setViewSelectedCallback(callback), [
		state
	])
	/**
	 * 设置场景变化回调
	 */
	const setSceneChangedCallback = useCallback((callback: Cb) => state.editHook.setSceneChangedCallback(callback), [
		state
	])
	/**
	 * 设置素材选择回调
	 */
	const setAssetSelectCallback = useCallback((callback: Cb) => state.editHook.setAssetSelectCallback(callback), [state])
	/**
	 * 设置素材选择回调
	 */
	const setAssetsLoadedCallback = useCallback((callback: Cb) => state.editHook.setAssetsLoadedCallback(callback), [
		state
	])
	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	//

	/**
	 * 修改封面对象
	 */
	const coverModified = useCallback(cover => state.editHook.coverModified(cover), [state])
	/**
	 * 修改导航路径对象
	 */
	const autoTourModified = useCallback(() => state.editHook.autoTourModified(), [state])
	/**
	 * 是否存在光照贴图
	 */
	const hasLightMap = useCallback(() => state.editHook.hasLightMap(), [state])
	/**
	 * 是否禁用进度条
	 */
	const getDisableProgressiveLoader = useCallback(() => state.editHook.getDisableProgressiveLoader(), [state])
	/**
	 * 设置进度条
	 */
	const setDisableProgressiveLoader = useCallback(loader => state.editHook.setDisableProgressiveLoader(loader), [state])
	/**
	 * 获取场景警告
	 */
	const getSceneScaleHtmlWarning = useCallback(() => state.editHook.getSceneScaleHtmlWarning(), [state])
	/**
	 * 获取Transform模式
	 */
	const getTransformMode = useCallback(() => state.editHook.getTransformMode(), [state])
	/**
	 * 设置Transform模式
	 */
	const setTransformMode = useCallback((mode: number) => state.editHook.setTransformMode(mode), [state])
	/**
	 * 获取支持的Transform模式
	 */
	const getSupportedTransformModes = useCallback(() => state.editHook.getSupportedTransformModes(), [state])
	/**
	 * 跳转到Item
	 */
	const seeItem = useCallback(item => state.editHook.seeItem(item), [state])
	/**
	 * 获取场景大小
	 */
	const getSceneBBox = useCallback(() => state.editHook.getSceneBBox(), [state])
	/**
	 * 获取素材JSON
	 */
	const getAssetsJson = useCallback(() => state.editHook.getAssetsJson(), [state])
	/**
	 * 判断是否有顶部视图并跳转
	 */
	const switchToFirstTopView = useCallback(() => state.editHook.switchToFirstTopView(), [state])

	////////////////////////////////////////////////////////////////////
	// 动画

	// 添加动画
	const addAnimation = useCallback(asset => state.editHook.addAnimation(asset), [state])

	// 获取全部动画
	const getAnimations = useCallback(() => state.editHook.getAnimations(), [state])

	// 移除动画
	const removeAnimation = useCallback(animation => state.editHook.removeAnimation(animation), [state])

	// 获取动画
	const getAnimation = useCallback(asset => state.editHook.getAnimation(asset), [state])

	// 加载全部动画
	const loadAnimations = useCallback(json => state.editHook.loadAnimations(json), [state])

	// 获取全部动画JSON
	const getAnimationsJson = useCallback(() => state.editHook.getAnimationsJson(), [state])

	// 设置动画属性改变回调
	const setAnimationUpdateCallback = useCallback(callback => state.editHook.setAnimationUpdateCallback(callback), [
		state
	])

	// 动画跳转
	const animationJumpTo = useCallback((asset, time) => state.editHook.animationJumpTo(asset, time), [state])

	// 动画播放
	const animationPlay = useCallback(
		(asset, loop?: number, repetitions?: number) => state.editHook.animationPlay(asset, loop, repetitions),
		[state]
	)

	// 动画停止
	const animationStop = useCallback(asset => state.editHook.animationStop(asset), [state])

	// 设置动画播放时回调
	const setAnimationPlayCallback = useCallback(callback => state.editHook.setAnimationPlayCallback(callback), [state])

	// 设置动画播放结束回调
	const setAnimationFinishedCallback = useCallback(callback => state.editHook.setAnimationFinishedCallback(callback), [
		state
	])

	// 设置动画播放单次循环结束回调
	const setAnimationLoopEndCallback = useCallback(callback => state.editHook.setAnimationLoopEndCallback(callback), [
		state
	])

	// 设置Views，Tours
	const loadViewsAndTours = useCallback(callback => state.editHook.loadViewsAndTours(callback), [state])

	////////////////////////////////////////////////////////////////////
	//

	return {
		/**
		 * 获取插件管理器
		 */
		getExtensionManager,
		/**
		 * 获取相机位置
		 */
		getCameraPosition,
		/**
		 * 获取相机旋转对象
		 */
		getCameraRotation,
		/**
		 * 获取相机对象
		 */
		getCamera,
		/**
		 * 获取相机旋转对象
		 */
		getSceneStats,
		/**
		 * 获取全部材质对象
		 */
		getMaterials,
		/**
		 * 获取全部灯光对象
		 */
		getLights,
		/**
		 * 获取全部反射球对象
		 */
		getLightProbes,
		/**
		 * 获取全部相机体对象
		 */
		getCameraVolumes,
		/**
		 * 获取全部节点对象
		 */
		getNodes,
		/**
		 * 获取全部相机位
		 */
		getViews,
		/**
		 * 获取全部相机体类型
		 */
		getCameraVolumeTypes,
		/**
		 * 获取场景Json
		 */
		getSceneJson,
		/**
		 * 获取封面Json
		 */
		getCoverJson,
		/**
		 * 获取路径播放对象
		 */
		getAutoTour,
		/**
		 * 获取全部导航路径
		 */
		getAutoTours,
		/**
		 * 获取全部素材
		 */
		getAssets,
		/**
		 * 添加灯对象
		 */
		addLight,
		/**
		 * 移除灯对象
		 */
		removeLight,
		/**
		 * 添加灯实例对象
		 */
		addLightInstance,
		/**
		 * 移除灯实例对象
		 */
		removeLightInstance,
		/**
		 * 添加反射球对象
		 */
		addLightProbe,
		/**
		 * 移除反射球对象
		 */
		removeLightProbe,
		/**
		 * 添加相机体对象
		 */
		addCameraVolume,
		/**
		 * 移除相机体对象
		 */
		removeCameraVolume,
		/**
		 * 排序相机体对象
		 */
		shiftCameraVolume,
		/**
		 * 移除导览路径对象
		 */
		addAutoTour,

		/**
		 * 移除导览路径对象
		 */
		removeAutoTour,
		/**
		 * 添加素材对象
		 */
		addAsset,
		/**
		 * 移除素材对象
		 */
		removeAsset,
		/**
		 * 获取导览路径集合
		 */
		getTours,
		/**
		 * 移除导览路径
		 */
		removeTour,
		/**
		 * 添加导览路径
		 */
		addTour,
		/**
		 * 标记截图区域
		 */
		markScreenshotArea,
		/**
		 * 取消截图区域标记
		 */
		unmarkScreenshotArea,
		/**
		 * 保存屏幕到缓存
		 */
		screenToBuffer,
		/**
		 * 添加相机位
		 */
		addViewFromCamera,
		/**
		 * 重置相机位
		 */
		resetViewFromCamera,
		/**
		 * 移除相机位
		 */
		removeView,
		/**
		 * 调整相机位顺序
		 */
		shiftView,
		/**
		 * 激活相机位天空盒
		 */
		activateSkyForView,
		/**
		 * 切换相机位视角
		 */
		switchToView,
		/**
		 * 重命名相机位
		 */
		renameView,
		/**
		 * 更新隐藏Mesh
		 */
		updateHiddenMeshes,
		/**
		 * 获取天空盒
		 */
		getSky,
		/**
		 * 获取全部天空盒
		 */
		getSkys,
		/**
		 * 加载纹理
		 */
		loadTexture,
		/**
		 * 更新材质纹理
		 */
		materialTextureUpdated,
		/**
		 * 改变天空盒纹理
		 */
		changeSkyTexture,
		/**
		 * 移除天空盒纹理
		 */
		removeSkyTexture,
		/**
		 * 获取颜色贴图名称
		 */
		getColorMapName,
		/**
		 * 加载颜色贴图
		 */
		loadColorMap,
		/**
		 * 关闭选择状态
		 */
		disableSelection,
		/**
		 * 启用材质选择状态
		 */
		enableMaterialSelection,
		/**
		 * 启用灯光选择状态
		 */
		enableLightSelection,
		/**
		 * 启用反射球选择状态
		 */
		enableLightProbeSelection,
		/**
		 * 启用插件选择状态
		 */
		enableExtensionSelection,
		/**
		 * 启用位置选择状态
		 */
		enablePositionSelection,
		/**
		 * 启用节点选择状态
		 */
		enableNodeSelection,
		/**
		 * 启用相机体选择状态
		 */
		enableCameraVolumeSelection,
		/**
		 * 启用素材选择状态
		 */
		enableAssetSelection,
		/**
		 * 选择材质
		 */
		selectMaterial,
		/**
		 * 替换材质
		 */
		replaceMaterial,
		/**
		 * 选择灯光
		 */
		selectLight,
		/**
		 * 选择灯光实例
		 */
		selectLightInstance,
		/**
		 * 选择反射球
		 */
		selectLightProbe,
		/**
		 * 选择相机体
		 */
		selectCameraVolume,
		/**
		 * 选择插件
		 */
		selectExtension,
		/**
		 * 选择节点
		 */
		selectNodes,
		/**
		 * 选择素材
		 */
		selectAsset,
		/**
		 * 加载素材
		 */
		loadAssets,
		/**
		 * 保存素材
		 */
		saveAssets,
		/**
		 * 设置要素更新回调
		 */
		setUpdateCallback,
		/**
		 * 设置材质选择回调
		 */
		setMaterialSelectedCallback,
		/**
		 * 设置材质选择回调
		 */
		setLightInstanceSelectedCallback,
		/**
		 * 设置节点选择回调
		 */
		setNodeSelectedCallback,
		/**
		 * 设置插件选择回调
		 */
		setExtensionSelectedCallback,
		/**
		 * 设置位置选择回调
		 */
		setPositionSelectedCallback,
		/**
		 * 设置Item改变回调
		 */
		setItemModifiedCallback,
		/**
		 * 设置相机位选择回调
		 */
		setViewSelectedCallback,
		/**
		 * 设置场景改变回调
		 */
		setSceneChangedCallback,
		/**
		 * 设置素材选择回调
		 */
		setAssetSelectCallback,
		/**
		 * 设置素材选择回调
		 */
		setAssetsLoadedCallback,
		/**
		 * 修改封面对象
		 */
		coverModified,
		/**
		 * 修改导航路径对象
		 */
		autoTourModified,
		/**
		 * 是否存在光照贴图
		 */
		hasLightMap,
		/**
		 * 是否禁用进度条
		 */
		getDisableProgressiveLoader,
		/**
		 * 设置进度条
		 */
		setDisableProgressiveLoader,
		/**
		 * 获取场景警告
		 */
		getSceneScaleHtmlWarning,
		/**
		 * 获取Transform模式
		 */
		getTransformMode,
		/**
		 * 设置Transform模式
		 */
		setTransformMode,
		/**
		 * 获取支持的Transform模式
		 */
		getSupportedTransformModes,
		/**
		 * 跳转到Item
		 */
		seeItem,
		/**
		 * 获取场景大小
		 */
		getSceneBBox,
		/**
		 * 获取素材JSON
		 */
		getAssetsJson,
		/**
		 * 判断是否有顶部视图并跳转
		 */
		switchToFirstTopView,
		// 添加动画
		addAnimation,

		// 获取全部动画
		getAnimations,

		// 移除动画
		removeAnimation,

		// 获取动画
		getAnimation,

		// 加载全部动画
		loadAnimations,

		// 获取全部动画JSON
		getAnimationsJson,

		// 设置动画属性改变回调
		setAnimationUpdateCallback,

		// 动画跳转
		animationJumpTo,

		// 动画播放
		animationPlay,
		// 动画停止

		animationStop,

		// 设置动画播放时回调
		setAnimationPlayCallback,

		// 设置动画播放结束回调
		setAnimationFinishedCallback,

		// 设置动画播放单次循环结束回调
		setAnimationLoopEndCallback,

		// 设置Views，Tours
		loadViewsAndTours
	}
}
