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

// 新增员工
export const reqAddEmployee = data => request.post('/sys/user', data)

// 删除员工
export const reqDelEmployee = (id) => request({
    method: 'delete',
    url: `/sys/user/${id}`
  })

// 批量导入员工  data [{}]
export const reqImportEmployees = data => request({
  method: 'post',
  url: '/sys/user/batch',
  data
})

/** *
 *  读取用户详情的基础信息 (个人详情-下面的接口)
 * **/
 export function reqGetPersonalDetail(id) {
  return request({
    method: 'get',
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息 (个人详情-下面的接口)
 * **/
export function reqUpdatePersonal(data) {
  return request({
    method: 'put',
    url: `/employees/${data.userId}/personalInfo`,
    data
  })
}

/** **
 * 获取用户的岗位信息  (岗位信息)
 * ****/
export function reqGetJobDetail(id) {
  return request({
    method: 'get',
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息  (岗位信息)
 * ****/
export function reqUpdateJob(data) {
  return request({
    method: 'put',
    url: `/employees/${data.userId}/jobs`,
    data
  })
}
