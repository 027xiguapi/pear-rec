import request from "../util/request";

export function useUserApi() {
	return {
		getCurrentUser: () => {
			return request({
				url: `/getCurrentUser`,
				method: "get",
			});
		},
		addUser: (data) => {
			return request({
				url: `/addUser`,
				method: "post",
				data: data,
			});
		},
		editUser: (userId, data) => {
			return request({
				url: `/editUser/${userId}`,
				method: "post",
				data: data,
			});
		},
		deleteUser: (userId) => {
			return request({
				url: `/deleteUser/${userId}`,
				method: "post",
			});
		},
	};
}
