<template>
  <v-app>
    <AppSidebar
      ref="appSidebar"
      :items="menuItems"
      @menu-item-click="handleMenuItemClick"
    />

    <AppHeader
      :title="pageTitle"
      @notification-click="handleNotificationClick"
      @profile-click="handleProfileClick"
      @settings-click="handleSettingsClick"
      @logout-click="handleLogoutClick"
    />

    <v-main class="main-content-wrapper">
      <v-container fluid class="main-content">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script src="./MainLayout.js"></script>
<style scoped src="./MainLayout.css"></style>
