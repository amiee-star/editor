import { defineConfig, IConfig } from "umi"
import ProxyConfig from "./proxy"
function buildProxy() {
	const proxyList = {} as Record<string, any>
	Object.keys(ProxyConfig).forEach(it => {
		proxyList[`/${it}`] = {
			target: ProxyConfig[it][process.env.API_ENV || "test"],
			changeOrigin: true,
			pathRewrite: { [`^/${it === "webwalk" ? "" : it}`]: "" }
		}
	})
	return proxyList
}

export default defineConfig({
	// devtool: "source-map",
	alias: {
		"@react-spring": "@/lib/@react-spring"
	},
	base: "./",
	outputPath: "./dist/",
	proxy: buildProxy(),
	exportStatic: {
		htmlSuffix: true,
		dynamicRoot: true
	},
	history: {
		type: "browser"
	},
	ignoreMomentLocale: true,
	mountElementId: "app",
	runtimePublicPath: true,
	hash: false,
	chunks: ["rule3D"],
	chainWebpack: conf => {
		const entryVal = conf.entry("umi").values()
		conf.entryPoints.delete("umi").end().entry("rule3D").merge(entryVal)
		conf.module.rule("no-use-base64").test(/no64/i).use("file-loader").loader("file-loader").options({
			name: "resources/[name].[hash:8].[ext]"
		})
		conf.module
			.rule("images")
			.test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/)
			.use("url-loader")
			.loader("url-loader")
			.options({
				limit: 5000,
				name: "resources/[name].[hash:8].[ext]",
				esModule: false,
				fallback: {
					loader: require.resolve("file-loader"),
					options: {
						name: "resources/[name].[hash:8].[ext]",
						esModule: false
					}
				}
			})
		conf.module
			.rule("svg")
			.test(/\.(svg)(\?.*)?$/)
			.use("file-loader")
			.loader("file-loader")
			.options({
				name: "resources/[name].[hash:8].[ext]",
				esModule: false
			})
		conf.module
			.rule("fonts")
			.test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
			.use("file-loader")
			.loader("file-loader")
			.options({
				name: "resources/[name].[hash:8].[ext]",
				esModule: false
			})

		conf.module
			.rule("plaintext")
			.test(/\.(txt|text|md)$/)
			.use("raw-loader")
			.loader("raw-loader")

		// conf.plugin("SentryWebpackPlugin").use(SentryWebpackPlugin, [
		// 	{
		// 		authToken: process.env.SENTRY_AUTH_TOKEN,
		// 		org: process.env.SENTRY_ORG,
		// 		project: process.env.SENTRY_PROJECT_NAME,
		// 		release: " 1.0",
		// 		include: ".",
		// 		ignore: ["node_modules", "webpack.config.js"]
		// 	}
		// ])
	},
	define: {
		API_ENV: process.env.API_ENV || "test"
	},
	dynamicImport: {
		loading: "@/components/utils/page.loading.tsx"
	},
	locale: {
		antd: true,
		title: true,
		baseNavigator: true,
		baseSeparator: "-"
	},
	dva: false,
	antd: {
		dark: true,
		compact: true
	}
} as IConfig)
