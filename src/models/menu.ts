import { useState, useCallback } from 'react'
import { history } from 'umi'
import store from 'store'
import { MenuItem } from '@/types/menu'
import r from '@/util/request'
import { clone } from 'evian'
import staticMenuList from '@/util/menu'

export default function() {
  const initMenuList: MenuItem[] = store.get('menuList', [])
  const initPList: string[] = []
  const [ menuList, setMenuList ] = useState(initMenuList)
  const [ pList, setPList ] = useState(initPList)

  // 将权限转换成菜单
  const handleMenuList = (payload: string[]) => {
    return new Promise(resolve => {
      setPList(payload)
      const list: string[] = payload

      let currentMenuList: MenuItem[] = [
        {
          icon: 'HomeOutlined',
          key: 'home',
          label: '首页',
          value: 'Home',
          path: '/home',
        },
      ]

      const cloneMenu: MenuItem[] = clone(staticMenuList)
      currentMenuList = [
        ...currentMenuList,
        ...cloneMenu
          .filter(module => list.includes(module.key))
          .map(item => {
            if (item.children) {
              item.children = item.children.filter(page =>
                list.includes(page.key)
              )
            }
            return item
          })
      ]
    
      store.set('menuList', currentMenuList)
      setMenuList(currentMenuList)
      resolve(currentMenuList)
    })
  }

  // 获取权限并处理成菜单
  const getPermissionList = (): Promise<MenuItem[]> => {
    return new Promise((resolve, reject) => {
      const params = {
        appIdentity: 'ocp',
      }

      r().get('GetPermission', { params }).then((rr: string[]) => {
        handleMenuList(rr).then(() => {
          if (rr.length) {
            resolve([])
            return
          }
          reject()
        })
      }).catch((err: any) => {
        reject(err)
      })
    })
  }

  // 获取菜单
  const getMenuList = useCallback(() => {
    console.log('getMenuList')
    getPermissionList().catch((err) => {
      history.replace(`/login?code=${err.code}`)
    })
  }, [])

  const clearMenuList = useCallback(() => {
    console.log('clearMenuList')
    store.clearAll()
    setMenuList([])
  }, [])

  return {
    pList,
    menuList,
    handleMenuList,
    getMenuList,
    clearMenuList,
  }
}