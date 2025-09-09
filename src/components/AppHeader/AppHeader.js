import axios from 'axios'

export default {
  name: 'AppHeader',
  props: {
    title: {
      type: String,
      default: 'Title',
    },
    username: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      showProfilePopup: false,
      popupPosition: {},
      branchManagerData: null,
      loading: false,
      error: null,
    }
  },
  computed: {
    displayUsername() {
      // Show the actual username from database
      return this.branchManagerData?.username || 'manager'
    },
    displayDesignation() {
      // Show the full name and area/location designation
      if (this.branchManagerData) {
        const fullName = this.branchManagerData.fullName || 'Branch Manager'
        const designation = this.branchManagerData.designation || ''
        return designation ? `${fullName} - ${designation}` : fullName
      }
      return 'Branch Manager'
    },
    displayLocation() {
      // Show area and location
      if (this.branchManagerData?.area && this.branchManagerData?.location) {
        return `${this.branchManagerData.area} - ${this.branchManagerData.location}`
      }
      return ''
    },
  },
  methods: {
    // Method to fetch branch manager data
    async fetchBranchManagerData() {
      try {
        this.loading = true
        this.error = null

        console.log('🔍 Fetching branch manager data...')

        // Get the token from storage
        const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken')

        if (!token) {
          console.warn('⚠️ No authentication token found')
          this.error = 'No authentication token found'
          return
        }

        // Set up axios headers
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }

        // Make request to the new branch manager info endpoint
        const response = await axios.get(
          'http://localhost:3001/api/auth/branch-manager-info',
          config,
        )

        if (response.data.success && response.data.branchManager) {
          this.branchManagerData = response.data.branchManager
          console.log('✅ Branch manager data loaded:', this.branchManagerData)

          // Store in sessionStorage for quick access
          sessionStorage.setItem('branchManagerData', JSON.stringify(this.branchManagerData))
        } else {
          console.warn('⚠️ No branch manager data found')
          this.error = 'Branch manager data not found'
        }
      } catch (error) {
        console.error('❌ Failed to fetch branch manager data:', error)

        if (error.response?.status === 401) {
          this.error = 'Authentication expired. Please login again.'
          // Clear invalid token
          sessionStorage.removeItem('authToken')
          localStorage.removeItem('authToken')
          // Redirect to login
          this.$router.push('/')
        } else if (error.response?.status === 403) {
          this.error = 'Access denied. Branch manager role required.'
        } else {
          this.error = 'Failed to load branch manager information'
        }

        // Try to use stored data as fallback
        const storedData = sessionStorage.getItem('branchManagerData')
        if (storedData) {
          try {
            this.branchManagerData = JSON.parse(storedData)
            console.log('📦 Using stored branch manager data as fallback')
            this.error = null
          } catch (parseError) {
            console.error('Error parsing stored branch manager data:', parseError)
          }
        }
      } finally {
        this.loading = false
      }
    },

    handleNotificationClick() {
      console.log('Notification clicked')
      this.$emit('notification-click')
    },

    handleProfileClick() {
      console.log('Profile clicked')
      this.closeProfilePopup()
      this.$emit('profile-click')
    },

    handleSettingsClick() {
      console.log('Settings clicked')
      this.closeProfilePopup()
      this.$emit('settings-click')
    },

    async handleLogoutClick() {
      console.log('Logout clicked')
      this.closeProfilePopup()

      // Clear any stored user data
      sessionStorage.removeItem('currentUser')
      sessionStorage.removeItem('authToken')
      sessionStorage.removeItem('branchManagerData')
      localStorage.removeItem('currentUser')
      localStorage.removeItem('authToken')

      // Clear axios header
      delete axios.defaults.headers.common['Authorization']

      // Clear component data
      this.branchManagerData = null

      // Clear Vuex store if you're using it
      if (this.$store && this.$store.dispatch) {
        this.$store.dispatch('auth/logout')
      }

      // Navigate to login page
      this.$router.push('/')

      // Emit logout event
      this.$emit('logout-click')
    },

    toggleProfilePopup() {
      if (this.showProfilePopup) {
        this.closeProfilePopup()
      } else {
        this.openProfilePopup()
      }
    },

    openProfilePopup() {
      this.showProfilePopup = true
      this.$nextTick(() => {
        this.calculatePopupPosition()
      })
    },

    closeProfilePopup() {
      this.showProfilePopup = false
    },

    calculatePopupPosition() {
      const button = this.$refs.profileButton.$el
      const buttonRect = button.getBoundingClientRect()

      this.popupPosition = {
        position: 'fixed',
        top: `${buttonRect.bottom + 8}px`,
        right: `${window.innerWidth - buttonRect.right}px`,
        zIndex: '9999',
      }
    },

    handleClickOutside(event) {
      if (this.showProfilePopup && !this.$refs.profileContainer.contains(event.target)) {
        this.closeProfilePopup()
      }
    },

    // Refresh branch manager data
    async refreshBranchManagerData() {
      await this.fetchBranchManagerData()
    },

    // Setup authentication for all axios requests
    setupAuthInterceptor() {
      const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      }
    },
  },

  async mounted() {
    document.addEventListener('click', this.handleClickOutside)

    // Setup authentication
    this.setupAuthInterceptor()

    // Fetch branch manager data when component mounts
    await this.fetchBranchManagerData()
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
}
