<template>
  <div class="employees-container">
    <div class="app-container">
      <PageTools>
        <template #left> 总记录数： {{ total }}</template>
        <template #right>
          <el-button size="mini" type="success">excel导入</el-button>
          <el-button size="mini" type="primary">excel导出</el-button>
          <el-button size="mini" type="warning">新增员工</el-button>
        </template>
      </PageTools>

      <el-card style="margin-top: 20px">
        <el-table
          :data="tableData"
          style="width: 100%"
          stripe
          border
        >
          <el-table-column label="序号" type="index" sortable="" />
          <el-table-column label="姓名" prop="username" sortable="" />
          <el-table-column label="头像" prop="staffPhoto" sortable="" />
          <el-table-column label="手机号" prop="mobile" sortable="" />
          <el-table-column label="工号" prop="workNumber" sortable="" />
          <el-table-column label="聘用形式" prop="formOfEmployment" sortable="" />
          <el-table-column label="部门" prop="departmentName" sortable="" />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable="" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template #default>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { reqGetEmployeesList } from '@/api/employees'
export default {
  name: 'Employees',
  data() {
    return {
      tableData: [],
      total: 0,
      page: 1,
      size: 2
    }
  },
  created() {
    this.getEmployeesList()
  },
  methods: {
    async getEmployeesList() {
      const { data: { data: { rows, total }}} = await reqGetEmployeesList(this.page, this.size)
      this.total = total
      this.tableData = rows
    }
  }
}
</script>

<style>

</style>
