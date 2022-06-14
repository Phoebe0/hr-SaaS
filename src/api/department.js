import request from '@/utils/request'

// 获取部门信息
export function reqGetDepartments() {
  return request.get('/company/department')
}

// 删除部门 id是删除部门的id
export function reqDelDept(id) {
  return request.delete(`/company/department/${id}`)
}

// 新增部门 post发送请求携带参数
export const reqAddDept = data => request.post('/company/department', data)

// 根据id查询部门详情
export const reqGetDeptInfoById = id => request.get(`/company/department/${id}`)

// 根据id更新部门详情
export const reqUpdateDeptInfo = data => request.put(`/company/department/${data.id}`, data)
