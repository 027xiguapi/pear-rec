import React, { useEffect, useRef, useState } from "react";
import { Card, Form, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { ipcRenderer } from "electron";
import dayjs from "dayjs";
import logo from "@/assets/imgs/logo@2x.ico";

const { Meta } = Card;

const UserSetting = () => {
	const [uuid, setUuid] = useState("");
	const [createdTime, setCreatedTime] = useState("");

	useEffect(() => {
		getUser();
	}, []);

	async function getUser() {
		const user = await ipcRenderer.invoke("se:get-user");
		setUuid(user.uuid);
		setCreatedTime(user.createdTime);
	}

	function formatTime(time: any) {
		return dayjs(time).format("YYYY-MM-DD hh:mm:ss");
	}

	return (
		<div className="userSetting">
			<Card style={{ width: 200 }} cover={<img alt="logo" src={logo} />}>
				<Meta title={uuid} description={formatTime(createdTime)} />
			</Card>
		</div>
	);
};

export default UserSetting;
