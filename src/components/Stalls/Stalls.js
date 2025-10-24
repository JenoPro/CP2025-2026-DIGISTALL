import CardStallsComponent from '../Stalls/StallsComponents/CardStallsComponent/CardStallsComponent.vue'
import SearchFilter from '../Stalls/StallsComponents/SearchAndFilter/SearchAndFilter.vue'
import AddChoiceModal from './StallsComponents/ChoicesModal/AddChoiceModal/AddChoiceModal.vue'
import EditStall from '../Stalls/StallsComponents/EditStall/EditStall.vue'

export default {
  name: 'Stalls',
  components: {
    CardStallsComponent,
    SearchFilter,
    AddChoiceModal,
    EditStall,
  },
  data() {
    return {
      pageTitle: 'Stalls',
      showModal: false,
      showEditModal: false,
      selectedStall: {},
      stallsData: [],
      displayStalls: [],
      loading: false,
      error: null,
      // API configuration
      // eslint-disable-next-line no-undef
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:3001',
      // Current user info
      currentUser: null,
      // Snackbar for notifications
      snackbar: {
        show: false,
        text: '',
        color: 'success',
      },
    }
  },

  async mounted() {
    await this.initializeComponent()
  },

  methods: {
    // Initialize component with user auth check
    async initializeComponent() {
      try {
        // Check authentication first
        const token = sessionStorage.getItem('authToken')
        const user = sessionStorage.getItem('currentUser')

        if (!token || !user) {
          this.showMessage('Please login to access stalls', 'error')
          this.$router.push('/login')
          return
        }

        // Check if user has permission to access stalls
        if (!this.checkStallsPermission()) {
          this.showMessage('Access denied. You do not have permission to view stalls.', 'error')
          this.$router.push('/dashboard')
          return
        }

        this.currentUser = JSON.parse(user)
        console.log('Current user:', this.currentUser)

        await this.fetchStalls()
      } catch (error) {
        console.error('Error initializing component:', error)
        this.showMessage('Error initializing stalls page', 'error')
      }
    },

    // Fetch stalls from backend API with proper authentication
    async fetchStalls() {
      this.loading = true
      this.error = null

      try {
        console.log('Fetching stalls from:', `${this.apiBaseUrl}/api/stalls`)

        // Get token from sessionStorage (where login stores it)
        const token = sessionStorage.getItem('authToken')

        if (!token) {
          throw new Error('Authentication token not found. Please login again.')
        }

        const response = await fetch(`${this.apiBaseUrl}/api/stalls`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid - redirect to login
            this.clearAuthAndRedirect()
            throw new Error('Session expired. Please login again.')
          } else if (response.status === 403) {
            throw new Error('Access denied. Branch manager access required.')
          } else if (response.status === 400) {
            throw new Error('Invalid request. Please check your authentication.')
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('API Response:', result)

        if (result.success) {
          // Transform backend data to match frontend format
          this.stallsData = result.data.map((stall) => this.transformStallData(stall))
          this.displayStalls = [...this.stallsData]

          console.log(`Successfully loaded ${this.stallsData.length} stalls for branch manager`)
          console.log('Transformed stalls data:', this.stallsData)
        } else {
          throw new Error(result.message || 'Failed to fetch stalls')
        }
      } catch (error) {
        console.error('Error fetching stalls:', error)
        this.error = error.message

        // Show error message
        this.showMessage(`Failed to load stalls: ${error.message}`, 'error')

        // If it's an auth error, clear session and redirect
        if (error.message.includes('login') || error.message.includes('Session expired')) {
          this.clearAuthAndRedirect()
        }
      } finally {
        this.loading = false
      }
    },

    transformStallData(stall) {
      console.log('🔄 Transforming stall data:', stall)

      const extractedId = stall.stall_id || stall.id || stall.ID

      return {
        // Basic stall info
        id: extractedId,
        stallNumber: stall.stall_no || stall.stallNumber,
        price: this.formatPrice(stall.rental_price || stall.price),
        location: stall.stall_location,
        size: stall.size,
        dimensions: stall.dimensions,
        description: stall.description,
        status: stall.status,
        stamp: stall.stamp,
        createdAt: stall.created_at,
        isAvailable: Boolean(stall.is_available),

        // ⭐ FIX: Add BOTH naming conventions for compatibility
        // Snake_case (for filter component)
        floor_id: stall.floor_id,
        floor_name: stall.floor_name,
        floor_number: stall.floor_number,
        section_id: stall.section_id,
        section_name: stall.section_name,
        section_code: stall.section_code,

        // CamelCase (for other components)
        floorId: stall.floor_id,
        floorName: stall.floor_name,
        floorNumber: stall.floor_number,
        sectionId: stall.section_id,
        sectionName: stall.section_name,
        sectionCode: stall.section_code,

        // Legacy fields for backward compatibility
        floor: stall.floor_name || `Floor ${stall.floor_number}`,
        section: stall.section_name,
        priceType: stall.price_type || 'Fixed Price',
        price_type: stall.price_type || 'Fixed Price',

        // Image
        image: stall.stall_image || this.getDefaultImage(stall.section_name),

        // Manager info
        managerName:
          stall.manager_first_name && stall.manager_last_name
            ? `${stall.manager_first_name} ${stall.manager_last_name}`
            : 'Unknown Manager',
        area: stall.area,
        branchLocation: stall.location,

        // Keep original values
        rentalPrice: stall.rental_price,
        rental_price: stall.rental_price,
        originalData: stall,
      }
    },

    // Format price display
    formatPrice(price) {
      return `₱${parseFloat(price).toLocaleString()}`
    },

    // Get default image based on section from database
    getDefaultImage(section) {
      const defaultImages = {
        // Match the sections from your database/form
        'Grocery Section': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        'Meat Section': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
        'Fresh Produce': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
        'Clothing Section': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
        'Electronics Section': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
        'Food Court': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',

        // Default fallback
        default: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      }

      console.log(`Getting image for section: "${section}"`)
      return defaultImages[section] || defaultImages['default']
    },

    // Check if user has permission to access stalls
    checkStallsPermission() {
      const userType = sessionStorage.getItem('userType')
      
      // Admins and branch managers always have access (check both formats)
      if (userType === 'admin' || userType === 'branch-manager' || userType === 'branch_manager') {
        return true
      }
      
      // For employees, check specific permissions
      if (userType === 'employee') {
        const employeePermissions = JSON.parse(sessionStorage.getItem('employeePermissions') || '[]')
        return employeePermissions.includes('stalls')
      }
      
      return false
    },

    // Clear authentication and redirect to login
    clearAuthAndRedirect() {
      sessionStorage.removeItem('authToken')
      sessionStorage.removeItem('currentUser')
      sessionStorage.removeItem('userType')
      sessionStorage.removeItem('branchManagerId')

      setTimeout(() => {
        this.$router.push('/login')
      }, 2000)
    },

    // Refresh stalls data
    async refreshStalls() {
      await this.fetchStalls()
    },

    // Edit stall functions
    handleStallEdit(stall) {
      console.log('🔧 Opening edit modal for stall:', stall)
      console.log('🔧 Stall ID in object:', stall.id)

      this.selectedStall = { ...stall }
      console.log('🔧 Selected stall set to:', this.selectedStall)

      this.showEditModal = true
    },

    async handleStallUpdated(updatedStallData) {
      try {
        console.log('🔄 Parent received stall update (raw backend data):', updatedStallData)

        // Transform the raw backend data using the same method used for initial load
        const updatedStall = this.transformStallData(updatedStallData)
        console.log('🔄 Transformed stall data:', updatedStall)

        console.log('🔄 Looking for stall with ID:', updatedStall.id)
        console.log(
          '🔄 Current stallsData IDs:',
          this.stallsData.map((s) => ({ id: s.id, stallNumber: s.stallNumber })),
        )

        // Update local data
        const index = this.stallsData.findIndex((s) => s.id === updatedStall.id)
        console.log('🔄 Found stall at index:', index)

        if (index > -1) {
          console.log('🔄 Old stall data:', this.stallsData[index])
          this.stallsData[index] = { ...updatedStall }
          console.log('🔄 New stall data:', this.stallsData[index])

          this.displayStalls = [...this.stallsData]
          console.log('✅ Local stall data updated successfully!')

          // No additional success message - EditStall component handles the popup
        } else {
          console.error('❌ Could not find stall to update in local data')
        }

        this.closeEditModal()
      } catch (error) {
        console.error('Error handling stall update:', error)
        this.showMessage('Error updating stall display', 'error')
      }
    },

    closeEditModal() {
      this.showEditModal = false
      this.selectedStall = {}
    },

    async handleStallDeleted(stallId) {
      try {
        console.log('Processing stall deletion for ID:', stallId)

        // Remove from local data
        const index = this.stallsData.findIndex((s) => s.id === stallId)
        if (index > -1) {
          const deletedStall = this.stallsData[index]
          this.stallsData.splice(index, 1)
          this.displayStalls = [...this.stallsData]

          console.log(`Stall "${deletedStall.stallNumber}" removed from local data`)
        } else {
          console.warn('Stall not found in local data for deletion')
        }
      } catch (error) {
        console.error('Error handling stall deletion:', error)
        this.showMessage('Error removing stall from display', 'error')
      }
    },

    // Search and filter functions
    handleFilteredStalls(filtered) {
      this.displayStalls = filtered
    },

    // Add stall functions
    openAddStallModal() {
      this.showModal = true
    },

    closeAddStallModal() {
      this.showModal = false
    },

    // UPDATED: Handle stall added with proper event name
    async handleStallAdded(newStallData) {
      try {
        console.log('🆕 Handling new stall data (from AddAvailableStall):', newStallData)
        console.log('🆕 Raw stall data type:', typeof newStallData)
        console.log('🆕 Raw stall data keys:', Object.keys(newStallData || {}))

        // Transform the new stall data and add to local array
        const transformedStall = this.transformStallData(newStallData)
        console.log('🆕 Transformed new stall:', transformedStall)
        console.log('🆕 Final stall ID:', transformedStall.id)

        this.stallsData.unshift(transformedStall) // Add to beginning
        this.displayStalls = [...this.stallsData]
        this.closeAddStallModal()
      } catch (error) {
        console.error('Error handling new stall:', error)
        this.showMessage('Error adding stall to display', 'error')
        // Refresh the entire list if there's an issue
        await this.fetchStalls()
      }
    },

    // Alternative handler method name (in case the emit uses different name)
    async onStallAdded(newStallData) {
      await this.handleStallAdded(newStallData)
    },

    // Handle floor added
    async handleFloorAdded(newFloorData) {
      try {
        console.log('Handling new floor data:', newFloorData)
      } catch (error) {
        console.error('Error handling new floor:', error)
        // Only show error messages
        this.showMessage('Error processing new floor', 'error')
      }
    },

    // Handle section added
    async handleSectionAdded(newSectionData) {
      try {
        console.log('Handling new section data:', newSectionData)
      } catch (error) {
        console.error('Error handling new section:', error)
        // Only show error messages
        this.showMessage('Error processing new section', 'error')
      }
    },

    // Handle refresh request from child components
    async onRefreshStalls() {
      await this.fetchStalls()
    },

    // Message handling with enhanced display options
    showMessage(text, color = 'success') {
      // Handle case where an object is passed instead of string
      const messageText = typeof text === 'string' ? text : JSON.stringify(text)

      this.snackbar = {
        show: true,
        text: messageText,
        color,
      }

      console.log(`Message (${color}): ${messageText}`)
    },

    // Modal event handlers
    handleEditModalClose() {
      this.closeEditModal()
    },

    handleEditError(errorMessage) {
      this.showMessage(errorMessage, 'error')
    },

    // Handle show-message events from child components
    handleShowMessage({ type, text }) {
      this.showMessage(text, type)
    },

    // Auction handlers (if using auction functionality)
    handleStallLive(stall) {
      console.log('Navigate to live page for stall:', stall)
      // Determine the type based on stall properties
      let liveType = 'live'
      if (stall.priceType === 'Auction') {
        liveType = 'auction'
      } else if (stall.priceType === 'Raffle') {
        liveType = 'raffle'
      }

      // Navigate to the live page with path parameters as expected by router
      this.$router.push({
        name: 'LivePage',
        params: {
          stallId: stall.id || stall.stallId,
          type: liveType,
        },
        query: {
          stallNumber: stall.stallNumber,
          stallName: stall.stallName || stall.name,
        },
      })
    },

    // NEW: Handle raffle management
    handleRaffleManagement(stall) {
      console.log('Navigate to raffle management for stall:', stall)
      // Navigate to the raffles page with a specific stall focus
      this.$router.push({
        path: '/stalls/raffles',
        query: { stallId: stall.id, stallNumber: stall.stallNumber },
      })
    },

    // NEW: Handle auction management
    handleAuctionManagement(stall) {
      console.log('Navigate to live auction management for stall:', stall)
      // Navigate to the live page with auction type to show bidding interface
      this.$router.push({
        name: 'LivePage',
        params: {
          stallId: stall.id || stall.stallId,
          type: 'auction',
        },
        query: {
          stallNumber: stall.stallNumber,
          stallName: stall.stallName || stall.name,
        },
      })
    },

    // Error handling utilities
    async retryFetch() {
      await this.fetchStalls()
    },

    handleNetworkError(error) {
      if (error.message.includes('fetch')) {
        return 'Network connection failed. Please check your internet connection.'
      } else if (error.message.includes('500')) {
        return 'Server error. Please try again later.'
      } else if (error.message.includes('404')) {
        return 'API endpoint not found. Please check server configuration.'
      }
      return error.message || 'An unexpected error occurred'
    },

    // API call helper function for other components
    async makeAuthenticatedRequest(url, options = {}) {
      const token = sessionStorage.getItem('authToken')

      if (!token) {
        this.clearAuthAndRedirect()
        throw new Error('Authentication required')
      }

      const defaultHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      }

      const response = await fetch(`${this.apiBaseUrl}${url}`, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      })

      if (response.status === 401) {
        this.clearAuthAndRedirect()
        throw new Error('Session expired. Please login again.')
      }

      return response
    },

    // Get current branch info
    getCurrentBranchInfo() {
      if (this.currentUser) {
        return {
          area: this.currentUser.area,
          location: this.currentUser.location,
          managerName: `${this.currentUser.firstName} ${this.currentUser.lastName}`,
        }
      }
      return null
    },

    // Debug helper - log current stall data
    debugStallData() {
      console.log('=== STALL DATA DEBUG ===')
      console.log('Total stalls:', this.stallsData.length)
      console.log('Display stalls:', this.displayStalls.length)
      console.log('Sample stall:', this.stallsData[0])
      console.log('Current user:', this.currentUser)
      console.log('========================')
    },
  },

  // Computed properties
  computed: {
    hasStalls() {
      return this.stallsData.length > 0
    },

    availableStallsCount() {
      return this.stallsData.filter((stall) => stall.isAvailable).length
    },

    totalStallsCount() {
      return this.stallsData.length
    },

    inactiveStallsCount() {
      return this.stallsData.filter((stall) => !stall.isAvailable).length
    },

    branchInfo() {
      return this.getCurrentBranchInfo()
    },

    // NEW: Computed properties for enhanced functionality
    stallsBySection() {
      const grouped = {}
      this.stallsData.forEach((stall) => {
        const section = stall.section || 'General Section'
        if (!grouped[section]) {
          grouped[section] = []
        }
        grouped[section].push(stall)
      })
      return grouped
    },

    stallsByFloor() {
      const grouped = {}
      this.stallsData.forEach((stall) => {
        const floor = stall.floor || '1st Floor'
        if (!grouped[floor]) {
          grouped[floor] = []
        }
        grouped[floor].push(stall)
      })
      return grouped
    },

    stallsByPriceType() {
      const grouped = {}
      this.stallsData.forEach((stall) => {
        const priceType = stall.priceType || 'Fixed Price'
        if (!grouped[priceType]) {
          grouped[priceType] = []
        }
        grouped[priceType].push(stall)
      })
      return grouped
    },
  },

  // Watchers
  watch: {
    stallsData: {
      handler(newStalls) {
        // Update display stalls when main data changes
        if (this.displayStalls.length === 0 || this.displayStalls.length === newStalls.length) {
          this.displayStalls = [...newStalls]
        }

        // Debug log when stalls data changes
        console.log(`Stalls data updated: ${newStalls.length} stalls`)
      },
      deep: true,
    },

    displayStalls: {
      handler(newDisplayStalls) {
        console.log(`Display stalls updated: ${newDisplayStalls.length} stalls shown`)
      },
    },
  },

  // Lifecycle hooks
  beforeUnmount() {
    // Clear any timeouts or intervals if needed
    console.log('Stalls component unmounting')
  },

  // Error handling for component
  errorCaptured(err, instance, info) {
    console.error('Component error captured:', err, info)
    this.showMessage('A component error occurred. Please refresh the page.', 'error')
    return false
  },
}
