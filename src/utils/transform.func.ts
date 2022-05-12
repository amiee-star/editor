import { getHex, getHexString, setHex } from "./math.func"

interface colorNum {
	r: number
	g: number
	b: number
}

export default {
	radWithDeg: (value: number, type: "in" | "out") => {
		var val = type === "in" ? (value * 180.0) / Math.PI: (value * Math.PI) / 180.0
		return Math.round(val * 1000) / 1000
	},
	rgbWithHex: (value: colorNum | string, type: "in" | "out" = "in") => {
		if (typeof value === "object") {
			return "#" + getHex(value)
		} else {
			return setHex(parseInt(value.split("#").slice(-1).toString(), 16))
		}
	},
	rgbWithHex16: (value: colorNum | string, type: "in" | "out" = "in") => {
		if (typeof value === "object") {
			return "#" + getHexString(getHex(value))
		} else {
			return setHex(parseInt(value.split("#").slice(-1).toString(), 16))
		}
	},
	mmtoM: (value: number, type: "in" | "out") => {
		return type === "in" ? value * 1000 : value / 1000
	},
	objToId: (value: any, type: "in" | "out") => {
		if (typeof value === "object" && value !== null) {
			return type === "in" ? value.map((item: any, index: any) => item.id) : []
		}
	}
}
