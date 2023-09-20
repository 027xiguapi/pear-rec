import React, { useEffect, useRef, useState } from "react";
import { Card } from "antd";
import dayjs from "dayjs";

const logo = "/imgs/icons/png/512x512.png";
const { Meta } = Card;
const UserSetting = (props) => {
	const { user } = props;
	const [uuid, setUuid] = useState("");
	const [createdTime, setCreatedTime] = useState("");

	useEffect(() => {
		getUser();
	}, [user]);

	async function getUser() {
		setUuid(user.uuid);
		setCreatedTime(user.createdAt);
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
