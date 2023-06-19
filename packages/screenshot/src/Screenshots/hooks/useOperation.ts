import { useCallback } from 'react'
import useDispatcher from './useDispatcher'
import useStore from './useStore'

export interface OperationDispatcher {
  set: (operation: string) => void;
  reset: () => void;
}

export type OperationValueDispatcher = [
  string | undefined,
  OperationDispatcher
];

export default function useOperation (): OperationValueDispatcher {
  const { operation } = useStore()
  const { setOperation } = useDispatcher()

  const set = useCallback(
    (operation: string) => {
      setOperation?.(operation)
    },
    [setOperation]
  )

  const reset = useCallback(() => {
    setOperation?.(undefined)
  }, [setOperation])

  return [
    operation,
    {
      set,
      reset
    }
  ]
}
