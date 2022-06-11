import Layout from '@/layout'
  export default {
    path: '/approvals',
    component: Layout,
    children: [{
      path: '/approvals',
      name: 'approvals',
      component: () => import('@/views/approvals'),
      meta: { title: '审批', icon: 'tree-table' }
    }]
  }
