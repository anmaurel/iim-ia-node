import Vue from 'vue'
import Router from 'vue-router'
import Pokemon from '@/components/Pokemon'
import Threejs from'@/components/Threejs'
import P4 from'@/components/P4'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Pokemon',
      component: Pokemon
    },
    {
      path: '/three/',
      name: 'Threejs',
      component: Threejs
    },
    {
      path: '/p4/',
      name: 'P4',
      component: P4
    }

  ]
})
