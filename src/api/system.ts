import { ApiItem } from '@/types/api'
import { baseUrl } from './var'

const system: ApiItem[] = [
  {
    name: '获取验证码',
    eng: 'getCaptcha',
    url: `/api/uias/authorization/v1/authorization/captcha`,
  },
  {
    name: '登录',
    eng: 'Login',
    url: `${baseUrl}/manager/login`,
  },
  {
    name: '登出',
    eng: 'LoginOut',
    url: `/api/uias/authorization/v1/authorization/logout`,
  },
  {
    name: '获取权限',
    eng: 'GetPermission',
    url: `/api/uias/authentication/v1/authentication/permission`,
  },
  {
    name: '文件上传',
    eng: 'FileUpload',
    url: `${baseUrl}/manager/common/upload`,
  },
  {
    name: '所有服务',
    eng: 'ServiceList',
    url: `${baseUrl}/manager/reports/service`,
  },
  {
    name: '服务对应能力',
    eng: 'CapacityList',
    url: `${baseUrl}/manager/reports/capacity`,
  },
  {
    name: '所有应用',
    eng: 'AppList',
    url: `${baseUrl}/manager/reports/app`,
  },
  {
    name: '统计数据',
    eng: 'IndexStatistics',
    url: `${baseUrl}/manager/index/total/statistics`,
  },
  {
    name: '能力耗时排行',
    eng: 'IndexAbilityCost',
    url: `${baseUrl}/manager/index/capacity/cost/time/top`,
  },
  {
    name: '能力转发排行',
    eng: 'IndexAbilityRs',
    url: `${baseUrl}/manager/index/capacity/invoke/top`,
  },
]

export default system