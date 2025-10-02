import { eventBus, EVENTS } from '../../../../eventBus.js'

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
        durationHours: 72, // Default 3 days for raffle/auction
      },
      // Price type options
      priceTypeOptions: [
        {
          title: '🏷️ Fixed Price',
          value: 'Fixed Price',
          subtitle: 'Standard monthly rental',
        },
        {
          title: '🎯 Raffle',
          value: 'Raffle',
          subtitle: 'Random winner selection',
        },
        {
          title: '🏺 Auction',
          value: 'Auction',
          subtitle: 'Highest bidder wins',
        },
      ],
      rules: {
        required: (value) => !!value || 'Required field',
        number: (value) => !isNaN(parseFloat(value)) || 'Must be a valid number',
        positiveNumber: (value) => parseFloat(value) > 0 || 'Must be greater than 0',
        durationHours: (value) => {
          // Basic validation - we'll handle conditional logic in the computed property
          const num = parseInt(value)
          return (
            (num && num >= 1 && num <= 720) ||
            'Duration must be between 1-720 hours (1 hour to 30 days)'
          )
        },
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
      lastAddedStall: null, // Store the last added stall data for real-time updates
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
            title: section.section_name, // FIXED: Remove section_code reference
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
          title: section.section_name, // FIXED: Remove section_code reference
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
        // Use floor_id from the updated schema
        const sectionFloorId = parseInt(section.floor_id)
        const matches = sectionFloorId === numericFloorId
        console.log(
          `Section ${section.section_name} (floor_id: ${section.floor_id}, floorId: ${section.floorId}) => parsed: ${sectionFloorId}, matches: ${matches}`,
        )
        return matches
      })

      console.log('Filtered sections:', filteredSections.length, 'for floor:', numericFloorId)

      this.sectionOptions = filteredSections.map((section) => ({
        title: section.section_name, // FIXED: Remove section_code reference
        value: section.section_id,
        sectionData: section,
      }))

      console.log('Final section options:', this.sectionOptions)
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

        // Auto close after 2 seconds and emit stall-added event
        this.popupTimeout = setTimeout(() => {
          this.closeSuccessPopup()

          // Emit local event for parent component
          this.$emit('stall-added', this.lastAddedStall)

          // NEW: Emit global event for real-time sidebar update
          eventBus.emit(EVENTS.STALL_ADDED, {
            stallData: this.lastAddedStall,
            priceType: this.lastAddedStall?.priceType || this.lastAddedStall?.price_type,
            message: 'Stall added successfully',
          })
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

      // Close the add stall modal after success popup closes
      this.closeModal()
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
        // FIXED: Use the correct field names and include floor_id for new schema
        const stallData = {
          stallNumber: this.newStall.stallNumber, // Backend expects 'stallNumber'
          price: parseFloat(this.newStall.price), // Backend expects 'price'
          location: this.newStall.location, // Backend expects 'location'
          size: this.newStall.size, // Send size directly
          floorId: this.newStall.floorId, // FIXED: Send floorId for new schema
          sectionId: this.newStall.sectionId, // FIXED: Send sectionId instead of section
          description: this.newStall.description,
          isAvailable: this.newStall.isAvailable,
          priceType: this.newStall.priceType,
        }

        // Add duration for raffle/auction stalls
        if (this.requiresDuration) {
          stallData.durationHours = parseInt(this.newStall.durationHours)
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
          // Store the stall data for later use
          this.lastAddedStall = result.data || stallData

          // Show success popup animation
          this.showSuccessAnimation(result.message || 'Stall added successfully!')

          // ENHANCED: Additional success actions
          console.log('Stall added successfully - will show real-time update after popup')

          // Do NOT emit immediately - wait for popup to close to avoid double-display
          // The event will be emitted from the popup timeout
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
      const baseValidation =
        this.newStall.stallNumber &&
        this.newStall.price &&
        this.newStall.location &&
        this.newStall.size &&
        this.newStall.floorId &&
        this.newStall.sectionId

      // Additional validation for raffle/auction stalls
      if (this.requiresDuration) {
        return (
          baseValidation &&
          this.newStall.durationHours &&
          parseInt(this.newStall.durationHours) >= 1 &&
          parseInt(this.newStall.durationHours) <= 720
        )
      }

      return baseValidation
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

    // NEW: Check if duration field is required based on price type
    requiresDuration() {
      return this.newStall.priceType === 'Raffle' || this.newStall.priceType === 'Auction'
    },

    // NEW: Dynamic price field label based on price type
    priceFieldLabel() {
      switch (this.newStall.priceType) {
        case 'Raffle':
          return 'Entry Fee (₱)'
        case 'Auction':
          return 'Starting Bid (₱)'
        case 'Fixed Price':
        default:
          return 'Monthly Rent (₱)'
      }
    },

    // NEW: Duration field hint text based on price type
    durationHint() {
      switch (this.newStall.priceType) {
        case 'Raffle':
          return 'How long participants can enter the raffle (1-720 hours)'
        case 'Auction':
          return 'How long bidders can place bids (1-720 hours)'
        default:
          return ''
      }
    },

    // NEW: Dynamic validation rules for duration field
    durationValidationRules() {
      if (!this.requiresDuration) {
        return [] // No validation needed for Fixed Price
      }
      return [
        (value) => !!value || 'Duration is required for raffle/auction stalls',
        (value) => {
          const num = parseInt(value)
          return (
            (num && num >= 1 && num <= 720) ||
            'Duration must be between 1-720 hours (1 hour to 30 days)'
          )
        },
      ]
    },
  },

  watch: {
    // ADDED: Watch for floor selection to filter sections
    'newStall.floorId'(newFloorId) {
      this.filterSectionsByFloor(newFloorId)
      // Reset section when floor changes
      this.newStall.sectionId = ''
    },

    // NEW: Watch for price type changes to debug
    'newStall.priceType'(newValue, oldValue) {
      console.log('Price type changed from', oldValue, 'to', newValue)
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

    // Debug price type options
    console.log('Price type options:', this.priceTypeOptions)
    console.log('Current price type:', this.newStall.priceType)

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
