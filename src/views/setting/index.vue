<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card>

        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="角色管理" name="role">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-s-custom"
              @click="ShowAdd"
            >新增角色</el-button>
            <!-- 表格 -->
            <!-- label 控制每一列的标题，prop 要渲染的字段 -->
            <el-table
              :data="tableData"
              border
              style="width: 100%; margin: 20px auto"
              stripe
            >
              <el-table-column
                type="index"
                label="序号"
                width="180"
                :index="indexMethod"
              />
              <el-table-column
                prop="name"
                label="角色名"
                width="180"
              />
              <el-table-column
                prop="description"
                label="描述"
              />
              <el-table-column
                prop="address"
                label="操作"
              >
                <template #default="{row}">
                  <!--
                  row是指当前行的数据 ：
                  例如：{ "id": "604e2b03488be61b90b68777", "name": "人事经理", "description": "负责整合人事部门" }
                  -->
                  {{ row.id }}
                  <el-button
                    size="mini"
                    type="text"
                    style="color:lightgreen"
                  >分配权限</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    style="color:orange"
                    @click="showEdit(row.id)"
                  >修改</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    style="color:red"
                    @click="deleteRow(row.id)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页 -->
            <!--
              :current-page 页码
              background 激活的页码带背景色
              :page-sizes 可选择每页条数的下拉框
              layout 容器 分页组件展示的可选项
              total 总条数
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
             -->
            <el-pagination
              :current-page="page"
              background
              :page-sizes="[1, 2, 3, 4]"
              :page-size="pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />

          </el-tab-pane>

          <el-tab-pane label="公司信息" name="company">
            <el-form label-width="80px">
              <el-form-item label="企业名称">
                <el-input :value="companyInfo.name" disabled />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input :value="companyInfo.companyAddress" disabled />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input :value="companyInfo.mailbox" disabled />
              </el-form-item>
              <el-form-item label="备注">
                <el-input :value="companyInfo.remarks" disabled />
              </el-form-item>
            </el-form>
          </el-tab-pane>

          <!-- 对话框 -->
          <el-dialog
            :title="title"
            :visible="showDialog"
            width="60%"
            center
            @close="closeAdd"
          >
            <el-form ref="roleForm" :model="form" :rules="rules" label-width="100px">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入角色名称" />
              </el-form-item>
              <el-form-item label="角色描述" prop="description">
                <el-input v-model="form.description" placeholder="请输入角色描述" />
              </el-form-item>
            </el-form>

            <template #footer>
              <el-button @click="closeAdd">取消</el-button>
              <el-button type="primary" @click="addRole">确认</el-button>
            </template>
          </el-dialog>

        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { reqAddRole, reqDelRole, reqGetRoleDetail, reqGetRolesList, reqUpdateRole } from '@/api/settings'
import { reqGetCompanyInfo } from '@/api/company'
export default {
  name: 'Setting',
  data() {
    return {
       activeName: 'role',
       tableData: [], // 表格数据
       total: 0, // 总条数
       page: 1, // 页码
       pagesize: 2, // 每条页数
       companyInfo: {},
       showDialog: false,
       form: {
        name: '',
        description: ''
      },
      title: '新增角色',
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: ['change', 'blur'] },
          { min: 2, max: 10, message: '角色名称要求2-10个字符', trigger: ['change', 'blur'] }
        ],

        description: [
          { required: true, message: '请输入角色描述', trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  created() {
    this.getRolesList()
    this.addRole()
  },
   methods: {
    // tabs组件点击的处理函数
      handleClick(tab, event) {
        // tab是当前激活的菜单，event是事件对象
        // 第一次进入 公司信息面板 时才发送请求
        if (tab.name === 'company' && !this.companyInfo.id) {
            this.getCompanyInfo()
        }
      },
      // 每条页数发生变化的处理函数
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`)
        // 将最新的每页条数赋值
        this.pagesize = val
        // 携最新的pagesize重新发请求
        this.getRolesList()
      },
      // 页码发生变化的处理函数
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`)
        // 将最新的当前页数赋值
        this.page = val
        // 携带最新的page重新发请求
        this.getRolesList()
      },
      // 自定义索引列
       indexMethod(index) {
        // 前一页的页码 * 每页条数 + 1
        return index + (this.page - 1) * this.pagesize + 1
      },
      // 获取所有角色列表
      async getRolesList() {
        const { data: { data: { total, rows }}} = await reqGetRolesList(this.page, this.pagesize)
        this.tableData = rows
        this.total = total
      },
      // 新增角色
      addRole() {
        // 预校验
        this.$refs.roleForm.validate(async boo => {
          if (boo) {
            if (this.form.id) {
              // 修改角色
              // 1. 发送请求
              await reqUpdateRole(this.form)
            } else {
              await reqAddRole(this.form)
            }
          // 关闭对话框
          this.closeAdd()
          // 重新渲染
          this.getRolesList()
          }
        })
      },
      // 修改角色
      async showEdit(id) {
        // 修改对话框名字
        this.title = '修改角色'
        const { data: { data }} = await reqGetRoleDetail(id)
        // 给form赋值
        this.form = data
        // 开启弹窗
        this.showDialog = true
      },
      ShowAdd() {
        // 开启弹框
        this.showDialog = true
      },
      closeAdd() {
        // 关闭弹框
        this.showDialog = false
        // 重置表单数据
        this.form = {
          name: '',
          description: ''
      }
        this.$refs.roleForm.resetFields()
      },
      // 删除角色
      deleteRow(id) {
        // 1. 消息提示
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          type: 'warning'
        }).then(async() => {
          // 2. 发送请求
          await reqDelRole(id)
          // 如果当前页面数组长度为1 并且不是第一页，则往前跳一页
          if (this.tableData.length === 1 && this.page > 1) {
            this.page--
          }
          // 3. 重新获取列表
          this.getRolesList()
        }).catch(() => {
          this.$message.info('已取消删除')
        })
      },
      // 获取企业信息
      async getCompanyInfo() {
        // console.log(this.$store)
        const { data } = await reqGetCompanyInfo(this.$store.state.user.userInfo.companyId)
        // console.log(data.data)
        this.companyInfo = data.data
      }
    }
}
</script>

<style>

</style>
