import axios from 'axios' // 创建一个axios的实例
import { Message } from 'element-ui'
// 创建axios实例配置基地址
const service = axios.create({
  // process.env是node环境内置的语法，可以获取我们是处于那种开发环境，项目启动根据运行环境自动执行
  baseURL: process.env.VUE_APP_BASE_API, // url = base url+ request url
  // baseURL: 'http://localhost:8080/api', // url = base url+ request url
  // baseURL: '/api', // 如果省略掉localhost:8080  浏览器会自动拼接
  timeout: 5000 // request timeout
})

// 添加请求拦截器
service.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  console.log('请求拦截')
  return config
}, function(error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use(function(response) {
  console.log(response)
  if (response.data.success) {
    Message.success(response.data.message)
  } else {
    Message.error(response.data.message)
    // 失败了，不能再跳转了
    // 抛出异常 阻止后续代码的执行
    return Promise.reject(response.data.message)
  }
  // response 是每次相应成功的对象，
  return response // 将响应的结果返回给客户端
}, function(error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default service // 导出axios实例
