import axios, { AxiosInstance } from "axios";
import { message, Modal } from "antd";
import { Session } from "./storage";
import qs from "qs";

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 50000,
	headers: {
		// "Content-Type": "application/x-www-form-urlencoded",
		"Content-Type": "application/json",
	},
	paramsSerializer: {
		serialize(params) {
			return qs.stringify(params, { allowDots: true });
		},
	},
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		// 在发送请求之前做些什么 token
		if (Session.get("token")) {
			config.headers!["token"] = `${Session.get("token")}`;
		}
		return config;
	},
	(error) => {
		// 对请求错误做些什么
		return Promise.reject(error);
	},
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		// 对响应数据做点什么
		const res = response.data;
		if (res.code && res.code !== 0) {
			// `token` 过期或者账号已在别处登录
			if (res.code === 401 || res.code === 4001) {
				Session.clear(); // 清除浏览器全部临时缓存
				window.location.href = "/"; // 去登录页
				Modal.confirm({ title: "提示", content: "你已被登出，请重新登录" });
			}
			return Promise.resolve(response.data);
		} else {
			return res;
		}
	},
	(error) => {
		// 对响应错误做点什么
		if (error.message.indexOf("timeout") != -1) {
			// message.error("网络超时");
		} else if (error.message == "Network Error") {
			// message.error("网络连接错误");
		} else {
			if (error.response.data) {
				// message.error(error.response.statusText);
			} else {
				// message.error("接口路径找不到");
			}
		}
		return Promise.reject(error);
	},
);

// 导出 axios 实例
export default service;
