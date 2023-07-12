import { defineConfig } from "vitepress";
import react from "@vitejs/plugin-react";

// https://vitepress.dev/reference/site-config
export default defineConfig({
	vite: {
		plugins: [react()],
	},
	title: "pear-rec",
	base: "/pear-rec",
	description: "一个跨平台的截图、录屏、录音、录像软件",
	head: [["link", { rel: "icon", href: "./logo@2x.ico" }]],
	themeConfig: {
		logo: "/logo@2x.ico",
		siteTitle: "『 pear-rec 』",
		outlineTitle: "🔴🟠🟡🟢🔵🟣🟤⚫⚪",
		outline: [2, 6],
		// 顶部导航
		nav: [
			{ text: "Home", link: "/" },
			{ text: "文档", link: "/desktop/examples.md" },
		],
		// 侧边栏
		sidebar: [
			{
				text: "文档",
				items: [
					{ text: "桌面软件", link: "/desktop/examples.md" },
					{ text: "网页应用", link: "/web/examples.md" },
					{ text: "录音插件", link: "/recorder/examples.md" },
					{ text: "计时插件", link: "/timer/examples" },
					{ text: "截图插件", link: "/screenshot/examples" },
					// { text: "markdown", link: "/markdown-examples.md" },
					// { text: "Runtime API Examples", link: "/api-examples" },
				],
			},
		],

		socialLinks: [
			{ icon: "github", link: "https://github.com/027xiguapi/pear-rec" },
		],
		// 页脚
		footer: {
			message: "",
			copyright: "",
		},
	},
});
