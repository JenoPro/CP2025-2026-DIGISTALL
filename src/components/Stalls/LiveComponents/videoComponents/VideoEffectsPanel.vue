<template>
  <v-expand-transition>
    <v-card
      v-if="show"
      class="video-effects-panel"
      elevation="12"
    >
      <v-card-title class="py-2">
        <v-icon small class="mr-2">mdi-video-effects</v-icon>
        Video Effects
        <v-spacer></v-spacer>
        <v-btn
          icon
          x-small
          @click="$emit('close')"
        >
          <v-icon small>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="py-3">
        <!-- Auto Focus Toggle -->
        <div class="effect-section mb-3">
          <v-row align="center" no-gutters>
            <v-col>
              <div class="effect-label">
                <v-icon small class="mr-2" color="primary">mdi-account-focus</v-icon>
                Auto Focus Person
              </div>
              <div class="effect-description">Enhance person clarity</div>
            </v-col>
            <v-col cols="auto">
              <v-switch
                :model-value="autoFocusEnabled"
                @update:model-value="$emit('toggle-auto-focus')"
                color="primary"
                dense
                hide-details
              ></v-switch>
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-3"></v-divider>

        <!-- Video Filters -->
        <div class="effect-section mb-3">
          <div class="section-title mb-3">
            <v-icon small class="mr-2" color="primary">mdi-palette</v-icon>
            Video Filters
          </div>
          <div class="filter-grid">
            <v-btn
              v-for="filter in videoFilters"
              :key="filter.value"
              :color="currentFilter === filter.value ? 'primary' : ''"
              :variant="currentFilter === filter.value ? 'tonal' : 'outlined'"
              class="filter-btn"
              size="small"
              @click="$emit('change-filter', filter.value)"
            >
              <v-icon size="16">{{ filter.icon }}</v-icon>
              <span class="ml-1">{{ filter.name }}</span>
            </v-btn>
          </div>
        </div>

        <v-divider class="my-3"></v-divider>

        <!-- Video Orientation -->
        <div class="effect-section mb-3">
          <div class="section-title mb-3">
            <v-icon small class="mr-2" color="primary">mdi-flip-horizontal</v-icon>
            Video Orientation
          </div>
          <v-row no-gutters class="mb-2">
            <v-col cols="12">
              <v-btn
                :color="videoFlipHorizontal ? 'primary' : ''"
                :variant="videoFlipHorizontal ? 'tonal' : 'outlined'"
                block
                size="small"
                @click="$emit('toggle-flip-horizontal')"
                class="mb-2"
              >
                <v-icon small class="mr-2">mdi-flip-horizontal</v-icon>
                Flip Horizontal
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn
                :color="videoFlipVertical ? 'primary' : ''"
                :variant="videoFlipVertical ? 'tonal' : 'outlined'"
                block
                size="small"
                @click="$emit('toggle-flip-vertical')"
              >
                <v-icon small class="mr-2">mdi-flip-vertical</v-icon>
                Flip Vertical
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-3"></v-divider>

        <!-- Camera Controls -->
        <div class="effect-section">
          <v-row no-gutters>
            <v-col cols="6" class="pr-1">
              <v-btn
                color="info"
                variant="tonal"
                block
                size="small"
                @click="$emit('switch-camera')"
              >
                <v-icon small class="mr-1">mdi-camera-flip</v-icon>
                Switch Cam
              </v-btn>
            </v-col>
            <v-col cols="6" class="pl-1">
              <v-btn
                color="warning"
                variant="tonal"
                block
                size="small"
                @click="$emit('reset-effects')"
              >
                <v-icon small class="mr-1">mdi-refresh</v-icon>
                Reset All
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-expand-transition>
</template>

<script>
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
</script>

<style scoped>
.video-effects-panel {
  position: absolute !important;
  top: 60px;
  right: 16px;
  width: 320px;
  max-height: 450px;
  overflow-y: auto;
  pointer-events: auto;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.98) !important;
  border: 1px solid rgba(25, 118, 210, 0.2);
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 30;
}

.effect-section {
  margin-bottom: 4px;
}

.effect-label {
  font-size: 14px;
  font-weight: 600;
  color: #1976d2;
  display: flex;
  align-items: center;
  margin-bottom: 2px;
}

.effect-description {
  font-size: 12px;
  color: #666;
  margin-left: 24px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1976d2;
  display: flex;
  align-items: center;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.filter-btn {
  height: 40px !important;
  border-radius: 8px !important;
  text-transform: none !important;
  font-size: 12px !important;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.2);
}

/* Card title styling */
.video-effects-panel :deep(.v-card-title) {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white !important;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px 12px 0 0 !important;
}

.video-effects-panel :deep(.v-card-title .v-icon) {
  color: white !important;
}

/* Switch styling */
:deep(.v-switch) {
  transform: scale(0.9);
  transform-origin: right center;
}

/* Custom scrollbar */
.video-effects-panel::-webkit-scrollbar {
  width: 6px;
}

.video-effects-panel::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.video-effects-panel::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  border-radius: 3px;
}

.video-effects-panel::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #1565c0, #0d47a1);
}
</style>