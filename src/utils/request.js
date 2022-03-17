import axios from 'axios'
// axios.defaults.baseURL = 'http://192.168.137.241:8080/admin'
axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? '/api' : '/track-patient/api'
// axios.defaults.baseURL = '/api'

axios.defaults.withCredentials = true
// axios.defaults.headers['Content-Type']='application/json'
const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // easy-mock服务挂了，暂时不使用了
  // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
  timeout: 5000
})

service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    console.log(error)
    return Promise.reject()
  }
)

service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data
    } else {
      Promise.reject()
    }
  },
  error => {
    console.log(error)
    return Promise.reject()
  }
)

export default service
