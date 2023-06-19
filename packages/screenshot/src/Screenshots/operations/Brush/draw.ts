import { BrushData, BrushEditData } from '.'
import { HistoryItemSource } from '../../types'

export default function draw (ctx: CanvasRenderingContext2D, action: HistoryItemSource<BrushData, BrushEditData>): void {
  const { size, color, points } = action.data
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.lineWidth = size
  ctx.strokeStyle = color

  const distance = action.editHistory.reduce(
    (distance, { data }) => ({
      x: distance.x + data.x2 - data.x1,
      y: distance.y + data.y2 - data.y1
    }),
    { x: 0, y: 0 }
  )

  ctx.beginPath()
  points.forEach((item, index) => {
    if (index === 0) {
      ctx.moveTo(item.x + distance.x, item.y + distance.y)
    } else {
      ctx.lineTo(item.x + distance.x, item.y + distance.y)
    }
  })
  ctx.stroke()

  if (action.isSelected) {
    ctx.lineWidth = 1
    ctx.strokeStyle = '#000000'
    ctx.beginPath()
    points.forEach((item, index) => {
      if (index === 0) {
        ctx.moveTo(item.x + distance.x, item.y + distance.y)
      } else {
        ctx.lineTo(item.x + distance.x, item.y + distance.y)
      }
    })
    ctx.stroke()
  }
}
