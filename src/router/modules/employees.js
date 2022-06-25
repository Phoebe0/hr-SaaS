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
    },
    // 员工打印页
    {
      path: 'print/:id',
      component: () => import('@/views/employees/Print'),
      hidden: true,
      meta: {
        title: '员工打印'
      }
    }
  ]
  }
