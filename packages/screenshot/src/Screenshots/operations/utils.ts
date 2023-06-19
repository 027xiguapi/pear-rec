import { HistoryItemSource, Point } from '../types'

const CircleRadius = 4

export function drawDragCircle (ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.lineWidth = 1
  ctx.strokeStyle = '#000000'
  ctx.fillStyle = '#ffffff'

  ctx.beginPath()
  ctx.arc(x, y, CircleRadius, 0, 2 * Math.PI)
  ctx.fill()
  ctx.stroke()
}

export function isHit<S, E> (ctx: CanvasRenderingContext2D, action: HistoryItemSource<S, E>, point: Point) {
  action.draw(ctx, action)
  const { data } = ctx.getImageData(point.x, point.y, 1, 1)
  return data.some(val => val !== 0)
}

export function isHitCircle (canvas: HTMLCanvasElement | null, e: MouseEvent, point: Point) {
  if (!canvas) {
    return false
  }

  const { left, top } = canvas.getBoundingClientRect()

  const x = e.clientX - left
  const y = e.clientY - top

  // 点到圆心的距离是否小于半径
  return (point.x - x) ** 2 + (point.y - y) ** 2 < CircleRadius ** 2
}
