export default {
  name: 'AddStallholder',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFormValid: false,
      isSubmitting: false,
      formData: {
        fullName: '',
        email: '',
        phoneNumber: '',
        address: ''
      },
      // Validation rules
      nameRules: [
        v => !!v || 'Full name is required',
        v => (v && v.length >= 2) || 'Name must be at least 2 characters'
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+\..+/.test(v) || 'Email must be valid'
      ],
      phoneRules: [
        v => !!v || 'Phone number is required',
        v => /^[0-9+\-\s()]*$/.test(v) || 'Phone number must be valid',
        v => (v && v.length >= 10) || 'Phone number must be at least 10 digits'
      ],
      addressRules: [
        v => !!v || 'Address is required',
        v => (v && v.length >= 5) || 'Address must be at least 5 characters'
      ]
    }
  },
  watch: {
    isVisible(newVal) {
      if (!newVal) {
        this.resetForm()
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },

    resetForm() {
      this.formData = {
        fullName: '',
        email: '',
        phoneNumber: '',
        address: ''
      }
      this.isFormValid = false
      this.isSubmitting = false
      
      // Reset form validation
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
    },

    async submitForm() {
      // Validate form first
      if (!this.$refs.form.validate()) {
        return
      }

      this.isSubmitting = true

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Create stallholder object
        const newStallholder = {
          id: Date.now(), // Temporary ID generation
          fullName: this.formData.fullName.trim(),
          email: this.formData.email.trim().toLowerCase(),
          phoneNumber: this.formData.phoneNumber.trim(),
          address: this.formData.address.trim(),
          status: 'Active',
          dateAdded: new Date().toLocaleDateString(),
          documents: [],
          stallNumber: null,
          businessName: null
        }

        // Emit the new stallholder data to parent
        this.$emit('add-stallholder', newStallholder)

        // Show success message (you can implement a notification system)
        console.log('Stallholder added successfully:', newStallholder)

        // Close modal
        this.closeModal()
        
        // You can also emit a success event for showing notifications
        this.$emit('stallholder-added', {
          success: true,
          message: 'Stallholder added successfully!',
          data: newStallholder
        })

      } catch (error) {
        console.error('Error adding stallholder:', error)
        
        // Emit error event
        this.$emit('stallholder-added', {
          success: false,
          message: 'Failed to add stallholder. Please try again.',
          error: error
        })
      } finally {
        this.isSubmitting = false
      }
    },

    // Helper method to validate individual fields
    validateField(fieldName) {
      const rules = this[`${fieldName}Rules`]
      const value = this.formData[fieldName]
      
      for (let rule of rules) {
        const result = rule(value)
        if (result !== true) {
          return result
        }
      }
      return true
    },

    // Method to pre-fill form data if needed
    setFormData(data) {
      this.formData = { ...this.formData, ...data }
    }
  }
}