import axios from 'axios'

export default {
  name: 'LoginPage',
  data() {
    return {
      valid: false,
      loading: false,
      username: '',
      password: '',
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
    }
  },
  computed: {
    loginEndpoint() {
      // Check if username indicates different user types
      const usernameUpper = this.username.toUpperCase()
      
      if (usernameUpper === 'ADMIN' || usernameUpper.includes('ADMIN')) {
        return 'http://localhost:3001/api/auth/admin/login'
      } else if (usernameUpper.startsWith('EMP') || usernameUpper.includes('.EMPLOYEE') || this.isEmployeeUsername(this.username)) {
        // Employee login - username starts with EMP, contains .employee, or matches employee pattern
        return 'http://localhost:3001/api/employees/login'
      } else {
        // Default to branch manager login
        return 'http://localhost:3001/api/auth/branch_manager/login'
      }
    },
  },
  async mounted() {
    // Clear any existing authentication data
    this.clearAuthData()
  },
  methods: {
    // Helper method to detect if username is an employee format
    isEmployeeUsername(username) {
      // Employee usernames are typically: firstname.lastname### (e.g., test.user314)
      // Look for pattern: word.word followed by numbers
      const employeePattern = /^[a-zA-Z]+\.[a-zA-Z]+\d+$/
      return employeePattern.test(username)
    },
    
    clearAuthData() {
      sessionStorage.removeItem('currentUser')
      sessionStorage.removeItem('authToken')
      sessionStorage.removeItem('userType')
      sessionStorage.removeItem('branchManagerId')
      sessionStorage.removeItem('adminId')
      sessionStorage.removeItem('adminData')
      sessionStorage.removeItem('employeeId')
      sessionStorage.removeItem('employeeData')
      sessionStorage.removeItem('employeePermissions')
      delete axios.defaults.headers.common['Authorization']
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
          ipAddress: '127.0.0.1', // Default for local testing
          userAgent: navigator.userAgent || 'Unknown'
        }

        console.log('🔐 Attempting login with:', {
          username: loginData.username,
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
          // Handle different response structures for different user types
          let token, user, isEmployee = false
          
          if (this.username.toUpperCase().startsWith('EMP') || this.username.toUpperCase().includes('.EMPLOYEE') || this.isEmployeeUsername(this.username)) {
            // Employee login response structure
            console.log('🔍 Employee login response:', response.data)
            token = response.data.data.token
            user = response.data.data.employee
            isEmployee = true
          } else {
            // Admin/Branch Manager login response structure  
            const responseData = response.data.data || response.data
            token = responseData.token
            user = responseData.user
          }

          // Handle different user types
          let userType = user.userType || 'branch-manager'
          let displayName = user.lastName || user.username
          
          // For employee login, set proper user type
          if (isEmployee) {
            userType = 'employee'
            displayName = user.first_name || user.firstName || user.username
            
            // Store employee-specific data
            sessionStorage.setItem('employeeId', user.employee_id?.toString() || user.id?.toString())
            sessionStorage.setItem('employeePermissions', JSON.stringify(user.permissions || []))
          }

          console.log('✅ Login successful!', {
            user: user.username || user.employee_username,
            userType: userType,
            firstName: user.firstName || user.first_name,
            lastName: user.lastName || user.last_name,
            area: user.area,
            location: user.location || user.branch,
            permissions: user.permissions,
          })

          // Turn loading back on for success redirect
          this.loading = true
          const userTypeTitle = userType === 'admin' ? 'Administrator' : 
                               userType === 'employee' ? 'Employee' : 'Manager'
          this.loadingText = `Welcome ${displayName}!`
          this.loadingSubtext = `Setting up your ${userTypeTitle} dashboard`

          // Store authentication data
          sessionStorage.setItem('authToken', token)
          sessionStorage.setItem('currentUser', JSON.stringify({
            ...user,
            userType: userType,
            username: user.username || user.employee_username
          }))
          sessionStorage.setItem('userType', userType)

          // For admin users, store admin ID and info
          if (userType === 'admin' && user.adminId) {
            sessionStorage.setItem('adminId', user.adminId.toString())
            // Store admin-specific info for header display
            sessionStorage.setItem(
              'adminData',
              JSON.stringify({
                adminId: user.adminId,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                contactNumber: user.contactNumber,
                email: user.email,
                fullName: `${user.firstName} ${user.lastName}`.trim(),
                role: 'System Administrator',
              }),
            )
          } else if (userType === 'employee') {
            // Store employee-specific info for header display
            sessionStorage.setItem(
              'employeeData',
              JSON.stringify({
                employeeId: user.employee_id || user.id,
                username: user.employee_username || user.username,
                firstName: user.first_name || user.firstName,
                lastName: user.last_name || user.lastName,
                email: user.email,
                permissions: user.permissions || [],
                fullName: `${user.first_name || user.firstName} ${user.last_name || user.lastName}`.trim(),
                role: 'Employee',
              }),
            )
          } else if (user.branchManagerId) {
            sessionStorage.setItem('branchManagerId', user.branchManagerId.toString())
          }

          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

          if (this.$store && this.$store.commit) {
            try {
              this.$store.commit('auth/setUser', user)
              this.$store.commit('auth/setToken', token)
              this.$store.commit('auth/setUserType', userType)
            } catch (storeError) {
              console.warn('Vuex store not available or missing mutations:', storeError)
            }
          }

          this.$emit('login-success', {
            user: user,
            token: token,
            userType: userType,
          })

          // Immediate redirect for employees, delayed for others
          if (userType === 'employee') {
            // Employee gets immediate navigation
            this.loading = false
            this.$router.push('/dashboard').catch((err) => {
              console.error('Navigation error:', err)
              window.location.href = '/dashboard'
            })
          } else {
            // Admin and managers get welcome screen delay
            setTimeout(() => {
              this.loading = false
              this.$router.push('/dashboard').catch((err) => {
                console.error('Navigation error:', err)
                window.location.href = '/dashboard'
              })
            }, 2000)
          }
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
            } else {
              errorMessage =
                data.message || 'Authentication failed. Please verify your username and password.'
            }
            break
          case 403:
            errorMessage =
              'Access denied. Your account may be inactive or you may not have the required permissions.'
            break
          case 404:
            errorMessage =
              'User account not found. Please verify your username or contact your administrator.'
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
      this.showPassword = false
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
    // Clear error messages when user starts typing
    username() {
      if (this.errorMessage) this.clearError()
      if (this.showSuccessMessage) this.clearSuccess()
    },
    password() {
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
