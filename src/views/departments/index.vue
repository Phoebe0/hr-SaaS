<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card>
        <!-- 标题 -->
        <!-- el-row被分成24份 -->
        <TreeTools
          :data="{name: 'XXXX股份有限公司'}"
          :is-root="false"
          style="border-bottom: 1px solid #999"
          @showDialog="dialogVisible=true"
        />

        <!-- 部门列表 -->
        <el-tree :data="list" :props="defaultProps" default-expand-all>
          <!-- data是组件内部作用域插槽携带的数据，表示的是每一行的数据 -->
          <template #default="{data}">
            <TreeTools :data="data" @reload="getDepts" @showDialog="dialogVisible=true" />
          </template>
        </el-tree>

        <!-- 对话框组件 -->
        <AddDepts :dialog-visible="dialogVisible" @closeDialog="dialogVisible=false" />
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
        dialogVisible: false // 控制对话框显示与隐藏
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

}
</style>
