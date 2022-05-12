/**
 * 一唯数组转树结构
 * @param data 需要转换的数组
 * @param key  集合的唯一字段名
 * @param Pkey 集合依赖的字段名
 */
export const doTree = <T>(data: (T & { children?: T[] })[], key: keyof T, Pkey: keyof T) => {
	const _data = JSON.parse(JSON.stringify(data)) as (T & { children?: T[] })[]
	return _data.reduce((prev, current) => {
		const hasData = _data.find(m => m[key] === current[Pkey])
		if (hasData) {
			hasData.children = hasData.children ? hasData.children.concat(current) : [current]
		} else {
			prev.push(current)
		}
		return prev
	}, [] as (T & { children?: T[] })[])
}
/**
 * 树结构转一唯数组
 * @param data      需要转换的数组
 * @param childKey  树节点key
 */
export const doAlone = <T extends object & { [field in P]: T[] }, P extends keyof T>(
	data: T[],
	childKey: P
): Omit<T, P>[] => {
	return data
		.map(m => {
			const child = m[childKey]
			const alone = JSON.parse(JSON.stringify(m))
			delete alone[childKey]
			return !!child && !!child["length"] ? doAlone(child, childKey).concat(alone) : alone
		})
		.flat(Infinity)
}
