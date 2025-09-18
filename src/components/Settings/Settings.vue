<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app>
    <!-- Main Content -->
    <v-main>
      <!-- Loading Overlay -->
      <v-overlay v-if="loading" contained>
        <v-progress-circular
          indeterminate
          size="64"
          color="primary"
        ></v-progress-circular>
        <div class="text-h6 mt-4">Loading settings...</div>
      </v-overlay>

      <!-- Main Content when loaded -->
      <div v-if="!loading" class="settings-container">
        <!-- Header Section -->
        <div class="settings-header mb-6">
          <div class="d-flex align-center">
            <v-icon size="48" color="primary" class="mr-4">mdi-cog</v-icon>
            <div>
              <h2 class="text-h4 font-weight-bold">Settings</h2>
              <p class="text-subtitle-1 text-medium-emphasis mt-1">
                Manage your account preferences and system configuration
              </p>
            </div>
          </div>
        </div>

        <!-- Settings Tabs -->
        <v-card elevation="2">
          <v-tabs
            v-model="activeTab"
            color="primary"
            slider-color="primary"
            show-arrows
            class="settings-tabs"
          >
            <v-tab value="profile">
              <v-icon left>mdi-account</v-icon>
              Profile
            </v-tab>
            <v-tab value="appearance">
              <v-icon left>mdi-palette</v-icon>
              Appearance
            </v-tab>
            <v-tab value="language">
              <v-icon left>mdi-translate</v-icon>
              Language
            </v-tab>
            <v-tab value="notifications">
              <v-icon left>mdi-bell</v-icon>
              Notifications
            </v-tab>
            <v-tab value="security">
              <v-icon left>mdi-shield-lock</v-icon>
              Security
            </v-tab>
          </v-tabs>

          <v-divider></v-divider>

          <!-- Tab Content -->
          <v-tabs-window v-model="activeTab" class="settings-content">
            <!-- Profile Settings Tab -->
            <v-tabs-window-item value="profile">
              <ProfileSettings
                :userInfo="userInfo"
                @update-profile="handleUpdateProfile"
                @show-message="showMessage"
                :loading="profileLoading"
              />
            </v-tabs-window-item>

            <!-- Appearance Settings Tab -->
            <v-tabs-window-item value="appearance">
              <AppearanceSettings
                :currentTheme="currentTheme"
                @update-theme="handleUpdateTheme"
                @show-message="showMessage"
              />
            </v-tabs-window-item>

            <!-- Language Settings Tab -->
            <v-tabs-window-item value="language">
              <LanguageSettings
                :currentLanguage="currentLanguage"
                @update-language="handleUpdateLanguage"
                @show-message="showMessage"
              />
            </v-tabs-window-item>

            <!-- Notifications Settings Tab -->
            <v-tabs-window-item value="notifications">
              <NotificationSettings
                :notificationPreferences="notificationPreferences"
                @update-notifications="handleUpdateNotifications"
                @show-message="showMessage"
              />
            </v-tabs-window-item>

            <!-- Security Settings Tab -->
            <v-tabs-window-item value="security">
              <SecuritySettings
                @change-password="handleChangePassword"
                @show-message="showMessage"
                :loading="securityLoading"
              />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card>
      </div>
    </v-main>

    <!-- Success/Error Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="5000"
      location="top right"
      variant="elevated"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script src="./Settings.js"></script>
<style scoped src="./Settings.css"></style>
