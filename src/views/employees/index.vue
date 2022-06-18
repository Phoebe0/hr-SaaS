<template>
  <div class="employees-container">
    <div class="app-container">
      <PageTools>
        <template #left> 总记录数： {{ total }}</template>
        <template #right>
          <el-button size="mini" type="success">excel导入</el-button>
          <el-button size="mini" type="primary">excel导出</el-button>
          <el-button size="mini" type="warning" @click="dialogVisible = true">新增员工</el-button>
        </template>
      </PageTools>

      <el-card style="margin-top: 20px">
        <!-- 表格 -->
        <el-table
          :data="tableData"
          style="width: 100%"
          stripe
          border
        >
          <el-table-column label="序号" type="index" :index="indexMethod" sortable="" />
          <el-table-column label="姓名" prop="username" sortable="" />
          <el-table-column label="头像" prop="staffPhoto" sortable="" />
          <el-table-column label="手机号" prop="mobile" sortable="" />
          <el-table-column label="工号" prop="workNumber" sortable="" />
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            :formatter="formatterMethod"
            sortable=""
          />
          <el-table-column label="部门" prop="departmentName" sortable="" />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable="">
            <template #default="{row}">
              {{ formatDate(row.timeOfEntry) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template #default="{row}">
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <el-pagination
          :current-page="page"
          background
          :page-sizes="[2, 4, 6, 8]"
          :page-size="size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />

        <!-- 对话框 -->
        <AddEmployees
          :dialog-visible.sync="dialogVisible"
          @reload="getEmployeesList"
        />

      </el-card>
    </div>
  </div>
</template>

<script>
import { reqDelEmployee, reqGetEmployeesList } from '@/api/employees'
import employeesMenu from '@/api/constant/employees'
import AddEmployees from './components/AddEmployees.vue'
import { formatDate } from '@/utils/index'
export default {
  name: 'Employees',
  components: {
    AddEmployees
  },
  data() {
    return {
      tableData: [],
      total: 0,
      page: 1,
      size: 2,
      dialogVisible: false
    }
  },
  created() {
    this.getEmployeesList()
  },
  methods: {
    // 获取员工列表
    async getEmployeesList() {
      const { data: { data: { rows, total }}} = await reqGetEmployeesList(this.page, this.size)
      this.total = total
      this.tableData = rows
    },
    // 每页条数发生变化
    handleSizeChange(value) {
      this.size = value
      this.getEmployeesList()
    },
    // 当前页数
    handleCurrentChange(value) {
      this.page = value
      this.getEmployeesList()
    },
    // 员工序号
    indexMethod(index) {
       return index + (this.page - 1) * this.size + 1
    },
    // 聘用形式列 格式化列的内容
    /*
      1. row 当前行的内容
      2. column 当前列的内容
      3. cellValue 当前列的单元格的值
      4. index 索引
    */
   formatterMethod(row, column, cellValue, index) {
    const o = employeesMenu.hireType.find(item => item.id === +cellValue)
    return o ? o.value : '查询暂无'
   },
  //  日期格式化
  formatDate(time) {
    return formatDate(time) // 直接调用工具函数
  },
  // 删除员工
  delEmployee(id) {
    this.$confirm('确定删除该员工?', '提示', {
          type: 'warning'
        }).then(async() => {
          await reqDelEmployee(id)
          if (this.tableData.length === 1 && this.page > 1) {
            this.page--
            // this.getEmployeesList()
          }
          this.getEmployeesList()
        }).catch(() => {
          this.$message.info('已取消')
        })
  }
  }
}
</script>

<style>

</style>
