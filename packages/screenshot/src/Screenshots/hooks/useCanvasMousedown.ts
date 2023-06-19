import { useEffect } from 'react'
import useEmiter from '../hooks/useEmiter'

export default function useCanvasMousedown (onMousedown: (e: MouseEvent) => unknown): void {
  const emiter = useEmiter()

  useEffect(() => {
    emiter.on('mousedown', onMousedown)
    return () => {
      emiter.off('mousedown', onMousedown)
    }
  }, [onMousedown, emiter])
}
