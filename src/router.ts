import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('./views/AgentLogin.vue')  // Fixed path
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('./views/InventoryView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',  // Add the route for orders
    component: () => import('./views/OrdersView.vue'),
    meta: { requiresAuth: true } // Ensure it's protected
  },
  {
    path: '/reports',
    name: 'Reports',  
    component: () => import('./views/ReportsView.vue'),
    meta: { requiresAuth: true } 
  },
  

  // Catch-all route for 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/')  // Redirect to login if not authenticated
  } else {
    next()
  }
})

export default router
