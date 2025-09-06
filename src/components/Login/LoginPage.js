import axios from 'axios'
import RegisterModal from '../Register/RegisterModal.vue'

export default {
  name: 'LoginPage',
  components: {
    RegisterModal,
  },
  data() {
    return {
      valid: false,
      loading: false,
      loadingCities: false,
      loadingBranches: false,
      username: '',
      password: '',
      selectedCity: '',
      selectedBranch: '',
      availableCities: [],
      availableBranches: [],
      allAreas: [], // Store all areas to filter by city
      showPassword: false, // Added for password visibility toggle
      showRegisterModal: false, // For controlling registration modal
      showSuccessSnackbar: false, // For success notifications
      successMessage: '', // Success message content
      errorMessage: '',
      usernameRules: [
        (v) => !!v || 'Username is required',
        (v) => (v && v.length >= 3) || 'Username must be at least 3 characters',
      ],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
      ],
      cityRules: [(v) => !!v || 'City selection is required'],
      branchRules: [(v) => !!v || 'Branch selection is required'],
    }
  },
  methods: {
    async handleLogin() {
      // Clear any previous error messages
      this.clearError()

      // Validate form first
      const { valid } = await this.$refs.loginForm.validate()

      if (!valid) {
        this.showErrorMessage('Please fill in all required fields correctly.')
        return
      }

      this.loading = true

      try {
        // Call backend API with branch
        const response = await axios.post('http://localhost:3001/api/admin/login', {
          username: this.username,
          password: this.password,
          branch: this.selectedBranch,
        })

        if (response.data.success) {
          // Store the token and user data
          const { token, user } = response.data.data

          // Store in sessionStorage for security
          sessionStorage.setItem('authToken', token)
          sessionStorage.setItem('currentUser', JSON.stringify(user))

          // If you're using Vuex store, commit the user data
          if (this.$store && this.$store.commit) {
            this.$store.commit('auth/setUser', user)
            this.$store.commit('auth/setToken', token)
          }

          // Set axios default authorization header for future requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

          // Show success message
          console.log('Login successful!', user)

          // Handle successful login
          this.$router.push('/dashboard')

          // Emit success event to parent component
          this.$emit('login-success', {
            user: user,
            token: token,
          })
        }
      } catch (error) {
        // Handle different types of errors
        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response

          if (status === 401) {
            this.showErrorMessage(data.message || 'Invalid username or password.')
          } else if (status === 400) {
            this.showErrorMessage(data.message || 'Please check your input.')
          } else if (status >= 500) {
            this.showErrorMessage('Server error. Please try again later.')
          } else {
            this.showErrorMessage(data.message || 'Login failed. Please try again.')
          }
        } else if (error.request) {
          // Network error
          this.showErrorMessage(
            'Unable to connect to server. Please check your internet connection.',
          )
        } else {
          // Other error
          this.showErrorMessage('An unexpected error occurred. Please try again.')
        }

        console.error('Login failed:', error)
      } finally {
        this.loading = false
      }
    },

    async handleForgotPassword() {
      // Clear error message when navigating away
      this.clearError()

      // Handle forgot password logic
      console.log('Forgot password clicked')

      // You can redirect to forgot password page or show modal
      this.$router.push('/forgot-password')

      // Or emit event to parent
      this.$emit('forgot-password')
    },

    showErrorMessage(message) {
      this.errorMessage = message

      // Auto-clear error message after 5 seconds
      setTimeout(() => {
        this.clearError()
      }, 5000)

      // You can also emit event to parent if needed
      this.$emit('show-error', message)
    },

    clearError() {
      this.errorMessage = ''
    },

    clearSuccess() {
      this.successMessage = ''
      this.showSuccessSnackbar = false
    },

    resetForm() {
      this.username = ''
      this.password = ''
      this.selectedCity = ''
      this.selectedBranch = ''
      this.showPassword = false
      this.clearError()
      this.clearSuccess()
      this.$refs.loginForm.resetValidation()
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
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

          console.log('Areas loaded:', this.allAreas)
          console.log('Cities loaded:', this.availableCities)
        }
      } catch (error) {
        console.error('Failed to fetch areas:', error)
        this.showErrorMessage(
          'Failed to load available cities and branches. Please refresh the page.',
        )
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
      console.log('Available branches:', this.availableBranches)
    },

    async fetchBranches() {
      // This method is now handled by fetchAreas and onCityChange
      // Keeping for backward compatibility but will be deprecated
      console.log('fetchBranches called - now handled by fetchAreas')
    },

    onAdminRegistered(newAdmin) {
      console.log('New admin registered:', newAdmin)

      // Show success notification (we'll create a proper notification system)
      this.showSuccessNotification(`Admin "${newAdmin.username}" has been successfully registered!`)

      // Refresh areas list to include any new areas/branches
      this.fetchAreas()

      // Close the modal
      this.showRegisterModal = false
    },

    showSuccessNotification(message) {
      // Use Vuetify snackbar for better UX
      this.successMessage = message
      this.showSuccessSnackbar = true

      // Clear any existing error messages
      this.clearError()
    },
  },

  watch: {
    // Clear error message when user starts typing
    username() {
      if (this.errorMessage) {
        this.clearError()
      }
      if (this.showSuccessSnackbar) {
        this.clearSuccess()
      }
    },
    password() {
      if (this.errorMessage) {
        this.clearError()
      }
      if (this.showSuccessSnackbar) {
        this.clearSuccess()
      }
    },
    selectedCity() {
      if (this.errorMessage) {
        this.clearError()
      }
      if (this.showSuccessSnackbar) {
        this.clearSuccess()
      }
    },
    selectedBranch() {
      if (this.errorMessage) {
        this.clearError()
      }
      if (this.showSuccessSnackbar) {
        this.clearSuccess()
      }
    },
  },

  mounted() {
    // Clear any existing user data when login page is mounted
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('authToken')

    // Remove axios default authorization header
    delete axios.defaults.headers.common['Authorization']

    // Fetch available areas and cities on component mount
    this.fetchAreas()

    // Any initialization logic when component is mounted
    console.log('Login page mounted')
  },

  beforeUnmount() {
    // Cleanup if needed (but don't reset form here as we want to keep the username)
    // this.resetForm()
  },
}
