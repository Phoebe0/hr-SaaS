<template>
  <div class="permission-container">
    <div class="app-container">
      <el-card>
        <el-row type="flex" justify="end" style="margin-bottom: 20px">
          <el-button
            size="mini"
            type="primary"
            style="float: right"
            @click="showDialog(1, '0')"
          >添加权限</el-button>
        </el-row>
        <el-table
          :data="tableData"
          border
          stripe
          row-key="id"
        >
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{row}">

              <!-- 二级权限携带当前行的id -->
              <el-button
                v-if="row.type === 1"
                size="small"
                type="success"
                @click="showDialog(2, row.id)"
              >添加权限</el-button>
              <el-button size="small" type="warning" @click="showEdit(row.id)">查看权限</el-button>

              <el-button size="small" type="danger" @click="delRights(row.id)">删除权限</el-button>

            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 对话框 -->

      <el-dialog
        :title="title"
        :visible="dialogVisible"
        width="60%"
        @close="dialogVisible = false"
      >
        <!-- 表单内容 -->
        <el-form label-width="100px">
          <el-form-item label="权限名称">
            <el-input v-model="formData.name" />
          </el-form-item>
          <el-form-item label="权限标识">
            <el-input v-model="formData.code" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" />
          </el-form-item>
          <el-form-item label="权限启用">
            <el-switch
              v-model="formData.enVisible"
              active-text="启用"
              active-value="1"
              inactive-text="不启用"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>

        <template #footer>
          <div style="text-align: right;">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { reqAddPermission, reqGetPermissionDetail, reqGetPermissionList, reqUpdatePermission, reqDelPermission } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: 'Permission',
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      formData: {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      },
      title: '' // 标题

    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const { data: { data }} = await reqGetPermissionList()
      this.tableData = tranListToTreeData(data, '0')
    },
    // 控制对话框的显示与隐藏
    showDialog(type, pid) {
      this.dialogVisible = true
      this.formData.type = type // 将type字段赋值
      this.formData.pid = pid // 将pid字段赋值
      // 清空表单
    },
    // 点击编辑按钮展示对话框并回显
   async showEdit(id) {
      this.dialogVisible = true
      const { data: { data }} = await reqGetPermissionDetail(id)
      this.formData = data
    },
    // 点击确定按钮新增或者修改
    async handleSubmit() {
      // 1. 预校验 省略
      // 2. 发送请求添加数据
      if (this.formData.id) {
        // 有id 走编辑
        this.title = '编辑'
        reqUpdatePermission(this.formData)
      } else {
        // 无id 走新增
        this.title = '新增'
      await reqAddPermission(this.formData)
      }
      // 3. 关闭对话框
      this.dialogVisible = false
      // 4. 重新渲染
      this.getPermissionList()
      // 5. 表单清空
      this.formData = {
        enVisible: '0', // 开启
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型
        pid: '' // 添加到哪个节点下
      }
    },
    // 删除权限
    async delRights(id) {
       this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {

          type: 'warning'
        }).then(async() => {
          await reqDelPermission(id)
          this.getPermissionList()
        }).catch(() => {
          this.$message.info('已取消删除')
        })
    }
  }
}
</script>

<style>

</style>
