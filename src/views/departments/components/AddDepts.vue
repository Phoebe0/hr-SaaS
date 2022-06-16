<template>
  <el-dialog
    :title="title"
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
    <el-form
      ref="formRef"

      :model="form"
      label-width="100px"
      :rules="formRules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="form.manager" style="width: 100%" placeholder="请选择该部门的负责人">
          <!-- label是提供给用户展示的字段 value是选中关联的值 -->
          <el-option
            v-for="item in simpleList"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="form.introduce" type="textarea" />
      </el-form-item>

      <el-form-item>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { reqGetSimpleList } from '@/api/employees'
import { reqAddDept, reqGetDeptInfoById, reqUpdateDeptInfo } from '@/api/department'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 原始部门列表数据
    sourceDepts: {
      type: Array,
      required: true
    },
    id: {
      // 添加部门的id当作pid 参数实现增加业务
      type: String,
      required: true
    }
  },
  data() {
    // value是输入框输入的值 ，callback是一个放行函数 ，callback()表示校验通过 ，callback(new Error('提示信息'))
    // 名称校验规则
    const checkNameRepeat = (rule, value, callback) => {
      console.log(value)
      console.log(this.sourceDepts)
      // 如果是处于编辑状态 并且校验的名称是当前编辑部门的名称 就放行
      if (this.form.id && this.editDept.name === value) return callback()
      // 判断value和所有的部门名称不重复
      const boo = this.sourceDepts.some(item => item.name === value.trim())
      console.log(boo)
      boo ? callback(new Error(`${value}已存在！`)) : callback()
    }
    // 编码校验规则
    const checkCodeRepeat = (rule, value, callback) => {
      console.log(value)
      console.log(this.sourceDepts)
      // 如果是处于编辑状态 并且校验的编码是当前编辑部门的编码 就放行
      if (this.form.id && this.editDept.code === value) return callback()
      // 判断value和所有的部门名称不重复
      const boo = this.sourceDepts.some(item => item.code === value.trim())
      console.log(boo)
      boo ? callback(new Error(`${value}已存在！`)) : callback()
    }
    return {

      // 表单关联对象
      form: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        manager: '', // 部门负责人
        name: '', // 部门名称
        pid: '' // 父部门 id
      },
      // 表单校验规则
      formRules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: ['change', 'blur'] },
          { min: 2, max: 10, message: '部门名称要求2-10个字符', trigger: ['change', 'blur'] },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: ['change', 'blur'] },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请选择部门负责人', trigger: ['change', 'blur'] }
        ],
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: ['change', 'blur'] }
        ]
      },
      simpleList: [], // 部门负责人列表
      title: '添加部门',
      loading: true,
      editDept: {}
    }
  },

  created() {
    this.getSimpleList()
  },
  methods: {
    closeDialog() {
      // 重置表单
      this.$refs.formRef.resetFields()
      // 通知父组件关闭对话框
      this.$emit('closeDialog')
      // 清除表单的id
      this.form.id = ''
    },

    // 获取部门负责人列表
    async getSimpleList() {
      const { data } = await reqGetSimpleList()
      console.log(data)
      this.simpleList = data.data
    },

      // 点击确定提交
    handleSubmit() {
      // 1. 预校验  给form表单加ref属性
      this.$refs.formRef.validate(async boo => {
        // console.log(boo)
        if (boo) {
          console.log(this.form.id)
        //  // 2. 发送请求
        // 判断是新增还是 编辑状态再去发送请求
        if (this.form.id) {
            // 编辑提交
            await reqUpdateDeptInfo(this.form)
            // 因为先编辑再新增，会重置表单，但是id字段是不会被重置，所以需要手动清除id
            this.form.id = ''
        } else {
          // 新增
          await reqAddDept({ ...this.form, pid: this.id }) // 将form中的pid重写
        }
          // 3. 通知父组件关闭对话框  并重新获取部门列表
         this.$refs.formRef.resetFields()
         this.$emit('reload')
        }
      })
      // this.form.reset()
    },

    // 做数据回显
    async showDeptInfo(id) {
      // // 发送请求前开启loading
      // this.loading = true
      // 根据id查询部门详情
     const { data } = await reqGetDeptInfoById(id)
    //  console.log(data)
     this.form = data.data
    //  这里重新定义一个对象 ，并将部门信息赋值给它，用于比较
     this.editDept = { ...data.data } // 不能直接赋值，因为复杂数据类型赋值的是地址，会和上面form的地址相同，
    //  // 请求结束后关闭loading
    //   this.loading = false
    }
  }
}
</script>

<style>

</style>
