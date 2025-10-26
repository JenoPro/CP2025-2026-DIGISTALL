import VideoEffectsPanel from '../VideoEffectsPanel/VideoEffectsPanel.vue'

export default {
  name: 'VideoArea',
  components: {
    VideoEffectsPanel,
  },
  props: {
    isLive: {
      type: Boolean,
      default: false,
    },
    videoFlipHorizontal: {
      type: Boolean,
      default: false,
    },
    videoFlipVertical: {
      type: Boolean,
      default: false,
    },
    videoFilters: {
      type: Array,
      default: () => [],
    },
    autoFocus: {
      type: Boolean,
      default: false,
    },
    currentFilter: {
      type: String,
      default: 'none',
    },
    isFullscreen: {
      type: Boolean,
      default: false,
    },
    customHeight: {
      type: String,
      default: null,
    },
    isAuction: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showSettings: false,
    }
  },
  computed: {
    videoStyles() {
      let filterStyle = ''

      // CSS Filters based on current filter
      switch (this.currentFilter) {
        case 'blur':
          filterStyle += 'blur(2px) '
          break
        case 'brightness':
          filterStyle += 'brightness(1.3) '
          break
        case 'contrast':
          filterStyle += 'contrast(1.4) '
          break
        case 'grayscale':
          filterStyle += 'grayscale(100%) '
          break
        case 'sepia':
          filterStyle += 'sepia(100%) '
          break
        case 'saturate':
          filterStyle += 'saturate(1.5) '
          break
        case 'hue-rotate':
          filterStyle += 'hue-rotate(90deg) '
          break
        case 'none':
        default:
          filterStyle = ''
          break
      }

      // Auto focus effect (sharpen and enhance person)
      if (this.autoFocus) {
        filterStyle += 'contrast(1.2) brightness(1.05) saturate(1.1) '
      }

      return {
        filter: filterStyle,
        height: this.customHeight || '50vh',
      }
    },
    videoAreaStyles() {
      const height = this.customHeight || '50vh'
      return {
        minHeight: height,
        height: height,
      }
    },
  },
  methods: {
    toggleSettings() {
      this.showSettings = !this.showSettings
    },

    // Expose video element to parent
    getVideoElement() {
      return this.$refs.videoElement
    },
  },
  emits: [
    'toggle-fullscreen',
    'toggle-auto-focus',
    'apply-effect',
    'remove-effect',
    'toggle-flip-horizontal',
    'toggle-flip-vertical',
    'switch-camera',
    'reset-effects',
  ],
}
