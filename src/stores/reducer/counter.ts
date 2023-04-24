import { createSlice } from "@reduxjs/toolkit";
import { RootState } from '../index';
const initialState = {
    counter: 100,
};
export const counterSlice = createSlice({
    name: "counter", // 命名空间，在调用action的时候会默认的设置为action的前缀,保证唯一.不重名
    initialState,
    reducers: {
        // reducer函数 state当前组件的数据 
        //第二个参数为{payload:{},type:"""} 想想就写法或者vuex
        increment(state) {
            state.counter += 100;
        },
        decrement(state, actions) {
            // actions == {payload:{},type:"""}
            console.log("decrement---actions", actions);
            state.counter -= actions.payload;
        }
    },
});
export const { increment, decrement } = counterSlice.actions;
export const selectCount = (state: RootState) => state.rootCounter.counter;

export default counterSlice.reducer;
