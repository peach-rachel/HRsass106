import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  routes: constantRoutes // 路由表，先放静态路由
}
const mutations = {
  // 修改state （本文件中的state，是根据用户权限，展示的不同的左侧菜单栏）
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}

const actions = {
  // 定义一个筛选权限的方法
  // 第一个参数是承接上下文
  // 第二个参数是登录后getuserinfo中的menus属性，内置了访问权限，与routes中name属性名一一对应上
  filterRoutes(context, menus) {
    const routes = []
    // 在uerinfo的menus中找，与动态路由相匹配的
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key)) // 得到一个新数组/【】
    })
    // key是menus中的每一项、item是动态路由asyncRout中的每一项，是两套循环
    context.commit('setRoutes', routes) // 是提交给mutation，控制左侧边栏用的
    return routes // 此处的return是给路由用的 addroutes
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
