import React, { ReactElement, useCallback, useRef, useState } from 'react'
import useCanvasContextRef from '../../hooks/useCanvasContextRef'
import useCanvasMousedown from '../../hooks/useCanvasMousedown'
import useCursor from '../../hooks/useCursor'
import useHistory from '../../hooks/useHistory'
import useOperation from '../../hooks/useOperation'
import ScreenshotsButton from '../../ScreenshotsButton'
import ScreenshotsSizeColor from '../../ScreenshotsSizeColor'
import {
  HistoryItemEdit,
  HistoryItemSource,
  HistoryItemType,
  Point
} from '../../types'
import ScreenshotsTextarea from '../../ScreenshotsTextarea'
import useBounds from '../../hooks/useBounds'
import useDrawSelect from '../../hooks/useDrawSelect'
import useCanvasMousemove from '../../hooks/useCanvasMousemove'
import useCanvasMouseup from '../../hooks/useCanvasMouseup'
import useLang from '../../hooks/useLang'

export interface TextData {
  size: number;
  color: string;
  fontFamily: string;
  x: number;
  y: number;
  text: string;
}

export interface TextEditData {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
}

export interface TextareaBounds {
  x: number;
  y: number;
  maxWidth: number;
  maxHeight: number;
}

const sizes: Record<number, number> = {
  3: 18,
  6: 32,
  9: 46
}

function draw (
  ctx: CanvasRenderingContext2D,
  action: HistoryItemSource<TextData, TextEditData>
) {
  const { size, color, fontFamily, x, y, text } = action.data
  ctx.fillStyle = color
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.font = `${size}px ${fontFamily}`

  const distance = action.editHistory.reduce(
    (distance, { data }) => ({
      x: distance.x + data.x2 - data.x1,
      y: distance.y + data.y2 - data.y1
    }),
    { x: 0, y: 0 }
  )

  text.split('\n').forEach((item, index) => {
    ctx.fillText(item, x + distance.x, y + distance.y + index * size)
  })
}

function isHit (
  ctx: CanvasRenderingContext2D,
  action: HistoryItemSource<TextData, TextEditData>,
  point: Point
) {
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.font = `${action.data.size}px ${action.data.fontFamily}`

  let width = 0
  let height = 0

  action.data.text.split('\n').forEach((item) => {
    const measured = ctx.measureText(item)
    if (width < measured.width) {
      width = measured.width
    }
    height += action.data.size
  })

  const { x, y } = action.editHistory.reduce(
    (distance, { data }) => ({
      x: distance.x + data.x2 - data.x1,
      y: distance.y + data.y2 - data.y1
    }),
    { x: 0, y: 0 }
  )

  const left = action.data.x + x
  const top = action.data.y + y
  const right = left + width
  const bottom = top + height

  return (
    point.x >= left && point.x <= right && point.y >= top && point.y <= bottom
  )
}

export default function Text (): ReactElement {
  const lang = useLang()
  const [history, historyDispatcher] = useHistory()
  const [bounds] = useBounds()
  const [operation, operationDispatcher] = useOperation()
  const [, cursorDispatcher] = useCursor()
  const canvasContextRef = useCanvasContextRef()
  const [size, setSize] = useState(3)
  const [color, setColor] = useState('#ee5126')
  const textRef = useRef<HistoryItemSource<TextData, TextEditData> | null>(
    null
  )
  const textEditRef = useRef<HistoryItemEdit<TextEditData, TextData> | null>(
    null
  )
  const [textareaBounds, setTextareaBounds] = useState<TextareaBounds | null>(
    null
  )
  const [text, setText] = useState<string>('')

  const checked = operation === 'Text'

  const selectText = useCallback(() => {
    operationDispatcher.set('Text')
    cursorDispatcher.set('default')
  }, [operationDispatcher, cursorDispatcher])

  const onSelectText = useCallback(() => {
    if (checked) {
      return
    }
    selectText()
    historyDispatcher.clearSelect()
  }, [checked, selectText, historyDispatcher])

  const onSizeChange = useCallback((size: number) => {
    if (textRef.current) {
      textRef.current.data.size = sizes[size]
    }
    setSize(size)
  }, [])

  const onColorChange = useCallback((color: string) => {
    if (textRef.current) {
      textRef.current.data.color = color
    }
    setColor(color)
  }, [])

  const onTextareaChange = useCallback(
    (value: string) => {
      setText(value)
      if (checked && textRef.current) {
        textRef.current.data.text = value
      }
    },
    [checked]
  )

  const onTextareaBlur = useCallback(() => {
    if (textRef.current && textRef.current.data.text) {
      historyDispatcher.push(textRef.current)
    }
    textRef.current = null
    setText('')
    setTextareaBounds(null)
  }, [historyDispatcher])

  const onDrawSelect = useCallback(
    (action: HistoryItemSource<unknown, unknown>, e: MouseEvent) => {
      if (action.name !== 'Text') {
        return
      }

      selectText()

      textEditRef.current = {
        type: HistoryItemType.Edit,
        data: {
          x1: e.clientX,
          y1: e.clientY,
          x2: e.clientX,
          y2: e.clientY
        },
        source: action as HistoryItemSource<TextData, TextEditData>
      }

      historyDispatcher.select(action)
    },
    [selectText, historyDispatcher]
  )

  const onMousedown = useCallback(
    (e: MouseEvent) => {
      if (!checked || !canvasContextRef.current || textRef.current || !bounds) {
        return
      }
      const { left, top } =
        canvasContextRef.current.canvas.getBoundingClientRect()
      const fontFamily = window.getComputedStyle(
        canvasContextRef.current.canvas
      ).fontFamily
      const x = e.clientX - left
      const y = e.clientY - top

      textRef.current = {
        name: 'Text',
        type: HistoryItemType.Source,
        data: {
          size: sizes[size],
          color,
          fontFamily,
          x,
          y,
          text: ''
        },
        editHistory: [],
        draw,
        isHit
      }

      setTextareaBounds({
        x: e.clientX,
        y: e.clientY,
        maxWidth: bounds.width - x,
        maxHeight: bounds.height - y
      })
    },
    [checked, size, color, bounds, canvasContextRef]
  )

  const onMousemove = useCallback(
    (e: MouseEvent): void => {
      if (!checked) {
        return
      }

      if (textEditRef.current) {
        textEditRef.current.data.x2 = e.clientX
        textEditRef.current.data.y2 = e.clientY
        if (history.top !== textEditRef.current) {
          textEditRef.current.source.editHistory.push(textEditRef.current)
          historyDispatcher.push(textEditRef.current)
        } else {
          historyDispatcher.set(history)
        }
      }
    },
    [checked, history, historyDispatcher]
  )

  const onMouseup = useCallback((): void => {
    if (!checked) {
      return
    }

    textEditRef.current = null
  }, [checked])

  useDrawSelect(onDrawSelect)
  useCanvasMousedown(onMousedown)
  useCanvasMousemove(onMousemove)
  useCanvasMouseup(onMouseup)

  return (
    <>
      <ScreenshotsButton
        title={lang.operation_text_title}
        icon='icon-text'
        checked={checked}
        onClick={onSelectText}
        option={
          <ScreenshotsSizeColor
            size={size}
            color={color}
            onSizeChange={onSizeChange}
            onColorChange={onColorChange}
          />
        }
      />
      {checked && textareaBounds && (
        <ScreenshotsTextarea
          x={textareaBounds.x}
          y={textareaBounds.y}
          maxWidth={textareaBounds.maxWidth}
          maxHeight={textareaBounds.maxHeight}
          size={sizes[size]}
          color={color}
          value={text}
          onChange={onTextareaChange}
          onBlur={onTextareaBlur}
        />
      )}
    </>
  )
}
