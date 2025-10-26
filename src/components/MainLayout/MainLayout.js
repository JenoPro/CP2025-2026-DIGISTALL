import AppHeader from '../AppHeader/AppHeader.vue'
import AppSidebar from '../AppSidebar/AppSidebar.vue'

export default {
  name: 'MainLayout',
  components: { AppSidebar, AppHeader },
  data() {
    return {
      pageTitle: 'Dashboard',
      // Base menu items - will be updated based on user type
      menuItems: [],
      // Define menu items for different user types
      adminMenuItems: [
        { id: 1, icon: 'mdi-view-dashboard', name: 'Dashboard', route: '/dashboard' },
        { id: 2, icon: 'mdi-credit-card', name: 'Payment', route: '/payment' },
        { id: 3, icon: 'mdi-domain', name: 'Branch', route: '/branch' },
      ],
      branchManagerMenuItems: [
        { id: 1, icon: 'mdi-view-dashboard', name: 'Dashboard', route: '/dashboard' },
        { id: 2, icon: 'mdi-credit-card', name: 'Payment', route: '/payment' },
        { id: 3, icon: 'mdi-account-group', name: 'Applicants', route: '/applicants' },
        { id: 4, icon: 'mdi-chart-line', name: 'Complaints', route: '/complaints' },
        { id: 5, icon: 'mdi-shield-check', name: 'Compliances', route: '/compliances' },
      ],
      // Employee menu items based on permissions
      employeeMenuItems: {
        dashboard: { id: 1, icon: 'mdi-view-dashboard', name: 'Dashboard', route: '/dashboard' },
        payments: { id: 2, icon: 'mdi-credit-card', name: 'Payment', route: '/payment' },
        applicants: { id: 3, icon: 'mdi-account-group', name: 'Applicants', route: '/applicants' },
        complaints: { id: 4, icon: 'mdi-chart-line', name: 'Complaints', route: '/complaints' },
        compliances: {
          id: 5,
          icon: 'mdi-shield-check',
          name: 'Compliances',
          route: '/compliances',
        },
        vendors: { id: 6, icon: 'mdi-account-multiple', name: 'Vendors', route: '/vendors' },
        stallholders: {
          id: 7,
          icon: 'mdi-account-group',
          name: 'Stallholders',
          route: '/stallholders',
        },
        collectors: { id: 8, icon: 'mdi-account-cash', name: 'Collectors', route: '/collectors' },
        stalls: { id: 9, icon: 'mdi-store', name: 'Stalls', route: '/stalls' },
      },
      // Define all possible menu routes including "more items" (6-10) and submenu items (91-92)
      allMenuRoutes: {
        1: '/dashboard',
        2: '/payment',
        3: '/applicants', // For branch manager, will be /branch for admin
        4: '/complaints',
        5: '/compliances',
        6: '/employees', // Employee Management
        7: '/vendors', // Vendors
        8: '/stallholders', // Stallholders
        9: '/stalls', // Stalls
        10: '/collectors', // Collectors
        // Submenu items for Stalls
        91: '/stalls/raffles', // Raffles submenu
        92: '/stalls/auctions', // Auctions submenu
      },
    }
  },
  mounted() {
    this.setMenuItemsBasedOnUserType()
  },
  watch: {
    // update header title on route change
    $route: {
      immediate: true,
      handler(to) {
        this.pageTitle = to.meta?.title || to.name || 'Dashboard'
        // Also check if user type has changed and update menu items
        this.setMenuItemsBasedOnUserType()
      },
    },
  },
  methods: {
    setMenuItemsBasedOnUserType() {
      const userType = sessionStorage.getItem('userType')
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}')

      console.log('🔧 Setting menu items for user type:', userType)

      if (userType === 'admin' || currentUser.userType === 'admin') {
        this.menuItems = [...this.adminMenuItems]
        // Update routes for admin
        this.allMenuRoutes[3] = '/branch'
      } else if (userType === 'employee') {
        // Employee: Show only features based on permissions
        const employeePermissions = JSON.parse(
          sessionStorage.getItem('employeePermissions') || '[]',
        )
        console.log('🔧 Employee permissions:', employeePermissions)

        this.menuItems = []
        let menuId = 1

        // Always show dashboard for employees
        if (employeePermissions.includes('dashboard')) {
          this.menuItems.push({ ...this.employeeMenuItems.dashboard, id: menuId++ })
        }

        // Add menu items based on permissions
        if (employeePermissions.includes('payments')) {
          this.menuItems.push({ ...this.employeeMenuItems.payments, id: menuId++ })
        }
        if (employeePermissions.includes('applicants')) {
          this.menuItems.push({ ...this.employeeMenuItems.applicants, id: menuId++ })
        }
        if (employeePermissions.includes('complaints')) {
          this.menuItems.push({ ...this.employeeMenuItems.complaints, id: menuId++ })
        }
        if (employeePermissions.includes('compliances')) {
          this.menuItems.push({ ...this.employeeMenuItems.compliances, id: menuId++ })
        }
        if (employeePermissions.includes('vendors')) {
          this.menuItems.push({ ...this.employeeMenuItems.vendors, id: menuId++ })
        }
        if (employeePermissions.includes('stallholders')) {
          this.menuItems.push({ ...this.employeeMenuItems.stallholders, id: menuId++ })
        }
        if (employeePermissions.includes('collectors')) {
          this.menuItems.push({ ...this.employeeMenuItems.collectors, id: menuId++ })
        }
        if (employeePermissions.includes('stalls')) {
          this.menuItems.push({ ...this.employeeMenuItems.stalls, id: menuId++ })
        }

        // If no permissions, show only dashboard
        if (this.menuItems.length === 0) {
          this.menuItems.push({ ...this.employeeMenuItems.dashboard, id: 1 })
        }
      } else {
        // Default to branch manager menu
        this.menuItems = [...this.branchManagerMenuItems]
        this.allMenuRoutes[3] = '/applicants'
      }
    },
    handleMenuItemClick(payload) {
      // Handle both main menu items (1-5) and more items (6-10)
      const itemId = typeof payload === 'object' ? payload.id : payload
      console.log('🔧 MainLayout handleMenuItemClick:', { payload, itemId })

      // First check if it's a main menu item with route property
      const mainItem = this.menuItems.find((i) => i.id === itemId)
      console.log('🔧 Found main item:', mainItem)

      if (mainItem?.route) {
        console.log('🔧 Navigating to main item route:', mainItem.route)
        this.$router.push(mainItem.route)
        return
      }

      // If not found in main items, check the allMenuRoutes for items 6-10
      const route = this.allMenuRoutes[itemId]
      console.log('🔧 AllMenuRoutes lookup for ID', itemId, ':', route)
      console.log('🔧 All available routes:', this.allMenuRoutes)

      if (route) {
        console.log('🔧 MainLayout navigating to:', route)
        this.$router.push(route)
      } else {
        console.warn('No route found for menu item ID:', itemId)
      }
    },
    handleNotificationClick() {
      console.log('Notification clicked')
    },
    handleProfileClick() {
      console.log('Profile clicked')
    },
    handleSettingsClick() {
      console.log('Settings clicked')
    },
    handleLogoutClick() {
      console.log('Logout clicked')
      // Clear authentication data
      sessionStorage.removeItem('currentUser')
      sessionStorage.removeItem('authToken')
      sessionStorage.removeItem('userType')
      sessionStorage.removeItem('branchManagerId')
      sessionStorage.removeItem('adminId')

      // Redirect to login page
      this.$router.push('/').catch(() => {
        window.location.href = '/'
      })
    },

    // NEW: Method to refresh sidebar stall types (can be called when stalls are modified)
    async refreshSidebarStallTypes() {
      if (this.$refs.appSidebar && this.$refs.appSidebar.refreshStallTypes) {
        await this.$refs.appSidebar.refreshStallTypes()
      }
    },
  },
}
