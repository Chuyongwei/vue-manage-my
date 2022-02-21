/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
// TODO：修改用户的规则，貌似应该删除了该验证
export function validUsername(str) {
  const valid_map = ['admin', 'editor'] // NOTE: 用户 TODO
  return valid_map.indexOf(str.trim()) >= 0 // trim删除空白字符 indexof的返回第一个索引
}
