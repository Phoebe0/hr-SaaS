import axios from 'axios' // 创建一个axios的实例
import { Message, Loading } from 'element-ui'
import store from '@/store'
import router from '@/router'

// 创建axios实例配置基地址
const service = axios.create({
  // process.env是node环境内置的语法，可以获取我们是处于那种开发环境，项目启动根据运行环境自动执行
  baseURL: process.env.VUE_APP_BASE_API, // url = base url+ request url
  // baseURL: 'http://localhost:8080/api', // url = base url+ request url
  // baseURL: '/api', // 如果省略掉localhost:8080  浏览器会自动拼接
  timeout: 5000 // request timeout
})

// 添加请求拦截器
let loading = null
service.interceptors.request.use(function(config) {
   loading = Loading.service({
    lock: true,
    text: '大大请稍等~',
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  // 在发送请求之前做些什么
  console.log('请求拦截')
  if (store.getters.token) {
    // config是请求的配置对象，config中的headers就是请求头，可以在请求拦截器中统一挂载token
    config.headers.Authorization = 'Bearer ' + store.getters.token
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use(function(response) {
  // console.log(response)
  if (response.data.success) {
    Message.success(response.data.message)
  } else {
    Message.error(response.data.message)
    // 失败了，不能再跳转了
    // 抛出异常 阻止后续代码的执行
    loading.close()
    return Promise.reject(response.data.message)
  }
  loading.close()
  // response 是每次相应成功的对象，
  return response // 将响应的结果返回给客户端
}, function(error) {
  loading.close()
  // 对响应错误做点什么
  if (error.response.status === 401 && error.response.data.code === 10002) {
    console.log('token过期')
    Message.warning('token过期了，请重新登录')
    // token过期后清理过期的token和个人信息
    store.dispatch('user/logout')
    // 重新登陆
    router.push('/login')
  }
  return Promise.reject(error)
})

export default service // 导出axios实例
