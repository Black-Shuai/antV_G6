import Vue from 'vue'
import Router from 'vue-router'
import g6svg from '../components/g6svg'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'g6svg',
      component: g6svg
    }
  ]
})
