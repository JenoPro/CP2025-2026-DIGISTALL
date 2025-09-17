import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/Login/LoginPage.vue'
import Dashboard from '../components/Dashboard/Dashboard.vue'
import Payment from '../components/Payment/Payment.vue'
import Applicants from '../components/Applicants/Applicants.vue'
import Complaints from '../components/Complaints/Complaints.vue'
import Compliances from '../components/Compliances/Compliance.vue'
import Vendors from '../components/Vendors/Vendors.vue'
import Stallholders from '../components/Stallholders/Stallholders.vue'
import MainLayout from '../components/MainLayout/MainLayout.vue'
import Collectors from '../components/Collectors/Collectors.vue'
import Stalls from '../components/Stalls/Stalls.vue'
import BranchManagement from '../components/Branch/Branch.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'login', component: LoginPage },

    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: Dashboard,
          meta: { title: 'Dashboard' },
        },
        {
          path: '/complaints',
          name: 'Complaints',
          component: Complaints,
          meta: { title: 'Complaints' },
        },
        {
          path: 'branch',
          name: 'Branch',
          component: BranchManagement,
          meta: {
            title: 'Branch Management',
            requiresAdmin: true,
          },
        },
        {
          path: 'payment',
          name: 'Payment',
          component: Payment, // just blank placeholder
          meta: { title: 'Payment' },
        },
        {
          path: 'applicants',
          name: 'Applicants',
          component: Applicants, // placeholder too
          meta: { title: 'Applicants' },
        },
        {
          path: 'compliances',
          name: 'Compliances',
          component: Compliances, // placeholder too
          meta: { title: 'Compliances' },
        },
        {
          path: 'vendors',
          name: 'Vendors',
          component: Vendors, // placeholder too
          meta: { title: 'Vendors' },
        },
        {
          path: 'stallholders',
          name: 'Stallholders',
          component: Stallholders,
          meta: { title: 'Stallholders' },
        },
        {
          path: 'vendors',
          name: 'Vendors',
          component: Vendors,
          meta: { title: 'Vendors' },
        },
        {
          path: 'collectors',
          name: 'Collectors',
          component: Collectors,
          meta: { title: 'Collectors' },
        },
        {
          path: 'stalls',
          name: 'Stalls',
          component: Stalls,
          meta: { title: 'Stalls' },
        },
      ],
    },
  ],
})

// Navigation guard to protect admin routes
router.beforeEach((to, from, next) => {
  const userType = sessionStorage.getItem('userType')
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}')

  // Check if route requires admin access
  if (to.meta?.requiresAdmin) {
    if (userType === 'admin' || currentUser.userType === 'admin') {
      next()
    } else {
      // Redirect non-admin users to dashboard
      next('/dashboard')
    }
  } else {
    next()
  }
})

export default router
