import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/Home' // 需要几个页面，引几个
import InfoList from '@/components/InfoList'
import InfoRelease from '@/components/InfoRelease'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '去拼车',
      component: home,
      children: [
        {path: '/InfoList', component: InfoList, name: '信息列表'},
        {path: '/InfoRelease', component: InfoRelease, name: '发布信息'}
        // { path: '/strategy', component: strategy, name: '瞎画的' },
      ]
    }
  ]
})
