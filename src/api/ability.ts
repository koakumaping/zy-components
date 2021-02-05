import { ApiItem } from '@/types/api'
import { baseUrl } from './var'

const ability: ApiItem[] = [
  {
    name: '服务开发商',
    eng: 'AbilitySdev',
    url: `${baseUrl}/manager/service/dev/{id}`,
  },
  {
    name: '服务开发商-状态变更',
    eng: 'AbilitySdevChangeStatus',
    url: `${baseUrl}/manager/service/dev/status/{id}`,
  },
  {
    name: '服务管理',
    eng: 'AbilityService',
    url: `${baseUrl}/manager/services/{id}`,
  },
  {
    name: '服务管理-服务开发商',
    eng: 'AbilityServiceLeftMenu',
    url: `${baseUrl}/manager/services/tree`,
  },
  {
    name: '服务管理-状态变更',
    eng: 'AbilityServiceChangeStatus',
    url: `${baseUrl}/manager/services/operator/up-down`,
  },
  {
    name: '服务管理-限流设置',
    eng: 'AbilityServiceLimit',
    url: `${baseUrl}/manager/services/rate-limiter/{id}`,
  },
  {
    name: '功能类型管理',
    eng: 'AbilityDict',
    url: `${baseUrl}/manager/function/types/{id}`,
  },
  {
    name: '功能类型-不分页',
    eng: 'AbilityDictAll',
    url: `${baseUrl}/manager/function/types/all`,
  },
  {
    name: '能力管理',
    eng: 'AbilityManage',
    url: `${baseUrl}/manager/service/capacities/{id}`,
  },
  {
    name: '能力管理-状态变更',
    eng: 'AbilityManageChangeStatus',
    url: `${baseUrl}/manager/service/capacities/status/{id}`,
  },
]

export default ability