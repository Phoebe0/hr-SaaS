<template>
  <el-dialog
    title="添加部门信息"
    :visible="dialogVisible"
    width="50%"
    @close="closeDialog"
  >
    <!-- 表单主体 -->
    <!--
        表单校验：
        1. :model
        2. :rules
        3. item prop
        4. input v-model

     -->
    <el-form :model="form" label-width="100px">
      <el-form-item label="部门名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="部门编码">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="部门负责人">
        <el-select v-model="form.manager" style="width: 100%" placeholder="请选择该部门的负责人">
          <el-option label="大明" value="大明" />
          <el-option label="玲玲" value="玲玲" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍">
        <el-input v-model="form.introduce" />
      </el-form-item>

      <el-form-item>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表单关联对象
      form: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        manager: '', // 部门负责人
        name: '', // 部门名称
        pid: '' // 父部门 id
      }
    }
  },
  methods: {
    closeDialog() {
      // 通知父组件关闭对话框
      this.$emit('closeDialog')
    }
  }
}
</script>

<style>

</style>
