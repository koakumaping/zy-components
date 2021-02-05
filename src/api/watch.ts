import { ApiItem } from '@/types/api'
import { baseUrl } from './var'

const watch: ApiItem[] = [
  {
    name: '异常告警',
    eng: 'WatchError',
    url: `${baseUrl}/manager/reports/invoke/error`,
  },
]

export default watch