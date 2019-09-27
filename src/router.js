import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/Home' // 需要几个页面，引几个
import product from '@/components/product'
// import forms from '@/components/forms'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '去拼车',
      component: home,
      children: [
        {path: '/product', component: product, name: '发布信息'}
        // {path: '/forms', component: forms, name: '表单管理'}
        // { path: '/strategy', component: strategy, name: '瞎画的' },
      ]
    }
  ]
})
