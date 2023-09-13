import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "antd";
import ImageEditor from "tui-image-editor";
import ininitApp from "../../pages/main";
import "tui-image-editor/dist/tui-image-editor.css";
import "tui-color-picker/dist/tui-color-picker.css";
import styles from "./index.module.scss";

const defaultImg = "./imgs/th.webp";
const locale_zh = {
	ZoomIn: "放大",
	ZoomOut: "缩小",
	Hand: "手掌",
	History: "历史",
	Resize: "调整宽高",
	Crop: "裁剪",
	DeleteAll: "全部删除",
	Delete: "删除",
	Undo: "撤销",
	Redo: "反撤销",
	Reset: "重置",
	Flip: "镜像",
	Rotate: "旋转",
	Draw: "画",
	Shape: "形状标注",
	Icon: "图标标注",
	Text: "文字标注",
	Mask: "遮罩",
	Filter: "滤镜",
	Bold: "加粗",
	Italic: "斜体",
	Underline: "下划线",
	Left: "左对齐",
	Center: "居中",
	Right: "右对齐",
	Color: "颜色",
	"Text size": "字体大小",
	Custom: "自定义",
	Square: "正方形",
	Apply: "应用",
	Cancel: "取消",
	"Flip X": "X 轴",
	"Flip Y": "Y 轴",
	Range: "区间",
	Stroke: "描边",
	Fill: "填充",
	Circle: "圆",
	Triangle: "三角",
	Rectangle: "矩形",
	Free: "曲线",
	Straight: "直线",
	Arrow: "箭头",
	"Arrow-2": "箭头2",
	"Arrow-3": "箭头3",
	"Star-1": "星星1",
	"Star-2": "星星2",
	Polygon: "多边形",
	Location: "定位",
	Heart: "心形",
	Bubble: "气泡",
	"Custom icon": "自定义图标",
	"Load Mask Image": "加载蒙层图片",
	Grayscale: "灰度",
	Blur: "模糊",
	Sharpen: "锐化",
	Emboss: "浮雕",
	"Remove White": "除去白色",
	Distance: "距离",
	Brightness: "亮度",
	Noise: "噪音",
	"Color Filter": "彩色滤镜",
	Sepia: "棕色",
	Sepia2: "棕色2",
	Invert: "负片",
	Pixelate: "像素化",
	Threshold: "阈值",
	Tint: "色调",
	Multiply: "正片叠底",
	Blend: "混合色",
	Width: "宽度",
	Height: "高度",
	"Lock Aspect Ratio": "锁定宽高比例",
};
const customTheme = {
	"common.bi.image": "", // 左上角logo图片
	"common.bisize.width": "0px",
	"common.bisize.height": "0px",
	"common.backgroundImage": "none",
	// "common.backgroundColor": "#f3f4f6",
	"common.border": "1px solid #333",

	// header
	"header.backgroundImage": "none",
	// "header.backgroundColor": "#f3f4f6",
	"header.border": "0px",

	// load button
	"loadButton.backgroundColor": "#fff",
	"loadButton.border": "1px solid #ddd",
	"loadButton.color": "#222",
	"loadButton.fontFamily": "NotoSans, sans-serif",
	"loadButton.fontSize": "12px",
	"loadButton.display": "none", // 隐藏

	// download button
	"downloadButton.backgroundColor": "#fdba3b",
	"downloadButton.border": "1px solid #fdba3b",
	"downloadButton.color": "#fff",
	"downloadButton.fontFamily": "NotoSans, sans-serif",
	"downloadButton.fontSize": "12px",
	"downloadButton.display": "none", // 隐藏

	// icons default
	"menu.normalIcon.color": "#8a8a8a",
	"menu.activeIcon.color": "#555555",
	"menu.disabledIcon.color": "#ccc",
	"menu.hoverIcon.color": "#e9e9e9",
	"submenu.normalIcon.color": "#8a8a8a",
	"submenu.activeIcon.color": "#e9e9e9",

	"menu.iconSize.width": "24px",
	"menu.iconSize.height": "24px",
	"submenu.iconSize.width": "32px",
	"submenu.iconSize.height": "32px",

	// submenu primary color
	"submenu.backgroundColor": "#1e1e1e",
	"submenu.partition.color": "#858585",

	// submenu labels
	"submenu.normalLabel.color": "#858585",
	"submenu.normalLabel.fontWeight": "lighter",
	"submenu.activeLabel.color": "#fff",
	"submenu.activeLabel.fontWeight": "lighter",

	// checkbox style
	"checkbox.border": "1px solid #ccc",
	"checkbox.backgroundColor": "#fff",

	// rango style
	"range.pointer.color": "#fff",
	"range.bar.color": "#666",
	"range.subbar.color": "#d1d1d1",

	"range.disabledPointer.color": "#414141",
	"range.disabledBar.color": "#282828",
	"range.disabledSubbar.color": "#414141",

	"range.value.color": "#fff",
	"range.value.fontWeight": "lighter",
	"range.value.fontSize": "11px",
	"range.value.border": "1px solid #353535",
	"range.value.backgroundColor": "#151515",
	"range.title.color": "#fff",
	"range.title.fontWeight": "lighter",

	// colorpicker style
	"colorpicker.button.border": "1px solid #1e1e1e",
	"colorpicker.title.color": "#fff",
};

const EditImage = () => {
	const { t } = useTranslation();
	const [instance, setInstance] = useState<any>("");

	useEffect(() => {
		init();
	}, []);

	function init() {
		const instance = new ImageEditor(
			document.querySelector("#tui-image-editor"),
			{
				includeUI: {
					loadImage: {
						path: defaultImg,
						name: "image",
					},
					initMenu: "draw", // 默认打开的菜单项
					menuBarPosition: "bottom", // 菜单所在的位置
					locale: locale_zh, // 本地化语言为中文
					theme: customTheme, // 自定义样式
				},
				cssMaxWidth: 1000,
				cssMaxHeight: 600,
				usageStatistics: false,
			} as any,
		);
		(
			document.getElementsByClassName("tui-image-editor-main")[0] as any
		).style.top = "45px"; // 图片距顶部工具栏的距离
		(
			document.getElementsByClassName(
				"tie-btn-reset tui-image-editor-item help",
			)[0] as any
		).style.display = "none"; // 隐藏顶部重置按钮

		setInstance(instance);
	}

	function save() {
		const base64String = instance.toDataURL(); // base64 文件
		const data = window.atob(base64String.split(",")[1]);
		const ia = new Uint8Array(data.length);
		for (let i = 0; i < data.length; i++) {
			ia[i] = data.charCodeAt(i);
		}
		const blob = new Blob([ia], { type: "image/png" }); // blob 文件
		const imgUrl = URL.createObjectURL(blob);
		if (window.electronAPI) {
			window.electronAPI.sendEiSaveImg(imgUrl);
		} else {
			copyImg(imgUrl);
			window.open(`/viewImage.html?imgUrl=${imgUrl}`);
		}
	}

	async function copyImg(url: string) {
		const data = await fetch(url);
		const blob = await data.blob();

		await navigator.clipboard.write([
			new ClipboardItem({
				[blob.type]: blob,
			}),
		]);
	}

	return (
		<div className={styles.container}>
			<div id="tui-image-editor"></div>
			<Button className="save" type="primary" onClick={save}>
				{t("editImage.save")}
			</Button>
		</div>
	);
};

ininitApp(EditImage);
export default EditImage;
