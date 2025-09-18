export default {
  name: 'AddAvailableStall',
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valid: false,
      newStall: {
        stallNumber: '',
        price: '',
        floorId: '',
        sectionId: '',
        size: '',
        location: '',
        description: '',
        image: null,
        isAvailable: true,
        priceType: 'Fixed Price',
      },
      rules: {
        required: (value) => !!value || 'Required field',
        number: (value) => !isNaN(parseFloat(value)) || 'Must be a valid number',
        positiveNumber: (value) => parseFloat(value) > 0 || 'Must be greater than 0',
      },
      // UPDATED: Dynamic options loaded from API
      floorOptions: [],
      sectionOptions: [],
      allSections: [], // Store all sections for filtering by floor
      loading: false,
      // Success popup states
      showSuccessPopup: false,
      popupState: 'loading', // 'loading' or 'success'
      successMessage: '',
      popupTimeout: null,
      refreshTimeout: null, // Added for auto-refresh timing
      // API base URL
      // eslint-disable-next-line no-undef
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:3001',
    }
  },

  methods: {
    // NEW METHOD: Load floors and sections from API
    async loadFloorsAndSections() {
      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) {
          throw new Error('Authentication token not found')
        }

        // Load floors for current branch manager
        const floorsResponse = await fetch(`${this.apiBaseUrl}/api/floors`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!floorsResponse.ok) {
          throw new Error(`Failed to load floors: ${floorsResponse.status}`)
        }

        const floorsResult = await floorsResponse.json()
        console.log('🔍 Backend floors response:', floorsResult)

        if (floorsResult.success) {
          this.floorOptions = floorsResult.data.map((floor) => ({
            title: floor.floor_name, // Just show "1st Floor", "2nd Floor", etc.
            value: floor.floor_id,
            floorData: floor,
          }))
          console.log('🔍 All floors loaded:', this.floorOptions)
        } else {
          console.error('API returned success: false for floors:', floorsResult)
          this.$emit(
            'show-message',
            `Failed to load floors: ${floorsResult.message || 'Unknown error'}`,
            'error',
          )
          this.floorOptions = []
        }

        // Load all sections for the current branch manager
        // TEMPORARY: Using debug endpoint to see what's returned
        const sectionsResponse = await fetch(`${this.apiBaseUrl}/api/sections`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!sectionsResponse.ok) {
          throw new Error(`Failed to load sections: ${sectionsResponse.status}`)
        }

        const sectionsResult = await sectionsResponse.json()
        console.log('🔍 Backend sections response:', sectionsResult)
        console.log('🔍 JWT Token being sent:', token)
        console.log(
          '🔍 Decoded token payload:',
          token ? JSON.parse(atob(token.split('.')[1])) : 'No token',
        )
        console.log('🔍 API URL being called:', `${this.apiBaseUrl}/api/sections`)

        if (sectionsResult.success) {
          this.allSections = sectionsResult.data
          console.log('🔍 All sections loaded:', this.allSections)
          console.log('🔍 First section sample:', this.allSections[0])

          // Initially show all sections (will be filtered when floor is selected)
          this.sectionOptions = this.allSections.map((section) => ({
            title: `${section.section_name} (${section.section_code})`,
            value: section.section_id,
            sectionData: section,
          }))
        } else {
          // If API returns success: false, show the error message
          console.error('API returned success: false for sections:', sectionsResult)
          this.$emit(
            'show-message',
            `Failed to load sections: ${sectionsResult.message || 'Unknown error'}`,
            'error',
          )
          // Clear the options instead of using static fallback
          this.floorOptions = []
          this.sectionOptions = []
        }
      } catch (error) {
        console.error('Error loading floors and sections:', error)
        this.$emit('show-message', `Failed to load floors and sections: ${error.message}`, 'error')

        // Clear the options instead of using static fallback data
        this.floorOptions = []
        this.sectionOptions = []
      }
    },

    // NEW METHOD: Filter sections by selected floor
    filterSectionsByFloor(floorId) {
      console.log(
        'Filtering sections by floor:',
        floorId,
        'Type of floorId:',
        typeof floorId,
        'Available sections:',
        this.allSections.length,
      )

      if (!floorId || !this.allSections.length) {
        // Show all sections if no floor selected or no sections available
        this.sectionOptions = this.allSections.map((section) => ({
          title: `${section.section_name} (${section.section_code})`,
          value: section.section_id,
          sectionData: section,
        }))
        console.log('Showing all sections:', this.sectionOptions.length)
        return
      }

      // Convert both to numbers for proper comparison
      const numericFloorId = parseInt(floorId)
      console.log('Converted floorId to:', numericFloorId)

      const filteredSections = this.allSections.filter((section) => {
        // Try different possible field names for floor_id
        const sectionFloorId = parseInt(section.floor_id || section.floorId || section.floor_number)
        const matches = sectionFloorId === numericFloorId
        console.log(
          `Section ${section.section_name} (floor_id: ${section.floor_id}, floorId: ${section.floorId}, floor_number: ${section.floor_number}) => parsed: ${sectionFloorId}, matches: ${matches}`,
        )
        return matches
      })

      console.log('Filtered sections:', filteredSections.length, 'for floor:', numericFloorId)

      this.sectionOptions = filteredSections.map((section) => ({
        title: `${section.section_name} (${section.section_code})`,
        value: section.section_id,
        sectionData: section,
      }))

      console.log('Final section options:', this.sectionOptions)
    },

    openAddStallModal() {
      this.$emit('open-modal')
    },

    closeModal() {
      this.$emit('close-modal')
      this.resetForm()
    },

    resetForm() {
      this.newStall = {
        stallNumber: '',
        price: '',
        floorId: '',
        sectionId: '',
        size: '',
        location: '',
        description: '',
        image: null,
        isAvailable: true,
        priceType: 'Fixed Price',
      }
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
    },

    showSuccessAnimation(message) {
      this.successMessage = message
      this.popupState = 'loading'
      this.showSuccessPopup = true

      // Transition to success state after loading animation
      setTimeout(() => {
        this.popupState = 'success'

        // Auto close after 2 seconds and trigger refresh
        this.popupTimeout = setTimeout(() => {
          this.closeSuccessPopup()
          this.triggerAutoRefresh() // Added auto-refresh trigger
        }, 2000)
      }, 1500)
    },

    closeSuccessPopup() {
      if (this.popupTimeout) {
        clearTimeout(this.popupTimeout)
        this.popupTimeout = null
      }
      if (this.refreshTimeout) {
        clearTimeout(this.refreshTimeout)
        this.refreshTimeout = null
      }
      this.showSuccessPopup = false
      this.popupState = 'loading'
      this.successMessage = ''
    },

    // NEW METHOD: Auto-refresh functionality
    triggerAutoRefresh() {
      console.log('Triggering auto-refresh after successful stall upload...')

      // Method 1: Emit event to parent component to refresh data
      this.$emit('stall-added')

      // Method 2: If parent component has a refresh method, call it
      if (this.$parent && this.$parent.refreshStalls) {
        this.$parent.refreshStalls()
      }

      // Method 3: If using Vuex store, dispatch refresh action
      if (this.$store && this.$store.dispatch) {
        this.$store.dispatch('refreshStalls').catch((error) => {
          console.warn('Vuex refresh failed:', error)
        })
      }

      // Method 4: Force page reload as fallback (use sparingly)
      // Uncomment the next line if you want to force a full page reload
      // this.refreshTimeout = setTimeout(() => window.location.reload(), 500)

      // Method 5: Router refresh (if using vue-router)
      if (this.$router && this.$route) {
        this.$router.go(0) // This will refresh the current route
      }
    },

    // NEW METHOD: Manual refresh trigger (can be called externally)
    manualRefresh() {
      console.log('Manual refresh triggered')
      this.triggerAutoRefresh()
    },

    async convertImageToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    },

    async submitForm() {
      // Validate form first
      if (!this.$refs.form.validate()) {
        this.$emit('show-message', {
          type: 'error',
          text: 'Please fill in all required fields correctly.',
        })
        return
      }

      this.loading = true

      try {
        // FIXED: Use the field names that the backend expects
        const stallData = {
          stallNumber: this.newStall.stallNumber, // Backend expects 'stallNumber'
          price: parseFloat(this.newStall.price), // Backend expects 'price'
          location: this.newStall.location, // Backend expects 'location'
          size: this.newStall.size, // Send size directly, no dimensions
          floor: this.newStall.floor,
          section: this.newStall.section,
          description: this.newStall.description,
          isAvailable: this.newStall.isAvailable,
          priceType: this.newStall.priceType,
        }

        // Convert image to base64 if uploaded
        if (this.newStall.image) {
          try {
            stallData.image = await this.convertImageToBase64(this.newStall.image)
          } catch (imageError) {
            console.error('Error converting image:', imageError)
            this.$emit('show-message', {
              type: 'warning',
              text: 'Image upload failed, but stall will be created without image.',
            })
          }
        }

        console.log('Sending stall data to backend:', stallData)

        // Get auth token from sessionStorage
        const token = sessionStorage.getItem('authToken')

        if (!token) {
          // FIXED: Corrected the emit call - was missing 'show-message' event name
          this.$emit('show-message', {
            type: 'error',
            text: 'Authentication token not found. Please login again.',
          })
          this.$router.push('/login')
          return
        }

        // Prepare headers
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }

        console.log('Making API request to:', `${this.apiBaseUrl}/api/stalls`)

        // Make API call to backend
        const response = await fetch(`${this.apiBaseUrl}/api/stalls`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(stallData),
        })

        console.log('Response status:', response.status)

        const result = await response.json()
        console.log('Backend response:', result)

        if (!response.ok) {
          if (response.status === 401) {
            this.$emit('show-message', {
              type: 'error',
              text: 'Session expired. Please login again.',
            })
            this.$router.push('/login')
            return
          } else if (response.status === 400) {
            throw new Error(result.message || 'Bad request - check required fields')
          } else if (response.status === 403) {
            throw new Error('Access denied - branch manager authentication required')
          }
          throw new Error(result.message || `HTTP error! status: ${response.status}`)
        }

        if (result.success) {
          // Show success popup animation
          this.showSuccessAnimation(result.message || 'Stall added successfully!')

          // ENHANCED: Additional success actions
          console.log('Stall added successfully, preparing to refresh...')

          // Emit success event with stall data for parent components
          this.$emit('stall-added', result.data || stallData)
        } else {
          throw new Error(result.message || 'Failed to add stall')
        }
      } catch (error) {
        console.error('Error adding stall:', error)
        this.handleSubmissionError(error)
      } finally {
        this.loading = false
      }
    },

    // Handle file input change
    handleImageUpload(file) {
      if (!file) return

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.$emit('show-message', {
          type: 'error',
          text: 'Please select a valid image file.',
        })
        return
      }

      // Validate file size (limit to 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        this.$emit('show-message', {
          type: 'error',
          text: 'Image file must be less than 5MB.',
        })
        return
      }

      this.newStall.image = file
    },

    // Validate price input
    validatePrice() {
      const price = parseFloat(this.newStall.price)
      if (isNaN(price) || price <= 0) {
        return 'Price must be a positive number'
      }
      return true
    },

    // Format stall number preview
    formatStallNumber(value) {
      if (!value) return ''
      return value.startsWith('STALL-') ? value : value
    },

    // Debug helper - check current auth state
    checkAuthState() {
      const token = sessionStorage.getItem('authToken')
      const user = sessionStorage.getItem('currentUser')

      console.log('Auth state check:', {
        tokenExists: !!token,
        tokenLength: token ? token.length : 0,
        userExists: !!user,
        currentUser: user ? JSON.parse(user) : null,
      })
    },

    // Validate stall number format
    validateStallNumber(value) {
      if (!value) return 'Stall number is required'
      if (value.length < 1) return 'Stall number must not be empty'
      return true
    },

    // Validate size format
    validateSize(value) {
      if (!value) return 'Size is required'
      // Allow formats like "3x2m", "3x2", "3 x 2m", etc.
      const sizePattern = /^\d+\s*[x×]\s*\d+\s*m?$/i
      if (!sizePattern.test(value)) {
        return 'Invalid format. Use format like "3x2m" or "3x2"'
      }
      return true
    },

    // Validate location text
    validateLocation(value) {
      if (!value) return 'Location is required'
      if (value.length < 3) return 'Location must be at least 3 characters'
      if (value.length > 100) return 'Location must be less than 100 characters'
      return true
    },

    // Get current user info for debugging
    getCurrentUserInfo() {
      const user = sessionStorage.getItem('currentUser')
      return user ? JSON.parse(user) : null
    },

    // Handle form submission errors
    handleSubmissionError(error) {
      console.error('Form submission error:', error)

      // Clear any existing success popup
      this.closeSuccessPopup()

      let userMessage = 'An error occurred while adding the stall.'

      if (error.message.includes('network') || error.message.includes('fetch')) {
        userMessage = 'Network error. Please check your connection and try again.'
      } else if (error.message.includes('authentication') || error.message.includes('token')) {
        userMessage = 'Session expired. Please login again.'
        // Auto redirect to login after showing message
        setTimeout(() => {
          this.$router.push('/login')
        }, 3000)
      } else if (error.message.includes('already exists')) {
        userMessage =
          'This stall number already exists in your branch. Please use a different number.'
      } else if (error.message) {
        userMessage = error.message
      }

      this.$emit('show-message', {
        type: 'error',
        text: userMessage,
      })
    },
  },

  computed: {
    stallNumberPreview() {
      return this.formatStallNumber(this.newStall.stallNumber)
    },

    formattedPrice() {
      const price = parseFloat(this.newStall.price)
      return isNaN(price) ? '' : `₱${price.toLocaleString()}`
    },

    // Check if all required fields are filled
    isFormValid() {
      return (
        this.newStall.stallNumber &&
        this.newStall.price &&
        this.newStall.location &&
        this.newStall.size &&
        this.newStall.floorId &&
        this.newStall.sectionId
      )
    },

    // Get formatted location for display (now just returns the text value)
    formattedLocation() {
      return this.newStall.location || ''
    },

    // Check if current user is authenticated
    isAuthenticated() {
      const token = sessionStorage.getItem('authToken')
      const user = sessionStorage.getItem('currentUser')
      return !!(token && user)
    },

    // ADDED: Get selected floor name for display
    selectedFloorName() {
      if (!this.newStall.floorId) return ''
      const selectedFloor = this.floorOptions.find((floor) => floor.value === this.newStall.floorId)
      return selectedFloor ? selectedFloor.title : ''
    },

    // ADDED: Get selected section name for display
    selectedSectionName() {
      if (!this.newStall.sectionId) return ''
      const selectedSection = this.sectionOptions.find(
        (section) => section.value === this.newStall.sectionId,
      )
      return selectedSection ? selectedSection.title : ''
    },
  },

  watch: {
    // ADDED: Watch for floor selection to filter sections
    'newStall.floorId'(newFloorId) {
      this.filterSectionsByFloor(newFloorId)
      // Reset section when floor changes
      this.newStall.sectionId = ''
    },

    // Location is now a free text field, so no need for automatic price type setting
    // You can remove this watcher or modify it based on your needs
    'newStall.location'(newLocation) {
      // Optional: Set default price type based on location text
      if (
        newLocation.toLowerCase().includes('auction') ||
        newLocation.toLowerCase().includes('satellite')
      ) {
        this.newStall.priceType = 'Auction'
      } else {
        this.newStall.priceType = 'Fixed Price'
      }
    },

    // Watch for image file changes
    'newStall.image'(newFile) {
      if (newFile) {
        console.log('Image file selected:', newFile.name, newFile.size)
      }
    },

    // Watch for form changes to debug (only in development)
    newStall: {
      handler(newVal) {
        // eslint-disable-next-line no-undef
        if (process.env.NODE_ENV === 'development') {
          console.log('Form data changed:', newVal)
        }
      },
      deep: true,
    },

    // Watch modal visibility - UPDATED with new logic
    showModal(newVal) {
      if (newVal) {
        // Modal opened - check auth state and load data
        if (!this.isAuthenticated) {
          console.warn('Modal opened but user not authenticated')
          this.$emit('show-message', {
            type: 'error',
            text: 'Please login to add stalls.',
          })
          this.$emit('close-modal')
        } else {
          // Load floors and sections when modal opens
          this.loadFloorsAndSections()
        }
      }
    },
  },

  mounted() {
    // Check authentication when component mounts
    this.checkAuthState()

    // Log current user info for debugging
    const userInfo = this.getCurrentUserInfo()
    if (userInfo) {
      console.log('Component mounted - Current user:', userInfo)
    } else {
      console.warn('Component mounted - No user authentication found')
    }

    // Load floors and sections if modal is already open
    if (this.showModal) {
      this.loadFloorsAndSections()
    }
  },

  beforeDestroy() {
    // Clean up timeouts when component is destroyed
    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout)
      this.popupTimeout = null
    }
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout)
      this.refreshTimeout = null
    }
  },

  // Error handling for the component
  errorCaptured(err, instance, info) {
    console.error('AddAvailableStall component error:', err, info)
    this.handleSubmissionError(err)
    return false // Prevent the error from propagating further
  },
}
