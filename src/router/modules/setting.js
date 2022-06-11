import Layout from '@/layout'
  export default {
    path: '/setting',
    component: Layout,
    children: [{
      path: '/setting',
      name: 'setting',
      component: () => import('@/views/setting'),
      meta: { title: '角色设置', icon: 'setting' }
    }]
  }
