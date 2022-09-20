import store from '@/store'
// 用来获取vuex实例中的state数据
export default {
  methods: {
    checkPermission(key) {
      const { userInfo } = store.state.user
      // 用户信息中的points中与key是否匹配，匹配代表有该权限
      if (userInfo.roles.points && userInfo.roles.points.length) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
