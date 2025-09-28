export default {
  name: 'AddFloorSection',
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeTab: 'floor',
      floorFormValid: false,
      sectionFormValid: false,
      loading: false,
      newFloor: {
        floorNumber: '',
        floorName: '',
        status: 'Active',
      },

      // Section data
      newSection: {
        floorId: null,
        sectionName: '',
        status: 'Active',
      },

      // Form validation rules
      rules: {
        required: (value) => !!value || 'Required field',
        floorNumber: (value) => {
          if (!value) return 'Required field'
          return /^[0-9A-Za-z]{1,3}$/.test(value) || 'Must be 1-3 characters (letters/numbers)'
        },
      },

      // Options for dropdowns
      floorOptions: [],
      statusOptions: [
        { value: 'Active', title: 'Active' },
        { value: 'Inactive', title: 'Inactive' },
        { value: 'Maintenance', title: 'Under Maintenance' },
        { value: 'Closed', title: 'Closed' },
      ],
      // API base URL
      apiBaseUrl: 'http://localhost:3001',

      // Success popup state
      showSuccessPopup: false,
      successMessage: '',
      successType: '', // 'floor' or 'section'
      popupState: 'success', // 'loading' or 'success'
    }
  },

  watch: {
    showModal(newVal) {
      if (newVal) {
        this.loadFloors()
        this.resetForms()
      }
    },
  },

  methods: {
    // Load floors for section dropdown (silent loading)
    async loadFloors() {
      try {
        const token = sessionStorage.getItem('authToken')
        // Use only the correct endpoint for floors
        const endpoint = `${this.apiBaseUrl}/api/floors`
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        if (!response.ok) {
          this.floorOptions = []
          return
        }
        const result = await response.json()
        // Support both array and object response
        const floors = Array.isArray(result) ? result : result.data || []
        this.floorOptions = Array.isArray(floors)
          ? floors.map((floor) => ({
              value: floor.floor_id,
              title: `${floor.floor_name} (${floor.floor_number})`,
            }))
          : []
      } catch (error) {
        console.error('Error loading floors:', error)
        this.floorOptions = []
      }
    },

    // Submit floor form
    async submitFloor() {
      if (!this.floorFormValid) return

      this.loading = true

      try {
        const token = sessionStorage.getItem('authToken')
        // Use only the correct endpoint for floors
        const endpoint = `${this.apiBaseUrl}/api/floors`
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            floor_number: this.newFloor.floorNumber,
            floor_name: this.newFloor.floorName,
            status: this.newFloor.status,
          }),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }
        const result = await response.json()

        // Show success popup with loading and success states
        this.popupState = 'loading'
        this.showSuccessPopup = true

        // Simulate loading then show success
        setTimeout(() => {
          this.successMessage = `Floor "${this.newFloor.floorName}" added successfully!`
          this.successType = 'floor'
          this.popupState = 'success'

          // Auto-close after 3 seconds
          setTimeout(() => {
            this.closeSuccessPopup()
          }, 3000)
        }, 800)

        this.resetFloorForm()
        await this.loadFloors()
        this.$emit('floor-added', result)
        this.$emit('refresh-data')
      } catch (error) {
        console.error('Error adding floor:', error)
        console.warn('Floor addition failed:', error.message || 'Unknown error')
      } finally {
        this.loading = false
      }
    },

    // Submit section form
    async submitSection() {
      if (!this.sectionFormValid) return
      this.loading = true
      try {
        const token = sessionStorage.getItem('authToken')
        // Use only the correct endpoint for sections
        const endpoint = `${this.apiBaseUrl}/api/sections`
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            floor_id: this.newSection.floorId,
            section_name: this.newSection.sectionName,
            status: this.newSection.status,
          }),
        })
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }
        const result = await response.json()

        // Show success popup with loading and success states
        this.popupState = 'loading'
        this.showSuccessPopup = true

        // Simulate loading then show success
        setTimeout(() => {
          this.successMessage = `Section "${this.newSection.sectionName}" added successfully!`
          this.successType = 'section'
          this.popupState = 'success'

          // Auto-close after 3 seconds
          setTimeout(() => {
            this.closeSuccessPopup()
          }, 3000)
        }, 800)

        this.resetSectionForm()
        this.$emit('section-added', result)
        this.$emit('refresh-data')
      } catch (error) {
        console.error('Error adding section:', error)
        console.warn('Section addition failed:', error.message || 'Unknown error')
      } finally {
        this.loading = false
      }
    },

    // Reset forms
    resetForms() {
      this.resetFloorForm()
      this.resetSectionForm()
      this.activeTab = 'floor'
    },

    resetFloorForm() {
      this.newFloor = {
        floorNumber: '',
        floorName: '',
        status: 'Active',
      }
      this.floorFormValid = false
      if (this.$refs.floorForm) {
        this.$refs.floorForm.resetValidation()
      }
    },

    resetSectionForm() {
      this.newSection = {
        floorId: null,
        sectionName: '',
        status: 'Active',
      }
      this.sectionFormValid = false
      if (this.$refs.sectionForm) {
        this.$refs.sectionForm.resetValidation()
      }
    },

    // Modal controls
    closeModal() {
      this.$emit('close-modal')
      this.resetForms()
    },

    // Success popup controls
    closeSuccessPopup() {
      this.showSuccessPopup = false
      this.successMessage = ''
      this.successType = ''
      this.popupState = 'success'
      // Also close the main modal
      this.closeModal()
    },
  },
}
