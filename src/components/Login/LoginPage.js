export default {
  name: 'LoginPage',
  data() {
    return {
      valid: false,
      loading: false,
      username: '',
      password: '',
      errorMessage: '', // Add error message state
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
        // Simulate API call
        await this.simulateLogin()

        // Store the username in localStorage for use across components
        localStorage.setItem('currentUser', this.username);
        
        // If you're using Vuex store, you can also commit the username
        if (this.$store && this.$store.commit) {
          this.$store.commit('auth/setUser', {
            username: this.username,
            // Add other user data as needed
          });
        }

        // Handle successful login
        this.$router.push('/dashboard') // Navigate to dashboard

        // Or you can emit an event to parent component
        this.$emit('login-success', {
          username: this.username,
        })
      } catch (error) {
        // Handle different types of errors
        if (error.message === 'Invalid credentials') {
          this.showErrorMessage('Invalid username or password. Please try again.')
        } else if (error.message === 'Network error') {
          this.showErrorMessage('Unable to connect to server. Please check your internet connection.')
        } else if (error.message === 'Server error') {
          this.showErrorMessage('Server is currently unavailable. Please try again later.')
        } else {
          this.showErrorMessage('Login failed. Please try again.')
        }
        
        console.error('Login failed:', error)
      } finally {
        this.loading = false
      }
    },

    async simulateLogin() {
      // Simulate API delay
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Updated credentials: admin / admin123
          if (this.username === 'admin' && this.password === 'admin123') {
            resolve({ success: true })
          } else if (this.username === 'network-error') {
            // Simulate network error for testing
            reject(new Error('Network error'))
          } else if (this.username === 'server-error') {
            // Simulate server error for testing
            reject(new Error('Server error'))
          } else {
            reject(new Error('Invalid credentials'))
          }
        }, 1500)
      })
    },

    handleForgotPassword() {
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

    resetForm() {
      this.username = ''
      this.password = ''
      this.clearError()
      this.$refs.loginForm.resetValidation()
    },
  },

  watch: {
    // Clear error message when user starts typing
    username() {
      if (this.errorMessage) {
        this.clearError()
      }
    },
    password() {
      if (this.errorMessage) {
        this.clearError()
      }
    }
  },

  mounted() {
    // Clear any existing user data when login page is mounted
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    
    // Any initialization logic when component is mounted
    console.log('Login page mounted')
  },

  beforeUnmount() {
    // Cleanup if needed (but don't reset form here as we want to keep the username)
    // this.resetForm()
  },
}