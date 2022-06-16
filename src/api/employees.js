// 员工相关的接口
import request from '@/utils/request'

// 获取员工简单信息列表
export const reqGetSimpleList = () => {
  return request.get('/sys/user/simple')
}

// 获取员工列表
export const reqGetEmployeesList = (page, size) => request.get('/sys/user', {
  params: { page, size }
})
