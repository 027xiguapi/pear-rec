import { useState, useRef } from 'react';
import raf from 'rc-util/lib/raf';
import { getClientSize } from 'rc-util/lib/Dom/css';
import { MIN_SCALE, MAX_SCALE } from '../previewConfig';

type TransformType = {
  x: number,
  y: number,
  rotate: number,
  scale: number,
  flipX: boolean,
  flipY: boolean,
};

const initialTransform = {
  x: 0,
  y: 0,
  rotate: 0,
  scale: 1,
  flipX: false,
  flipY: false,
};

export default function useImageTransform(imgRef: React.MutableRefObject<HTMLImageElement>) {
  const frame = useRef(null);
  const queue = useRef<TransformType[]>([]);
  const [transform, setTransform] = useState(initialTransform);

  const resetTransform = () => {
    setTransform(initialTransform);
  };

  /** Direct update transform */
  const updateTransform = (newTransform: Partial<TransformType>) => {
    if (frame.current === null) {
      queue.current = [];
      frame.current = raf(() => {
        setTransform(preState => {
          let memoState: any = preState;
          queue.current.forEach(queueState => {
            memoState = { ...memoState, ...queueState };
          });
          frame.current = null;

          return memoState;
        });
      });
    }
    queue.current.push({
      ...transform,
      ...newTransform,
    });
  };

  /** Scale according to the position of clientX and clientY */
  const dispatchZoomChange = (ratio: number, clientX?: number, clientY?: number) => {
    const { width, height, offsetWidth, offsetHeight, offsetLeft, offsetTop } = imgRef.current;

    let newRatio = ratio;
    let newScale = transform.scale * ratio;
    if (newScale > MAX_SCALE) {
      newRatio = MAX_SCALE / transform.scale;
      newScale = MAX_SCALE;
    } else if (newScale < MIN_SCALE) {
      newRatio = MIN_SCALE / transform.scale;
      newScale = MIN_SCALE;
    }

    /** Default center point scaling */
    const mergedClientX = clientX ?? innerWidth / 2;
    const mergedClientY = clientY ?? innerHeight / 2;

    const diffRatio = newRatio - 1;
    /** Deviation calculated from image size */
    const diffImgX = diffRatio * width * 0.5;
    const diffImgY = diffRatio * height * 0.5;
    /** The difference between the click position and the edge of the document */
    const diffOffsetLeft = diffRatio * (mergedClientX - transform.x - offsetLeft);
    const diffOffsetTop = diffRatio * (mergedClientY - transform.y - offsetTop);
    /** Final positioning */
    let newX = transform.x - (diffOffsetLeft - diffImgX);
    let newY = transform.y - (diffOffsetTop - diffImgY);

    /**
     * When zooming the image
     * When the image size is smaller than the width and height of the window, the position is initialized
     */
    if (ratio < 1 && newScale === 1) {
      const mergedWidth = offsetWidth * newScale;
      const mergedHeight = offsetHeight * newScale;
      const { width: clientWidth, height: clientHeight } = getClientSize();
      if (mergedWidth <= clientWidth && mergedHeight <= clientHeight) {
        newX = 0;
        newY = 0;
      }
    }

    updateTransform({
      x: newX,
      y: newY,
      scale: newScale,
    });
  };

  return {
    transform,
    resetTransform,
    updateTransform,
    dispatchZoomChange,
  };
};
