export default {
  name: 'VideoEffectsPanel',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    currentFilter: {
      type: String,
      default: 'none'
    },
    videoFilters: {
      type: Array,
      default: () => []
    },
    videoFlipHorizontal: {
      type: Boolean,
      default: false
    },
    videoFlipVertical: {
      type: Boolean,
      default: false
    },
    autoFocusEnabled: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'close',
    'toggle-auto-focus',
    'change-filter',
    'toggle-flip-horizontal',
    'toggle-flip-vertical',
    'switch-camera',
    'reset-effects'
  ]
}
