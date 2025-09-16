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
        size: [
          (v) => !!v || 'Size is required',
          (v) => /^\d+x\d+/i.test(v) || 'Size format should be like "3x3" or "3x3 meters"',
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
      // API base URL
      // eslint-disable-next-line no-undef
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:3001',
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

      // Auto-refresh the page after modal closes
      this.$nextTick(() => {
        console.log('🔄 Auto-refreshing page after successful update...')
        setTimeout(() => {
          window.location.reload()
        }, 500) // Small delay to ensure modal closes smoothly
      })
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
        size: '',
        location: '',
        description: '',
        image: null,
        isAvailable: true,
        priceType: 'Fixed Price',
      }
    },

    populateForm(data) {
      console.log('Populating form with data:', data)

      this.editForm = {
        id: data.stall_id || data.ID || data.id,
        stallNumber: data.stall_no || data.stallNumber || '',
        price: this.extractNumericPrice(data.rental_price || data.price) || '',
        floor: data.floor || '',
        section: data.section || '',
        size: data.size || data.dimensions || '',
        location: data.stall_location || data.location || '',
        description: data.description || '',
        image: data.stall_image || data.image || null,
        isAvailable: data.status === 'Active' || data.isAvailable === true,
        priceType: data.price_type || data.priceType || 'Fixed Price',
      }

      if (this.editForm.image) {
        this.imagePreview = this.editForm.image
      }

      this.selectedImageFile = null
      console.log('Form populated:', this.editForm)
    },

    extractNumericPrice(priceString) {
      if (!priceString) return ''

      const numericPart = String(priceString)
        .replace(/[₱,\s]/g, '')
        .replace(/php/gi, '')
        .replace(/\/.*$/i, '')
        .trim()

      return numericPart
    },

    async handleSave() {
      this.loading = true

      try {
        console.log('Saving stall with form data:', this.editForm)

        // Basic field validation
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
          console.error(`Missing fields: ${missingFields.join(', ')}`)
          return
        }

        // Validate size format
        if (this.editForm.size && !/^\d+x\d+/i.test(this.editForm.size)) {
          console.error('Invalid size format')
          return
        }

        // Handle image upload if new image is selected
        let imageData = this.editForm.image
        if (this.selectedImageFile) {
          if (this.selectedImageFile.size > 5000000) {
            console.error('Image size too large')
            return
          }

          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
          if (!allowedTypes.includes(this.selectedImageFile.type)) {
            console.error('Invalid image type')
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
          console.error('Invalid price')
          return
        }

        const updateData = {
          stallNumber: this.editForm.stallNumber.trim(),
          price: numericPrice,
          floor: this.editForm.floor,
          section: this.editForm.section,
          size: this.editForm.size ? this.editForm.size.trim() : null, // Use size instead of dimensions
          location: this.editForm.location,
          description: this.editForm.description.trim(),
          image: imageData,
          isAvailable: this.editForm.isAvailable,
          priceType: this.editForm.priceType,
        }

        console.log('Sending update data to API:', updateData)

        const token = sessionStorage.getItem('authToken')

        if (!token) {
          console.error('No auth token found')
          this.$router.push('/login')
          return
        }

        const response = await fetch(`${this.apiBaseUrl}/api/stalls/${this.editForm.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        })

        const result = await response.json().catch(() => {
          return {
            success: false,
            message: response.statusText || 'Server error',
          }
        })
        console.log('API Response:', result)

        if (!response.ok) {
          if (response.status === 401) {
            console.error('Session expired')
            this.$router.push('/login')
            return
          } else if (response.status === 403) {
            throw new Error('Access denied - you do not have permission to update this stall')
          } else if (response.status === 404) {
            throw new Error('Stall not found or you do not have permission to update it')
          }
          throw new Error(result.message || `Server error: ${response.status}`)
        }

        if (result.success && result.data) {
          // Show success animation with backend message or fallback
          const successMessage = result.message || 'Stall updated successfully!'
          this.showSuccessAnimation(successMessage)

          const transformedData = this.transformBackendData(result.data)

          // Emit stall-updated event with correct parameters
          this.$emit('stall-updated', transformedData)
        } else {
          throw new Error(result.message || 'Failed to update stall')
        }
      } catch (error) {
        console.error('Update stall error:', error)
        // Only log errors, no user-facing messages
      } finally {
        this.loading = false
      }
    },
    transformBackendData(stallData) {
      const transformed = {
        id: stallData.stall_id || stallData.ID || stallData.id,
        stallNumber: stallData.stall_no || stallData.stallNumber,
        price: this.formatPrice(
          stallData.rental_price || stallData.price,
          stallData.price_type || stallData.priceType,
        ),
        floor: stallData.floor,
        section: stallData.section,
        size: stallData.size, // Only use size, no dimensions
        location: stallData.stall_location || stallData.location,
        description: stallData.description,
        image: stallData.stall_image || stallData.image,
        isAvailable: stallData.status === 'Active',
        priceType: stallData.price_type || stallData.priceType,
        status: stallData.status,
        createdAt: stallData.created_at,
        updatedAt: stallData.updated_at,
        manager_first_name: stallData.manager_first_name,
        manager_last_name: stallData.manager_last_name,
        area: stallData.area,
        branch_location: stallData.branch_location,
      }

      return transformed
    },

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
      this.$emit('stall-deleted', event.stallId)
      this.handleClose()
    },

    handleDeleteError(error) {
      console.error('❌ Delete error:', error)
      this.$emit('stall-deleted-error', error)
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
        console.error('Image size too large')
        return
      }

      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        console.error('Invalid image type')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        this.imagePreview = e.target.result
        console.log('Image preview set')
      }
      reader.onerror = () => {
        console.error('Failed to read image file')
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
      return ['1st Floor', '2nd Floor', '3rd Floor']
    },

    getSectionOptions() {
      return [
        'Grocery Section',
        'Meat Section',
        'Fresh Produce',
        'Clothing Section',
        'Electronics Section',
        'Food Court',
        'General Section',
      ]
    },

    getPriceTypeOptions() {
      return ['Fixed Price', 'Auction', 'Raffle']
    },

    formatPriceInput(event) {
      let value = event.target.value
      value = value.replace(/[^0-9.]/g, '')

      const parts = value.split('.')
      if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('')
      }

      this.editForm.price = value
    },
  },

  beforeDestroy() {
    if (this.popupTimeout) {
      clearTimeout(this.popupTimeout)
    }
  },
}
