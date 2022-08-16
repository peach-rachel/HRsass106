import { getToken, setToken, removeToken } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
const state = {
  // 设置token为共享状态，初始化时先从缓存获取
  token: getToken(),
  userInfo: {}
}
const mutations = {
  setToken(state, token) {
    // 将新的token 设置给vuex
    state.token = token
    // 此处的 setToken是调用utils中的settoken方法，将新的token set进去
    // 也就是 同步缓存
    setToken(token)
  },
  removeToken(state) {
    state.token = null
    removeToken() // 清空缓存
  },
  setUserInfo(state, result) {
    state.userInfo = result
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  // 定义login action  也需要参数 调用action时 传递过来的参数
  async login(context, data) {
    const result = await login(data) // 实际上就是一个promise  result就是执行的结果
    // axios默认给数据加了一层data
    // if (result.data.success) {
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('setToken', result)
    // }
  },
  // 封装获取用户信息的actions
  async getUserInfo(context) {
    const result = await getUserInfo()
    const baseInfo = await getUserDetailById(result.userId)
    context.commit('setUserInfo', { ...result, ...baseInfo })
    return result
  },
  // 退出登录
  logout(context) {
    context.commit('removeToken') // 清空token
    context.commit('removeUserInfo') // 清空用户信息
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
