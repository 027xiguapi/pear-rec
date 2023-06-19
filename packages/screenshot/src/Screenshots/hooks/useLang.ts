import { Lang } from '../zh_CN'
import useStore from './useStore'

export default function useLang (): Lang {
  const { lang } = useStore()

  return lang
}
