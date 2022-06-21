// 不推荐在.vue文件中书写关于请求相关的代码，如果有一天地址调整，维护会很麻烦
// 将发送请求的代码放到一个单独的文件夹  api   中，这样可以避免这种情况

// 用户相关的接口模块
import request from '@/utils/request'
// import store from '@/store'

// 登录接口
export function reqLogin(data) {
  // axios 中能.then  说明axios请求是一个promise
  return request.post('/sys/login', data)
}

// 获取用户信息接口
export function reqGetUserInfo() {
  return request({
    method: 'post',
    url: 'sys/profile'
    // headers在以后的请求中会经常用到，所以可以把它挂载到请求拦截器中
    // headers: {
    //   Authorization: 'Bearer ' + store.getters.token
    // }
  })
}

// 获取用户基本信息
export function reqGetUserDetailById(id) {
  return request({
    method: 'get',
    url: `/sys/user/${id}`
  })
}

// 保存员工基本信息
export const reqSaveUserDetailById = data => request({
  method: 'put',
  url: `/sys/user/${data.id}`,
  data
})
