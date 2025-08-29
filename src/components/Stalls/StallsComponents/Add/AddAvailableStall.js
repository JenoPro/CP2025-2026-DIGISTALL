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
      },
      rules: {
        required: (value) => !!value || 'Required field',
        number: (value) => !isNaN(value) || 'Must be a number',
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
        const stallToAdd = {
          ...this.newStall,
          id: newId,
          stallNumber: `STALL# ${this.newStall.stallNumber.padStart(2, '0')}`,
        }
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
  },
}
