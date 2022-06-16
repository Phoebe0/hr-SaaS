// 角色相关的接口模块

import request from '@/utils/request'
// 获取所有角色列表
export const reqGetRolesList = (page, pagesize) => request({
  method: 'get',
  url: '/sys/role',
  params: {
    page,
    pagesize
  }
})

// 根据id删除角色
export const reqDelRole = id => request.delete(`/sys/role/${id}`, id)

// 添加角色
export const reqAddRole = data => request.post('/sys/role', data)

// 修改角色
export const reqUpdateRole = data => request.put(`/sys/role/${data.id}`, data)

// 根据id获取角色详情
export const reqGetRoleDetail = id => request.get(`/sys/role/${id}`)
