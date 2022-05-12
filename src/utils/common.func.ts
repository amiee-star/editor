import urlFunc from "./url.func"
export default {
	//取小数点
	toFixed: (value: number, length: number = 2) => {
		return Number.prototype.toFixed.call(value || 0, length)
	},
	browser: () => {
		const userAgent = navigator.userAgent
		return {
			trident: userAgent.indexOf("Trident") > -1, //IE内核
			presto: userAgent.indexOf("Presto") > -1, //opera内核
			webKit: userAgent.indexOf("AppleWebKit") > -1, //苹果、谷歌内核
			gecko: userAgent.indexOf("Gecko") > -1 && userAgent.indexOf("KHTML") == -1, //火狐内核
			mobile: !!userAgent.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: userAgent.indexOf("Android") > -1 || userAgent.indexOf("Adr") > -1, //android终端
			iPhone: userAgent.indexOf("iPhone") > -1, //是否为iPhone或者QQHD浏览器
			iPad: userAgent.indexOf("iPad") > -1, //是否iPad
			webApp: userAgent.indexOf("Safari") == -1, //是否web应该程序，没有头部与底部
			weixin: userAgent.indexOf("MicroMessenger") > -1, //是否微信 （2015-01-22新增）
			qq: !!userAgent.match(/\sQQ/i) //是否QQ
		}
	},
	dataURLtoFile(baseUrl: string, fileName: string) {
		const checkData = baseUrl.split(",")
		const type = checkData[0].match(/:(.*?);/)[1]
		const bstr = atob(checkData[1])
		let len = bstr.length
		const u8arr = new Uint8Array(len)
		while (len--) {
			u8arr[len] = bstr.charCodeAt(len)
		}
		return new File([u8arr], fileName, { type })
	},
	thumb(url: string, width: number = 0, height: number = 0) {
		const newUrl = new URL(urlFunc.replaceUrl(url, "obs"))
		newUrl.searchParams.append("x-oss-process", `${["image/resize", `w_${width}`, `h_${height}`].toString()}`)
		return newUrl.toString()
	},
	getUrl(file: File) {
		let url: string
		if ("createObjectURL" in window) {
			url = window["createObjectURL"](file)
		} else if (window.URL != undefined) {
			url = window.URL.createObjectURL(file)
		} else if (window.webkitURL != undefined) {
			url = window.webkitURL.createObjectURL(file)
		}
		return url
	}
}
