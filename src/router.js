import Vue from 'vue'
import Router from 'vue-router'
/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
import home from '@/components/Home' // 需要几个页面，引几个
import InfoList from '@/components/InfoList'
import InfoRelease from '@/components/InfoRelease'

Vue.use(Router)

export default new Router({
  mode:'hash',
  routes: [
    {
      path: '/',
      name: '去拼车',
      component: home,
      children: [
        {path: '/InfoList', component: InfoList, name: '信息列表'},
        {path: '/InfoRelease', component: InfoRelease, name: '发布信息',},
      ]
    }
  ]
})
