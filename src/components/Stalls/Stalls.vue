<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app>
    <!-- Sidebar Component -->
    <AppSidebar :items="menuItems" @menu-item-click="handleMenuItemClick" />

    <div class="main-wrapper">
      <!-- Header Component -->
      <AppHeader :title="pageTitle" @notification-click="handleNotificationClick" @profile-click="handleProfileClick"
        @settings-click="handleSettingsClick" @logout-click="handleLogoutClick" />

      <!-- Main Content -->
      <v-main>
        <v-container fluid class="main-content">
          <v-row>
            <v-col cols="12">
              <!-- Search Filter Component -->
              <SearchFilter :stallsData="stallsData" @filtered-stalls="handleFilteredStalls" />

              <!-- Card Stalls Component -->
              <CardStallsComponent :stalls="displayStalls" @stall-edit="handleStallEdit"
                @stall-delete="handleStallDelete" />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script src="./Stalls.js"></script>
<style scoped src="./Stalls.css"></style>