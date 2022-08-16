import router from '@/router'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import store from './store' // 引入store实例
// 创建 无需token可直接跳转的白名单
const whiteList = ['/login', '/404']
// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  nprogress.start() // 开启进度条
  // 有token
  if (store.getters.token) {
    // 如访问登录页面，直接放行至主页
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')
      }
      next() // 直接放行
    }
  } else { // 没有token
    // 访问页面是否在白名单
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  nprogress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 路由后置守卫
router.afterEach(() => {
  nprogress.done() // 关闭进度条
})
