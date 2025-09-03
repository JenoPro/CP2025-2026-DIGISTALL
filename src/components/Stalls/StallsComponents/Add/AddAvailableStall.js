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
        floor: '',
        section: '',
        dimensions: '',
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
      floorOptions: ['1st Floor', '2nd Floor', '3rd Floor'],
      sectionOptions: [
        'Grocery Section',
        'Meat Section',
        'Fresh Produce',
        'Clothing Section',
        'Electronics Section',
        'Food Court',
      ],
      locationOptions: ["Naga City People's Mall", 'Satellite Market'],
      priceTypeOptions: ['Raffle', 'Auction', 'Fixed Price'],
      loading: false,
      // Success popup states
      showSuccessPopup: false,
      popupState: 'loading', // 'loading' or 'success'
      successMessage: '',
      popupTimeout: null,
      // API base URL - adjust this to match your backend URL
      // eslint-disable-next-line no-undef
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:3001',
    }
  },
  methods: {
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
        floor: '',
        section: '',
        dimensions: '',
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

        // Auto close after 2 seconds
        this.popupTimeout = setTimeout(() => {
          this.closeSuccessPopup()
        }, 2000)
      }, 1500)
    },

    closeSuccessPopup() {
      if (this.popupTimeout) {
        clearTimeout(this.popupTimeout)
        this.popupTimeout = null
      }
      this.showSuccessPopup = false
      this.popupState = 'loading'
      this.successMessage = ''
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
        // Prepare the data to send to backend
        const stallData = {
          stallNumber: `STALL# ${this.newStall.stallNumber.padStart(2, '0')}`,
          price: parseFloat(this.newStall.price),
          floor: this.newStall.floor,
          section: this.newStall.section,
          dimensions: this.newStall.dimensions,
          location: this.newStall.location,
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

        // Get auth token from localStorage (if using authentication)
        const token = localStorage.getItem('authToken')

        // Prepare headers
        const headers = {
          'Content-Type': 'application/json',
        }

        // Add authorization header if token exists
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }

        // Make API call to backend
        const response = await fetch(`${this.apiBaseUrl}/api/stalls`, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(stallData),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message || `HTTP error! status: ${response.status}`)
        }

        if (result.success) {
          // Show success popup animation only - NO alert message emit
          this.showSuccessAnimation(result.message || 'Stall added successfully!')

          // Close modal and refresh stalls without triggering parent alert
          this.closeModal()

          // Emit refresh event to parent component
          this.$emit('refresh-stalls')
        } else {
          throw new Error(result.message || 'Failed to add stall')
        }
      } catch (error) {
        console.error('Error adding stall:', error)

        // Handle specific error types
        let errorMessage = 'Error adding stall. Please try again.'

        if (error.message.includes('already exists')) {
          errorMessage = 'This stall number already exists. Please use a different number.'
        } else if (error.message.includes('Required fields')) {
          errorMessage = 'Please fill in all required fields.'
        } else if (error.message.includes('Failed to connect')) {
          errorMessage = 'Unable to connect to server. Please check your connection.'
        } else if (error.message) {
          errorMessage = error.message
        }

        this.$emit('show-message', {
          type: 'error',
          text: errorMessage,
        })
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
      return `STALL# ${value.padStart(2, '0')}`
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
  },

  watch: {
    // Watch for image file changes
    'newStall.image'(newFile) {
      if (newFile) {
        this.handleImageUpload(newFile)
      }
    },
  },

  beforeDestroy() {
    // Clean up timeout when component is destroyed
    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout)
    }
  },
}
