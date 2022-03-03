import request from '@/utils/request'

// TAG 提交登录信息（后端接口）
export function login(data) {
  console.log("sadf",data);
  return request({
    url: '/doctor/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  console.log("api info",token);
  return request({
    url: '/doctor/info',
    method: 'post',
    params: { doctorid:token-0 }
  })
}

export function logout() {
  return request({
    url: '/doctor/logout',
    method: 'post'
  })
}
