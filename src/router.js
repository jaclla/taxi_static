import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/Home' // 需要几个页面，引几个
import Pc_InfoList from '@/components/Pc_InfoList'
import M_InfoList from '@/components/M_InfoList'
import Pc_InfoRelease from '@/components/Pc_InfoRelease'
import M_InfoRelease from '@/components/M_InfoRelease'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '去拼车',
      component: home,
      children: [
        {path: '/Pc_InfoList', component: Pc_InfoList, name: '信息列表'},
        {path: '/M_InfoList', component: M_InfoList, name: '信息列表'},
        {path: '/Pc_InfoRelease', component: Pc_InfoRelease, name: '发布信息',},
        {path: '/M_InfoRelease', component: M_InfoRelease, name: '发布信息'},
      ]
    }
  ]
})
