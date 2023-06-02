import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "pear-rec",
  base: "/pear-rec",
  description: "一个跨平台的截图、录屏、录音、录像软件",
  head: [["link", { rel: "icon", href: "./logo@2x.ico" }]],
  themeConfig: {
    logo: "./logo@2x.ico",
    siteTitle: "『 pear-rec 』",
    outlineTitle: "🔴🟠🟡🟢🔵🟣🟤⚫⚪",
    outline: [2, 6],
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "文档", link: "/pear-rec-examples.md" },
    ],

    sidebar: [
      {
        text: "文档",
        items: [
          { text: "pear-rec", link: "/pear-rec-examples.md" },
          { text: "recorder-api", link: "/recorder-api.md" },
          // { text: "markdown", link: "/markdown-examples.md" },
          // { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/027xiguapi/pear-rec" },
    ],
  },
});
