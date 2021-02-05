import { RuleObject } from 'node_modules/rc-field-form/lib/interface'
import { isEmpty } from 'evian'

const specialReg = new RegExp(
  '[\'"<>=]'
)

const emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/

const phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/

const chineseReg = /.*[\u4e00-\u9fa5]+.*$/

// 只能输入数字字母
const onlyNC = /^[A-Za-z0-9]+$/

// IP
const ipReg =  /^(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])(:([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?$/

function hasSpecial(payload: string) {
  return specialReg.test(payload)
}

function notEmailNumber(payload: string) {
  return !emailReg.test(payload)
}

function notPhoneNumber(payload: string) {
  return !phoneReg.test(payload)
}

function hasChinese(payload: string) {
  return chineseReg.test(payload)
}

function hasNC(payload: string) {
  return onlyNC.test(payload)
}

function hasSpace(payload: string) {
  return payload.indexOf(' ') > -1
}

export function noEmptyValidator(rule: RuleObject, value: any) {
  if (isEmpty(value)) return Promise.reject('必填项')
  if (hasSpecial(value)) {
    return Promise.reject('不能含有特殊字符( \' " < > = )')
  }
  return Promise.resolve()
}

export function emailValidator(rule: RuleObject, value: string) {
  if (isEmpty(value)) return Promise.reject('必填项')
  if (notEmailNumber(value)) {
    return Promise.reject('格式错误')
  }
  return Promise.resolve()
}

export function phoneCanEmptyValidator(rule: RuleObject, value: string) {
  if (isEmpty(value)) return Promise.resolve()
  if (notPhoneNumber(value)) {
    return Promise.reject('格式错误')
  }
  return Promise.resolve()
}

export function phoneValidator(rule: RuleObject, value: string) {
  if (isEmpty(value)) return Promise.reject('必填项')
  if (notPhoneNumber(value)) {
    return Promise.reject('格式错误')
  }
  return Promise.resolve()
}

export function noSpecialInput(rule: RuleObject, value: string) {
  if (specialReg.test(value)) {
    return Promise.reject('不能含有特殊字符( \' " < > = )')
  }
  return Promise.resolve()
}

export function noChineseValidator(rule: RuleObject, value: any) {
  if (isEmpty(value)) return Promise.reject('必填项')
  if (hasSpecial(value)) {
    return Promise.reject('不能含有特殊字符( \' " < > = )')
  }
  if (hasChinese(value)) {
    return Promise.reject('不能含有中文')
  }
  return Promise.resolve()
}

export function onlyNCValidator(rule: RuleObject, value: any) {
  if (isEmpty(value)) return Promise.reject('必填项')
  if (!hasNC(value)) {
    return Promise.reject('只能输入数字和英文字母')
  }
  return Promise.resolve()
}

export function passwordValidator(rule: RuleObject, value: any) {
  console.log(value)
  if (isEmpty(value)) return Promise.reject('必填项')
  if (hasSpace(value)) {
    return Promise.reject('不能含有空格')
  }
  if (hasSpecial(value)) {
    return Promise.reject('不能含有特殊字符( \' " < > = )')
  }
  return Promise.resolve()
}

export function ipValidator(rule: RuleObject, value: any) {
  if (isEmpty(value)) return Promise.reject('必填项')
  if (!ipReg.test(value)) {
    return Promise.reject('格式错误')
  }
  return Promise.resolve()
}