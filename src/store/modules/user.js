// 用户模块  先初始化一个空模块，后期自己写
import { reqLogin } from '@/api/user'
import { setToken, getToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    // 优先从本地获取
    token: getToken() || ''
  },
  mutations: {
    // 存储token
    setTokenInfo(state, token) {
      // 存在vuex中
      state.token = token
      // 存在cookie中
      setToken(token)
    }
  },
  actions: {
    // 登录
    async login({ commit }, loginform) {
      const res = await reqLogin(loginform)
      const { data } = res.data
      if (res.data.success) commit('setTokenInfo', data)

      return res.data // 要在页面组件中做消息提示
    }
  }

}

