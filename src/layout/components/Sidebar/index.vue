<template>
  <div :class="{'has-logo':showLogo}">
    <!-- 侧边栏logo -->
    <logo v-if="showLogo" :collapse="isCollapse" />
    <!-- el-scrollbar 菜单栏滚动条，菜单项过多就会展示 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!--
        el-menu  菜单组件
          - default-active 默认激活菜单
          - collapse 是否水平折叠收起菜单
          - unique-opened 是否只保存一个子菜单打开
          - active-text-color 激活的文本颜色
          - collapse-transition 折叠动画
          - mode 菜单类型：水平类型，垂直类型
       -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!-- :item 表示传递的是每一项路由规则  :base-path 表示的是每一个规则的路径  使用父传子传参 -->
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    routes() {
      return this.$router.options.routes // 这是在获取路由规则，获取到的是一个数组
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
