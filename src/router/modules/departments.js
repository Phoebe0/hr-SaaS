import Layout from '@/layout'
  export default {
    path: '/departments',
    component: Layout,
    children: [{
      path: '/departments',
      name: 'departments',
      component: () => import('@/views/departments'),
      meta: { title: '组织架构', icon: 'dashboard' }
    }]
  }
