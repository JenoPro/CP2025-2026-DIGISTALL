export default {
  name: 'ProfileSettings',
  props: {
    userInfo: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      valid: false,
      profileData: {},
      originalData: {},
      usernameRules: [
        (v) => !!v || 'Username is required',
        (v) => (v && v.length >= 3) || 'Username must be at least 3 characters',
        (v) => (v && v.length <= 20) || 'Username must be less than 20 characters',
        (v) =>
          /^[a-zA-Z0-9_]+$/.test(v) ||
          'Username can only contain letters, numbers, and underscores',
      ],
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) => /.+@.+\..+/.test(v) || 'Email must be valid',
      ],
    }
  },
  computed: {
    hasChanges() {
      return JSON.stringify(this.profileData) !== JSON.stringify(this.originalData)
    },
  },
  watch: {
    userInfo: {
      handler(newVal) {
        this.profileData = { ...newVal }
        this.originalData = { ...newVal }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    handleAvatarChange(event) {
      const file = event.target.files[0]
      if (file) {
        // Create preview URL
        const reader = new FileReader()
        reader.onload = (e) => {
          this.profileData.avatar = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },

    resetForm() {
      this.profileData = { ...this.originalData }
      this.$refs.profileForm.resetValidation()
    },

    async saveProfile() {
      if (this.$refs.profileForm.validate()) {
        this.$emit('update-profile', this.profileData)
        this.originalData = { ...this.profileData }
      }
    },
  },
}
