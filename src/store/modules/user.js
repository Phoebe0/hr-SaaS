// 用户模块  先初始化一个空模块，后期自己写
import { reqGetUserDetailById, reqGetUserInfo, reqLogin } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
export default {
  namespaced: true,
  state: {
    // 优先从本地获取
    token: getToken() || '',
    userInfo: {}
  },
  mutations: {
    // 存储token
    setTokenInfo(state, token) {
      // 存在vuex中
      state.token = token
      // 存在cookie中
      setToken(token)
    },
    // 设置用户信息
    setUserInfo(state, info) {
      state.userInfo = info
    },
    // 清除token
    removeToken(state) {
      state.token = ''
      removeToken()
    },
    // 清除个人信息
    removeUserInfo(state) {
      state.userInfo = {}
    }

  },
  actions: {
    // 登录
    async login({ commit }, loginform) {
      const res = await reqLogin(loginform) // await 拿到的是成功的结果
      const { data } = res.data
      if (res.data.success) commit('setTokenInfo', data)

      return res.data // 要在页面组件中做消息提示
    },

    // 获取用户资料
    async getUserInfo(context) {
      const data = await reqGetUserInfo() // 获取用户简单信息
      const data2 = await reqGetUserDetailById(data.data.data.userId)

      const fullUserInfo = { ...data, ...data2 }
      console.log(fullUserInfo)
      context.commit('setUserInfo', fullUserInfo.data.data)
    },

    // 退出功能
    logout({ commit }) {
      commit('removeToken')
      commit('removeUserInfo')
    }
  }

}

