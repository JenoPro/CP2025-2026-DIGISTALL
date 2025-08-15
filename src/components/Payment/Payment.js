// Import the components
import AppSidebar from '../AppSidebar/AppSidebar.vue'
import AppHeader from '../AppHeader/AppHeader.vue'

export default {
  name: 'Payment',
  components: {
    AppSidebar,
    AppHeader,
  },
  data() {
    return {
      pageTitle: 'Payments',
      menuItems: [
        { id: 1, icon: 'mdi-view-dashboard', name: 'Dashboard', active: false },
        { id: 2, icon: 'mdi-credit-card', name: 'Payments', active: true },
        { id: 3, icon: 'mdi-account-group', name: 'Applicants', active: false },
        { id: 4, icon: 'mdi-chart-line', name: 'Complaints', active: false },
        { id: 5, icon: 'mdi-shield-check', name: 'Compliances', active: false },
      ],
    }
  },
  mounted() {
    this.initializePayment()
  },
  methods: {
    // Handle menu item clicks from sidebar
    handleMenuItemClick(itemId) {
      console.log('Menu item clicked:', itemId)
      // Update page title based on selected menu item
      this.updatePageTitle(itemId)
      // Add navigation logic here
      this.navigateToPage(itemId)
    },

    // Handle notification clicks from header
    handleNotificationClick() {
      console.log('Notification clicked in Payment')
      // Add notification logic here
    },

    // Handle profile clicks from header
    handleProfileClick() {
      console.log('Profile clicked in Payment')
    },

    // Handle settings clicks from header dropdown
    handleSettingsClick() {
      console.log('Settings clicked in Payment')
      // Navigate to settings or open settings modal
    },

    // Handle logout clicks from header dropdown
    handleLogoutClick() {
      console.log('Logout clicked in Payment')
      // Handle logout logic - clear session, redirect to login, etc.
    },

    // Update page title based on menu selection
    updatePageTitle(itemId) {
      const titleMap = {
        1: 'Dashboard',
        2: 'Payments',
        3: 'Applicants',
        4: 'Complaints',
        5: 'Compliances',
      }
      this.pageTitle = titleMap[itemId] || 'Payments'
    },

    // Navigate to different pages
    navigateToPage(itemId) {
      const routes = {
        1: '/dashboard',
        2: '/payments',
        3: '/applicants',
        4: '/Complaints',
        5: '/compliances',
      }

      if (routes[itemId] && this.$router.currentRoute.value.path !== routes[itemId]) {
        this.$router.push(routes[itemId])
      }
    },

    // Initialize payment page
    initializePayment() {
      console.log('Payment page initialized')
      // Add any initialization logic here
    },
  },
}
