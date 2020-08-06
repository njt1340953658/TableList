import Vue from 'vue'

import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/studentInfo/index',
    name: 'studentInfo',
    component: _ => import('@/studentInfo.vue'),
    meta: { title: '主页测试', }
  }]
})