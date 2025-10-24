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
      branchManagerData: null,
      adminData: null,
      employeeData: null,
      loading: false,
      error: null,
      // Popup state
      showProfilePopup: false,
      popupPosition: {
        top: '0px',
        right: '0px',
      },
    }
  },
  computed: {
    userType() {
      return sessionStorage.getItem('userType') || 'branch-manager'
    },
    isAdmin() {
      return this.userType === 'admin'
    },
    isEmployee() {
      return this.userType === 'employee'
    },
    currentUserData() {
      if (this.isAdmin) return this.adminData
      if (this.isEmployee) return this.employeeData
      return this.branchManagerData
    },
    displayUsername() {
      // Show the actual username from database
      return this.currentUserData?.username || (this.isAdmin ? 'admin' : 'manager')
    },
    displayDesignation() {
      // Show the full name and area/location designation
      if (this.currentUserData) {
        const fullName =
          this.currentUserData.fullName || (this.isAdmin ? 'Administrator' : 'Branch Manager')
        const designation = this.currentUserData.designation || ''
        return designation ? `${fullName} - ${designation}` : fullName
      }
      return this.isAdmin ? 'System Administrator' : 'Branch Manager'
    },
    displayLocation() {
      // Show area and location
      if (this.isAdmin) {
        return 'System Administration'
      }
      if (this.currentUserData?.area && this.currentUserData?.location) {
        return `${this.currentUserData.area} - ${this.currentUserData.location}`
      }
      return ''
    },
  },
  methods: {
    // Method to fetch user data based on user type
    async fetchUserData() {
      if (this.isAdmin) {
        await this.fetchAdminData()
      } else if (this.isEmployee) {
        await this.fetchEmployeeData()
      } else {
        await this.fetchBranchManagerData()
      }
    },

    // Method to fetch admin data
    async fetchAdminData() {
      try {
        this.loading = true
        this.error = null

        console.log('🔍 Loading admin data...')

        // First try to get from session storage
        const storedAdminData = sessionStorage.getItem('adminData')
        if (storedAdminData) {
          try {
            this.adminData = JSON.parse(storedAdminData)
            console.log('✅ Admin data loaded from storage:', this.adminData)
            this.loading = false
            return
          } catch (parseError) {
            console.warn('Error parsing stored admin data:', parseError)
          }
        }

        // If no stored data, fetch from API
        const token = sessionStorage.getItem('authToken')
        if (!token) {
          console.warn('⚠️ No authentication token found')
          this.error = 'No authentication token found'
          return
        }

        console.log('📡 Fetching admin data from server...')

        const response = await axios.get('http://localhost:3001/api/auth/admin-info', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        })

        if (response.data && response.data.success && response.data.admin) {
          this.adminData = response.data.admin
          console.log('✅ Admin data loaded from API:', this.adminData)

          // Store in sessionStorage for quick access
          sessionStorage.setItem('adminData', JSON.stringify(this.adminData))
        } else {
          console.warn('⚠️ No admin data found in response')
          this.error = 'Admin data not available'
        }
      } catch (error) {
        console.error('❌ Failed to fetch admin data:', error)

        if (error.response?.status === 401) {
          this.error = 'Authentication expired. Please login again.'
          // Clear invalid token
          sessionStorage.removeItem('authToken')
          localStorage.removeItem('authToken')
          // Redirect to login
          this.$router.push('/')
        } else if (error.response?.status === 403) {
          this.error = 'Access denied. Admin role required.'
        } else if (error.code === 'ECONNABORTED') {
          this.error = 'Request timeout. Please try again.'
        } else {
          this.error = 'Failed to load admin information'
        }

        // Try to use stored data as fallback
        const storedData = sessionStorage.getItem('adminData')
        if (storedData) {
          try {
            this.adminData = JSON.parse(storedData)
            console.log('📦 Using stored admin data as fallback')
            this.error = null
          } catch (parseError) {
            console.error('Error parsing stored admin data:', parseError)
          }
        }
      } finally {
        this.loading = false
      }
    },

    // Method to fetch employee data
    async fetchEmployeeData() {
      try {
        this.loading = true
        this.error = null

        console.log('🔍 Loading employee data...')

        // Get employee data from session storage (stored during login)
        const storedCurrentUser = sessionStorage.getItem('currentUser')
        if (storedCurrentUser) {
          try {
            const userData = JSON.parse(storedCurrentUser)
            if (userData.userType === 'employee') {
              this.employeeData = {
                username: userData.employee_username || userData.username,
                fullName: `${userData.first_name || userData.firstName || ''} ${userData.last_name || userData.lastName || ''}`.trim(),
                designation: 'Employee',
                area: userData.branch_name || 'Branch Employee',
                location: userData.branch_name || '',
                permissions: userData.permissions || []
              }
              console.log('✅ Employee data loaded from storage:', this.employeeData)
              this.loading = false
              return
            }
          } catch (parseError) {
            console.warn('Error parsing stored employee data:', parseError)
          }
        }

        // If no stored data, create default employee data
        this.employeeData = {
          username: 'employee',
          fullName: 'Employee User',
          designation: 'Employee',
          area: 'System Employee',
          location: '',
          permissions: []
        }
        console.log('📦 Using default employee data')
      } catch (error) {
        console.error('❌ Failed to fetch employee data:', error)
        this.error = 'Failed to load employee information'
      } finally {
        this.loading = false
      }
    },

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
      sessionStorage.removeItem('userType')
      sessionStorage.removeItem('branchManagerData')
      sessionStorage.removeItem('adminData')
      sessionStorage.removeItem('branchManagerId')
      sessionStorage.removeItem('adminId')
      localStorage.removeItem('currentUser')
      localStorage.removeItem('authToken')

      // Clear axios header
      delete axios.defaults.headers.common['Authorization']

      // Clear component data
      this.branchManagerData = null
      this.adminData = null

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

    // Refresh user data based on user type
    async refreshUserData() {
      await this.fetchUserData()
    },

    // Refresh branch manager data (kept for backward compatibility)
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

    // Fetch user data based on user type when component mounts
    await this.fetchUserData()
  },

  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
}
