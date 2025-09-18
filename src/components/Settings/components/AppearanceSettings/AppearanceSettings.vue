<template>
  <v-container class="pa-6">
    <div class="appearance-settings">
      <!-- Appearance Header -->
      <div class="appearance-header mb-6">
        <h3 class="text-h5 font-weight-bold mb-2">Appearance Settings</h3>
        <p class="text-subtitle-2 text--secondary">
          Customize the look and feel of your application
        </p>
      </div>

      <!-- Theme Selection -->
      <v-card elevation="2" class="mb-6">
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-3">mdi-palette</v-icon>
          Theme Selection
        </v-card-title>
        <v-card-text>
          <v-row>
            <!-- Light Theme -->
            <v-col cols="12" sm="6" md="4">
              <v-card
                :class="['theme-card', { 'selected': currentTheme === 'light' }]"
                @click="selectTheme('light')"
                elevation="1"
              >
                <div class="theme-preview light-preview">
                  <div class="preview-header light-header"></div>
                  <div class="preview-content light-content"></div>
                  <div class="preview-sidebar light-sidebar"></div>
                </div>
                <v-card-actions class="justify-center">
                  <v-icon v-if="currentTheme === 'light'" color="primary">mdi-check-circle</v-icon>
                  <v-icon v-else color="grey">mdi-circle-outline</v-icon>
                  <span class="ml-2">Light Mode</span>
                </v-card-actions>
              </v-card>
            </v-col>

            <!-- Dark Theme -->
            <v-col cols="12" sm="6" md="4">
              <v-card
                :class="['theme-card', { 'selected': currentTheme === 'dark' }]"
                @click="selectTheme('dark')"
                elevation="1"
              >
                <div class="theme-preview dark-preview">
                  <div class="preview-header dark-header"></div>
                  <div class="preview-content dark-content"></div>
                  <div class="preview-sidebar dark-sidebar"></div>
                </div>
                <v-card-actions class="justify-center">
                  <v-icon v-if="currentTheme === 'dark'" color="primary">mdi-check-circle</v-icon>
                  <v-icon v-else color="grey">mdi-circle-outline</v-icon>
                  <span class="ml-2">Dark Mode</span>
                </v-card-actions>
              </v-card>
            </v-col>

            <!-- System Theme -->
            <v-col cols="12" sm="6" md="4">
              <v-card
                :class="['theme-card', { 'selected': currentTheme === 'system' }]"
                @click="selectTheme('system')"
                elevation="1"
              >
                <div class="theme-preview system-preview">
                  <div class="preview-split">
                    <div class="preview-half light-half">
                      <div class="preview-header light-header"></div>
                      <div class="preview-content light-content"></div>
                    </div>
                    <div class="preview-half dark-half">
                      <div class="preview-header dark-header"></div>
                      <div class="preview-content dark-content"></div>
                    </div>
                  </div>
                </div>
                <v-card-actions class="justify-center">
                  <v-icon v-if="currentTheme === 'system'" color="primary">mdi-check-circle</v-icon>
                  <v-icon v-else color="grey">mdi-circle-outline</v-icon>
                  <span class="ml-2">System Default</span>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Additional Appearance Options -->
      <v-card elevation="2">
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-3">mdi-tune</v-icon>
          Display Options
        </v-card-title>
        <v-card-text>
          <v-row>
            <!-- Compact Mode -->
            <v-col cols="12" md="6">
              <div class="setting-item">
                <div class="setting-info">
                  <h4 class="text-subtitle-1 font-weight-medium">Compact Mode</h4>
                  <p class="text-caption text--secondary">
                    Reduce spacing and make the interface more compact
                  </p>
                </div>
                <v-switch
                  v-model="compactMode"
                  color="primary"
                  inset
                  @change="handleCompactModeChange"
                ></v-switch>
              </div>
            </v-col>

            <!-- High Contrast -->
            <v-col cols="12" md="6">
              <div class="setting-item">
                <div class="setting-info">
                  <h4 class="text-subtitle-1 font-weight-medium">High Contrast</h4>
                  <p class="text-caption text--secondary">
                    Increase contrast for better visibility
                  </p>
                </div>
                <v-switch
                  v-model="highContrast"
                  color="primary"
                  inset
                  @change="handleHighContrastChange"
                ></v-switch>
              </div>
            </v-col>

            <!-- Reduced Motion -->
            <v-col cols="12" md="6">
              <div class="setting-item">
                <div class="setting-info">
                  <h4 class="text-subtitle-1 font-weight-medium">Reduced Motion</h4>
                  <p class="text-caption text--secondary">
                    Minimize animations and transitions
                  </p>
                </div>
                <v-switch
                  v-model="reducedMotion"
                  color="primary"
                  inset
                  @change="handleReducedMotionChange"
                ></v-switch>
              </div>
            </v-col>

            <!-- Font Size -->
            <v-col cols="12" md="6">
              <div class="setting-item">
                <div class="setting-info">
                  <h4 class="text-subtitle-1 font-weight-medium">Font Size</h4>
                  <p class="text-caption text--secondary">
                    Adjust text size for better readability
                  </p>
                </div>
                <v-select
                  v-model="fontSize"
                  :items="fontSizeOptions"
                  variant="outlined"
                  density="compact"
                  @update:model-value="handleFontSizeChange"
                ></v-select>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<script src="./AppearanceSettings.js"></script>
<style scoped src="./AppearanceSettings.css"></style>