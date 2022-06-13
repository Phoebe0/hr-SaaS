<template>
  <el-row :gutter="20" style="width: 100%">
    <el-col :span="16">{{ data.name }}</el-col>
    <el-col :span="8">
      <el-row>
        <el-col :span="12">负责人</el-col>
        <el-col :span="12">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <!-- 父传子传递过来一个isRoot  判断 isRoot是否为true 如果是true则显示 -->
              <el-dropdown-item v-if="isRoot" command="edit">查看部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { reqDelDept } from '@/api/department'

export default {
 props: {
  data: {
    type: Object,
    required: true
  },
  isRoot: {
    type: Boolean,
    default: true
  }
 },
 methods: {
  handleCommand(command) {
    // 添加
        if (command === 'add') {
          console.log('添加')
        }
        // 查看编辑
        if (command === 'edit') {
          console.log('编辑')
        }
        // 删除
        if (command === 'del') {
          // 1. 确认删除提示
           this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
          type: 'warning'
        }).then(async() => {
          // 2. 发送删除部门的请求
          await reqDelDept(this.data.id)
          // 3. 重新渲染一次部门列表（通知父组件 子传父）
          this.$emit('reload')
          // 4. 提示通过响应拦截器做了
          // this.$message.success('删除成功!')
        }).catch(() => {
          this.$message.info('已取消删除')
        })
        }
      }
 }
}
</script>

