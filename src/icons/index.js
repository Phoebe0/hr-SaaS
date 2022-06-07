import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// 注册全局组件 ， 后期如果想要展示小图标，就可以使用这个组件
Vue.component('svg-icon', SvgIcon)

// webpack语法，批量导入svg文件夹下所有的图标并和组件绑定
// require.context(读取文件的路径，是否遍历子目录，匹配文件的正则)
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
