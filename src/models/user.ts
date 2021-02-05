import { useState } from 'react'
import store from 'store'
import { UserItem } from '@/types/user'

export default function() {
  const initItem: UserItem = store.get('user') || {}
  const [ user, setUser ] = useState(initItem)

  const setUserInfo = (payload: UserItem) => {
    console.log('setUserInfo', payload)
    setUser(payload)
  }

  return {
    user,
    setUserInfo,
  }
}