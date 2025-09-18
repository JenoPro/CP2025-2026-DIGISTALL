import ProfileSettings from './components/ProfileSettings/ProfileSettings.vue'
import AppearanceSettings from './components/AppearanceSettings/AppearanceSettings.vue'
import LanguageSettings from './components/LanguageSettings/LanguageSettings.vue'
import NotificationSettings from './components/NotificationSettings/NotificationSettings.vue'
import SecuritySettings from './components/SecuritySettings/SecuritySettings.vue'

export default {
  name: 'Settings',
  components: {
    ProfileSettings,
    AppearanceSettings,
    LanguageSettings,
    NotificationSettings,
    SecuritySettings,
  },
  data() {
    return {
      loading: false,
      profileLoading: false,
      securityLoading: false,
      activeTab: 'profile',

      // User Information
      userInfo: {
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        role: '',
        branch: '',
        avatar: null,
      },

      // Theme Settings
      currentTheme: 'light',

      // Language Settings
      currentLanguage: 'en',

      // Notification Preferences
      notificationPreferences: {
        emailNotifications: true,
        pushNotifications: true,
        stallUpdates: true,
        paymentReminders: true,
        systemAnnouncements: true,
        maintenanceAlerts: false,
      },

      // Snackbar for notifications
      snackbar: {
        show: false,
        text: '',
        color: 'success',
      },

      // API configuration
      // eslint-disable-next-line no-undef
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:3001',
    }
  },

  async mounted() {
    await this.initializeSettings()
  },

  methods: {
    // Initialize settings with user data
    async initializeSettings() {
      this.loading = true
      try {
        await this.loadUserInfo()
        await this.loadUserPreferences()
      } catch (error) {
        console.error('Error loading settings:', error)
        this.showMessage('Failed to load settings', 'error')
      } finally {
        this.loading = false
      }
    },

    // Load user information from API or localStorage
    async loadUserInfo() {
      try {
        const token = sessionStorage.getItem('authToken')
        const userType = sessionStorage.getItem('userType')
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}')

        if (!token) {
          throw new Error('Authentication token not found')
        }

        let userInfo = {}

        if (userType === 'admin') {
          // Get admin data
          const adminData = JSON.parse(sessionStorage.getItem('adminData') || '{}')
          userInfo = {
            username: adminData.username || currentUser.username || '',
            email: adminData.email || currentUser.email || '',
            firstName: adminData.firstName || currentUser.firstName || '',
            lastName: adminData.lastName || currentUser.lastName || '',
            role: adminData.role || 'System Administrator',
            branch: 'Head Office',
            avatar: null,
          }
        } else {
          // Get branch manager data
          const branchManagerData = JSON.parse(sessionStorage.getItem('branchManagerData') || '{}')
          userInfo = {
            username: branchManagerData.username || currentUser.username || '',
            email: branchManagerData.email || currentUser.email || '',
            firstName: branchManagerData.firstName || currentUser.firstName || '',
            lastName: branchManagerData.lastName || currentUser.lastName || '',
            role: branchManagerData.role || 'Branch Manager',
            branch: branchManagerData.location || branchManagerData.area || 'Main Branch',
            avatar: null,
          }
        }

        this.userInfo = userInfo
        console.log('User info loaded:', this.userInfo)
      } catch (error) {
        console.error('Error loading user info:', error)
        // Fallback to basic info
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}')
        this.userInfo = {
          username: currentUser.username || 'User',
          email: currentUser.email || 'user@example.com',
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          role: currentUser.userType === 'admin' ? 'System Administrator' : 'Branch Manager',
          branch: 'Main Branch',
          avatar: null,
        }
      }
    },

    // Load user preferences from localStorage
    async loadUserPreferences() {
      try {
        // Load theme preference
        const savedTheme = localStorage.getItem('userTheme')
        if (savedTheme) {
          this.currentTheme = savedTheme
          // Apply theme immediately
          this.handleUpdateTheme(savedTheme)
        } else {
          // Apply default theme
          this.handleUpdateTheme(this.currentTheme)
        }

        // Load language preference
        const savedLanguage = localStorage.getItem('userLanguage')
        if (savedLanguage) {
          this.currentLanguage = savedLanguage
          // Apply language immediately
          this.handleUpdateLanguage(savedLanguage)
        } else {
          // Apply default language
          this.handleUpdateLanguage(this.currentLanguage)
        }

        // Load notification preferences
        const savedNotifications = localStorage.getItem('notificationPreferences')
        if (savedNotifications) {
          this.notificationPreferences = {
            ...this.notificationPreferences,
            ...JSON.parse(savedNotifications),
          }
        }
      } catch (error) {
        console.error('Error loading preferences:', error)
      }
    },

    // Handle profile update
    async handleUpdateProfile(updatedProfile) {
      this.profileLoading = true
      try {
        // TODO: Implement API call to update profile
        // const response = await fetch(`${this.apiBaseUrl}/api/user/profile`, {
        //   method: 'PUT',
        //   headers: {
        //     Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(updatedProfile),
        // });

        // For now, just update locally
        this.userInfo = { ...this.userInfo, ...updatedProfile }
        this.showMessage('Profile updated successfully', 'success')

        console.log('Profile updated:', updatedProfile)
      } catch (error) {
        console.error('Error updating profile:', error)
        this.showMessage('Failed to update profile', 'error')
      } finally {
        this.profileLoading = false
      }
    },

    // Handle theme update
    handleUpdateTheme(newTheme) {
      this.currentTheme = newTheme
      localStorage.setItem('userTheme', newTheme)

      // Apply theme to Vuetify
      if (newTheme === 'system') {
        // Detect system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        this.$vuetify.theme.global.name = prefersDark ? 'dark' : 'light'
      } else {
        this.$vuetify.theme.global.name = newTheme
      }

      // Apply theme classes to body for custom components
      document.body.className = document.body.className.replace(/theme-\w+/g, '')
      document.body.classList.add(`theme-${this.$vuetify.theme.global.name}`)

      this.showMessage(`Theme changed to ${newTheme} mode`, 'success')
      console.log('Theme updated:', newTheme)
    },

    // Handle language update
    handleUpdateLanguage(newLanguage) {
      this.currentLanguage = newLanguage
      localStorage.setItem('userLanguage', newLanguage)

      // Apply language globally by adding class to body
      document.body.className = document.body.className.replace(/lang-\w+/g, '')
      document.body.classList.add(`lang-${newLanguage}`)

      // Emit global language change event for other components to listen
      window.dispatchEvent(
        new CustomEvent('languageChanged', {
          detail: { language: newLanguage },
        }),
      )

      const languageName = newLanguage === 'en' ? 'English' : 'Filipino'
      const message =
        newLanguage === 'en'
          ? `Language changed to ${languageName}`
          : `Wika ay nabago sa ${languageName}`

      this.showMessage(message, 'success')
      console.log('Language updated:', newLanguage)
    },

    // Handle notification preferences update
    handleUpdateNotifications(newPreferences) {
      this.notificationPreferences = { ...newPreferences }
      localStorage.setItem('notificationPreferences', JSON.stringify(newPreferences))

      this.showMessage('Notification preferences updated', 'success')
      console.log('Notifications updated:', newPreferences)
    },

    // Handle password change
    async handleChangePassword(passwordData) {
      this.securityLoading = true
      try {
        // TODO: Implement API call to change password
        // const response = await fetch(`${this.apiBaseUrl}/api/user/change-password`, {
        //   method: 'POST',
        //   headers: {
        //     Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(passwordData),
        // });

        this.showMessage('Password changed successfully', 'success')
        console.log('Password change requested:', passwordData)
      } catch (error) {
        console.error('Error changing password:', error)
        this.showMessage('Failed to change password', 'error')
      } finally {
        this.securityLoading = false
      }
    },

    // Show message with snackbar
    showMessage(text, color = 'success') {
      this.snackbar = {
        show: true,
        text,
        color,
      }
    },
  },
}
