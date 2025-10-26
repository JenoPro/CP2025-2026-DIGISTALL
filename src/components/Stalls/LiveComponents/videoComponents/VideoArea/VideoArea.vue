<template>
  <v-card class="video-card" :class="{ 'mb-6': !isAuction, 'mb-3': isAuction }" elevation="8">
    <div class="video-area" :style="videoAreaStyles">
      <video v-if="isLive" ref="videoElement" id="live-video" class="live-video-element" autoplay muted playsinline
        :class="{
          'flip-horizontal': videoFlipHorizontal,
          'flip-vertical': videoFlipVertical,
        }" :style="videoStyles"></video>
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
        <v-btn fab x-small class="video-settings-btn" color="rgba(0,0,0,0.6)" @click="toggleSettings">
          <v-icon small color="white">mdi-cog</v-icon>
        </v-btn>

        <!-- Video Effects Panel -->
        <VideoEffectsPanel :show="showSettings" :current-filter="currentFilter" :video-filters="videoFilters"
          :video-flip-horizontal="videoFlipHorizontal" :video-flip-vertical="videoFlipVertical"
          :auto-focus-enabled="autoFocus" @close="showSettings = false" @toggle-auto-focus="$emit('toggle-auto-focus')"
          @change-filter="$emit('apply-effect', $event)" @toggle-flip-horizontal="$emit('toggle-flip-horizontal')"
          @toggle-flip-vertical="$emit('toggle-flip-vertical')" @switch-camera="$emit('switch-camera')"
          @reset-effects="$emit('reset-effects')" />
      </div>

      <!-- Fullscreen Exit Button -->
      <div v-if="isFullscreen" class="fullscreen-controls">
        <v-btn @click="$emit('toggle-fullscreen')" icon="mdi-fullscreen-exit" color="white" variant="elevated"
          class="exit-fullscreen-btn"></v-btn>
      </div>
    </div>
  </v-card>
</template>

<script src="./VideoArea.js"></script>

<style scoped src="./VideoArea.css"></style>

