import { RectangleData, RectangleEditData, RectangleEditType } from '.'
import { HistoryItemSource } from '../../types'
import { drawDragCircle } from '../utils'

export function getEditedRectangleData (action: HistoryItemSource<RectangleData, RectangleEditData>) {
  let { x1, y1, x2, y2 } = action.data

  action.editHistory.forEach(({ data }) => {
    const x = data.x2 - data.x1
    const y = data.y2 - data.y1
    if (data.type === RectangleEditType.Move) {
      x1 += x
      y1 += y
      x2 += x
      y2 += y
    } else if (data.type === RectangleEditType.ResizeTop) {
      y1 += y
    } else if (data.type === RectangleEditType.ResizeRightTop) {
      x2 += x
      y1 += y
    } else if (data.type === RectangleEditType.ResizeRight) {
      x2 += x
    } else if (data.type === RectangleEditType.ResizeRightBottom) {
      x2 += x
      y2 += y
    } else if (data.type === RectangleEditType.ResizeBottom) {
      y2 += y
    } else if (data.type === RectangleEditType.ResizeLeftBottom) {
      x1 += x
      y2 += y
    } else if (data.type === RectangleEditType.ResizeLeft) {
      x1 += x
    } else if (data.type === RectangleEditType.ResizeLeftTop) {
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

export default function draw (
  ctx: CanvasRenderingContext2D,
  action: HistoryItemSource<RectangleData, RectangleEditData>
) {
  const { size, color, x1, y1, x2, y2 } = getEditedRectangleData(action)
  ctx.lineCap = 'butt'
  ctx.lineJoin = 'miter'
  ctx.lineWidth = size
  ctx.strokeStyle = color

  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y1)
  ctx.lineTo(x2, y2)
  ctx.lineTo(x1, y2)
  ctx.closePath()
  ctx.stroke()

  if (action.isSelected) {
    ctx.lineWidth = 1
    ctx.strokeStyle = '#000000'
    ctx.fillStyle = '#ffffff'

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
