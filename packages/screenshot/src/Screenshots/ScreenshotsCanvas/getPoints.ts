import { Point, Bounds } from '../types'

export default function getBoundsByPoints (e: MouseEvent, resizeOrMove: string, point: Point, bounds: Bounds): Point[] {
  const x = e.clientX - point.x
  const y = e.clientY - point.y
  let x1 = bounds.x
  let y1 = bounds.y
  let x2 = bounds.x + bounds.width
  let y2 = bounds.y + bounds.height

  switch (resizeOrMove) {
    case 'top':
      y1 += y
      break
    case 'top-right':
      x2 += x
      y1 += y
      break
    case 'right':
      x2 += x
      break
    case 'right-bottom':
      x2 += x
      y2 += y
      break
    case 'bottom':
      y2 += y
      break
    case 'bottom-left':
      x1 += x
      y2 += y
      break
    case 'left':
      x1 += x
      break
    case 'left-top':
      x1 += x
      y1 += y
      break
    case 'move':
      x1 += x
      y1 += y
      x2 += x
      y2 += y
      break
    default:
      break
  }

  return [
    {
      x: x1,
      y: y1
    },
    {
      x: x2,
      y: y2
    }
  ]
}
