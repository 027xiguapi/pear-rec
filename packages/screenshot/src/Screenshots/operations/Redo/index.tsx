import React, { ReactElement, useCallback } from 'react'
import ScreenshotsButton from '../../ScreenshotsButton'
import useHistory from '../../hooks/useHistory'
import useLang from '../../hooks/useLang'

export default function Redo (): ReactElement {
  const lang = useLang()
  const [history, historyDispatcher] = useHistory()

  const onClick = useCallback(() => {
    historyDispatcher.redo()
  }, [historyDispatcher])

  return (
    <ScreenshotsButton
      title={lang.operation_redo_title}
      icon='icon-redo'
      disabled={!history.stack.length || history.stack.length - 1 === history.index}
      onClick={onClick}
    />
  )
}
