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
    }
  },
  methods: {
    async handleConfirmDelete() {
      if (!this.stallData || (!this.stallData.id && !this.stallData.ID)) {
        console.error('❌ No stall ID provided for deletion')
        this.$emit('error', 'No stall ID provided for deletion')
        return
      }

      this.loading = true

      try {
        const stallId = this.stallData.id || this.stallData.ID
        const stallNumber = this.stallData.stallNumber || this.stallData.stall_number || 'Unknown'

        console.log('🗑️ Starting deletion process...')
        console.log(`📋 Stall Details: ID=${stallId}, Number=${stallNumber}`)
        console.log(`📍 Location: ${this.stallData.location || 'N/A'}`)

        // Show success animation first
        this.showSuccessAnimation('Stall has been successfully deleted!')

        // Make API call to delete stall
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
        const apiUrl = `${backendUrl}/api/stalls/${stallId}`

        console.log(`🌐 Making DELETE request to: ${apiUrl}`)

        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if you have authentication
            ...(localStorage.getItem('authToken') && {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }),
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
          throw new Error(result.message || `Server error: ${response.status}`)
        }

        if (result.success) {
          console.log('✅ Stall deletion successful!')
          console.log(`🎉 Successfully deleted stall: ${stallNumber}`)

          // Emit success event to parent component
          this.$emit('deleted', {
            stallId: stallId,
            stallData: this.stallData,
            message: result.message || `Stall ${stallNumber} deleted successfully`,
          })
        } else {
          throw new Error(result.message || 'Failed to delete stall')
        }
      } catch (error) {
        console.error('❌ Error deleting stall:', error)
        console.error('🔍 Error details:', {
          message: error.message,
          stallId: this.stallData.id || this.stallData.ID,
          stallNumber: this.stallData.stallNumber || this.stallData.stall_number,
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

    showSuccessAnimation(message) {
      const stallNumber = this.stallData.stallNumber || this.stallData.stall_number || 'Unknown'
      console.log('🎬 Showing delete success animation...')
      console.log(`✅ Success message: ${message}`)
      console.log(`🏪 For stall: ${stallNumber}`)

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
