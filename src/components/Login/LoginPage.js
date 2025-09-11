import axios from 'axios'

export default {
  name: 'LoginPage',
  data() {
    return {
      valid: false,
      loading: false,
      loadingAreas: false,
      loadingBranches: false,
      username: '',
      password: '',
      selectedArea: '',
      selectedBranch: '',
      availableAreas: [],
      availableBranches: [],
      showPassword: false,
      showSuccessSnackbar: false,
      showSuccessMessage: false,
      successMessage: '',
      errorMessage: '',
      loadingText: 'Authenticating',
      loadingSubtext: 'Verifying your credentials',
      usernameRules: [
        (v) => !!v || 'Username is required',
        (v) => (v && v.length >= 3) || 'Username must be at least 3 characters',
      ],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
      ],
      areaRules: [(v) => !!v || 'Area selection is required'],
      branchRules: [(v) => !!v || 'Branch selection is required'],
    }
  },
  computed: {
    loginEndpoint() {
      return 'http://localhost:3001/api/auth/branch_manager/login'
    },
  },
  async mounted() {
    // Clear any existing authentication data
    this.clearAuthData()
    await this.fetchAreas()
  },
  methods: {
    clearAuthData() {
      sessionStorage.removeItem('currentUser')
      sessionStorage.removeItem('authToken')
      sessionStorage.removeItem('userType')
      sessionStorage.removeItem('branchManagerId')
      delete axios.defaults.headers.common['Authorization']
    },

    async fetchAreas() {
      this.loadingAreas = true
      try {
        const response = await axios.get('http://localhost:3001/api/areas')
        if (response.data && response.data.success) {
          const areasData = Array.isArray(response.data.data)
            ? response.data.data
            : Object.values(response.data.data || {})

          this.availableAreas = areasData
            .map((area) => ({
              title: typeof area === 'string' ? area : area.name || area.title,
              value: typeof area === 'string' ? area : area.name || area.title || area.value,
            }))
            .sort((a, b) => a.title.localeCompare(b.title))

          console.log('📍 Loaded areas:', this.availableAreas.length, 'areas')
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error('Failed to fetch areas:', error)
        this.showErrorMessage(
          'Failed to load available areas. Please refresh the page or contact support.',
        )
      } finally {
        this.loadingAreas = false
      }
    },

    async onAreaChange() {
      this.selectedBranch = ''
      this.availableBranches = []

      if (!this.selectedArea) {
        return
      }

      this.loadingBranches = true
      try {
        const response = await axios.get(
          `http://localhost:3001/api/branches/${encodeURIComponent(this.selectedArea)}`,
        )
        if (response.data && response.data.success) {
          const branchesData = Array.isArray(response.data.data)
            ? response.data.data
            : Object.values(response.data.data || {})

          this.availableBranches = branchesData
            .map((branch) => ({
              title: typeof branch === 'string' ? branch : branch.name || branch.title,
              value:
                typeof branch === 'string' ? branch : branch.name || branch.title || branch.value,
            }))
            .sort((a, b) => a.title.localeCompare(b.title))

          console.log(
            '🏢 Loaded branches for',
            this.selectedArea,
            ':',
            this.availableBranches.length,
            'branches',
          )
        } else {
          throw new Error('Invalid response format')
        }
      } catch (error) {
        console.error('Failed to fetch branches:', error)
        this.showErrorMessage('Failed to load available branches for the selected area.')
      } finally {
        this.loadingBranches = false
      }
    },

    async handleLogin() {
      this.clearError()
      this.clearSuccess()

      // Validate form first
      const { valid } = await this.$refs.loginForm.validate()

      if (!valid) {
        this.showErrorMessage('Please fill in all required fields correctly.')
        return
      }

      this.loading = true
      this.loadingText = 'Authenticating'
      this.loadingSubtext = 'Verifying your credentials'

      try {
        this.loadingText = 'Connecting'
        this.loadingSubtext = 'Establishing secure connection'

        const loginData = {
          username: this.username.trim(),
          password: this.password,
          area: this.selectedArea,
          location: this.selectedBranch, // Only send 'location', not 'branch'
        }

        console.log('🔐 Attempting login with:', {
          username: loginData.username,
          area: loginData.area,
          location: loginData.location, // Updated log
        })

        this.loadingText = 'Validating'
        this.loadingSubtext = 'Checking permissions'

        const response = await axios.post(this.loginEndpoint, loginData, {
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
          },
          validateStatus: (status) => {
            return status < 500 // Don't throw for 4xx errors
          },
        })

        // FIXED: Always turn off loading, then handle success/error
        this.loading = false

        if (response.status === 200 && response.data && response.data.success) {
          const { token, user } = response.data.data || response.data

          console.log('✅ Login successful!', {
            user: user.username,
            area: user.area,
            location: user.location || user.branch,
          })

          const displayName = user.lastName

          // Turn loading back on for success redirect
          this.loading = true
          this.loadingText = `Welcome ${displayName}!`
          this.loadingSubtext = 'Setting up your dashboard'

          // Store authentication data
          sessionStorage.setItem('authToken', token)
          sessionStorage.setItem('currentUser', JSON.stringify(user))
          sessionStorage.setItem('userType', user.userType || 'branch-manager')
          if (user.branchManagerId) {
            sessionStorage.setItem('branchManagerId', user.branchManagerId.toString())
          }

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

          if (this.$store && this.$store.commit) {
            try {
              this.$store.commit('auth/setUser', user)
              this.$store.commit('auth/setToken', token)
              this.$store.commit('auth/setUserType', user.userType || 'branch-manager')
            } catch (storeError) {
              console.warn('Vuex store not available or missing mutations:', storeError)
            }
          }

          this.$emit('login-success', {
            user: user,
            token: token,
            userType: user.userType || 'branch-manager',
          })

          // Redirect after delay
          setTimeout(() => {
            this.loading = false
            this.$router.push('/dashboard').catch((err) => {
              console.error('Navigation error:', err)
              window.location.href = '/dashboard'
            })
          }, 2000)
        } else {
          // Handle error responses
          this.handleLoginError({
            response: {
              status: response.status,
              data: response.data,
            },
          })
        }
      } catch (error) {
        // FIXED: Always turn off loading for errors
        this.loading = false
        this.handleLoginError(error)
      }
    },

    handleLoginError(error) {
      // FIXED: Ensure loading is always turned off
      this.loading = false

      let errorMessage = 'An unexpected error occurred. Please try again.'

      if (error.response) {
        const { status, data } = error.response
        console.error('❌ Server Error:', status, data)

        switch (status) {
          case 400:
            errorMessage = data.message || 'Invalid request. Please check your input and try again.'
            break
          case 401:
            if (data.message && data.message.toLowerCase().includes('credentials')) {
              errorMessage =
                'Invalid username or password. Please check your credentials and try again.'
            } else if (data.message && data.message.toLowerCase().includes('area')) {
              errorMessage = 'Invalid area selection. Please select a valid area.'
            } else if (data.message && data.message.toLowerCase().includes('branch')) {
              errorMessage =
                'Invalid branch selection. Please select a valid branch for the chosen area.'
            } else {
              errorMessage =
                data.message ||
                'Authentication failed. Please verify your credentials, area, and branch selection.'
            }
            break
          case 403:
            errorMessage =
              'Access denied. Your account may be inactive or you may not have permission to access this area/branch.'
            break
          case 404:
            errorMessage =
              'Branch manager account not found. Please verify your area and branch selection, or contact your administrator.'
            break
          case 429:
            errorMessage = 'Too many login attempts. Please wait a few minutes before trying again.'
            break
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = 'Server is temporarily unavailable. Please try again in a few moments.'
            break
          default:
            errorMessage =
              data.message || `Server error (${status}). Please contact support if this continues.`
        }
      } else if (error.request) {
        console.error('❌ Network Error:', error.request)
        errorMessage =
          'Unable to connect to the server. Please check your internet connection and try again.'
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Login request timed out. Please check your connection and try again.'
      } else {
        console.error('❌ Unexpected Error:', error.message)
        errorMessage = error.message || 'An unexpected error occurred. Please try again.'
      }

      this.showErrorMessage(errorMessage)
    },

    async handleForgotPassword() {
      this.clearError()
      this.clearSuccess()
      console.log('Forgot password clicked')

      try {
        this.$router.push('/forgot-password')
        this.$emit('forgot-password')
      } catch (error) {
        console.error('Navigation error:', error)
        this.showErrorMessage('Unable to navigate to forgot password page.')
      }
    },

    showErrorMessage(message) {
      this.errorMessage = message
      this.showSuccessMessage = false

      setTimeout(() => {
        this.clearError()
      }, 10000) // Longer timeout for better UX

      this.$emit('show-error', message)
    },

    clearError() {
      this.errorMessage = ''
    },

    clearSuccess() {
      this.successMessage = ''
      this.showSuccessSnackbar = false
      this.showSuccessMessage = false
    },

    resetForm() {
      this.username = ''
      this.password = ''
      this.selectedArea = ''
      this.selectedBranch = ''
      this.showPassword = false
      this.availableBranches = []
      this.clearError()
      this.clearSuccess()
      if (this.$refs.loginForm) {
        this.$refs.loginForm.resetValidation()
      }
    },

    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },

    showSuccessNotification(message) {
      this.successMessage = message
      this.showSuccessSnackbar = true
      this.showSuccessMessage = true
      this.clearError()
    },

    onAdminRegistered(adminData) {
      this.showSuccessNotification(`Admin ${adminData.username} registered successfully!`)
    },

    // FIXED: Add retry mechanism for failed requests
    async retryLogin() {
      if (this.loading) return

      console.log('🔄 Retrying login...')
      await this.handleLogin()
    },
  },

  watch: {
    // Clear error messages when user starts typing or changing selections
    username() {
      if (this.errorMessage) this.clearError()
      if (this.showSuccessMessage) this.clearSuccess()
    },
    password() {
      if (this.errorMessage) this.clearError()
      if (this.showSuccessMessage) this.clearSuccess()
    },
    selectedArea() {
      if (this.errorMessage) this.clearError()
      if (this.showSuccessMessage) this.clearSuccess()
    },
    selectedBranch() {
      if (this.errorMessage) this.clearError()
      if (this.showSuccessMessage) this.clearSuccess()
    },
  },

  beforeUnmount() {
    // Clear any pending timeouts
    if (this.redirectTimeout) {
      clearTimeout(this.redirectTimeout)
    }
  },
}
