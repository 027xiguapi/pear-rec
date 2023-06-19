import { useEffect } from 'react'
import useEmiter from '../hooks/useEmiter'
import { HistoryItemSource } from '../types'

export default function useDrawSelect (
  onDrawSelect: (action: HistoryItemSource<unknown, unknown>, e: MouseEvent) => unknown
): void {
  const emiter = useEmiter()

  useEffect(() => {
    emiter.on('drawselect', onDrawSelect)
    return () => {
      emiter.off('drawselect', onDrawSelect)
    }
  }, [onDrawSelect, emiter])
}
