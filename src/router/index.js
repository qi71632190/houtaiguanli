import Vue from 'vue'
import Router from 'vue-router'
import Store from '../store'

Vue.use(Router)
function hasUrl(url){
  return Store.state.userInfo.menus_url.some(item=>item ==url)
}

export let indexRoutes = [
  {
    path: "/menu",
    component: () => import("@/views/menu/menu"),
    name: "菜单管理",
    beforeEnter: (to, from, next) => {
      hasUrl('/menu') ? next() : next('/home')
    }
  },
  {
    path: "/role",
    component: () => import("@/views/role/role"),
    name: "角色管理",
    beforeEnter: (to, from, next) => {
      hasUrl('/role') ? next() : next('/home')
    }
  },
  {
    path: "/use",
    component: () => import("@/views/use/use"),
    name: "管理员管理",
    beforeEnter: (to, from, next) => {
      hasUrl('/use') ? next() : next('/home')
    }
  },
  {
    path: "/cate",
    component: () => import("@/views/cate/cate"),
    name: "商品分类",
    beforeEnter: (to, from, next) => {
      hasUrl('/cate') ? next() : next('/home')
    }
  },
  {
    path: "/specs",
    component: () => import("@/views/specs/specs"),
    name: "商品规格管理",
    beforeEnter: (to, from, next) => {
      hasUrl('/specs') ? next() : next('/home')
    }
  },
  {
    path: "/goods",
    component: () => import("@/views/goods/goods"),
    name: "商品管理",
    beforeEnter: (to, from, next) => {
      hasUrl('/goods') ? next() : next('/home')
    }
  },
  {
    path: "/member",
    component: () => import("@/views/member/member"),
    name: "会员管理",
    beforeEnter: (to, from, next) => {
      hasUrl('/member') ? next() : next('/home')
    }
  },
  {
    path: "/banner",
    component: () => import("@/views/banner/banner"),
    name: "轮播图管理",
    beforeEnter: (to, from, next) => {
      hasUrl('/banner') ? next() : next('/home')
    }
  },
  {
    path: "/seck",
    component: () => import("@/views/seck/seck"),
    name: "限时秒杀",
    beforeEnter: (to, from, next) => {
      hasUrl('/seck') ? next() : next('/home')
    }
  },
];

const router = new Router({
  routes: [
    {
      path: '/login',
      component: () => import('../pages/login')
    },
    {
      path: '/index',
      component: () => import('../pages/index'),
      children: [
        ...indexRoutes,
        {
          path: '/home',
          component: () => import('../views/home')
        },
        {
          //二级路由重定向
          path: "",
          redirect: "/menu"
        }

      ]
    },
    {
      path: '*',
      redirect: '/login'
    }

  ]
})
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    next()
    return
  }
  if(Store.state.userInfo){
    next()
    return
  }
  next('/login')
})


export default router
