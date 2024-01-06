import React, { createContext } from 'react';

export const historyInitialState: any = { historyList: [], index: -1 };

export const HistoryContext = createContext(historyInitialState);

export function historyReducer(state, action) {
  switch (action.type) {
    case 'increment': {
      let historyList = [...state.historyList, action.data];
      let index = historyList.length - 1;
      return {
        historyList: historyList,
        index: index,
      };
    }
    case 'prev': {
      let historyList = [...state.historyList];
      let index = state.index - 1;
      return { historyList, index };
    }
    case 'next': {
      let historyList = [...state.historyList];
      let index = state.index + 1;
      return { historyList, index };
    }
    case 'reset': {
      return historyInitialState;
    }
    default:
      throw new Error();
  }
}
