<template>
  <div class="salarys-container">
    <div class="app-container">
      <h2>
        {{ msg }}
      </h2>
      <!-- :value 和 @input组合实现v-model -->
      <!-- <MySon v-model="msg" /> -->
      <hr>
      <!--
        如果解决多个参数传递，可以用 .sync
        1. 父传子 :属性名.sync = "值"
        2. 子组件接收 props: {属性名: {type: xx}}
        3. 子组件要子传父的时候 this.$emit('update: 属性名', '修改的值')
        只要看到.sync修饰符 肯定是父子组件相互通信
        vue3中这个语法被移除了
       -->
      <MySon :msg.sync="msg" :num.sync="num" />
    </div>
  </div>
</template>

<script>
import MySon from './MySon.vue'
export default {
  name: 'Salarys',
  components: { MySon },
  data() {
    return {
      msg: 'haha',
      num: 10
    }
  }
}
</script>

<style>

</style>
