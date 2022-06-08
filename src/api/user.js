// 不推荐在.vue文件中书写关于请求相关的代码，如果有一天地址调整，维护会很麻烦
// 将发送请求的代码放到一个单独的文件夹  api   中，这样可以避免这种情况

// 用户相关的接口模块
import request from '@/utils/request'

export function reqLogin(data) {
  // axios 中能.then  说明axios请求是一个promise
  return request.post('/sys/login', data)
}

