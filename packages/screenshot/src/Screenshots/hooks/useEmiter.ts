import { useCallback } from 'react'
import { EmiterListener } from '../types'
import useStore from './useStore'

export interface EmiterDispatcher {
  on: (event: string, listener: EmiterListener) => void
  off: (event: string, listener: EmiterListener) => void
  emit: (event: string, ...args: unknown[]) => void
  reset: () => void
}

export default function useEmiter (): EmiterDispatcher {
  const { emiterRef } = useStore()

  const on = useCallback(
    (event: string, listener: EmiterListener) => {
      const emiter = emiterRef.current
      if (Array.isArray(emiter[event])) {
        emiter[event].push(listener)
      } else {
        emiter[event] = [listener]
      }
    },
    [emiterRef]
  )

  const off = useCallback(
    (event: string, listener: EmiterListener) => {
      const emiter = emiterRef.current
      if (Array.isArray(emiter[event])) {
        const index = emiter[event].findIndex(item => item === listener)
        if (index !== -1) {
          emiter[event].splice(index, 1)
        }
      }
    },
    [emiterRef]
  )

  const emit = useCallback(
    (event: string, ...args: unknown[]) => {
      const emiter = emiterRef.current

      if (Array.isArray(emiter[event])) {
        emiter[event].forEach(listener => listener(...args))
      }
    },
    [emiterRef]
  )

  const reset = useCallback(() => {
    emiterRef.current = {}
  }, [emiterRef])

  return {
    on,
    off,
    emit,
    reset
  }
}
