import React, { ReactElement, useCallback } from 'react'
import composeImage from '../../composeImage'
import useStore from '../../hooks/useStore'
import useCall from '../../hooks/useCall'
import useCanvasContextRef from '../../hooks/useCanvasContextRef'
import useHistory from '../../hooks/useHistory'
import useReset from '../../hooks/useReset'
import ScreenshotsButton from '../../ScreenshotsButton'

export default function Save (): ReactElement {
  const { image, width, height, history, bounds, lang } = useStore()
  const canvasContextRef = useCanvasContextRef()
  const [, historyDispatcher] = useHistory()
  const call = useCall()
  const reset = useReset()

  const onClick = useCallback(() => {
    historyDispatcher.clearSelect()
    setTimeout(() => {
      if (!canvasContextRef.current || !image || !bounds) {
        return
      }
      composeImage({
        image,
        width,
        height,
        history,
        bounds
      }).then(blob => {
        call('onSave', blob, bounds)
        reset()
      })
    })
  }, [canvasContextRef, historyDispatcher, image, width, height, history, bounds, call, reset])

  return <ScreenshotsButton title={lang.operation_save_title} icon='icon-save' onClick={onClick} />
}
