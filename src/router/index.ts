// Composables
import {createRouter, createWebHistory} from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: '/tao-de-thi',
        name: 'CreateRandomExam',
        component: () => import(/* webpackChunkName: "create-random-exam" */ '@/views/CreateRandomExam.vue'),
      },
      {
        path: '/dang-nhap',
        name: 'Login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue'),
      },
      {
        path: '/dang-ki',
        name: 'Register',
        component: () => import(/* webpackChunkName: "register" */ '@/views/Register.vue'),
      },

    ],

  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  if (['Login', 'Register'].includes(String(to.name))) {
    next()
  } else if (user?.username) {
    next()
  } else {
    next({name: 'Login'})
  }
})


export default router
