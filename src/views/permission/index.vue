<template>
  <div class="permission-container">
    <div class="app-container">
      <el-card>
        <el-row type="flex" justify="end" style="margin-bottom: 20px">
          <el-button size="mini" type="primary" style="float: right">添加权限</el-button>
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
              <el-button v-if="row.type === 1" size="small" type="success">添加权限</el-button>
              <el-button size="small" type="warning">查看权限</el-button>
              <el-button size="small" type="danger">删除权限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script>
import { reqGetPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: 'Permission',
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const { data: { data }} = await reqGetPermissionList()
      this.tableData = tranListToTreeData(data, '0')
    }
   }
}
</script>

<style>

</style>
