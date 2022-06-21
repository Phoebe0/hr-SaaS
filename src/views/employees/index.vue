<template>
  <div class="employees-container">
    <div class="app-container">
      <PageTools>
        <template #left> 总记录数： {{ total }}</template>
        <template #right>
          <el-button
            size="mini"
            type="success"
            @click="$router.push('/import?name=employees')"
          >excel导入</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleDownload"
          >excel导出</el-button>
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
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
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
  },
  // 导出员工excel表
    async handleDownload() {
      const { data: { data: { rows }}} = await reqGetEmployeesList(1, this.total)
      // const headersArr = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const mapRules = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const data = this.formatToArr(rows, mapRules)
      // 1. 先拿到所有员工列表

      // 我们需要的是二维数组,所以需要对rows进行处理
      // 1. 将数组处理成二维数组
      // 2. 将不需要的字段剔除
      console.log(data) // 所有员工列表

      // 在点击了导出按钮后import 再去加载对应的js模块
      import('@/vendor/Export2Excel').then(excel => {
        // excel是1个对象
        excel.export_json_to_excel({
          header: Object.keys(mapRules),
          data, // 二维数组
          filename: '员工信息表', // 导出的excel文件名称
          autoWidth: true, // 自适应宽度
          bookType: 'xlsx', // 导出的excel文件扩展名
          multiHeader,
          merges

        })
      })
    },

    // 返回二维数组
    formatToArr(rows, mapRules) {
    return rows.map(item => {
      // item是每一个员工对象
      return Object.keys(mapRules).map(value => {
        // value是标题数组的每一项(字符串)
        // console.log(value) // 中文的键名
        const englishKey = mapRules[value] // 英文的键名
        // 处理日期相关的bug
        if (['correctionTime', 'timeOfEntry'].includes(englishKey)) {
          return formatDate(item[englishKey])
        } else if (englishKey === 'formOfEmployment') {
          const o = employeesMenu.hireType.find(elem => elem.id === +item[englishKey])
          return o ? o.value : '暂无'
        } else {
         return item[englishKey] // 将取到的值,追加到数组中
        }
      })
     })
    }
  }
}
</script>

<style>

</style>
