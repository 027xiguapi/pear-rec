import request from "../util/request";

export function useSettingApi() {
	return {
		getSetting: (userId: string) => {
			return request({
				url: `/getSetting?userId=${userId}`,
				method: "get",
			});
		},
	};
}
