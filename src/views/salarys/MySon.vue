<template>
  <div style="border: 1px solid #333; padding: 10px">
    我是子组件 ---- {{ value }}
    <button @click="changeStr">改数据</button>
    <hr>
    {{ num }} <button @click="changeNum">改num</button>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: String,
      default: ''
    },
    num: {
      type: Number,
      default: 0
    }
  },
  methods: {
    changeStr() {
      // 子传父
      this.$emit('update:msg', '嘿嘿')
    },
    changeNum() {
      this.$emit('update:num', 99)
    }
  }

}
</script>

<style>

</style>
