import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zhCN from "./locales/zh-CN.json";
import enUS from "./locales/en-US.json";
import deDE from "./locales/de-DE.json";

export function initI18n() {
	i18n.use(initReactI18next).init({
		resources: {
			de: {
				translation: deDE,
			},
			en: {
				translation: enUS,
			},
			zh: {
				translation: zhCN,
			},
		},
		lng: localStorage.getItem("pear-rec_i18n") || "zh", // 设置默认语言
		fallbackLng: "zh", // 设置回退语言
		interpolation: {
			escapeValue: false, // 不需要转义内容
		},
	});
}
