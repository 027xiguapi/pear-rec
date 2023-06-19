import { useCallback } from 'react'
import useDispatcher from './useDispatcher'

export type CallDispatcher = <T extends unknown[]>(funcName: string, ...args: T) => void

export default function useCall (): CallDispatcher {
  const dispatcher = useDispatcher()

  const call = useCallback(
    <T extends unknown[]>(funcName: string, ...args: T) => {
      dispatcher.call?.(funcName, ...args)
    },
    [dispatcher]
  )

  return call
}
