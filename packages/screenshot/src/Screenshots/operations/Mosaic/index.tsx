import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import ScreenshotsButton from '../../ScreenshotsButton'
import ScreenshotsSize from '../../ScreenshotsSize'
import useCanvasMousedown from '../../hooks/useCanvasMousedown'
import useCanvasMousemove from '../../hooks/useCanvasMousemove'
import useCanvasMouseup from '../../hooks/useCanvasMouseup'
import { HistoryItemSource, HistoryItemType } from '../../types'
import useOperation from '../../hooks/useOperation'
import useCursor from '../../hooks/useCursor'
import useStore from '../../hooks/useStore'
import useBounds from '../../hooks/useBounds'
import useHistory from '../../hooks/useHistory'
import useCanvasContextRef from '../../hooks/useCanvasContextRef'
import useLang from '../../hooks/useLang'

export interface MosaicTile {
  x: number
  y: number
  color: number[]
}

export interface MosaicData {
  size: number
  tiles: MosaicTile[]
}

function getColor (x: number, y: number, imageData: ImageData): number[] {
  if (!imageData) {
    return [0, 0, 0, 0]
  }
  const { data, width } = imageData

  const index = y * width * 4 + x * 4

  return Array.from(data.slice(index, index + 4))
}

function draw (ctx: CanvasRenderingContext2D, action: HistoryItemSource<MosaicData, null>) {
  const { tiles, size } = action.data
  tiles.forEach(tile => {
    const r = Math.round(tile.color[0])
    const g = Math.round(tile.color[1])
    const b = Math.round(tile.color[2])
    const a = tile.color[3] / 255

    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
    ctx.fillRect(tile.x - size / 2, tile.y - size / 2, size, size)
  })
}

export default function Mosaic (): ReactElement {
  const lang = useLang()
  const { image, width, height } = useStore()
  const [operation, operationDispatcher] = useOperation()
  const canvasContextRef = useCanvasContextRef()
  const [history, historyDispatcher] = useHistory()
  const [bounds] = useBounds()
  const [, cursorDispatcher] = useCursor()
  const [size, setSize] = useState(3)
  const imageDataRef = useRef<ImageData | null>(null)
  const mosaicRef = useRef<HistoryItemSource<MosaicData, null> | null>(null)

  const checked = operation === 'Mosaic'

  const selectMosaic = useCallback(() => {
    operationDispatcher.set('Mosaic')
    cursorDispatcher.set('crosshair')
  }, [operationDispatcher, cursorDispatcher])

  const onSelectMosaic = useCallback(() => {
    if (checked) {
      return
    }
    selectMosaic()
    historyDispatcher.clearSelect()
  }, [checked, selectMosaic, historyDispatcher])

  const onMousedown = useCallback(
    (e: MouseEvent): void => {
      if (!checked || mosaicRef.current || !imageDataRef.current || !canvasContextRef.current) {
        return
      }

      const rect = canvasContextRef.current.canvas.getBoundingClientRect()
      const x = e.clientX - rect.x
      const y = e.clientY - rect.y
      const mosaicSize = size * 2
      mosaicRef.current = {
        name: 'Mosaic',
        type: HistoryItemType.Source,
        data: {
          size: mosaicSize,
          tiles: [
            {
              x,
              y,
              color: getColor(x, y, imageDataRef.current)
            }
          ]
        },
        editHistory: [],
        draw
      }
    },
    [checked, size, canvasContextRef]
  )

  const onMousemove = useCallback(
    (e: MouseEvent): void => {
      if (!checked || !mosaicRef.current || !canvasContextRef.current || !imageDataRef.current) {
        return
      }

      const rect = canvasContextRef.current.canvas.getBoundingClientRect()
      const x = e.clientX - rect.x
      const y = e.clientY - rect.y

      const mosaicSize = mosaicRef.current.data.size
      const mosaicTiles = mosaicRef.current.data.tiles

      let lastTile = mosaicTiles[mosaicTiles.length - 1]

      if (!lastTile) {
        mosaicTiles.push({
          x,
          y,
          color: getColor(x, y, imageDataRef.current)
        })
      } else {
        const dx = lastTile.x - x
        const dy = lastTile.y - y
        // 减小点的个数
        let length = Math.sqrt(dx ** 2 + dy ** 2)
        const sin = -dy / length
        const cos = -dx / length

        while (length > mosaicSize) {
          const cx = Math.floor(lastTile.x + mosaicSize * cos)
          const cy = Math.floor(lastTile.y + mosaicSize * sin)
          lastTile = {
            x: cx,
            y: cy,
            color: getColor(cx, cy, imageDataRef.current)
          }
          mosaicTiles.push(lastTile)
          length -= mosaicSize
        }

        // 最后一个位置补充一块
        if (length > mosaicSize / 2) {
          mosaicTiles.push({
            x,
            y,
            color: getColor(x, y, imageDataRef.current)
          })
        }
      }

      if (history.top !== mosaicRef.current) {
        historyDispatcher.push(mosaicRef.current)
      } else {
        historyDispatcher.set(history)
      }
    },
    [checked, canvasContextRef, history, historyDispatcher]
  )

  const onMouseup = useCallback(() => {
    if (!checked) {
      return
    }

    mosaicRef.current = null
  }, [checked])

  useCanvasMousedown(onMousedown)
  useCanvasMousemove(onMousemove)
  useCanvasMouseup(onMouseup)

  useEffect(() => {
    if (!bounds || !image || !checked) {
      return
    }

    const $canvas = document.createElement('canvas')

    const canvasContext = $canvas.getContext('2d')

    if (!canvasContext) {
      return
    }

    $canvas.width = bounds.width
    $canvas.height = bounds.height

    const rx = image.naturalWidth / width
    const ry = image.naturalHeight / height

    canvasContext.drawImage(
      image,
      bounds.x * rx,
      bounds.y * ry,
      bounds.width * rx,
      bounds.height * ry,
      0,
      0,
      bounds.width,
      bounds.height
    )

    imageDataRef.current = canvasContext.getImageData(0, 0, bounds.width, bounds.height)
  }, [width, height, bounds, image, checked])

  return (
    <ScreenshotsButton
      title={lang.operation_mosaic_title}
      icon='icon-mosaic'
      checked={checked}
      onClick={onSelectMosaic}
      option={<ScreenshotsSize value={size} onChange={setSize} />}
    />
  )
}
