import { ApiItem } from '@/types/api'
import systems from './system'
import config from './config'
import ability from './ability'
import open from './open'
import app from './app'
import data from './data'
import watch from './watch'

const apiList: ApiItem[] = [
  ...systems,
  ...config,
  ...ability,
  ...open,
  ...app,
  ...data,
  ...watch,
]

const getApiItem = (routerName: string): ApiItem => {
  for (let i = 0, l = apiList.length; i < l; ++i) {
    if (apiList[i].eng === routerName) {
      return apiList[i]
    }
  }
  return {
    name: '',
    eng: '',
    url: '',
  }
}

export default getApiItem