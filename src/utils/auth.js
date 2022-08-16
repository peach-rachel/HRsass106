import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token' // 任意 设定一个独一无二的key
const TimeStamp = 'hrsaas-timestamo-key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTimeStamp() {
  return Cookies.get(TimeStamp)
}

export function setTimeStamp() {
  return Cookies.set(TimeStamp, Date.now())
}
