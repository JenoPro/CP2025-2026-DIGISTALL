// Import the components
import AppSidebar from '../AppSidebar/AppSidebar.vue'
import AppHeader from '../AppHeader/AppHeader.vue'
import CardStallsComponent from '../Stalls/Components/Card/CardStallsComponent.vue'
import SearchFilter from '../Stalls/Components/SearchAndFilter/SearchAndFilter.vue'

export default {
  name: 'Stalls',
  components: {
    AppSidebar,
    AppHeader,
    CardStallsComponent,
    SearchFilter,
  },
  data() {
    return {
      pageTitle: 'Stalls',
      menuItems: [
        { id: 1, icon: 'mdi-view-dashboard', name: 'Dashboard', active: false },
        { id: 2, icon: 'mdi-credit-card', name: 'Payments', active: false },
        { id: 3, icon: 'mdi-account-group', name: 'Applicants', active: false },
        { id: 4, icon: 'mdi-chart-line', name: 'Complaints', active: false },
        { id: 5, icon: 'mdi-shield-check', name: 'Compliances', active: false },
      ],
      stallsData: [
        {
          id: 1,
          stallNumber: 'STALL# 01',
          price: '1,500 Php / Raffle',
          floor: '2nd Floor',
          section: 'Grocery Section',
          dimensions: '3x3 meters',
          location: "Naga City People's Mall",
          description:
            'Perfect for grocery business with high foot traffic area. Well-ventilated space with easy access to main entrance.',
          image: 'https://tse3.mm.bing.net/th/id/OIP.B6h1C5jCwEUN1PEbu0exVQHaGB?pid=Api&P=0&h=180',
          isAvailable: true,
        },
        {
          id: 2,
          stallNumber: 'STALL# 02',
          price: '1,500 Php Min. / Auction',
          floor: '2nd Floor',
          section: 'Grocery Section',
          dimensions: '3x3 meters',
          location: 'Satellite Market',
          description:
            'Strategic corner location ideal for various retail businesses. Near restroom facilities and loading area.',
          image:
            'https://www.citybgroup.com/assets/sales/traditional-style-marketing-stall/skipton-3__FillWzEwMDAsNTYzXQ.JPG',
          isAvailable: true,
        },
        {
          id: 3,
          stallNumber: 'STALL# 03',
          price: '1,500 Php / Raffle',
          floor: '2nd Floor',
          section: 'Grocery Section',
          dimensions: '3x3 meters',
          location: "Naga City People's Mall",
          description:
            'Spacious stall with good lighting and electrical outlets. Suitable for fresh produce or packaged goods.',
          image: 'https://i.pinimg.com/originals/b8/7f/96/b87f9661d0f56d6d88c8e1462e4c68a3.jpg',
          isAvailable: true,
        },
        {
          id: 4,
          stallNumber: 'STALL# 04',
          price: '1,500 Php Min. / Auction',
          floor: '2nd Floor',
          section: 'Grocery Section',
          dimensions: '3x3 meters',
          location: 'Satellite Market',
          description:
            'Prime location with excellent visibility. Close to parking area and public transportation routes.',
          image: 'https://i.pinimg.com/originals/60/17/ec/6017ec3acc17f3e0d729d882026f92eb.jpg',
          isAvailable: true,
        },
        {
          id: 5,
          stallNumber: 'STALL# 05',
          price: '1,800 Php / Raffle',
          floor: '1st Floor',
          section: 'Meat Section',
          dimensions: '4x3 meters',
          location: "Naga City People's Mall",
          description:
            'Premium ground floor location with freezer hookups. Perfect for meat vendors with cold storage.',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          isAvailable: true,
        },
        {
          id: 6,
          stallNumber: 'STALL# 06',
          price: '2,000 Php Min. / Auction',
          floor: '1st Floor',
          section: 'Fresh Produce',
          dimensions: '3x4 meters',
          location: 'Satellite Market',
          description:
            'Large corner stall with water access and drainage. Ideal for vegetable and fruit vendors with washing facilities.',
          image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
          isAvailable: true,
        },
      ],
      displayStalls: [],
    }
  },
  mounted() {
    this.initializeStalls()
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
      console.log('Notification clicked in Stalls')
      // Add notification logic here
    },

    // Handle profile clicks from header
    handleProfileClick() {
      console.log('Profile clicked in Stalls')
    },

    // Handle settings clicks from header dropdown
    handleSettingsClick() {
      console.log('Settings clicked in Stalls')
      // Navigate to settings or open settings modal
    },

    // Handle logout clicks from header dropdown
    handleLogoutClick() {
      console.log('Logout clicked in Stalls')
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
        6: 'Vendors',
        7: 'Stallholders',
        8: 'Collectors',
        9: 'Stalls',
      }
      this.pageTitle = titleMap[itemId] || 'Stalls'
    },

    // Navigate to different pages
    navigateToPage(itemId) {
      const routes = {
        1: '/dashboard',
        2: '/payments',
        3: '/applicants',
        4: '/Complaints',
        5: '/compliances',
        6: '/vendors',
        7: '/stallholders',
        8: '/collectors',
        9: '/stalls',
      }

      if (routes[itemId] && this.$router.currentRoute.value.path !== routes[itemId]) {
        this.$router.push(routes[itemId])
      }
    },

    // Initialize stalls page
    initializeStalls() {
      console.log('Stalls page initialized')
      // Add any initialization logic here
    },

    handleStallEdit(stall) {
      console.log('Edit stall:', stall)
      // Add stall edit logic 
    },

    handleStallDelete(stall) {
      console.log('Delete stall:', stall)
        // Add stall delete logic 
      if (confirm(`Are you sure you want to delete ${stall.stallNumber}?`)) {
        // Delete logic here upon confirmation
      }
    },

    handleFilteredStalls(filtered) {
      this.displayStalls = filtered
    },
  },
}
