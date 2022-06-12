<template>
  <!-- v-if判断是否在左侧展示左侧导航 如果hidden: true 则 直接不创建结构 -->
  <div v-if="!item.hidden">
    <!--
      这个结构展示的条件：
      1. 筛选的子路由只有一项满足
      2. 筛选的子路由没有一项满足
     -->
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <!-- el-menu-item是菜单项 -->
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <!-- item组件是渲染图标和文本的 -->
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <!-- 以下是带二级导航的代码 -->
    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  // 子组件接收到的值
  props: {
    // 每一项路由
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    // 每一项路由规则的path值
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    // children表示的是路由规则的子路由（数组） ， parents表示的是每一个路由规则对象item
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        // item是子路由规则的每一项
        if (item.hidden) {
          // 如果children的每一项加了hidden，则不收集
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item // 如果children的每一项没加hidden，赋值到onlyOneChild 收集
          return true
        }
      })
      console.log(showingChildren)
      console.log(showingChildren.length)

      // 如果筛选出来的数组长度为1，就把子路由当作一级菜单展示
      if (showingChildren.length === 1) {
        return true
      }

      // 如果筛选出来的数组长度为0（即全是hidden），就把父路由当作一级菜单展示
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }
      // 筛选后数组长度不是0也不是1。展示下面的结构
      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
