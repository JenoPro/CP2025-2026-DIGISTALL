import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/Login/LoginPage.vue'
import Dashboard from '../components/Dashboard/Dashboard.vue'
import Vendors from '../components/Vendors/Vendors.vue'
import Collectors from '../components/Collectors/Collectors.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginPage,
    },

    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
    },
    {
      path: '/vendors',
      name: 'Vendors',
      component: Vendors,
    },
    {
      path: '/collectors',
      name: 'Collectors',
      component: Collectors,
    },
  ],
})

export default router
