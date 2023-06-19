import { Bounds, Point } from '../types'

export default function getBoundsByPoints (
  { x: x1, y: y1 }: Point,
  { x: x2, y: y2 }: Point,
  bounds: Bounds,
  width: number,
  height: number,
  resizeOrMove: string
): Bounds {
  // 交换值
  if (x1 > x2) {
    [x1, x2] = [x2, x1]
  }

  if (y1 > y2) {
    [y1, y2] = [y2, y1]
  }

  // 把图形限制在元素里面
  if (x1 < 0) {
    x1 = 0
    if (resizeOrMove === 'move') {
      x2 = bounds.width
    }
  }

  if (x2 > width) {
    x2 = width
    if (resizeOrMove === 'move') {
      x1 = x2 - bounds.width
    }
  }

  if (y1 < 0) {
    y1 = 0
    if (resizeOrMove === 'move') {
      y2 = bounds.height
    }
  }

  if (y2 > height) {
    y2 = height
    if (resizeOrMove === 'move') {
      y1 = y2 - bounds.height
    }
  }

  return {
    x: x1,
    y: y1,
    width: Math.max(x2 - x1, 1),
    height: Math.max(y2 - y1, 1)
  }
}
