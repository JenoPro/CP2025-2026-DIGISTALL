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
      valid: false, // this will tracks the form validation state
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
        priceType: '',
      },
      rules: {
        required: (value) => !!value || 'Required field',
        number: (value) => !isNaN(value) || 'Must be a number',
        priceNumber: (value) => {
          const numericValue = value.replace(/[^\d]/g, '')
          return numericValue && !isNaN(numericValue) || 'Price must contain a valid number'
        },
      },
      floorOptions: ['1st Floor', '2nd Floor', '3rd Floor', '4th Floor'],
      sectionOptions: [
        'Grocery Section',
        'Meat Section',
        'Fresh Produce',
        'Clothing Section',
        'Electronics Section',
        'Food Court',
        'Dry Goods',
        'Household Items',
        'Accessories',
        'Any Other',
      ],
      locationOptions: ["Naga City People's Mall", 'Satellite Market'],
      priceTypeOptions: ['Raffle', 'Auction'],
      loading: false,
      stallsList: [], // Array to store stalls locally
    }
  },
  watch: {
    'newStall.location'(newLocation) {
      if (newLocation === 'Satellite Market') {
        this.newStall.priceType = 'Auction'
      } else if (newLocation === "Naga City People's Mall") {
        this.newStall.priceType = 'Raffle'
      } else {
        this.newStall.priceType = ''
      }
    },
  },
  mounted() {
    // Load existing stalls from localStorage
    this.loadStalls()
  },
  methods: {
    loadStalls() {
      const savedStalls = localStorage.getItem('stallsData')
      if (savedStalls) {
        try {
          this.stallsList = JSON.parse(savedStalls)
        } catch (error) {
          console.error('Error loading stalls from localStorage:', error)
          this.stallsList = []
        }
      } else {
        this.stallsList = []
      }
    },
    saveStalls() {
      try {
        localStorage.setItem('stallsData', JSON.stringify(this.stallsList))
      } catch (error) {
        console.error('Error saving stalls to localStorage:', error)
      }
    },
    openAddStallModal() {
      this.$emit('open-modal')
    },
    closeModal() {
      this.$emit('close-modal')
      this.resetForm()
    },
    resetForm() {
      this.valid = false // Reset validation state
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
        priceType: '',
      }
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
    },
    async submitForm() {
      if (!this.$refs.form.validate()) return

      this.loading = true
      try {
        const newId = Date.now()
        
        // Format the price with the price type
        const formattedPrice = `${this.newStall.price} Php / ${this.newStall.priceType}`
        
        const stallToAdd = {
          ...this.newStall,
          id: newId,
          stallNumber: `STALL# ${this.newStall.stallNumber.padStart(2, '0')}`,
          price: formattedPrice, // Use the formatted price
        }
        
        // Add to local storage
        this.stallsList.push(stallToAdd)
        this.saveStalls()
        
        this.$emit('stall-added', stallToAdd)
        this.$emit('show-message', {
          type: 'success',
          text: 'Stall added successfully!',
        })
        this.closeModal()
      } catch (error) {
        console.error('Error adding stall:', error)
        this.$emit('show-message', {
          type: 'error',
          text: 'Error adding stall. Please try again.',
        })
      } finally {
        this.loading = false
      }
    },
    handleImageUpload(file) {
      if (!file) return
      const reader = new FileReader()
      reader.onload = (e) => {
        this.newStall.image = e.target.result
      }
      reader.readAsDataURL(file)
    },
    getAllStalls() {
      return this.stallsList
    },
    getStallById(id) {
      return this.stallsList.find(stall => stall.id === id)
    },
    updateStall(id, updatedData) {
      const index = this.stallsList.findIndex(stall => stall.id === id)
      if (index !== -1) {
        this.stallsList[index] = { ...this.stallsList[index], ...updatedData }
        this.saveStalls()
        return true
      }
      return false
    },
    deleteStall(id) {
      const index = this.stallsList.findIndex(stall => stall.id === id)
      if (index !== -1) {
        this.stallsList.splice(index, 1)
        this.saveStalls()
        return true
      }
      return false
    },
  },
}
