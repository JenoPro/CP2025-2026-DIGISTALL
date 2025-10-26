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

<script src="./VideoEffectsPanel.js"></script>

<style scoped src="./VideoEffectsPanel.css"></style>
