<template>
  <el-dialog
    title="分配角色"
    :visible="showRoleVisible"
    @close="closeDialog"
    @open="open"
  >
    <el-checkbox-group v-model="checkList" v-loading="loading">
      <el-checkbox
        v-for="item in rolesList"
        :key="item.id"
        :label="item.id"
      >
        {{ item.name }}
      </el-checkbox>

    </el-checkbox-group>
    <!-- 所有的角色列表 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="assignRole">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { reqGetRolesList } from '@/api/settings'
import { reqGetUserDetailById } from '@/api/user'
import { reqAssignRole } from '@/api/employees'
export default {
  props: {
    showRoleVisible: {
      type: Boolean,
      default: false
    },
    assignId: {
      type: String,
      required: true

    }
  },
  data() {
    return {
      rolesList: [], // 所有的角色列表
      checkList: [], // 选中项checkbox的label值会收集到这个数组中
      loading: false
    }
  },
  created() {
    // this.getAllRolesList()
  },
  methods: {
    closeDialog() {
      // 通知父组件关闭对话框
      this.$emit('update:showRoleVisible', false)
      this.checkList = []
    },
    // 获取所有角色列表
    async getAllRolesList() {
      const { data: { data: { rows }}} = await reqGetRolesList(1, 9999)
      this.rolesList = rows
    },
    // 监听对话框的打开
    async open() {
      // // 获取所有角色列表
      // this.getAllRolesList()
      // // 获取点击员工的个人信息
      // this.getUserDetail()
      this.loading = true
      // 在最短时间内获取到多个并发请求
      Promise.all([this.getAllRolesList(), this.getUserDetail()]).then(() => {
        this.loading = false
      })
    },
    // 获取点击员工的个人信息 个人信息中使用一个roleIds的数组，将这个数组直接赋值给checklist
    async getUserDetail() {
      const { data: { data: { roleIds }}} = await reqGetUserDetailById(this.assignId)
      this.checkList = roleIds
    },
    // 为员工分配角色
    async assignRole() {
      await reqAssignRole(this.assignId, this.checkList)
      this.closeDialog()
    }
  }
}
</script>

<style>

</style>
