import { useContext } from 'react'
import ScreenshotsContext, { ScreenshotsContextDispatcher } from '../ScreenshotsContext'

export default function useDispatcher (): ScreenshotsContextDispatcher {
  const { dispatcher } = useContext(ScreenshotsContext)

  return dispatcher
}
