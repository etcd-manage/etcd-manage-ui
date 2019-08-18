import Vue from 'vue'
import Router from 'vue-router'
import CloudHome from '@/page/CloudHome'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'CloudHome',
    component: CloudHome,
    children: [
      {
        path: '/key/kv',
        name: 'KV',
        component: () => import('@/page/KV'),
      },
      {
        path: '/server/members',
        name: 'Members',
        component: () => import('@/page/Members'),
      },
      {
        path: '/setings/EtcdServers',
        name: 'EtcdServers',
        component: () => import('@/page/EtcdServers'),
      },
      {
        path: '/setings/user',
        name: 'User',
        component: () => import('@/page/User'),
      },
      {
        path: '/setings/role',
        name: 'Role',
        component: () => import('@/page/Role'),
      }
      
    ]
  }]
})
