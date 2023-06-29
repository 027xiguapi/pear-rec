// 引入
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "./reducer/counter";
import userReducer from "./reducer/user";

export const store = configureStore({
	reducer: {
		rootCounter: counterReducer,
		user: userReducer,
	},
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;
