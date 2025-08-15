import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/Login/LoginPage.vue'
import Dashboard from '../components/Dashboard/Dashboard.vue'
import Payment from '../components/Payment/Payment.vue'
import Applicants from '../components/Applicants/Applicants.vue'
import Complaints from '../components/Complaints/Complaints.vue'
import Compliances from '../components/Compliances/Compliances.vue'
import Vendors from '../components/Vendors/Vendors.vue'
import Stallholders from '../components/Stallholders/Stallholders.vue'
import Collectors from '../components/Collectors/Collectors.vue'
import Stalls from '../components/Stalls/Stalls.vue'

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
      path: '/payments',
      name: 'Payment',
      component: Payment,
    },
    {
      path: '/applicants',
      name: 'Applicants',
      component: Applicants,
    },
    {
      path: '/complaints',
      name: 'Complaints',
      component: Complaints,
    },
    {
      path: '/compliances',
      name: 'Compliances',
      component: Compliances,
    },
    {
      path: '/vendors',
      name: 'Vendors',
      component: Vendors,
    },
    {
      path: '/stallholders',
      name: 'Stallholders',
      component: Stallholders,
    },
    {
      path: '/collectors',
      name: 'Collectors',
      component: Collectors,
    },
    {
      path: '/stalls',
      name: 'Stalls',
      component: Stalls,
    },
  ],
})

export default router
