import Vue from 'vue'
// 参数 （指令名， 配置对象）
Vue.directive('imgerr', {
  inserted(el, binding) { // el指向的是使用指令的dom元素  也就是图片标签, binding.value是指令后面的值
      el.onerror = () => {
          // onerror是图片加载失败后触发
          el.src = binding.value
      }
  }
})
