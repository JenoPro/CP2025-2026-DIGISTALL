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
import Employees from '../components/Employees/Employees.vue'

// Helper function to check if user has required permission
const hasPermission = (requiredPermission) => {
  const userType = sessionStorage.getItem('userType')
  console.log('🔍 Permission check:', { userType, requiredPermission })

  // Admin and branch managers have access to everything (check both formats)
  if (userType === 'admin' || userType === 'branch-manager' || userType === 'branch_manager') {
    console.log('✅ Admin/Branch Manager - Access granted')
    return true
  }

  // For employees, check specific permissions
  if (userType === 'employee') {
    const employeePermissions = JSON.parse(sessionStorage.getItem('employeePermissions') || '[]')
    const hasAccess = employeePermissions.includes(requiredPermission)
    console.log('👤 Employee permission check:', {
      employeePermissions,
      requiredPermission,
      hasAccess,
    })
    return hasAccess
  }

  console.log('❌ No valid user type or permission denied')
  return false
}

// Route guard to check permissions
const requiresPermission = (permission) => {
  return (to, from, next) => {
    const userType = sessionStorage.getItem('userType')
    console.log('🛡️ Route guard check:', { to: to.path, permission, userType })

    if (!userType) {
      console.log('❌ No user type - redirecting to login')
      // Not logged in
      next('/')
      return
    }

    if (hasPermission(permission)) {
      console.log('✅ Permission granted - proceeding to route')
      next()
    } else {
      console.log('❌ Permission denied - redirecting to dashboard')
      // No permission - redirect to dashboard or show error
      next('/dashboard')
    }
  }
}

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
          path: 'complaints',
          name: 'Complaints',
          component: Complaints,
          meta: { title: 'Complaints' },
          beforeEnter: requiresPermission('complaints'),
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
          path: 'employees',
          name: 'Employees',
          component: Employees,
          meta: {
            title: 'Employee Management',
            requiresBranchManager: true,
          },
        },
        {
          path: 'payment',
          name: 'Payment',
          component: Payment,
          meta: { title: 'Payment' },
          beforeEnter: requiresPermission('payments'),
        },
        {
          path: 'applicants',
          name: 'Applicants',
          component: Applicants,
          meta: { title: 'Applicants' },
          beforeEnter: requiresPermission('applicants'),
        },
        {
          path: 'compliances',
          name: 'Compliances',
          component: Compliances,
          meta: { title: 'Compliances' },
          beforeEnter: requiresPermission('compliances'),
        },
        {
          path: 'vendors',
          name: 'Vendors',
          component: Vendors,
          meta: { title: 'Vendors' },
          beforeEnter: requiresPermission('vendors'),
        },
        {
          path: 'stallholders',
          name: 'Stallholders',
          component: Stallholders,
          meta: { title: 'Stallholders' },
          beforeEnter: requiresPermission('stallholders'),
        },
        {
          path: 'collectors',
          name: 'Collectors',
          component: Collectors,
          meta: { title: 'Collectors' },
          beforeEnter: requiresPermission('collectors'),
        },
        {
          path: 'stalls',
          name: 'Stalls',
          component: Stalls,
          meta: { title: 'Stalls' },
          beforeEnter: requiresPermission('stalls'),
        },
        {
          path: 'stalls/raffles',
          name: 'Raffles',
          component: () =>
            import('../components/Stalls/RaffleComponents/RafflesPage/RafflesPage.vue'),
          meta: { title: 'Active Raffles' },
        },
        {
          path: 'stalls/auctions',
          name: 'Auctions',
          component: () =>
            import('../components/Stalls/AuctionComponents/AuctionsPage/AuctionsPage.vue'),
          meta: { title: 'Active Auctions' },
        },
        {
          path: 'stalls/live/:stallId/:type',
          name: 'LivePage',
          component: () => import('../components/Stalls/LiveComponents/LivePage.vue'),
          props: true,
          meta: { title: 'Live Management' },
        },
      ],
    },
  ],
})

// Navigation guard to protect admin and branch manager routes
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
  }
  // Check if route requires branch manager access
  else if (to.meta?.requiresBranchManager) {
    if (
      userType === 'admin' ||
      currentUser.userType === 'admin' ||
      userType === 'branch_manager' ||
      currentUser.userType === 'branch_manager' ||
      userType === 'branch-manager' ||
      currentUser.userType === 'branch-manager'
    ) {
      next()
    } else {
      // Redirect non-branch manager users to dashboard
      next('/dashboard')
    }
  } else {
    next()
  }
})

export default router
