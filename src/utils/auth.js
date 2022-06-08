import Cookies from 'js-cookie'

const TokenKey = 'hr-saas-token'

// 获取token的方法
export function getToken() {
  return Cookies.get(TokenKey)
}
// 存储token的方法
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// 删除token的方法
export function removeToken() {
  return Cookies.remove(TokenKey)
}
