import request from '@/utils/request'

// 获取部门信息
export function reqGetDepartments() {
  return request.get('/company/department')
}

// 删除部门 id是删除部门的id
export function reqDelDept(id) {
  return request.delete(`/company/department/${id}`)
}
