import axios from 'axios'

export default {
  name: 'RegisterModal',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'admin-registered'],
  data() {
    return {
      dialog: this.modelValue,
      valid: false,
      loading: false,
      loadingCities: false,
      loadingBranches: false,
      showNewCityInput: false,
      showNewBranchInput: false,

      // Form fields
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      selectedCity: '',
      selectedBranch: '',
      newCityName: '',
      newBranchName: '',
      role: 'admin',

      // Password visibility
      showPassword: false,
      showConfirmPassword: false,

      // Available options
      availableCities: [],
      availableBranches: [],
      allAreas: [], // Store all areas to filter by city
      roleOptions: [{ title: 'Admin', value: 'admin' }],

      // Messages
      errorMessage: '',
      successMessage: '',

      // Validation rules
      nameRules: [
        (v) => !!v || 'This field is required',
        (v) => (v && v.length >= 2) || 'Must be at least 2 characters',
        (v) => /^[a-zA-Z\s]+$/.test(v) || 'Only letters and spaces allowed',
      ],
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
      ],
      usernameRules: [
        (v) => !!v || 'Username is required',
        (v) => (v && v.length >= 3) || 'Username must be at least 3 characters',
        (v) => /^[a-zA-Z0-9_]+$/.test(v) || 'Only letters, numbers, and underscores allowed',
      ],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 8) || 'Password must be at least 8 characters',
        (v) => /(?=.*[a-z])/.test(v) || 'Must contain at least one lowercase letter',
        (v) => /(?=.*[A-Z])/.test(v) || 'Must contain at least one uppercase letter',
        (v) => /(?=.*\d)/.test(v) || 'Must contain at least one number',
      ],
      cityRules: [(v) => !!v || 'City selection is required'],
      branchRules: [(v) => !!v || 'Branch selection is required'],
      newCityRules: [
        (v) => !this.showNewCityInput || !!v || 'New city name is required',
        (v) =>
          !this.showNewCityInput ||
          (v && v.length >= 3) ||
          'City name must be at least 3 characters',
      ],
      newBranchRules: [
        (v) => !this.showNewBranchInput || !!v || 'New branch name is required',
        (v) =>
          !this.showNewBranchInput ||
          (v && v.length >= 3) ||
          'Branch name must be at least 3 characters',
      ],
      roleRules: [(v) => !!v || 'Role selection is required'],
    }
  },
  computed: {
    confirmPasswordRules() {
      return [
        (v) => !!v || 'Password confirmation is required',
        (v) => v === this.password || 'Passwords do not match',
      ]
    },
  },
  watch: {
    modelValue(newVal) {
      this.dialog = newVal
    },
    dialog(newVal) {
      this.$emit('update:modelValue', newVal)
      if (newVal) {
        this.fetchAreas()
      }
    },
  },
  methods: {
    async handleRegister() {
      // Clear any previous messages
      this.clearError()
      this.clearSuccess()

      // Validate form
      const { valid } = await this.$refs.registerForm.validate()
      if (!valid) {
        this.showErrorMessage('Please fill in all required fields correctly.')
        return
      }

      // Check if passwords match
      if (this.password !== this.confirmPassword) {
        this.showErrorMessage('Passwords do not match.')
        return
      }

      // Handle new city creation
      let cityToUse = this.selectedCity
      if (this.showNewCityInput && this.newCityName.trim()) {
        cityToUse = this.newCityName.trim()
      }

      // Handle new branch creation
      let branchToUse = this.selectedBranch
      if (this.showNewBranchInput && this.newBranchName.trim()) {
        branchToUse = this.newBranchName.trim()
      }

      // Find area_id for the selected city and branch
      let areaId = null
      const existingArea = this.allAreas.find(
        (area) => area.city === cityToUse && area.branch === branchToUse,
      )
      if (existingArea) {
        areaId = existingArea.ID
      }

      this.loading = true

      try {
        const registrationData = {
          username: this.username.trim(),
          password: this.password,
          email: this.email.trim(),
          firstName: this.firstName.trim(),
          lastName: this.lastName.trim(),
          city: cityToUse,
          branch: branchToUse,
          area_id: areaId,
          role: this.role,
        }

        const response = await axios.post(
          'http://localhost:3001/api/admin/create-user',
          registrationData,
        )

        if (response.data.success) {
          this.showSuccessMessage(`Admin "${this.username}" has been successfully registered!`)

          // Emit event to parent component
          this.$emit('admin-registered', response.data.data)

          // Reset form after successful registration
          setTimeout(() => {
            this.resetForm()
            this.closeModal()
          }, 2000)
        }
      } catch (error) {
        if (error.response) {
          const { status, data } = error.response

          if (status === 409) {
            this.showErrorMessage('Username already exists. Please choose a different username.')
          } else if (status === 400) {
            this.showErrorMessage(data.message || 'Please check your input and try again.')
          } else if (status >= 500) {
            this.showErrorMessage('Server error. Please try again later.')
          } else {
            this.showErrorMessage(data.message || 'Registration failed. Please try again.')
          }
        } else if (error.request) {
          this.showErrorMessage(
            'Unable to connect to server. Please check your internet connection.',
          )
        } else {
          this.showErrorMessage('An unexpected error occurred. Please try again.')
        }

        console.error('Registration failed:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchAreas() {
      this.loadingCities = true
      try {
        const response = await axios.get('http://localhost:3001/api/areas')
        if (response.data.success) {
          this.allAreas = response.data.data

          // Extract unique cities for the city dropdown
          const uniqueCities = [...new Set(this.allAreas.map((area) => area.city))]
          this.availableCities = uniqueCities.sort()

          console.log('Areas loaded for registration:', this.allAreas)
          console.log('Cities loaded for registration:', this.availableCities)
        }
      } catch (error) {
        console.error('Failed to fetch areas:', error)
        this.showErrorMessage('Failed to load available cities and branches.')
      } finally {
        this.loadingCities = false
      }
    },

    onCityChange() {
      // Clear branch selection when city changes
      this.selectedBranch = ''

      // Filter branches based on selected city
      if (this.selectedCity) {
        const cityAreas = this.allAreas.filter((area) => area.city === this.selectedCity)
        this.availableBranches = cityAreas.map((area) => area.branch).sort()
      } else {
        this.availableBranches = []
      }

      console.log('City changed to:', this.selectedCity)
      console.log('Available branches for registration:', this.availableBranches)
    },

    addNewCity() {
      if (this.newCityName.trim()) {
        const newCity = this.newCityName.trim()
        if (!this.availableCities.includes(newCity)) {
          this.availableCities.push(newCity)
          this.availableCities.sort()
          this.selectedCity = newCity
          // Clear branches when new city is added
          this.availableBranches = []
          this.selectedBranch = ''
        }
        this.showNewCityInput = false
        this.newCityName = ''
      }
    },

    async fetchBranches() {
      // This method is now handled by fetchAreas and onCityChange
      // Keeping for backward compatibility but will be deprecated
      console.log('fetchBranches called - now handled by fetchAreas')
    },

    addNewBranch() {
      if (this.newBranchName.trim() && this.selectedCity) {
        const newBranch = this.newBranchName.trim()
        if (!this.availableBranches.includes(newBranch)) {
          this.availableBranches.push(newBranch)
          this.availableBranches.sort()
          this.selectedBranch = newBranch
        }
        this.showNewBranchInput = false
        this.newBranchName = ''
      }
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },

    toggleConfirmPasswordVisibility() {
      this.showConfirmPassword = !this.showConfirmPassword
    },

    showErrorMessage(message) {
      this.errorMessage = message
      this.successMessage = ''

      // Auto-clear after 8 seconds
      setTimeout(() => {
        this.clearError()
      }, 8000)
    },

    showSuccessMessage(message) {
      this.successMessage = message
      this.errorMessage = ''
    },

    clearError() {
      this.errorMessage = ''
    },

    clearSuccess() {
      this.successMessage = ''
    },

    resetForm() {
      this.firstName = ''
      this.lastName = ''
      this.email = ''
      this.username = ''
      this.password = ''
      this.confirmPassword = ''
      this.selectedCity = ''
      this.selectedBranch = ''
      this.newCityName = ''
      this.newBranchName = ''
      this.role = 'admin'
      this.showPassword = false
      this.showConfirmPassword = false
      this.showNewCityInput = false
      this.showNewBranchInput = false
      this.clearError()
      this.clearSuccess()

      if (this.$refs.registerForm) {
        this.$refs.registerForm.resetValidation()
      }
    },

    closeModal() {
      this.dialog = false
      this.resetForm()
    },
  },

  mounted() {
    console.log('RegisterModal mounted')
  },
}
