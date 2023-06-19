import { EllipseData, EllipseEditData, EllipseEditType } from '.'
import { HistoryItemSource } from '../../types'
import { drawDragCircle } from '../utils'

export function getEditedEllipseData (action: HistoryItemSource<EllipseData, EllipseEditData>) {
  let { x1, y1, x2, y2 } = action.data

  action.editHistory.forEach(({ data }) => {
    const x = data.x2 - data.x1
    const y = data.y2 - data.y1
    if (data.type === EllipseEditType.Move) {
      x1 += x
      y1 += y
      x2 += x
      y2 += y
    } else if (data.type === EllipseEditType.ResizeTop) {
      y1 += y
    } else if (data.type === EllipseEditType.ResizeRightTop) {
      x2 += x
      y1 += y
    } else if (data.type === EllipseEditType.ResizeRight) {
      x2 += x
    } else if (data.type === EllipseEditType.ResizeRightBottom) {
      x2 += x
      y2 += y
    } else if (data.type === EllipseEditType.ResizeBottom) {
      y2 += y
    } else if (data.type === EllipseEditType.ResizeLeftBottom) {
      x1 += x
      y2 += y
    } else if (data.type === EllipseEditType.ResizeLeft) {
      x1 += x
    } else if (data.type === EllipseEditType.ResizeLeftTop) {
      x1 += x
      y1 += y
    }
  })

  return {
    ...action.data,
    x1,
    x2,
    y1,
    y2
  }
}

export default function draw (ctx: CanvasRenderingContext2D, action: HistoryItemSource<EllipseData, EllipseEditData>) {
  const { size, color, x1, y1, x2, y2 } = getEditedEllipseData(action)
  ctx.lineCap = 'butt'
  ctx.lineJoin = 'miter'
  ctx.lineWidth = size
  ctx.strokeStyle = color

  const x = (x1 + x2) / 2
  const y = (y1 + y2) / 2
  const rx = Math.abs(x2 - x1) / 2
  const ry = Math.abs(y2 - y1) / 2
  const k = 0.5522848
  // 水平控制点偏移量
  const ox = rx * k
  // 垂直控制点偏移量
  const oy = ry * k
  // 从椭圆的左端点开始顺时针绘制四条三次贝塞尔曲线
  ctx.beginPath()
  ctx.moveTo(x - rx, y)
  ctx.bezierCurveTo(x - rx, y - oy, x - ox, y - ry, x, y - ry)
  ctx.bezierCurveTo(x + ox, y - ry, x + rx, y - oy, x + rx, y)
  ctx.bezierCurveTo(x + rx, y + oy, x + ox, y + ry, x, y + ry)
  ctx.bezierCurveTo(x - ox, y + ry, x - rx, y + oy, x - rx, y)
  ctx.closePath()
  ctx.stroke()

  if (action.isSelected) {
    ctx.lineWidth = 1
    ctx.strokeStyle = '#000000'
    ctx.fillStyle = '#ffffff'

    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y1)
    ctx.lineTo(x2, y2)
    ctx.lineTo(x1, y2)
    ctx.closePath()
    ctx.stroke()

    drawDragCircle(ctx, (x1 + x2) / 2, y1)
    drawDragCircle(ctx, x2, y1)
    drawDragCircle(ctx, x2, (y1 + y2) / 2)
    drawDragCircle(ctx, x2, y2)
    drawDragCircle(ctx, (x1 + x2) / 2, y2)
    drawDragCircle(ctx, x1, y2)
    drawDragCircle(ctx, x1, (y1 + y2) / 2)
    drawDragCircle(ctx, x1, y1)
  }
}
