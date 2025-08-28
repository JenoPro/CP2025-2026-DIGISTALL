export default {
  name: 'LoginPage',
  data() {
    return {
      valid: false,
      loading: false,
      username: '',
      password: '',
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
      // Validate form first
      const { valid } = await this.$refs.loginForm.validate()

      if (!valid) {
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
        // Handle login error
        console.error('Login failed:', error)

        // Show error message (you can use Vuetify's snackbar or alert)
        this.showErrorMessage('Invalid username or password')
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
          } else {
            reject(new Error('Invalid credentials'))
          }
        }, 1500)
      })
    },

    handleForgotPassword() {
      // Handle forgot password logic
      console.log('Forgot password clicked')

      // You can redirect to forgot password page or show modal
      this.$router.push('/forgot-password')

      // Or emit event to parent
      this.$emit('forgot-password')
    },

    showErrorMessage(message) {
      // You can use Vuetify's snackbar or your preferred notification method
      this.$emit('show-error', message)
    },

    resetForm() {
      this.username = ''
      this.password = ''
      this.$refs.loginForm.resetValidation()
    },
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