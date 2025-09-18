export default {
  name: 'NotificationSettings',
  props: {
    notificationPreferences: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      preferences: {},
      testLoading: false,
    }
  },
  watch: {
    notificationPreferences: {
      handler(newVal) {
        this.preferences = { ...newVal }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    updatePreferences() {
      this.$emit('update-notifications', this.preferences)
    },

    async sendTestNotification() {
      this.testLoading = true
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Show browser notification if permission granted
        if (Notification.permission === 'granted') {
          new Notification('Test Notification', {
            body: 'Your notification settings are working correctly!',
            icon: '/favicon.ico',
          })
        } else if (Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission()
          if (permission === 'granted') {
            new Notification('Test Notification', {
              body: 'Your notification settings are working correctly!',
              icon: '/favicon.ico',
            })
          }
        }

        this.$emit('show-message', 'Test notification sent successfully!', 'success')
      } catch (error) {
        console.error('Test notification failed:', error)
        this.$emit('show-message', 'Failed to send test notification', 'error')
      } finally {
        this.testLoading = false
      }
    },
  },
}
