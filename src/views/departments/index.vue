<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card>
        <!-- 标题 -->
        <!-- el-row被分成24份 -->
        <TreeTools
          :data="companyInfo"
          :is-root="false"
          style="border-bottom: 1px solid #999"
          @showDialog="showDialog"
        />

        <!-- 部门列表 -->
        <el-tree :data="list" :props="defaultProps" default-expand-all>
          <!-- data是组件内部作用域插槽携带的数据，表示的是每一行的数据 -->
          <template #default="{data}">
            <TreeTools
              :data="data"
              @reload="getDepts"
              @showDialog="showDialog"
              @showEditDialog="showEditDialog"
            />
          </template>
        </el-tree>

        <!-- 对话框组件 -->
        <AddDepts
          :id="id"
          ref="addDeptRef"
          :dialog-visible="dialogVisible"
          :source-depts="sourceDepts"
          @closeDialog="dialogVisible=false"
          @reload="reload"
        />
      </el-card>

    </div>
  </div>
</template>

<script>
import TreeTools from './components/TreeTools.vue'
import AddDepts from './components/AddDepts.vue'
import { reqGetDepartments } from '@/api/department'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: 'Departments',
  components: {
    TreeTools,
    AddDepts
  },
  data() {
    return {
     list: [],
      defaultProps: {
          children: 'children',
          label: 'name'
        },
        dialogVisible: false, // 控制对话框显示与隐藏
        sourceDepts: [], // 原始的部门列表数据
        id: '', // 点击添加存储部门的id
        companyInfo: { name: 'XXX公司', manager: '负责人', id: '' }
    }
  },
  created() {
    this.getDepts()
  },
  methods: {
    // 获取部门列表的方法
    async getDepts() {
      const { data } = await reqGetDepartments()
      // console.log(data)
      this.list = tranListToTreeData(data.data.depts, '')
      this.sourceDepts = data.data.depts // 存储一份原始的部门列表数据
    },
    // 点击添加展示对话框并接受传递部门的id
    showDialog(id) {
      this.$refs.addDeptRef.title = '添加部门'
      this.dialogVisible = true
      this.id = id
    },
    // 确定提交完成，子组件通知父组件关闭对话框并重新获取部门列表
    reload() {
      this.dialogVisible = false
      this.getDepts()
    },
    // 点击编辑显示对话框
    showEditDialog(data) {
      this.$refs.addDeptRef.title = '编辑部门'
      this.$refs.addDeptRef.showDeptInfo(data.id) // 将点击的部门信息给到子组件 让子组件拿着这个id去获取部门信息
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
  // 直接覆盖树形样式即可
::v-deep .el-tree {

    // 小三角的样式, 去掉默认的小三角的旋转效果
    .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    // 有子节点 且未展开
    .el-icon-caret-right:before {
      background: url("~@/assets/common/add.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    // 有子节点 且已展开
    .el-tree-node__expand-icon.expanded.el-icon-caret-right:before{
      background: url("~@/assets/common/sub.png") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    // 没有子节点
    .el-tree-node__expand-icon.is-leaf::before  {
      background: url("~@/assets/common/bumen.gif") no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }

    // 深度选择器
    // 作用某些类名 ， 但是样式做用不上，原因是类名压根不在组件中
    // 这时候就要使用深度选择器来讲这个样式穿透到组件内部
    // scss ::v-deep
    // less /deep/
    // css >>>

    ::v-deep .el-tree-node__content {
      margin-top: 10px !important;
    }

}
</style>
