import DeleteStall from '../Delete/DeleteStall.vue'

export default {
  name: 'EditStall',
  components: {
    DeleteStall,
  },
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
      editForm: this.getEmptyForm(),
      selectedImageFile: null,
      imagePreview: null,
      showDeleteConfirm: false,
      valid: false,
      loading: false,
      showSuccessPopup: false,
      popupState: 'loading', // 'loading' or 'success'
      successMessage: '',
      popupTimeout: null,
      rules: {
        stallNumber: [
          (v) => !!v || 'Stall number is required',
          (v) => (v && v.length >= 3) || 'Stall number must be at least 3 characters',
        ],
        price: [
          (v) => !!v || 'Price is required',
          (v) => {
            // Allow various price formats: 1500, 1,500, ₱1500, PHP1500, 1500.00, etc.
            const cleanPrice = String(v)
              .replace(/[₱,\s]/g, '')
              .replace(/php/gi, '')
            return (
              (!isNaN(cleanPrice) && parseFloat(cleanPrice) > 0) ||
              'Please enter a valid price (numbers only)'
            )
          },
        ],
        floor: [(v) => !!v || 'Floor is required'],
        section: [(v) => !!v || 'Section is required'],
        dimensions: [
          (v) => !!v || 'Dimensions are required',
          (v) => /^\d+x\d+/i.test(v) || 'Dimensions format should be like "3x3" or "3x3 meters"',
        ],
        location: [(v) => !!v || 'Location is required'],
        description: [
          (v) => !!v || 'Description is required',
          (v) => (v && v.length >= 10) || 'Description must be at least 10 characters',
        ],
      },
      imageRules: [
        (v) => !v || v.size < 5000000 || 'Image size should be less than 5 MB!',
        (v) =>
          !v ||
          ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(v.type) ||
          'Only JPEG, PNG, GIF, and WebP images are allowed!',
      ],
    }
  },
  watch: {
    stallData: {
      handler(newData) {
        if (newData && Object.keys(newData).length) {
          this.populateForm(newData)
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    showSuccessAnimation(message) {
      console.log('✅ Showing success popup:', message)
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

      // Close the main modal after success popup closes
      this.handleClose()
    },

    closeModal() {
      this.resetForm()
      this.$emit('close')
    },

    getEmptyForm() {
      return {
        id: null,
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
    },

    populateForm(data) {
      console.log('Populating form with data:', data)

      // Map the data fields properly
      this.editForm = {
        id: data.id || data.ID,
        stallNumber: data.stallNumber || data.stall_number || '',
        price: this.extractNumericPrice(data.price) || '',
        floor: data.floor || '',
        section: data.section || '',
        dimensions: data.dimensions || '',
        location: data.location || '',
        description: data.description || '',
        image: data.image || data.image_data || null,
        isAvailable:
          data.isAvailable !== undefined
            ? data.isAvailable
            : data.is_available !== undefined
              ? data.is_available
              : true,
        priceType: data.priceType || data.price_type || 'Fixed Price',
      }

      // Set image preview if there's existing image data
      if (this.editForm.image) {
        this.imagePreview = this.editForm.image
      }

      this.selectedImageFile = null

      console.log('Form populated:', this.editForm)
    },

    // Extract numeric price from formatted price string
    extractNumericPrice(priceString) {
      if (!priceString) return ''

      // Remove currency symbols, commas, and extract just the number
      const numericPart = String(priceString)
        .replace(/[₱,\s]/g, '')
        .replace(/php/gi, '')
        .replace(/\/.*$/i, '') // Remove everything after "/" (like "/ Fixed Price")
        .trim()

      return numericPart
    },

    async handleSave() {
      this.loading = true

      try {
        console.log('Saving stall with form data:', this.editForm)

        // Basic field validation - check for required fields
        const requiredFields = {
          stallNumber: 'Stall number',
          price: 'Price',
          floor: 'Floor',
          section: 'Section',
          location: 'Location',
          description: 'Description',
        }

        const missingFields = []
        for (const [field, label] of Object.entries(requiredFields)) {
          if (!this.editForm[field] || String(this.editForm[field]).trim() === '') {
            missingFields.push(label)
          }
        }

        if (missingFields.length > 0) {
          this.$emit(
            'error',
            `Please fill in the following required fields: ${missingFields.join(', ')}`,
          )
          return
        }

        // Validate dimensions format
        if (this.editForm.dimensions && !/^\d+x\d+/i.test(this.editForm.dimensions)) {
          this.$emit('error', 'Dimensions format should be like "3x3" or "3x3 meters"')
          return
        }

        // Handle image upload if new image is selected
        let imageData = this.editForm.image
        if (this.selectedImageFile) {
          // Validate image file
          if (this.selectedImageFile.size > 5000000) {
            this.$emit('error', 'Image size should be less than 5 MB!')
            return
          }

          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
          if (!allowedTypes.includes(this.selectedImageFile.type)) {
            this.$emit('error', 'Only JPEG, PNG, GIF, and WebP images are allowed!')
            return
          }

          imageData = await this.processImageFile(this.selectedImageFile)
        }

        // Clean and validate price
        const cleanPrice = String(this.editForm.price)
          .replace(/[₱,\s]/g, '')
          .replace(/php/gi, '')
          .trim()

        const numericPrice = parseFloat(cleanPrice)

        if (isNaN(numericPrice) || numericPrice <= 0) {
          this.$emit('error', 'Please enter a valid price (numbers only)')
          return
        }

        // Prepare update data with correct field names for backend
        const updateData = {
          stall_number: this.editForm.stallNumber.trim(),
          price: numericPrice,
          floor: this.editForm.floor,
          section: this.editForm.section,
          dimensions: this.editForm.dimensions ? this.editForm.dimensions.trim() : null,
          location: this.editForm.location,
          description: this.editForm.description.trim(),
          image_data: imageData,
          is_available: this.editForm.isAvailable,
          price_type: this.editForm.priceType,
        }

        console.log('Sending update data to API:', updateData)

        // Make API call to update stall
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'
        const response = await fetch(`${backendUrl}/api/stalls/${this.editForm.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if you have authentication
            ...(localStorage.getItem('authToken') && {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }),
          },
          body: JSON.stringify(updateData),
        })

        const result = await response.json().catch(() => {
          // If JSON parsing fails, return a generic error object
          return {
            success: false,
            message: response.statusText || 'Server error',
          }
        })
        console.log('API Response:', result)

        if (!response.ok) {
          throw new Error(result.message || `Server error: ${response.status}`)
        }

        if (result.success && result.data) {
          console.log('Stall update successful')

          // Transform the response data back to frontend format
          const transformedData = this.transformBackendData(result.data)

          // Show success animation with backend message or fallback
          const successMessage = result.message || 'Stall updated successfully'
          this.showSuccessAnimation(successMessage)

          // Emit the updated data to parent (no need to close modal here - let popup handle it)
          this.$emit('stall-updated', transformedData)
        } else {
          throw new Error(result.message || 'Failed to update stall')
        }
      } catch (error) {
        console.error('Update stall error:', error)
        this.$emit('error', error.message || 'Failed to update stall. Please try again.')
      } finally {
        this.loading = false
      }
    },

    // Transform backend response data to frontend format
    transformBackendData(stallData) {
      return {
        id: stallData.ID || stallData.id,
        stallNumber: stallData.stall_number,
        price: this.formatPrice(stallData.price, stallData.price_type),
        floor: stallData.floor,
        section: stallData.section,
        dimensions: stallData.dimensions,
        location: stallData.location,
        description: stallData.description,
        image: stallData.image_data || stallData.image,
        isAvailable: stallData.is_available,
        priceType: stallData.price_type,
        status: stallData.status,
        createdAt: stallData.created_at,
        updatedAt: stallData.updated_at,
        createdByName: stallData.created_by_name,
        updatedByName: stallData.updated_by_name,
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

    handleStallDeleted(event) {
      console.log('✅ Stall deleted successfully:', event)

      // Emit the delete event to parent component
      this.$emit('stall-deleted', event.stallId)

      // Close the edit modal
      this.handleClose()
    },

    handleDeleteError(error) {
      console.error('❌ Delete error:', error)

      // Emit error to parent component
      this.$emit('error', error.message || 'Failed to delete stall')

      // Close delete dialog
      this.showDeleteConfirm = false
    },

    handleClose() {
      this.resetForm()
      this.$emit('close')
    },

    resetForm() {
      this.editForm = this.getEmptyForm()
      this.selectedImageFile = null
      this.imagePreview = null
      this.showDeleteConfirm = false
      if (this.$refs.editForm) this.$refs.editForm.resetValidation()
    },

    handleImageUpload(event) {
      const file = event.target.files?.[0] || event
      if (!file) return

      console.log('Processing image file:', file.name, file.size, file.type)

      if (file.size > 5000000) {
        this.$emit('error', 'Image size should be less than 5 MB!')
        return
      }

      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        this.$emit('error', 'Only JPEG, PNG, GIF, and WebP images are allowed!')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagePreview = e.target.result
        console.log('Image preview set')
      }
      reader.onerror = () => {
        this.$emit('error', 'Failed to read image file')
      }
      reader.readAsDataURL(file)
      this.selectedImageFile = file
    },

    removeImage() {
      this.selectedImageFile = null
      this.imagePreview = null
      this.editForm.image = null
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ''
      console.log('Image removed')
    },

    async processImageFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          console.log('Image file processed successfully')
          resolve(e.target.result)
        }
        reader.onerror = () => {
          console.error('Failed to process image file')
          reject(new Error('Failed to read image file'))
        }
        reader.readAsDataURL(file)
      })
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
    },

    handleDelete() {
      this.showDeleteConfirm = true
    },

    cancelDelete() {
      this.showDeleteConfirm = false
    },

    getFloorOptions() {
      return ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor']
    },

    getSectionOptions() {
      return [
        'Grocery Section',
        'Meat Section',
        'Fresh Produce',
        'Dry Goods',
        'Clothing Section',
        'Electronics Section',
        'Food Court',
      ]
    },

    getLocationOptions() {
      return ["Naga City People's Mall", 'Satellite Market']
    },

    getPriceTypeOptions() {
      return ['Fixed Price', 'Auction', 'Raffle']
    },

    // Helper method to format price input (optional - for better UX)
    formatPriceInput(event) {
      let value = event.target.value
      // Remove non-numeric characters except decimal point
      value = value.replace(/[^0-9.]/g, '')

      // Ensure only one decimal point
      const parts = value.split('.')
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('')
      }

      this.editForm.price = value
    },
  },

  beforeDestroy() {
    // Clean up timeout when component is destroyed
    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout)
    }
  },
}
