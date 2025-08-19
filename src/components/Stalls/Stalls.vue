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
              <CardStallsComponent :stalls="displayStalls" @stall-edit="handleStallEdit"/>

              <!-- Empty State when no stalls are displayed -->
              <div v-if="displayStalls.length === 0" class="empty-state">
                <v-card class="pa-8 text-center" elevation="2">
                  <v-icon size="64" color="grey-lighten-2">mdi-store-off</v-icon>
                  <h3 class="text-h6 mt-4 mb-2 text-grey-darken-1">No stalls found</h3>
                  <p class="text-body-2 text-grey">
                    No stalls match your current search criteria. Try adjusting your filters or add a new stall.
                  </p>
                  <v-btn color="primary" variant="elevated" @click="openAddStallModal" class="mt-4">
                    <v-icon left>mdi-plus</v-icon>
                    Add New Stall
                  </v-btn>
                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-container>

        <!-- Add Available Stall Component -->
        <AddAvailableStall :showModal="showModal" @open-modal="openAddStallModal" @close-modal="closeAddStallModal"
          @stall-added="handleStallAdded" />

        <!-- Edit Stall Modal Component -->
        <EditStall :showModal="showEditModal" :stallData="selectedStall" @close="handleEditModalClose"
          @stall-updated="handleStallUpdated" @stall-deleted="handleStallDeleted" @error="handleEditError" />
      </v-main>

      <!-- Success/Error Snackbar - kept at main-wrapper level for optimal positioning -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="5000" location="top right" variant="elevated">
        {{ snackbar.text }}
        <template v-slot:actions>
          <v-btn color="white" variant="text" @click="snackbar.show = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-app>
</template>

<script src="./Stalls.js"></script>
<style scoped src="./Stalls.css"></style>