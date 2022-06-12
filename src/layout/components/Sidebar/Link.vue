<template>
  <!-- 这个组件最终会根据传递的to属性渲染出a标签 或者 router-link标签 -->
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: { // to路由的路径
      type: String,
      required: true
    }
  },
  computed: {
    isExternal() {
      // 如果to接收到的是/xxx 这样的路径，结果是false, 如果传递的是https：结果是true
      return isExternal(this.to)
    },
    type() {
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    linkProps(to) {
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script>
