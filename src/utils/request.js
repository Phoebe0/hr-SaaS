import axios from 'axios' // 创建一个axios的实例
// 创建axios实例配置基地址
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url+ request url
  timeout: 5000 // request timeout
})
export default service // 导出axios实例
