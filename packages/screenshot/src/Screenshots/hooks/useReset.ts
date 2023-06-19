import { useCallback } from 'react'
import useBounds from './useBounds'
import useCursor from './useCursor'
import useEmiter from './useEmiter'
import useHistory from './useHistory'
import useOperation from './useOperation'

export type ResetDispatcher = () => void

export default function useReset (): ResetDispatcher {
  const emiter = useEmiter()
  const [, boundsDispatcher] = useBounds()
  const [, cursorDispatcher] = useCursor()
  const [, historyDispatcher] = useHistory()
  const [, operatioDispatcher] = useOperation()

  const reset = useCallback(() => {
    emiter.reset()
    historyDispatcher.reset()
    boundsDispatcher.reset()
    cursorDispatcher.reset()
    operatioDispatcher.reset()
  }, [emiter, historyDispatcher, boundsDispatcher, cursorDispatcher, operatioDispatcher])

  return reset
}
