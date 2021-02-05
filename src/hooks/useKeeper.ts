import { useMemo } from 'react'
import { useModel, useLocation } from 'umi'
import url2key from '@/util/url2key'

export default function useKeeper() {
  const pList = useModel('menu').pList
  const location = useLocation()

  const btnPList = useMemo(() => {
    const key = url2key(location.pathname)
    const list: string[] = pList.filter(item => item.indexOf(key) > -1).map(item => item.replace(key, ''))
    return list
  }, [ pList, location ])

  // 是否拥有某个权限
  const P = (payload: string) => {
    return btnPList.indexOf(payload) > -1
  }

  return {
    P
  }
}