<template>
  <div class="raffles-page">
    <active-raffles
      @show-message="handleMessage"
      @view-raffle-details="handleViewDetails"
      @view-raffle-participants="handleViewParticipants"
    />

    <!-- Use the separate RaffleDetailsPopup component -->
    <raffle-details-popup
      :show-details-modal="showDetailsModal"
      :selected-raffle="selectedRaffle"
      :show-participants-modal="showParticipantsModal"
      :selected-raffle-for-participants="selectedRaffleForParticipants"
      @close-details-modal="closeDetailsModal"
      @close-participants-modal="closeParticipantsModal"
    />

    <!-- Enhanced Message Snackbar -->
    <v-snackbar
      v-model="showMessage"
      :color="messageType"
      :timeout="messageTimeout"
      location="top right"
      variant="elevated"
      class="enhanced-snackbar"
    >
      <div class="snackbar-content">
        <v-icon
          :color="messageType === 'success' ? 'white' : 'white'"
          class="snackbar-icon"
        >
          {{ messageType === "success" ? "mdi-check-circle" : "mdi-information" }}
        </v-icon>
        <span class="snackbar-text">{{ message }}</span>
      </div>
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          size="small"
          @click="showMessage = false"
          class="snackbar-action"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script src="./RafflesPage.js"></script>
<style src="./RafflesPage.css"></style>
