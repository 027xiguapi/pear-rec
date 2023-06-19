import { useCallback } from 'react'
import { Bounds } from '../types'
import useDispatcher from './useDispatcher'
import useStore from './useStore'

export interface BoundsDispatcher {
  set: (bounds: Bounds) => void
  reset: () => void
}

export type BoundsValueDispatcher = [Bounds | null, BoundsDispatcher]

export default function useBounds (): BoundsValueDispatcher {
  const { bounds } = useStore()
  const { setBounds } = useDispatcher()

  const set = useCallback(
    (bounds: Bounds) => {
      setBounds?.(bounds)
    },
    [setBounds]
  )

  const reset = useCallback(() => {
    setBounds?.(null)
  }, [setBounds])

  return [
    bounds,
    {
      set,
      reset
    }
  ]
}
