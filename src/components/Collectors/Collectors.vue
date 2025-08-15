<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app>
    <!-- Sidebar Component -->
    <AppSidebar :items="menuItems" @menu-item-click="handleMenuItemClick" />

    <div class="main-wrapper">
      <!-- Header Component -->
      <AppHeader
        :title="pageTitle"
        @notification-click="handleNotificationClick"
        @profile-click="handleProfileClick"
        @settings-click="handleSettingsClick"
        @logout-click="handleLogoutClick"
      />

      <!-- Main Content -->
      <v-main>
        <v-container fluid class="main-content">
          <v-row>
            <v-col cols="12">
              <div class="content-placeholder">
                <h3>Collectors Content</h3>
                <p>Collectors management system content goes here</p>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script src="./Collectors.js"></script>
<style scoped src="./Collectors.css"></style>
