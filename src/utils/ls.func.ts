import { bakeData, devicesData } from "@/interfaces/jmt.interface"

export interface localStorageData {
	user: any
	token: string
	bake: bakeData
	devices: devicesData[]
	// 后台跳转编辑模式 带token
	accessToken: string
	// 展厅id
	sceneName: string
}
export default {
	/**
	 * 设置Storage
	 */
	setItem<T extends keyof localStorageData>(key: T, value: localStorageData[T]) {
		localStorage.setItem(key, JSON.stringify(value))
	},
	/**
	 * 读取Storage
	 *
	 */
	getItem<T extends keyof localStorageData>(key: T): localStorageData[T] | null {
		let value = localStorage.getItem(key)
		if (!value) {
			return null
		}
		return JSON.parse(value)
	},
	/**
	 * 移除Storage
	 */
	removeItem(key: keyof localStorageData) {
		localStorage.removeItem(key)
	},
	/**
	 * 清空Storage
	 */
	clearItem() {
		localStorage.clear()
	}
}
