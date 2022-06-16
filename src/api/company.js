// 企业有关的接口模块

import request from '@/utils/request'

// 根据id查询企业信息
export const reqGetCompanyInfo = id => request({
  method: 'get',
  url: `/company/${id}`
})
