<!-- components/AppHeader.vue -->
<template>
  <v-app-bar app color="white" elevation="1" height="80">
    <div class="d-flex align-center">
      <h2 class="title-text ml-4">{{ title }}</h2>
    </div>

    <v-spacer></v-spacer>

    <div class="d-flex align-center">
      <v-btn icon class="mr-2" @click="handleNotificationClick">
        <v-icon size="28" color="dark">mdi-bell-outline</v-icon>
      </v-btn>

      <!-- Profile Button -->
      <div class="profile-container" ref="profileContainer">
        <v-btn icon class="profile-btn" @click="toggleProfilePopup" ref="profileButton">
          <v-icon size="28" color="dark">mdi-account-circle</v-icon>
        </v-btn>

        <!-- Profile Popup -->
        <div
          v-if="showProfilePopup"
          class="profile-popup"
          :style="popupPosition"
          @click.stop
        >
          <div class="popup-arrow"></div>
          <div class="popup-content">
            <!-- Loading state -->
            <div v-if="loading" class="profile-loading">
              <v-progress-circular
                indeterminate
                size="20"
                color="primary"
              ></v-progress-circular>
              <span class="ml-2">Loading profile...</span>
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="profile-error">
              <v-icon color="error" class="mr-2">mdi-alert</v-icon>
              <div class="error-content">
                <div class="error-message">{{ error }}</div>
                <v-btn small color="primary" @click="refreshUserData" class="mt-2">
                  Retry
                </v-btn>
              </div>
            </div>

            <!-- User profile info (Admin, Branch Manager, or Employee) -->
            <div v-else class="profile-info" @click="handleProfileClick">
              <div class="profile-avatar-container">
                <v-avatar
                  class="profile-avatar"
                  :color="
                    isAdmin ? 'red darken-1' : isEmployee ? 'green darken-1' : 'primary'
                  "
                  size="44"
                >
                  <v-icon color="white" size="22">
                    {{
                      isAdmin
                        ? "mdi-shield-account"
                        : isEmployee
                        ? "mdi-account-tie"
                        : "mdi-account"
                    }}
                  </v-icon>
                </v-avatar>
              </div>

              <div class="profile-details">
                <!-- Username from database -->
                <div class="profile-name">{{ displayUsername }}</div>

                <!-- Full name with optional badge -->
                <div v-if="currentUserData?.fullName" class="profile-full-name">
                  {{ currentUserData.fullName }}
                  <!-- Role badge -->
                  <div v-if="currentUserData?.role" class="profile-badge">
                    {{ currentUserData.role }}
                  </div>
                </div>

                <!-- Area and Location -->
                <div class="profile-location" v-if="displayLocation">
                  {{ displayLocation }}
                </div>

                <!-- Email if available -->
                <div class="profile-email" v-if="currentUserData?.email">
                  {{ currentUserData.email }}
                </div>

                <!-- Contact number for admin -->
                <div
                  class="profile-contact"
                  v-if="isAdmin && currentUserData?.contactNumber"
                >
                  {{ currentUserData.contactNumber }}
                </div>
              </div>
            </div>

            <div class="popup-divider"></div>

            <!-- Menu items -->
            <div class="popup-item" @click="handleSettingsClick">
              <v-icon class="item-icon">mdi-cog</v-icon>
              <span>Settings</span>
            </div>

            <div class="popup-divider"></div>

            <div class="popup-item logout-item" @click="handleLogoutClick">
              <v-icon class="item-icon">mdi-logout</v-icon>
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay to close popup when clicking outside -->
    <div v-if="showProfilePopup" class="popup-overlay" @click="closeProfilePopup"></div>
  </v-app-bar>
</template>

<script src="./AppHeader.js"></script>
<style scoped src="./AppHeader.css"></style>
