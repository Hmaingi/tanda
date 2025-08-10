import { createRouter, createWebHistory } from 'vue-router'

// Use explicit imports with full paths for debugging
const AgentLogin = () => import('C:/Users/hanna/OneDrive/Desktop/tanda-inventory-system/src/views/AgentLogin.vue')
const InventoryDash = () => import('C:/Users/hanna/OneDrive/Desktop/tanda-inventory-system/src/views/InventoryDash.vue')

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: AgentLogin
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: InventoryDash,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('agentAuth')) {
    next('/login')
  } else {
    next()
  }
})

export default router
