export default {
  name: 'SecuritySettings',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      passwordValid: false,
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      twoFactorEnabled: false,
      passwordData: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      },
      currentPasswordRules: [(v) => !!v || 'Current password is required'],
      newPasswordRules: [
        (v) => !!v || 'New password is required',
        (v) => (v && v.length >= 8) || 'Password must be at least 8 characters',
      ],
      confirmPasswordRules: [
        (v) => !!v || 'Please confirm your password',
        (v) => v === this.passwordData.newPassword || 'Passwords do not match',
      ],
    }
  },
  mounted() {
    this.loadSecuritySettings()
  },
  methods: {
    loadSecuritySettings() {
      // Load 2FA status from localStorage or API
      this.twoFactorEnabled = localStorage.getItem('twoFactorEnabled') === 'true'
    },

    async changePassword() {
      if (this.$refs.passwordForm.validate()) {
        this.$emit('change-password', this.passwordData)
        // Reset form after successful change
        this.passwordData = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }
        this.$refs.passwordForm.resetValidation()
      }
    },

    async enableTwoFactor() {
      // TODO: Implement 2FA enable logic
      this.twoFactorEnabled = true
      localStorage.setItem('twoFactorEnabled', 'true')
      this.$emit('show-message', 'Two-Factor Authentication enabled', 'success')
    },

    async disableTwoFactor() {
      // TODO: Implement 2FA disable logic
      this.twoFactorEnabled = false
      localStorage.setItem('twoFactorEnabled', 'false')
      this.$emit('show-message', 'Two-Factor Authentication disabled', 'info')
    },
  },
}
