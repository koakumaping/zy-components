import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { history } from 'umi'
import { message } from 'antd'
import {
  clone,
  isEmpty,
  isObject,
  isEmptyObject,
} from 'evian'
import CryptoJS from 'crypto-js'
import store from 'store'
import getApiItem from '@/api/index'
import { ApiItem } from '@/types/api'

const ignoreToken = false
// des3 key
const keyCrypto = '684523174589651002354157'
// 向量
const ivText = '00000000'
// 协商
const merchantKey = 'com.hzsun.ccd.uias'

export const loginConfig = {
  clientId: 'test_client',
  clientSecret: 'test_secret',
  grantType: 'captcha',
}

export const tokenVerKey = '123456'

// DES-CBC模式加密
function encryptByDESModeCBC(payload: string) {
  const keyHex = CryptoJS.enc.Utf8.parse(keyCrypto)
  const encrypted = CryptoJS.TripleDES.encrypt(payload, keyHex, {
    iv: CryptoJS.enc.Utf8.parse(ivText),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.toString()
}

// DES-CBC模式解密
function decryptByDESModeCBC(ciphertext: string) {
  const keyHex = CryptoJS.enc.Utf8.parse(keyCrypto)
  const decrypted = CryptoJS.TripleDES.decrypt(ciphertext, keyHex, {
    iv: CryptoJS.enc.Utf8.parse(ivText),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

function md5(msg: string) {
  return CryptoJS.MD5(msg).toString()
}

// base64加密
function enBase64(strInfo: string) {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(strInfo))
}

// 请求post进行加密
function makeSign(data: { [keyof: string]: any }) {
  let request: { [keyof: string]: any } = {}
  // 排除对象值为undefined或者null
  Object.keys(data).forEach(item => {
    if (data[item] !== undefined && data[item] !== null) {
      request[item] = data[item]
    }
  })
  let keyString = ''
  request = Object.assign({}, request, { merchantKey })
  // ascii排序
  const keys = Object.keys(request).sort()
  for (let i = 0; i < keys.length; i++) {
    if (typeof request[keys[i]] === 'object') {
      keyString += `&${keys[i]}=${JSON.stringify(request[keys[i]])}`
    } else {
      keyString += `&${keys[i]}=${request[keys[i]]}`
    }
  }
  // 将拼接好字符串MD5加密 生成sign
  const signPre = md5(keyString.substr(1))
  const base64Str = enBase64(signPre)
  return base64Str
}

function makeGetSign(data: any) {
  const keys = Object.keys(data)
  let keyString = ''
  for (let i = 0; i < keys.length; i++) {
    if (typeof data[keys[i]] === 'object') {
      keyString += `&${keys[i]}=${JSON.stringify(data[keys[i]])}`
    } else {
      keyString += `&${keys[i]}=${data[keys[i]]}`
    }
  }
  const signPre = keyString.substr(1)
  return signPre
}

/**
 * 替换 URL 路径中的变量，例如 /rest/users/{id}，其中 {id} 替换为 params.id 的值
 *
 * @param {String} url           URL 例如 /rest/users/{id}，如果没有占位的变量，则原样返回
 * @param {Json}   params Json 对象
 * @return {String} 返回替换变量后的 URL
 */
function formatUrl(url: string | undefined, params: Record<string, any>) {
  console.log(url)
  if (!url) {
    return url
  }

  // 查找 {name}，然后进行替换
  // m 是正则中捕获的组 $0，即匹配的整个子串
  // n 是正则中捕获的组 $1，即 () 中的内容
  // function($0, $1, $2, ...)
  return url.replace(/\{(\w+)\}/g, function(m, n) {
    if (m === '{') return ''
    if (m === '}') return ''
    const value = isObject(params) ? params[n] : ''
    if (value) {
      console.log(n, value)
      delete params[n]
      return value
    }
    return ''
  })
}

function handleParams(payload: AxiosRequestConfig) {
  const params = clone(payload?.params)
  if (!params || isEmpty(params)) return
  console.log(params)
  for (const key in params) {
    // 去除空值
    const value = params[key]
    if (isEmpty(value)) delete params[key]
    // 删除id
    // if (key === 'id') delete params[key]
  }

  if (isEmptyObject(params)) {
    payload.params = ''
    return
  }

  const results = encodeURIComponent(
    encryptByDESModeCBC(makeGetSign(params))
  )
  payload.params = { paramStr: results }
}

function handleData(payload: AxiosRequestConfig) {
  const { data } = payload
  console.log(clone(data))
  if (!data) return false
  const newData = Object.assign({}, data, { sign: makeSign(data) })
  const results = encodeURIComponent(
    encryptByDESModeCBC(JSON.stringify(newData))
  )

  payload.data = { paramStr: results }
  if (payload.params) delete payload.params.id
}

function r(): any {
  let routerName = ''
  let routerNameCN = ''
  let method = ''
  let apiItem: ApiItem = {
    name: '',
    eng: '',
    url: '',
  }

  const instance = axios.create()

  // Override timeout default for the library
  instance.defaults.timeout = 60000

  instance.interceptors.request.use((config: AxiosRequestConfig) => {
    // 读取真正的url地址
    routerName = config.url || ''
    if (!routerName) {
      console.warn('缺少url')
      return Promise.reject('缺少url')
    }
    apiItem = getApiItem(routerName)
    routerNameCN = apiItem.name
    method = config.method || ''

    console.log('请求:', method, routerNameCN || config.url)
    console.log(config.params)
    config.url = apiItem.url || config.url
    config.url = formatUrl(config.url, config.params)
    // 处理id
    // const params = clone(config.params)
    // if (params && params.id) {
    //   config.url = `${config.url}/${params.id}`
    // }

    // 设置token
    config.headers['Authorization'] = store.get('token')
    config.headers.charset = 'utf-8'
    
    // if (apiItem.isFile) return config
    if (method === 'get' || method === 'delete') handleParams(config.params)
    if (method === 'post' || method === 'put') console.log(clone(config.data))
    return config
  }, (error) => {
    // Do something with request error
    return Promise.reject(error)
  })

  instance.interceptors.response.use((response: AxiosResponse) => {
    // Do something with response data
    const received = response.data
    console.log('返回:', method, routerNameCN, received.code, received.data)
    switch (received.code) {
      case undefined:
        if (received.error) {
          message.info(`path: ${received.path}, msg: ${received.message}`)
        }
        break
      case -1:
        message.info(received.msg || received.data)
        return Promise.reject(received)
      case 1:
        return Promise.resolve(received.data)
      // 需要登陆
      case 20002:
        if (!ignoreToken) history.replace('/login?code=20002')
        return Promise.reject(received)
      // 导入错误提示
      case 20003:
        return Promise.reject(received)
      case 20013:
      case 20020: // token失效 登录超时，请重新登录
        if (!ignoreToken) history.replace('/login?code=20020')
        return Promise.reject(received)
      case 20053: // token失效 账号在其他地方登录
        if (!ignoreToken) history.replace('/login?code=20053')
        return Promise.reject(received)
      case 20011: // 用户名或者密码错误
      case 20025: // 验证码错误
        message.warn(received.msg)
        return Promise.reject(received)
      default:
        message.error(received.msg)
        return Promise.reject(received)
    }
    return Promise.reject(received)
  }, (error) => {
    // Do something with response error
    if (error && error.response && error.response.status) {
      const { status, data } = error.response
      switch (status) {
        case 401:
          if (!ignoreToken) history.replace('/login?code=401')
          break
        case 402:
        case 403:
          message.error(data.msg)
          // router.replace({ name: '403' })
          break
        case 500:
          message.error(data.msg ? data.msg : data)
          // router.replace({ name: '500' })
          break
        case 404:
          if (error.response.request.responseType !== 'blob') {
            message.error('请求后台接口失败，请稍后再试')
          }
          break
        default:
          message.error(`连接出错 (${status})`)
      }
      return Promise.reject(error)
    }
    message.error(error.toString())
    return Promise.reject(error)
  })

  return instance
}

export default r
