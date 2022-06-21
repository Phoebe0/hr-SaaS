import Layout from '@/layout'
  export default {
    path: '/employees',
    component: Layout,
    children: [{
      path: '/employees',
      name: 'employees',
      component: () => import('@/views/employees'),
      meta: { title: '员工', icon: 'people' }
    },
    {
        path: 'detail/:id',
        name: 'detail',
        component: () => import('@/views/employees/Detail'),
        hidden: true
    }
  ]
  }
