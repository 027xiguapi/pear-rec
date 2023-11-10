import request from "../util/request";

export function useSettingApi() {
	return {
		getSetting: (userId: string) => {
			return request({
				url: `/getSettingByUserId/${userId}`,
				method: "get",
			});
		},
		editSetting: (settingId, data) => {
			return request({
				url: `/editSetting/${settingId}`,
				method: "post",
				data: data,
			});
		},
	};
}
