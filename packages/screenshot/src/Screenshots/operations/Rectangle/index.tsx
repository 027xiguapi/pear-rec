import React, { ReactElement, useCallback, useRef, useState } from 'react'
import useCanvasContextRef from '../../hooks/useCanvasContextRef'
import useCanvasMousedown from '../../hooks/useCanvasMousedown'
import useCanvasMousemove from '../../hooks/useCanvasMousemove'
import useCanvasMouseup from '../../hooks/useCanvasMouseup'
import useCursor from '../../hooks/useCursor'
import useDrawSelect from '../../hooks/useDrawSelect'
import useHistory from '../../hooks/useHistory'
import useLang from '../../hooks/useLang'
import useOperation from '../../hooks/useOperation'
import ScreenshotsButton from '../../ScreenshotsButton'
import ScreenshotsSizeColor from '../../ScreenshotsSizeColor'
import { HistoryItemSource, HistoryItemEdit, HistoryItemType } from '../../types'
import { isHit, isHitCircle } from '../utils'
import draw, { getEditedRectangleData } from './draw'

export interface RectangleData {
  size: number
  color: string
  x1: number
  y1: number
  x2: number
  y2: number
}

export enum RectangleEditType {
  Move,
  ResizeTop,
  ResizeRightTop,
  ResizeRight,
  ResizeRightBottom,
  ResizeBottom,
  ResizeLeftBottom,
  ResizeLeft,
  ResizeLeftTop
}

export interface RectangleEditData {
  type: RectangleEditType
  x1: number
  y1: number
  x2: number
  y2: number
}

export default function Rectangle (): ReactElement {
  const lang = useLang()
  const [history, historyDispatcher] = useHistory()
  const [operation, operationDispatcher] = useOperation()
  const [, cursorDispatcher] = useCursor()
  const canvasContextRef = useCanvasContextRef()
  const [size, setSize] = useState(3)
  const [color, setColor] = useState('#ee5126')
  const rectangleRef = useRef<HistoryItemSource<RectangleData, RectangleEditData> | null>(null)
  const rectangleEditRef = useRef<HistoryItemEdit<RectangleEditData, RectangleData> | null>(null)

  const checked = operation === 'Rectangle'

  const selectRectangle = useCallback(() => {
    operationDispatcher.set('Rectangle')
    cursorDispatcher.set('crosshair')
  }, [operationDispatcher, cursorDispatcher])

  const onSelectRectangle = useCallback(() => {
    if (checked) {
      return
    }
    selectRectangle()
    historyDispatcher.clearSelect()
  }, [checked, selectRectangle, historyDispatcher])

  const onDrawSelect = useCallback(
    (action: HistoryItemSource<unknown, unknown>, e: MouseEvent) => {
      if (action.name !== 'Rectangle' || !canvasContextRef.current) {
        return
      }

      const source = action as HistoryItemSource<RectangleData, RectangleEditData>
      selectRectangle()

      const { x1, y1, x2, y2 } = getEditedRectangleData(source)

      let type = RectangleEditType.Move
      if (
        isHitCircle(canvasContextRef.current.canvas, e, {
          x: (x1 + x2) / 2,
          y: y1
        })
      ) {
        type = RectangleEditType.ResizeTop
      } else if (
        isHitCircle(canvasContextRef.current.canvas, e, {
          x: x2,
          y: y1
        })
      ) {
        type = RectangleEditType.ResizeRightTop
      } else if (
        isHitCircle(canvasContextRef.current.canvas, e, {
          x: x2,
          y: (y1 + y2) / 2
        })
      ) {
        type = RectangleEditType.ResizeRight
      } else if (
        isHitCircle(canvasContextRef.current.canvas, e, {
          x: x2,
          y: y2
        })
      ) {
        type = RectangleEditType.ResizeRightBottom
      } else if (
        isHitCircle(canvasContextRef.current.canvas, e, {
          x: (x1 + x2) / 2,
          y: y2
        })
      ) {
        type = RectangleEditType.ResizeBottom
      } else if (
        isHitCircle(canvasContextRef.current.canvas, e, {
          x: x1,
          y: y2
        })
      ) {
        type = RectangleEditType.ResizeLeftBottom
      } else if (
        isHitCircle(canvasContextRef.current.canvas, e, {
          x: x1,
          y: (y1 + y2) / 2
        })
      ) {
        type = RectangleEditType.ResizeLeft
      } else if (
        isHitCircle(canvasContextRef.current.canvas, e, {
          x: x1,
          y: y1
        })
      ) {
        type = RectangleEditType.ResizeLeftTop
      }

      rectangleEditRef.current = {
        type: HistoryItemType.Edit,
        data: {
          type,
          x1: e.clientX,
          y1: e.clientY,
          x2: e.clientX,
          y2: e.clientY
        },
        source: action as HistoryItemSource<RectangleData, RectangleEditData>
      }

      historyDispatcher.select(action)
    },
    [canvasContextRef, selectRectangle, historyDispatcher]
  )

  const onMousedown = useCallback(
    (e: MouseEvent) => {
      if (!checked || !canvasContextRef.current || rectangleRef.current) {
        return
      }

      const { left, top } = canvasContextRef.current.canvas.getBoundingClientRect()
      const x = e.clientX - left
      const y = e.clientY - top
      rectangleRef.current = {
        name: 'Rectangle',
        type: HistoryItemType.Source,
        data: {
          size,
          color,
          x1: x,
          y1: y,
          x2: x,
          y2: y
        },
        editHistory: [],
        draw,
        isHit
      }
    },
    [checked, size, color, canvasContextRef]
  )

  const onMousemove = useCallback(
    (e: MouseEvent) => {
      if (!checked || !canvasContextRef.current) {
        return
      }

      if (rectangleEditRef.current) {
        rectangleEditRef.current.data.x2 = e.clientX
        rectangleEditRef.current.data.y2 = e.clientY
        if (history.top !== rectangleEditRef.current) {
          rectangleEditRef.current.source.editHistory.push(rectangleEditRef.current)
          historyDispatcher.push(rectangleEditRef.current)
        } else {
          historyDispatcher.set(history)
        }
      } else if (rectangleRef.current) {
        const { left, top } = canvasContextRef.current.canvas.getBoundingClientRect()
        const rectangleData = rectangleRef.current.data
        rectangleData.x2 = e.clientX - left
        rectangleData.y2 = e.clientY - top

        if (history.top !== rectangleRef.current) {
          historyDispatcher.push(rectangleRef.current)
        } else {
          historyDispatcher.set(history)
        }
      }
    },
    [checked, canvasContextRef, history, historyDispatcher]
  )

  const onMouseup = useCallback(() => {
    if (!checked) {
      return
    }

    if (rectangleRef.current) {
      historyDispatcher.clearSelect()
    }

    rectangleRef.current = null
    rectangleEditRef.current = null
  }, [checked, historyDispatcher])

  useDrawSelect(onDrawSelect)
  useCanvasMousedown(onMousedown)
  useCanvasMousemove(onMousemove)
  useCanvasMouseup(onMouseup)

  return (
    <ScreenshotsButton
      title={lang.operation_rectangle_title}
      icon='icon-rectangle'
      checked={checked}
      onClick={onSelectRectangle}
      option={<ScreenshotsSizeColor size={size} color={color} onSizeChange={setSize} onColorChange={setColor} />}
    />
  )
}
