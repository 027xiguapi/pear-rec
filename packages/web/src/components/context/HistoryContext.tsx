import { createContext } from 'react';

export const historyInitialState: any = { historyList: [], index: 0, doHistory: {} };

export const HistoryContext = createContext(historyInitialState);

export function historyReducer(state, action) {
  switch (action.type) {
    case 'increment': {
      let newHistoryList = [...state.historyList];
      let index = state.index;
      let videoFrames = newHistoryList.splice(0, index);
      videoFrames.push(action.data);
      index = videoFrames.length;
      return {
        historyList: videoFrames,
        index: index,
        doHistory: {},
      };
    }
    case 'prev': {
      let historyList = [...state.historyList];
      let index = state.index - 1 <= 0 ? 0 : state.index - 1;
      let doHistory = {
        type: 'prev',
        history: historyList[index],
      };
      return { historyList, index, doHistory };
    }
    case 'next': {
      let historyList = [...state.historyList];
      let index = state.index + 1 >= historyList.length ? historyList.length : state.index + 1;
      let doHistory = {
        type: 'next',
        history: historyList[index - 1],
      };
      return { historyList, index, doHistory };
    }
    case 'reset': {
      return historyInitialState;
    }
    default:
      throw new Error();
  }
}
