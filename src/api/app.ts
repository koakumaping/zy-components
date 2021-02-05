import { ApiItem } from '@/types/api'
import { baseUrl } from './var'

const app: ApiItem[] = [
  {
    name: '应用上下架管理',
    eng: 'AppOnoff',
    url: `${baseUrl}/manager/app/manager/up/apply/{id}`,
  },
  {
    name: '应用上下架管理--审核流程',
    eng: 'AppOnoffFlow',
    url: `${baseUrl}/manager/app/audit/record/audit-flow`,
  },
  {
    name: '应用上下架管理--审核',
    eng: 'AppOnoffHandle',
    url: `${baseUrl}/manager/app/manager/up/apply/audit`,
  },
  {
    name: '应用管理',
    eng: 'AppManage',
    url: `${baseUrl}/manager/app/manager/{id}`,
  },
  {
    name: '应用管理-变更状态',
    eng: 'AppManageChangeStatus',
    url: `${baseUrl}/manager/app/manager/down/{id}`,
  },
]

export default app