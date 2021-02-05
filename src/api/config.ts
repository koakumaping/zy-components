import { ApiItem } from '@/types/api'
import { baseUrl } from './var'

const config: ApiItem[] = [
  {
    name: '安全设置-Token',
    eng: 'ConfigSafeToken',
    url: `${baseUrl}/manager/config/security`,
  },
  {
    name: '安全设置-Email',
    eng: 'ConfigSafeEmail',
    url: `${baseUrl}/manager/config/email`,
  },
  {
    name: '安全设置-Email-发送',
    eng: 'ConfigSafeEmailSend',
    url: `${baseUrl}/manager/config/email/testing`,
  },
  {
    name: '安全设置-Secret',
    eng: 'ConfigSafeSecret',
    url: `${baseUrl}/manager/config/encryptKey`,
  },
  {
    name: '安全设置-Gateway',
    eng: 'ConfigSafeGateway',
    url: `${baseUrl}/manager/config/gateway/url`,
  },
  {
    name: '协议管理',
    eng: 'ConfigPact',
    url: `${baseUrl}/manager/protocol`,
  },
  {
    name: '协议管理-详情',
    eng: 'ConfigPactModular',
    url: `${baseUrl}/manager/protocol/{id}`,
  },
]

export default config