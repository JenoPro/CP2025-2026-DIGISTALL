<template>
  <v-card class="mb-6" elevation="8">
    <div class="video-area">
      <video
        v-if="isLive"
        ref="videoElement"
        id="live-video"
        class="live-video-element"
        autoplay
        muted
        playsinline
        :class="{
          'flip-horizontal': videoFlipHorizontal,
          'flip-vertical': videoFlipVertical,
        }"
        :style="videoStyles"
      ></video>
      <div v-else class="video-placeholder">
        <v-icon size="64" color="#1976d2">mdi-video</v-icon>
        <div class="mt-3">Live Stream Will Appear Here</div>
        <div class="text-body-2 mt-2 text-grey">
          Click "Start Live" to begin broadcasting
        </div>
      </div>

      <!-- Video Controls Overlay -->
      <div v-if="isLive" class="video-controls-overlay">
        <!-- Settings Button -->
        <v-btn
          fab
          x-small
          class="video-settings-btn"
          color="rgba(0,0,0,0.6)"
          @click="toggleSettings"
        >
          <v-icon small color="white">mdi-cog</v-icon>
        </v-btn>

        <!-- Video Effects Panel -->
        <VideoEffectsPanel
          :show="showSettings"
          :current-filter="currentFilter"
          :video-filters="videoFilters"
          :video-flip-horizontal="videoFlipHorizontal"
          :video-flip-vertical="videoFlipVertical"
          :auto-focus-enabled="autoFocus"
          @close="showSettings = false"
          @toggle-auto-focus="$emit('toggle-auto-focus')"
          @change-filter="$emit('apply-effect', $event)"
          @toggle-flip-horizontal="$emit('toggle-flip-horizontal')"
          @toggle-flip-vertical="$emit('toggle-flip-vertical')"
          @switch-camera="$emit('switch-camera')"
          @reset-effects="$emit('reset-effects')"
        />
      </div>

      <!-- Fullscreen Exit Button -->
      <div v-if="isFullscreen" class="fullscreen-controls">
        <v-btn
          @click="$emit('toggle-fullscreen')"
          icon="mdi-fullscreen-exit"
          color="white"
          variant="elevated"
          class="exit-fullscreen-btn"
        ></v-btn>
      </div>
    </div>
  </v-card>
</template>

<script>
import VideoEffectsPanel from "./VideoEffectsPanel.vue";

export default {
  name: "VideoArea",
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
      default: "none",
    },
    isFullscreen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showSettings: false,
    };
  },
  computed: {
    videoStyles() {
      let filterStyle = "";

      // CSS Filters based on current filter
      switch (this.currentFilter) {
        case "blur":
          filterStyle += "blur(2px) ";
          break;
        case "brightness":
          filterStyle += "brightness(1.3) ";
          break;
        case "contrast":
          filterStyle += "contrast(1.4) ";
          break;
        case "grayscale":
          filterStyle += "grayscale(100%) ";
          break;
        case "sepia":
          filterStyle += "sepia(100%) ";
          break;
        case "saturate":
          filterStyle += "saturate(1.5) ";
          break;
        case "hue-rotate":
          filterStyle += "hue-rotate(90deg) ";
          break;
        case "none":
        default:
          filterStyle = "";
          break;
      }

      // Auto focus effect (sharpen and enhance person)
      if (this.autoFocus) {
        filterStyle += "contrast(1.2) brightness(1.05) saturate(1.1) ";
      }

      return {
        filter: filterStyle,
      };
    },
  },
  methods: {
    toggleSettings() {
      this.showSettings = !this.showSettings;
    },

    // Expose video element to parent
    getVideoElement() {
      return this.$refs.videoElement;
    },
  },
  emits: [
    "toggle-fullscreen",
    "toggle-auto-focus",
    "apply-effect",
    "remove-effect",
    "toggle-flip-horizontal",
    "toggle-flip-vertical",
    "switch-camera",
    "reset-effects",
  ],
};
</script>

<style scoped>
.video-area {
  position: relative;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.live-video-element {
  width: 100%;
  height: 50vh;
  object-fit: cover;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.live-video-element.flip-horizontal {
  transform: scaleX(-1);
}

.live-video-element.flip-vertical {
  transform: scaleY(-1);
}

.live-video-element.flip-horizontal.flip-vertical {
  transform: scaleX(-1) scaleY(-1);
}

.video-placeholder {
  text-align: center;
  color: #666;
  padding: 40px;
}

.video-controls-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
}

.video-settings-btn {
  position: absolute !important;
  top: 16px;
  right: 60px;
  pointer-events: auto;
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.7) !important;
  z-index: 20;
  transition: all 0.2s ease;
}

.video-fullscreen-btn {
  position: absolute !important;
  top: 16px;
  right: 16px;
  pointer-events: auto;
  backdrop-filter: blur(8px);
  background: rgba(0, 0, 0, 0.7) !important;
  z-index: 20;
  transition: all 0.2s ease;
}

.video-settings-btn:hover,
.video-fullscreen-btn:hover {
  background: rgba(0, 0, 0, 0.8) !important;
  transform: scale(1.05);
}

.fullscreen-controls {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.exit-fullscreen-btn {
  backdrop-filter: blur(8px);
}
</style>
