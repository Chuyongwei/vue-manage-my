import Cookies from 'js-cookie'

// HACK 修改cookie名
const TokenKey = 'vue_admin_template_token'

// INFO Cookie设置
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
