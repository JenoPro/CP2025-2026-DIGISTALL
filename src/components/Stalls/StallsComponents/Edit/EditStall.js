export default {
  name: 'EditStall',
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
      deleteLoading: false,
      valid: false,
      loading: false,
      rules: {
        stallNumber: [
          (v) => !!v || 'Stall number is required',
          (v) => v.length >= 3 || 'Stall number must be at least 3 characters',
        ],
        price: [
          (v) => !!v || 'Price is required',
          (v) =>
            /^\d+(\.\d{1,2})?\s*(Php|PHP)/.test(v) || 'Price format should be like "1,500 Php"',
        ],
        floor: [(v) => !!v || 'Floor is required'],
        section: [(v) => !!v || 'Section is required'],
        dimensions: [
          (v) => !!v || 'Dimensions are required',
          (v) => /^\d+x\d+/.test(v) || 'Dimensions format should be like "3x3 meters"',
        ],
        location: [(v) => !!v || 'Location is required'],
        description: [
          (v) => !!v || 'Description is required',
          (v) => v.length >= 10 || 'Description must be at least 10 characters',
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
      }
    },

    populateForm(data) {
      this.editForm = { ...this.getEmptyForm(), ...data }
      this.selectedImageFile = null
      this.imagePreview = null
    },

    // wag nyo pakealaman gagamitin koto soon pag may db na.
    // async handleSave() {
    //   if (!this.$refs.editForm.validate()) return

    //   this.loading = true
    //   try {
    //     if (this.selectedImageFile) {
    //       const uploadedImage = await this.uploadImage(this.selectedImageFile)
    //       this.editForm.image = uploadedImage
    //     }
    //     await new Promise((r) => setTimeout(r, 1000)) // simulate API
    //     this.$emit('stall-updated', { ...this.editForm })
    //     this.handleClose()
    //   } catch (err) {
    //     console.error(err)
    //     this.$emit('error', 'Failed to update stall. Please try again.')
    //   } finally {
    //     this.loading = false
    //   }
    // },

    handleSave() {
      if (!this.$refs.editForm.validate()) {
        this.$emit('error', 'Please fill in all required fields correctly.')
        return
      }

      // Emit updated stall data
      this.$emit('stall-updated', { ...this.editForm })

      // Close the modal
      this.handleClose()
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

      if (file.size > 5000000) return this.$emit('error', 'Image size should be less than 5 MB!')
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type))
        return this.$emit('error', 'Only JPEG, PNG, GIF, and WebP images are allowed!')

      const reader = new FileReader()
      reader.onload = (e) => (this.imagePreview = e.target.result)
      reader.readAsDataURL(file)
      this.selectedImageFile = file
    },

    removeImage() {
      this.selectedImageFile = null
      this.imagePreview = null
      const fileInput = document.querySelector('input[type="file"]')
      if (fileInput) fileInput.value = ''
    },

    async uploadImage(file) {
      console.log('Uploading image:', file.name)
      await new Promise((r) => setTimeout(r, 2000)) // simulate upload
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
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

    async confirmDelete() {
      this.deleteLoading = true
      try {
        await new Promise((r) => setTimeout(r, 1000))
        this.$emit('stall-deleted', this.editForm.id)
        this.handleClose()
      } catch (err) {
        console.error(err)
        this.$emit('error', 'Failed to delete stall. Please try again.')
      } finally {
        this.deleteLoading = false
      }
    },

    cancelDelete() {
      this.showDeleteConfirm = false
    },

    getFloorOptions() {
      return ['1st Floor', '2nd Floor', '3rd Floor', 'Ground Floor']
    },

    getSectionOptions() {
      return [
        'Grocery Section',
        'Meat Section',
        'Fresh Produce',
        'Dry Goods',
        'Clothing Section',
        'Electronics Section',
      ]
    },

    getLocationOptions() {
      return ["Naga City People's Mall", 'Satellite Market']
    },
  },
}
