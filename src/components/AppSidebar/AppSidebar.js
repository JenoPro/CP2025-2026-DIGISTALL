import { eventBus, EVENTS } from '../../eventBus.js'

export default {
  name: 'AppSidebar',
  props: {
    items: {
      type: Array,
      default: () => [
        { id: 1, icon: 'mdi-view-dashboard', name: 'Dashboard', route: '/dashboard' },
        { id: 2, icon: 'mdi-credit-card', name: 'Payments', route: '/payments' },
        { id: 3, icon: 'mdi-account-plus', name: 'Applicants', route: '/applicants' },
        { id: 4, icon: 'mdi-chart-line', name: 'Complaints', route: '/complaints' },
        {
          id: 5,
          icon: 'mdi-clipboard-check',
          name: 'Compliances',
          route: '/compliances',
        },
      ],
    },
  },
  data() {
    return {
      menuItems: [...this.items],
      isExpanded: false,
      showMoreItems: false,
      showStallsSubMenu: false, // NEW: Track stalls submenu state
      // NEW: Track available stall types in current branch
      availableStallTypes: {
        hasRaffles: false,
        hasAuctions: false,
      },
      // API configuration
      // eslint-disable-next-line no-undef
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:3001',
      moreItems: [
        { id: 6, icon: 'mdi-account-group', name: 'Vendors', route: '/vendors' },
        {
          id: 7,
          icon: 'mdi-account-multiple',
          name: 'Stallholders',
          route: '/stallholders',
        },
        { id: 8, icon: 'mdi-account-cash', name: 'Collectors', route: '/collectors' },
        {
          id: 9,
          icon: 'mdi-store',
          name: 'Stalls',
          route: '/stalls',
          hasSubMenu: true, // NEW: Indicate this item has submenu
          subItems: [
            // NEW: Sub-menu items for Stalls - will be dynamically filtered
            {
              id: 91,
              icon: 'mdi-ticket-percent',
              name: 'Raffles',
              route: '/stalls/raffles',
              type: 'raffle',
            },
            {
              id: 92,
              icon: 'mdi-gavel',
              name: 'Auctions',
              route: '/stalls/auctions',
              type: 'auction',
            },
          ],
        },
      ],
    }
  },
  computed: {
    // Check if current user is admin
    isAdmin() {
      const userType = sessionStorage.getItem('userType')
      const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}')
      return userType === 'admin' || currentUser.userType === 'admin'
    },

    // NEW: Get filtered submenu items based on available stall types
    filteredStallSubItems() {
      const stallsItem = this.moreItems.find((item) => item.id === 9)
      if (!stallsItem || !stallsItem.subItems) return []

      return stallsItem.subItems.filter((subItem) => {
        if (subItem.type === 'raffle') {
          return this.availableStallTypes.hasRaffles
        }
        if (subItem.type === 'auction') {
          return this.availableStallTypes.hasAuctions
        }
        return true // Show other items by default
      })
    },
  },
  watch: {
    items: {
      handler(newItems) {
        this.menuItems = [...newItems]
      },
      deep: true,
    },
    // Watch for route changes to update active state
    $route: {
      handler() {
        this.updateActiveStates()
        // NEW: Refresh stall types when navigating to/from stalls pages
        if (this.$route.path.includes('/stalls')) {
          this.checkAvailableStallTypes()
        }
      },
      immediate: true,
    },
  },

  // NEW: Lifecycle hook to check stall types when component mounts
  async mounted() {
    await this.checkAvailableStallTypes()

    // NEW: Listen for stall events to update sidebar in real-time
    eventBus.on(EVENTS.STALL_ADDED, this.handleStallEvent)
    eventBus.on(EVENTS.STALL_DELETED, this.handleStallEvent)
    eventBus.on(EVENTS.STALL_UPDATED, this.handleStallEvent)
  },

  // NEW: Cleanup event listeners when component is destroyed
  beforeUnmount() {
    eventBus.off(EVENTS.STALL_ADDED, this.handleStallEvent)
    eventBus.off(EVENTS.STALL_DELETED, this.handleStallEvent)
    eventBus.off(EVENTS.STALL_UPDATED, this.handleStallEvent)
  },

  methods: {
    // NEW: Check what stall types are available in the current branch
    async checkAvailableStallTypes() {
      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) {
          console.log('No auth token, skipping stall type check')
          return
        }

        const response = await fetch(`${this.apiBaseUrl}/api/stalls`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          console.log('Failed to fetch stalls for type check:', response.status)
          return
        }

        const result = await response.json()
        if (result.success && result.data) {
          const stalls = result.data

          // Check if there are any raffle or auction stalls
          this.availableStallTypes.hasRaffles = stalls.some(
            (stall) => stall.price_type === 'Raffle' || stall.priceType === 'Raffle',
          )

          this.availableStallTypes.hasAuctions = stalls.some(
            (stall) => stall.price_type === 'Auction' || stall.priceType === 'Auction',
          )

          console.log('Available stall types:', this.availableStallTypes)
        }
      } catch (error) {
        console.error('Error checking stall types:', error)
        // Fallback: show both options if we can't determine
        this.availableStallTypes.hasRaffles = true
        this.availableStallTypes.hasAuctions = true
      }
    },

    toggleSidebar() {
      this.isExpanded = !this.isExpanded
      if (!this.isExpanded) {
        this.showMoreItems = false
      }
    },

    toggleMoreItems() {
      this.showMoreItems = !this.showMoreItems
      // Close stalls submenu when more items is collapsed
      if (!this.showMoreItems) {
        this.showStallsSubMenu = false
      }
    },

    // NEW: Toggle stalls submenu
    toggleStallsSubMenu() {
      this.showStallsSubMenu = !this.showStallsSubMenu
    },

    setActiveItem(itemId, route, hasSubMenu = false) {
      // Handle stalls menu item with submenu
      if (itemId === 9 && hasSubMenu) {
        // Only toggle submenu if there are raffle/auction stalls available
        if (this.availableStallTypes.hasRaffles || this.availableStallTypes.hasAuctions) {
          this.toggleStallsSubMenu()
        }
        // Always navigate to main stalls page
        if (route && this.$route.path !== route) {
          this.$router.push(route).catch((err) => {
            console.log('Navigation handled:', err.message)
          })
        }
        return
      }

      // Navigate to the route for regular items
      if (route && this.$route.path !== route) {
        this.$router.push(route).catch((err) => {
          console.log('Navigation handled:', err.message)
        })
      }

      // Close more items if a main item is selected
      const isMainItem = this.menuItems.find((item) => item.id === itemId)
      if (isMainItem) {
        this.showMoreItems = false
        this.showStallsSubMenu = false
      }

      // Emit the navigation event to parent
      this.$emit('menu-item-click', itemId, route)
    },

    // Check if the current route matches the item route
    isActiveRoute(route) {
      return this.$route.path === route
    },

    // Update active states based on current route
    updateActiveStates() {
      // This method is called when route changes
      // The active state is now determined by isActiveRoute method
      // which compares current route with item route
    },

    // NEW: Method to refresh stall types (can be called from parent components)
    async refreshStallTypes() {
      await this.checkAvailableStallTypes()
    },

    // NEW: Handle stall events from event bus for real-time updates
    async handleStallEvent(eventData) {
      console.log('Sidebar received stall event:', eventData)
      // Refresh stall types when any stall is added, deleted, or updated
      await this.checkAvailableStallTypes()
    },
  },
}
