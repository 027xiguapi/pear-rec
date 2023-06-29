import { createSlice } from "@reduxjs/toolkit";
const initialState = {
	user: {
		name: "027xiguapi",
		job: "工程师",
	},
};
export const userSlice = createSlice({
	name: "user", // 命名空间，在调用action的时候会默认的设置为action的前缀,保证唯一.不重名
	initialState,
	reducers: {
		updateUser(state, { payload }) {
			console.log("updateUser-------payload", payload);
			// 引用类型 注意 赋值的写法
			state.user = {
				...state.user,
				...payload,
			};
		},
	},
});

export const { updateUser } = userSlice.actions;
export const selectUser = (state: any) => state.user.user;

export default userSlice.reducer;
