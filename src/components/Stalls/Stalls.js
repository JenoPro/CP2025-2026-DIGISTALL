import CardStallsComponent from '../Stalls/StallsComponents/Card/CardStallsComponent.vue'
import SearchFilter from '../Stalls/StallsComponents/SearchAndFilter/SearchAndFilter.vue'
import AddAvailableStall from '../Stalls/StallsComponents/Add/AddAvailableStall.vue'
import EditStall from '../Stalls/StallsComponents/Edit/EditStall.vue'
import AuctionTable from '../Stalls/AuctionComponents/AuctionTable.vue'
import AuctionRecords from '../Stalls/AuctionComponents/AuctionRecords.vue'

export default {
  name: 'Stalls',
  components: {
    CardStallsComponent,
    SearchFilter,
    AddAvailableStall,
    EditStall,
    AuctionTable,
    AuctionRecords,
  },
  data() {
    return {
      pageTitle: 'Stalls',
      showModal: false,
      showEditModal: false,
      showAuctionModal: false,
      showGeneralAuctionRecords: false,
      selectedStall: {},
      stallsData: [], // Now empty - will be populated from API
      displayStalls: [],
      loading: false,
      error: null,
      // API configuration
      // eslint-disable-next-line no-undef
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:3001',
      // Snackbar for notifications
      snackbar: {
        show: false,
        text: '',
        color: 'success',
      },
    }
  },

  async mounted() {
    await this.fetchStalls()
  },

  methods: {
    // Fetch stalls from backend API
    async fetchStalls() {
      this.loading = true
      this.error = null

      try {
        console.log('Fetching stalls from:', `${this.apiBaseUrl}/api/stalls`)

        const response = await fetch(`${this.apiBaseUrl}/api/stalls`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add auth header if token exists
            ...(localStorage.getItem('authToken') && {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }),
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('API Response:', result)

        if (result.success) {
          // Transform backend data to match frontend format
          this.stallsData = result.data.map((stall) => this.transformStallData(stall))
          this.displayStalls = [...this.stallsData]

          console.log(`Successfully loaded ${this.stallsData.length} stalls`)
        } else {
          throw new Error(result.message || 'Failed to fetch stalls')
        }
      } catch (error) {
        console.error('Error fetching stalls:', error)
        this.error = error.message

        // Show error message
        this.showMessage(`Failed to load stalls: ${error.message}`, 'error')
      } finally {
        this.loading = false
      }
    },

    // Transform backend stall data to frontend format
    transformStallData(stall) {
      return {
        id: stall.ID,
        stallNumber: stall.stall_number,
        // Format price based on price_type
        price: this.formatPrice(stall.price, stall.price_type),
        floor: stall.floor,
        section: stall.section,
        dimensions: stall.dimensions,
        location: stall.location,
        description: stall.description,
        // Handle image data - use image_data if available, fallback to image_url
        image: stall.image_data || stall.image_url || this.getDefaultImage(stall.section),
        isAvailable: stall.is_available,
        priceType: stall.price_type,
        status: stall.status,
        createdAt: stall.created_at,
        updatedAt: stall.updated_at,
        createdByName: stall.created_by_name,
        updatedByName: stall.updated_by_name,
      }
    },

    // Format price display based on type
    formatPrice(price, priceType) {
      const formattedPrice = `₱${parseFloat(price).toLocaleString()}`

      switch (priceType) {
        case 'Raffle':
          return `${formattedPrice} / Raffle`
        case 'Auction':
          return `${formattedPrice} Min. / Auction`
        case 'Fixed Price':
        default:
          return `${formattedPrice} / Fixed Price`
      }
    },

    // Get default image based on section
    getDefaultImage(section) {
      const defaultImages = {
        'Grocery Section': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        'Meat Section': 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400',
        'Fresh Produce': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
        'Clothing Section': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
        'Electronics Section': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
        'Food Court': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      }
      return (
        defaultImages[section] ||
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
      )
    },

    // Refresh stalls data
    async refreshStalls() {
      await this.fetchStalls()
    },

    // Edit functions
    handleStallEdit(stall) {
      this.selectedStall = { ...stall }
      this.showEditModal = true
    },

    async handleStallUpdated(updatedStall) {
      try {
        // Update local data
        const index = this.stallsData.findIndex((s) => s.id === updatedStall.id)
        if (index > -1) {
          this.stallsData[index] = { ...updatedStall }
          this.displayStalls = [...this.stallsData]
        }

        this.closeEditModal()

        // Optionally refresh from server to ensure consistency
        // await this.fetchStalls()
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
        // Remove from local data
        const index = this.stallsData.findIndex((s) => s.id === stallId)
        if (index > -1) {
          this.stallsData.splice(index, 1)
          this.displayStalls = [...this.stallsData]
        }

        // Optionally refresh from server
        // await this.fetchStalls()
      } catch (error) {
        console.error('Error handling stall deletion:', error)
        this.showMessage('Error removing stall from display', 'error')
      }
    },

    // Search and filter
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

    async handleStallAdded(newStall) {
      try {
        // Transform the new stall data and add to local array
        const transformedStall = this.transformStallData(newStall)
        this.stallsData.unshift(transformedStall) // Add to beginning
        this.displayStalls = [...this.stallsData]

        this.showMessage('Stall added successfully!', 'success')

        // Optionally refresh entire list to ensure consistency
        // await this.fetchStalls()
      } catch (error) {
        console.error('Error handling new stall:', error)
        // Refresh the entire list if there's an issue
        await this.fetchStalls()
      }
    },

    // Message handling
    showMessage(text, color = 'success') {
      this.snackbar = {
        show: true,
        text,
        color,
      }
    },

    handleEditModalClose() {
      this.closeEditModal()
    },

    handleEditError(errorMessage) {
      this.showMessage(errorMessage, 'error')
    },

    // Auction handlers
    handleStallAuction(stall) {
      this.selectedStall = { ...stall }
      this.showAuctionModal = true
    },

    handleCloseAuction() {
      this.showAuctionModal = false
      this.selectedStall = {}
    },

    handleAuctionStatus({ participant, status }) {
      // The custom popup in AuctionTable will handle the user feedback
      console.log(`Auction status updated: ${participant.fullName} marked as ${status}`)
    },

    handleStallLive(stall) {
      this.showMessage(`Live mode activated for ${stall.stallNumber}`, 'info')
    },

    // Utility methods
    async retryFetch() {
      await this.fetchStalls()
    },

    // Handle network errors gracefully
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
  },

  // Watch for data changes
  watch: {
    stallsData: {
      handler(newStalls) {
        // Update display stalls when main data changes
        if (this.displayStalls.length === 0 || this.displayStalls.length === newStalls.length) {
          this.displayStalls = [...newStalls]
        }
      },
      deep: true,
    },
  },

  // Error handling for component
  errorCaptured(err, instance, info) {
    console.error('Component error captured:', err, info)
    this.showMessage('A component error occurred. Please refresh the page.', 'error')
    return false
  },
}
