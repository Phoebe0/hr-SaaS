// 自定义指令的配置对象文件

// 参数 （指令名， 配置对象）
export const imgerr = {
  inserted(el, binding) { // el指向的是使用指令的dom元素  也就是图片标签, binding.value是指令后面的值
      el.onerror = () => {
          // onerror是图片加载失败后触发
          el.src = binding.value || 'http://t13.baidu.com/it/u=1686986286,3284394871&fm=224&app=112&f=JPEG?w=500&h=500'
      }
  }
}
