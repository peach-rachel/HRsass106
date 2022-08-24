import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
const TimeOut = 3600 // 设置超时时间
// create an axios instance
const service = axios.create({
  // 如果执行 npm run dev  值为 /api 正确  /api 这个代理只是给开发环境配置的代理
  // 如果执行 npm run build 值为 /prod-api  没关系  运维应该在上线的时候 给你配置上 /prod-api的代理
  baseURL: process.env.VUE_APP_BASE_API,
  // 设置axios请求的基础的基础地址
  timeout: 5000 // 定义5秒超时
})
// // request interceptor
service.interceptors.request.use(async config => {
  // 有token
  if (store.getters.token) {
    // 判断token的时间戳是否超时
    if (IsCheckTimeOut()) {
      await store.dispatch('user/logout') // 退出登录
      router.push('/login') // 跳转登录页
      return Promise.reject(new Error('token超时了ya'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use(response => {
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 1002) {
    store.dispatch('modules/user') // 退出登录
    router.push('/login') // 跳转登录页
  } else {
    Message.error(error.message)
  }
  return Promise.reject(error)
})
// token 超时逻辑
function IsCheckTimeOut() {
  var currentTime = Date.now()
  var timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service
