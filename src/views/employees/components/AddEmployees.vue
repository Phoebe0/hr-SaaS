<template>
  <el-dialog
    title="新增员工"
    :visible="dialogVisible"
    center
    @close="closeDialog"
    @click.native="isShow=false"
  >
    <!-- 注意这里"isShow=false"，当点击子元素input时，会冒泡到父元素从而导致关闭树形列表，所以要禁止事件冒泡 -->
    <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <!--
          禁止输入的解决方案：
          1. disabled
          2. readonly
          3. maxlength=0
          4. :value

         -->
        <el-input
          :value="formData.departmentName"
          style="width:50%"
          placeholder="请选择部门"
          @click.native.stop="showDepts"
        />
        <!-- 树形结构 -->
        <div v-if="isShow" class="tree_box">
          <!--
          node-click	节点被点击时的回调	共三个参数，依次为：传递给 data 属性的数组中该节点所对
          应的对象、节点对应的 Node、节点组件本身。
           -->
          <el-tree
            :data="treeData"
            :props="{label: 'name'}"
            @node-click="handleClick"
          />
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="addEmployee">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import employeesMenu from '@/api/constant/employees'
import { reqGetDepartments } from '@/api/department'
import { tranListToTreeData } from '@/utils/index'
import { reqAddEmployee } from '@/api/employees'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
  return {
    // 表单关联的数据
    formData: {
      username: '', // 用户名
      mobile: '', // 手机号
      formOfEmployment: '', // 聘用形式
      workNumber: '', // 工号
      departmentName: '', // 部门
      timeOfEntry: '', // 入职时间
      correctionTime: '' // 转正时间
    },
    // 表单校验规则
    rules: {
      username: [
        { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
        { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
      ],
      mobile: [
        { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
      ],
      formOfEmployment: [
        { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
      ],
      workNumber: [
        { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
      ],
      departmentName: [
        { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
      ],
      timeOfEntry: [
        { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
      ]
    },
    hireType: employeesMenu.hireType, // 聘用形式数据
    treeData: [], // 部门列表树形展示
    isShow: false
  }
},
  methods: {
    // 通知父组件关闭对话框
    closeDialog() {
      this.$emit('update:dialogVisible', false)
      this.$refs.addForm.resetFields() // 表单内容重置
    },
    // 展示部门树形列表
    async showDepts() {
      this.isShow = !this.isShow // 点击一次显示，再点击一次隐藏
      if (!this.treeData.length) {
        // 优化：请求只发送一次
        const { data: { data: { depts }}} = await reqGetDepartments()
        this.treeData = tranListToTreeData(depts, '')
      }
    },
    // 树形节点 ，点击触发的方法
    handleClick(data) {
      // data是点击的树形节点的数据对象
      // 将点击的树形节点name赋值给formData.departmentName
      // 禁止有子部门的部门被选中哦
      if (!data.children.length) {
        this.formData.departmentName = data.name
        // 选择完毕后关闭部门列表
        this.isShow = false
      }
    },
    // 新增员工
    addEmployee() {
      // 1. 预校验
      this.$refs.addForm.validate(async boo => {
        if (boo) {
          // 2. 发送新增请求
          await reqAddEmployee(this.formData)
          // 3. 关闭对话框
          this.closeDialog()
          // 4. 通知父组件重新获取员工列表
          this.$emit('reload')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree_box {
  position: absolute;
  top: 40px;
  left: 0;
  border: 1px solid #ccc;
  width: 50%;
  z-index: 1;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 5px #06C;
}
</style>
