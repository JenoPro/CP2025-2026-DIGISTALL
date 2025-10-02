import { eventBus, EVENTS } from '../../../../eventBus.js'

export default {
  name: 'DeleteStall',
  props: {
    stallData: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      showSuccessPopup: false,
      popupState: 'loading', // 'loading' or 'success'
      successMessage: '',
      popupTimeout: null,
      // API base URL
      // eslint-disable-next-line no-undef
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:3001',
    }
  },
  methods: {
    showSuccessAnimation(message) {
      console.log('🎬 Showing delete success animation...')
      console.log(`✅ Success message: ${message}`)

      this.successMessage = message
      this.popupState = 'loading'
      this.showSuccessPopup = true

      // Transition to success state after loading animation
      setTimeout(() => {
        console.log('🎉 Transitioning to success state')
        this.popupState = 'success'

        // Auto close after 2 seconds
        this.popupTimeout = setTimeout(() => {
          console.log('⏰ Auto-closing success popup')
          this.closeSuccessPopup()
        }, 2000)
      }, 1500)
    },

    closeSuccessPopup() {
      console.log('🚪 Closing success popup and returning to main view')

      if (this.popupTimeout) {
        clearTimeout(this.popupTimeout)
        this.popupTimeout = null
      }
      this.showSuccessPopup = false
      this.popupState = 'loading'
      this.successMessage = ''
      this.loading = false

      // Close the main modal after success popup closes
      this.handleCancel()
    },

    async handleConfirmDelete() {
      // Check for stall ID using correct field names from backend
      const stallId = this.stallData.stall_id || this.stallData.ID || this.stallData.id

      if (!stallId) {
        console.error('❌ No stall ID provided for deletion')
        console.log('Available stall data:', this.stallData)
        this.$emit('error', 'No stall ID provided for deletion')
        return
      }

      this.loading = true

      try {
        const stallNumber = this.stallData.stall_no || this.stallData.stallNumber || 'Unknown'

        console.log('🗑️ Starting deletion process...')
        console.log(`📋 Stall Details: ID=${stallId}, Number=${stallNumber}`)
        console.log(
          `📍 Location: ${this.stallData.stall_location || this.stallData.location || 'N/A'}`,
        )

        // Get auth token from sessionStorage
        const token = sessionStorage.getItem('authToken')

        if (!token) {
          this.$emit('error', 'Authentication token not found. Please login again.')
          this.$router.push('/login')
          return
        }

        // Make API call to delete stall
        const apiUrl = `${this.apiBaseUrl}/api/stalls/${stallId}`

        console.log(`🌐 Making DELETE request to: ${apiUrl}`)

        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        const result = await response.json().catch(() => {
          // If JSON parsing fails, return a generic error object
          return {
            success: false,
            message: response.statusText || 'Server error',
          }
        })

        console.log('📡 Delete API Response:', result)
        console.log(`📊 Response Status: ${response.status} ${response.statusText}`)

        if (!response.ok) {
          if (response.status === 401) {
            this.$emit('error', 'Session expired. Please login again.')
            this.$router.push('/login')
            return
          } else if (response.status === 403) {
            throw new Error('Access denied - you do not have permission to delete this stall')
          } else if (response.status === 404) {
            throw new Error('Stall not found or you do not have permission to delete it')
          }
          throw new Error(result.message || `Server error: ${response.status}`)
        }

        if (result.success) {
          console.log('✅ Stall deletion successful!')
          console.log(`🎉 Successfully deleted stall: ${stallNumber}`)

          // Show success animation after API success
          this.showSuccessAnimation(result.message || `Stall ${stallNumber} deleted successfully!`)

          // Emit success event to parent component
          this.$emit('deleted', {
            stallId: stallId,
            stallData: this.stallData,
            message: result.message || `Stall ${stallNumber} deleted successfully`,
          })

          // NEW: Emit global event for real-time sidebar update
          eventBus.emit(EVENTS.STALL_DELETED, {
            stallId: stallId,
            stallData: this.stallData,
            priceType: this.stallData?.priceType || this.stallData?.price_type,
            message: result.message || `Stall ${stallNumber} deleted successfully`,
          })
        } else {
          throw new Error(result.message || 'Failed to delete stall')
        }
      } catch (error) {
        console.error('❌ Error deleting stall:', error)
        console.error('🔍 Error details:', {
          message: error.message,
          stallId: stallId,
          stallNumber: this.stallData.stall_no || this.stallData.stallNumber,
        })

        this.loading = false
        this.closeSuccessPopup()

        // Emit error event to parent component
        this.$emit('error', {
          message: error.message || 'Failed to delete stall',
          error: error,
        })
      }
    },

    handleCancel() {
      this.$emit('close')
    },

    formatPrice(price) {
      if (!price) return 'N/A'

      // Extract numeric price if it's a formatted string
      const numericPrice = String(price)
        .replace(/[₱,\s]/g, '')
        .replace(/php/gi, '')
        .replace(/\/.*$/i, '') // Remove everything after "/" (like "/ Fixed Price")
        .trim()

      if (isNaN(numericPrice)) return price

      return `₱${parseFloat(numericPrice).toLocaleString()}`
    },
  },

  beforeDestroy() {
    // Clean up timeout when component is destroyed
    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout)
      this.popupTimeout = null
    }
  },
}
