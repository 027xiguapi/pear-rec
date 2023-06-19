import { useCallback } from 'react'
import useDispatcher from './useDispatcher'
import useStore from './useStore'

export interface CursorDispatcher {
  set: (cursor: string) => void;
  reset: () => void;
}

export type CursorValueDispatcher = [string | undefined, CursorDispatcher];

export default function useCursor (): CursorValueDispatcher {
  const { cursor } = useStore()
  const { setCursor } = useDispatcher()

  const set = useCallback(
    (cursor: string) => {
      setCursor?.(cursor)
    },
    [setCursor]
  )

  const reset = useCallback(() => {
    setCursor?.('move')
  }, [setCursor])

  return [
    cursor,
    {
      set,
      reset
    }
  ]
}
