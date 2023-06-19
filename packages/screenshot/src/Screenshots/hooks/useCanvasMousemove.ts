import { useEffect } from 'react'
import useEmiter from '../hooks/useEmiter'

export default function useCanvasMousemove (onMousemove: (e: MouseEvent) => unknown): void {
  const emiter = useEmiter()

  useEffect(() => {
    emiter.on('mousemove', onMousemove)
    return () => {
      emiter.off('mousemove', onMousemove)
    }
  }, [onMousemove, emiter])
}
