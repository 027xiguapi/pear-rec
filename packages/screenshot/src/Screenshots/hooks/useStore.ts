import { useContext } from 'react'
import ScreenshotsContext, { ScreenshotsContextStore } from '../ScreenshotsContext'

export default function useStore (): ScreenshotsContextStore {
  const { store } = useContext(ScreenshotsContext)

  return store
}
