import ProxyConfig from "@/../config/proxy"

export default new (class {
	//获取数据Host
	requestHost(key: keyof typeof ProxyConfig = "api") {
		return process.env.NODE_ENV === "production" ? this.getHost(key) : key
	}
	//获取HOST
	getHost(key: keyof typeof ProxyConfig = "api"): string {
		return ProxyConfig[key][API_ENV || "test"]
	}
	//返回处理后的URL
	replaceUrl(url: string, key: keyof typeof ProxyConfig = "api") {
		if (typeof url == "string") {
			const urls = url.split("?")
			const [realUrl, urlParams] = urls
			const filePath = realUrl.includes("http")
				? new URL(realUrl).pathname
				: realUrl.startsWith("/")
				? realUrl
				: `/${realUrl}`
			const host = this.getHost(key) || location.origin
			return host + filePath + (!!urlParams ? "?" + urlParams : "")
		}
	}
})()
