<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app>
    <!-- Main Content -->
    <v-main>
      <v-row>
        <v-col cols="12">
          <!-- Search Filter Component -->
          <SearchFilter :stallsData="stallsData" @filtered-stalls="handleFilteredStalls" />

          <!-- Card Stalls Component -->
          <CardStallsComponent :stalls="displayStalls" @stall-edit="handleStallEdit" @stall-auction="handleStallAuction"
            @stall-live="handleStallLive" />

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

      <!-- Add Available Stall Component -->
      <AddAvailableStall :showModal="showModal" @open-modal="openAddStallModal" @close-modal="closeAddStallModal"
        @stall-added="handleStallAdded" />

      <!-- Edit Stall Modal Component -->
      <EditStall :showModal="showEditModal" :stallData="selectedStall" @close="handleEditModalClose"
        @stall-updated="handleStallUpdated" @stall-deleted="handleStallDeleted" @error="handleEditError" />

      <!-- Auction Modal -->
      <v-dialog v-model="showAuctionModal" class="auction-dialog" persistent scrollable>
        <v-card>
          <v-card-title class="d-flex justify-end align-center">
            <v-btn icon variant="text" @click="handleCloseAuction">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-0">
            <AuctionTable :stall="selectedStall" @update-status="handleAuctionStatus"
              @close-auction="handleCloseAuction" />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-main>

    <!-- Success/Error Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="5000" location="top right" variant="elevated">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script src="./Stalls.js"></script>
<style scoped src="./Stalls.css"></style>