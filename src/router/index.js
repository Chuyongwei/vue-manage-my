import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
// import { inc } from 'nprogress'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

// TAG 动态路由
export const asyncRoutes = [{
  path: '/patient',
  component: Layout,
  redirect: '/patient/subscribe',
  meta: { title: '治疗病人', icon: 'patient', roles: ['doctor'] },
  children: [
    {
      path: 'subscribe',
      name: 'subscribe',
      component: () => import('@/views/Subscribe/Subscribe.vue'),
      meta: { title: '预约病人', icon: 'Subscripe', roles: ['doctor'] }
    },
    {
      path: 'inHospital',
      name: 'inHospital',
      component: () => import('@/views/Subscribe/InHospital.vue'),
      meta: {
        title: '住院病人',
        icon: 'inHospital',
        roles: ['doctor']
      }
    },
    {
      path: 'tracking',
      name: 'tracking',
      component: () => import('@/views/Score/Tracking.vue'),
      meta: {
        title: '跟踪病人',
        icon: 'trackScore',
        roles: ['doctor']
      }
    }
  ]
},
// 管理员的权限
{
  path: '/manager',
  component: Layout,
  meta: { title: '管理', icon: 'DataManager', roles: ['admin'] },
  redirect: '/manager/department',
  children: [
    {
      path: 'doctor',
      name: 'doctor',
      component: () => import('@/views/Manager/Doctor.vue'),
      meta: { title: '医生管理', icon: 'doctor', roles: ['admin'] }
    },
    {
      path: 'department',
      name: 'department',
      component: () => import('@/views/Manager/Department.vue'),
      meta: {
        title: '部门管理',
        icon: 'dashboard',
        roles: ['admin']
      }
    },
    {
      path: 'patient',
      name: 'patient',
      component: () => import('@/views/Manager/Patient.vue'),
      meta: {
        title: '病人管理',
        icon: 'doctor',
        roles: ['admin']
      }
    },
    {
      path: 'bed',
      name: 'bed',
      component: () => import('@/views/Manager/Bed.vue'),
      meta: {
        title: '病床管理',
        icon: 'bed',
        roles: ['admin']
      }
    }

  ]
},
// 修改密码
{
  path: '/ma',
  component: Layout,
  redirect: '/ma/updatepwd',
  children: [
    {
      path: 'updatepwd',
      name: 'updatepwd',
      component: () => import('@/views/UpdatePwd.vue'),
      meta: { title: '修改密码', icon: 'doctor', roles: ['doctor'] }
    }
  ]
}
]

// 这里的内容可从this.$router.options.routes
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }

    ]
  },

  {
    path: '/score',
    component: Layout,
    meta: { title: '记录', icon: 'score' },
    children: [
      {
        path: 'bedscore',
        name: 'bedscore',
        component: () => import('@/views/Score/BedScore.vue'),
        meta: {
          title: '病床记录',
          icon: 'score'
        }
      },
      {
        path: 'calendar',
        name: 'calendar',
        component: () => import('@/views/Score/Calendar.vue'),
        meta: {
          title: '值班日历',
          icon: 'score'
        }
      },
      {
        path: 'map',
        name: 'map',
        component: () => import('@/views/Score/Map.vue'),
        meta: {
          title: '医院地图',
          icon: 'score'
        }
      },
      {
        path: 'patient-record',
        name: 'patient-record',
        component: () => import('@/views/Score/Patient.vue'),
        meta: {
          title: '跟踪病人',
          icon: 'trackScore',
          roles: ['doctor']
        }
      }
    ]
  },

  // TAG 编写不能写到导航栏中的路由
  // 使用 words.filter(word => word.length > 6);

  // {
  //   path: '/manager2',
  //   component: Layout,
  //   name:"manager",
  //   redirect:"/manager/checkdetial",
  //   meta:{title:"病人管理"},
  //   children:[
  //     // HACK 可能需要添加查找的页面
  //     // XXX 子组件获取参数this.$route.params.id
  //     //
  //     {
  //       path: 'checkdetial',
  //       name: 'checkdetial',
  //       component: Layout,
  //       meta:{title:'病人病历'}
  //     },
  //     // 可能会设计成浮窗
  //     {
  //       path: 'uploadreport',
  //       name: "uploadreport",
  //       meta: {title:'提交检查报告'}
  //     }

  //   ]
  // },
  //

  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' }
  //     }
  //   ]
  // },

  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: '外连接', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

