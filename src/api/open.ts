import { ApiItem } from '@/types/api'
import { baseUrl } from './var'

const open: ApiItem[] = [
  {
    name: '应用开发者',
    eng: 'OpenDevman',
    url: `${baseUrl}/manager/app/developer/{id}`,
  },
  {
    name: '应用开发者-审核流程',
    eng: 'OpenDevmanFlow',
    url: `${baseUrl}/manager/app/developer/audit-flow`,
  },
  {
    name: '应用开发者-审核详情',
    eng: 'OpenDevmanModular',
    url: `${baseUrl}/manager/app/developer/detail`,
  },
  {
    name: '应用申请管理',
    eng: 'OpenApp',
    url: `${baseUrl}/manager/app/audit/record/{id}`,
  },
  {
    name: '应用申请管理-审核流程',
    eng: 'OpenAppFlow',
    url: `${baseUrl}/manager/app/audit/record/audit-flow`,
  },
  {
    name: '应用申请管理-审核详情',
    eng: 'OpenAppModular',
    url: `${baseUrl}/manager/app/manager/{id}`,
  },
  {
    name: '应用IP授权列表',
    eng: 'OpenIpauth',
    url: `${baseUrl}/manager/app/ip/appList`,
  },
  {
    name: '应用IP授权-对应IP列表',
    eng: 'OpenIpauthIpList',
    url: `${baseUrl}/manager/app/ip/{id}`,
  },
  {
    name: '应用IP授权-变更应用限制状态',
    eng: 'OpenIpauthAppStatus',
    url: `${baseUrl}/manager/app/ip/limit/{id}`,
  },
  {
    name: '应用IP授权-变更应用下的IP状态',
    eng: 'OpenIpauthAppIpStatus',
    url: `${baseUrl}/manager/app/ip/status/{id}/{ipId}`,
  },
  {
    name: '应用IP授权-变更应用下的IP',
    eng: 'OpenIpauthAppIpModular',
    url: `${baseUrl}/manager/app/ip/{id}`,
  },
  {
    name: '应用IP授权-IP绑定模式',
    eng: 'OpenIpauthAppIpMode',
    url: `${baseUrl}/manager/app/ip/mode`,
  },
  {
    name: '应用IP授权-删除绑定IP',
    eng: 'OpenIpauthAppIpDelete',
    url: `${baseUrl}/manager/app/ip/delete`,
  },
]

export default open