<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="stall-participants">
    <!-- Modern Header Section -->
    <div class="modern-header">
      <div class="header-content">
        <div class="header-info">
          <div class="header-icon">
            <v-icon size="32" color="white">mdi-account-group</v-icon>
          </div>
          <div class="header-text">
            <h2 class="header-title">Participants</h2>
            <p class="header-subtitle">
              {{ participants.length }}
              {{ participants.length === 1 ? "participant" : "participants" }} found
            </p>
          </div>
        </div>
        <v-btn
          icon
          size="large"
          color="white"
          variant="text"
          @click="$emit('close')"
          class="close-btn"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-content">
        <v-progress-circular
          indeterminate
          size="48"
          color="primary"
          :width="4"
        ></v-progress-circular>
        <p class="loading-text">Loading participants...</p>
      </div>
    </div>

    <!-- Error State -->
    <v-alert v-if="error && !loading" type="error" variant="tonal" class="error-alert">
      <template v-slot:prepend>
        <v-icon>mdi-alert-circle</v-icon>
      </template>
      <div class="error-content">
        <div class="error-title">Failed to load participants</div>
        <div class="error-message">{{ error }}</div>
      </div>
      <template v-slot:append>
        <v-btn color="error" variant="text" @click="fetchParticipants" size="small">
          <v-icon start>mdi-refresh</v-icon>
          Retry
        </v-btn>
      </template>
    </v-alert>

    <!-- Participants Content -->
    <div v-if="!loading && !error" class="participants-content">
      <!-- Empty State -->
      <div v-if="participants.length === 0" class="empty-state">
        <div class="empty-icon">
          <v-icon size="64" color="grey-lighten-3">mdi-account-off-outline</v-icon>
        </div>
        <h3 class="empty-title">No participants yet</h3>
        <p class="empty-subtitle">
          This stall currently has no participants or applicants.
        </p>
      </div>

      <!-- Participants List -->
      <div v-else class="participants-list">
        <div
          v-for="participant in participants"
          :key="participant.participantId"
          class="participant-item"
        >
          <div class="participant-avatar">
            <div class="avatar-circle">
              <span class="avatar-text">{{
                participant.personalInfo.fullName.charAt(0).toUpperCase()
              }}</span>
            </div>
          </div>

          <div class="participant-details">
            <div class="participant-name">
              {{ participant.personalInfo.fullName }}
            </div>

            <div class="participant-info">
              <div class="info-item">
                <v-icon size="16" color="primary">mdi-email-outline</v-icon>
                <span>{{ participant.personalInfo.email }}</span>
              </div>

              <div class="info-item">
                <v-icon size="16" color="primary">mdi-map-marker-outline</v-icon>
                <span>{{ participant.personalInfo.address }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success/Error Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="5000"
      location="top right"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script src="./StallParticipants.js"></script>
<style scoped src="./StallParticipants.css"></style>
