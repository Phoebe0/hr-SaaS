// 这个文件是配合导航守卫来做页面跳转拦截的
import router from '@/router'
import store from '@/store'
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 路由前置导航守卫 router.beforeEach(...)

// to 去哪里  是一个路由信息对象（记录要去的页面路由信息）
// from （记录从哪里来的页面路由信息）
// next() 是一个放行函数 next如果不调用 看不到页面 （）里面可以写要去的页面路由地址 例如 next('/')
// 前置导航守卫 一般要做页面拦截
// 例如：如果没有登陆 不允许访问有权限的页面
// 如果登陆过，不允许访问登陆页面 如果访问登录页则强制去首页
const whitelist = ['/login', '/404'] // 白名单
router.beforeEach((to, from, next) => {
  // 开启进度条
  Nprogress.start()

  // 检测是否登陆过 ----判断token
  const token = store.getters.token
  // 如果有token 并且要去的页面是登录页
  if (token) {
    if (to.path === '/login') {
      // 直接去首页
      next('/')
      Nprogress.done()
    } else {
      // 想去别的页面 就放行
      next()
    }
  } else {
    // 没有token
    // 如果想去 login 或者 404页面  (没有权限的页面) 直接放行
    if (whitelist.includes(to.path)) { // includes是检测数组中是否包含某个元素
      next()
    } else {
      // 想去有权限的页面  强制去登录页
      next('/login')
      Nprogress.done()
    }
  }
  // next()
})
// 路由后置导航守卫  router.afterEach(...)
// 注意：被next强制跳转的页面是不会经过后置导航守卫的
router.afterEach((to, from) => {
  // 关闭进度条
  Nprogress.done()
})
