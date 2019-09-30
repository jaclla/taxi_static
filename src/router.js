import Vue from 'vue'
import Router from 'vue-router'
import InfoList from '@/components/InfoList'
import InfoRelease from '@/components/InfoRelease'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', component: InfoList, name: '信息列表'},
    {path: '/InfoRelease', component: InfoRelease, name: '发布信息'}
  ]
})
