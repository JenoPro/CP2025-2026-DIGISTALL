export default {
  name: 'AppearanceSettings',
  props: {
    currentTheme: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      compactMode: false,
      highContrast: false,
      reducedMotion: false,
      fontSize: 'medium',
      fontSizeOptions: [
        { title: 'Small', value: 'small' },
        { title: 'Medium', value: 'medium' },
        { title: 'Large', value: 'large' },
        { title: 'Extra Large', value: 'xl' },
      ],
    }
  },
  mounted() {
    this.loadDisplaySettings()
  },
  methods: {
    selectTheme(theme) {
      this.$emit('update-theme', theme)
    },

    loadDisplaySettings() {
      // Load saved display settings
      this.compactMode = localStorage.getItem('compactMode') === 'true'
      this.highContrast = localStorage.getItem('highContrast') === 'true'
      this.reducedMotion = localStorage.getItem('reducedMotion') === 'true'
      this.fontSize = localStorage.getItem('fontSize') || 'medium'
    },

    handleCompactModeChange() {
      localStorage.setItem('compactMode', this.compactMode.toString())
      // Apply compact mode classes to body
      if (this.compactMode) {
        document.body.classList.add('compact-mode')
      } else {
        document.body.classList.remove('compact-mode')
      }
      this.$emit(
        'show-message',
        `Compact mode ${this.compactMode ? 'enabled' : 'disabled'}`,
        'info',
      )
    },

    handleHighContrastChange() {
      localStorage.setItem('highContrast', this.highContrast.toString())
      if (this.highContrast) {
        document.body.classList.add('high-contrast')
      } else {
        document.body.classList.remove('high-contrast')
      }
      this.$emit(
        'show-message',
        `High contrast ${this.highContrast ? 'enabled' : 'disabled'}`,
        'info',
      )
    },

    handleReducedMotionChange() {
      localStorage.setItem('reducedMotion', this.reducedMotion.toString())
      if (this.reducedMotion) {
        document.body.classList.add('reduced-motion')
      } else {
        document.body.classList.remove('reduced-motion')
      }
      this.$emit(
        'show-message',
        `Reduced motion ${this.reducedMotion ? 'enabled' : 'disabled'}`,
        'info',
      )
    },

    handleFontSizeChange() {
      localStorage.setItem('fontSize', this.fontSize)
      // Apply font size classes
      document.body.className = document.body.className.replace(/font-size-\w+/g, '')
      document.body.classList.add(`font-size-${this.fontSize}`)
      this.$emit('show-message', `Font size changed to ${this.fontSize}`, 'info')
    },
  },
}
