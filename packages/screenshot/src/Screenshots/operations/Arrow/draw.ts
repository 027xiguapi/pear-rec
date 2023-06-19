import { ArrowData, ArrowEditData, ArrowEditType } from '.'
import { HistoryItemSource } from '../../types'
import { drawDragCircle } from '../utils'

export function getEditedArrowData (action: HistoryItemSource<ArrowData, ArrowEditData>) {
  let { x1, y1, x2, y2 } = action.data
  action.editHistory.forEach(({ data }) => {
    const x = data.x2 - data.x1
    const y = data.y2 - data.y1
    if (data.type === ArrowEditType.Move) {
      x1 += x
      y1 += y
      x2 += x
      y2 += y
    } else if (data.type === ArrowEditType.MoveStart) {
      x1 += x
      y1 += y
    } else if (data.type === ArrowEditType.MoveEnd) {
      x2 += x
      y2 += y
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

export default function draw (ctx: CanvasRenderingContext2D, action: HistoryItemSource<ArrowData, ArrowEditData>) {
  const { size, color, x1, x2, y1, y2 } = getEditedArrowData(action)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'bevel'
  ctx.lineWidth = size
  ctx.strokeStyle = color

  const dx = x2 - x1
  const dy = y2 - y1
  // 箭头头部长度
  const length = size * 3
  const angle = Math.atan2(dy, dx)
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.lineTo(x2 - length * Math.cos(angle - Math.PI / 6), y2 - length * Math.sin(angle - Math.PI / 6))
  ctx.moveTo(x2, y2)
  ctx.lineTo(x2 - length * Math.cos(angle + Math.PI / 6), y2 - length * Math.sin(angle + Math.PI / 6))
  ctx.stroke()

  if (action.isSelected) {
    drawDragCircle(ctx, x1, y1)
    drawDragCircle(ctx, x2, y2)
  }
}
