import { createContext } from 'react';

export const gifInitialState: any = {
  imgUrl: '',
  videoUrl: '',
  videoFrames: [],
  index: 0,
  load: 0,
  isPlay: false,
  frameNum: 0,
  // timeStart: 0,
  // timeEnd: 0,
  // duration: 100,
};

export const GifContext = createContext(gifInitialState);

export function gifReducer(state, action) {
  switch (action.type) {
    case 'setVideoFrames': {
      return { ...state, videoFrames: action.videoFrames };
    }
    case 'setImgUrl': {
      return { ...state, imgUrl: action.imgUrl };
    }
    case 'setVideoUrl': {
      return { ...state, videoUrl: action.videoUrl };
    }
    case 'setIndex': {
      return { ...state, index: action.index };
    }
    case 'setLoad': {
      return { ...state, load: action.load };
    }
    case 'setIsPlay': {
      return { ...state, isPlay: action.isPlay };
    }
    // case 'setDuration': {
    //   return { ...state, duration: action.duration };
    // }
    case 'setFrameNum': {
      return { ...state, frameNum: action.frameNum };
    }
    // case 'setTime': {
    //   return { ...state, timeStart: action.time[0], timeEnd: action.time[1] };
    // }
    // case 'setTimeStart': {
    //   return { ...state, timeStart: action.timeStart };
    // }
    // case 'setTimeEnd': {
    //   return { ...state, timeEnd: action.timeEnd };
    // }
    case 'setLoadAdd': {
      return { ...state, load: state.load + action.num > 99 ? 99 : state.load + action.num };
    }
    default:
  }
}
