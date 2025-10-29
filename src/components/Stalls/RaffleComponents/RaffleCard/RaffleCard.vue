<template>
  <v-card class="raffle-card" :class="cardClass" elevation="3">
    <!-- Status Banner -->
    <div class="status-banner" :class="`status-${statusType}`">
      <v-icon small class="status-icon">{{ statusIcon }}</v-icon>
      <span class="status-text">{{ statusText }}</span>
    </div>

    <!-- Card Header -->
    <v-card-title class="card-header">
      <div class="stall-info">
        <h3 class="stall-number">{{ raffle.stall_number }}</h3>
        <p class="stall-location">{{ raffle.location }}</p>
      </div>
      <div class="entry-fee">
        <span class="fee-label">Entry Fee</span>
        <span class="fee-amount">₱{{ formatPrice(raffle.entry_fee) }}</span>
      </div>
    </v-card-title>

    <!-- Timer Section -->
    <div class="timer-section" :class="`timer-${statusType}`">
      <div class="timer-display">
        <v-icon class="timer-icon" :color="timerColor">mdi-timer</v-icon>
        <div class="timer-text">
          <span class="time-remaining">{{ timeRemainingText }}</span>
          <span class="expiry-date">{{ formatDateTime(raffle.expires_at) }}</span>
        </div>
      </div>
      <v-progress-linear
        :value="progressPercentage"
        :color="timerColor"
        height="4"
        rounded
        class="timer-progress"
      ></v-progress-linear>
    </div>

    <!-- Participants Section -->
    <v-card-text class="participants-section">
      <div class="participants-info">
        <div class="participant-count">
          <v-icon color="primary">mdi-account-group</v-icon>
          <span>{{ raffle.participant_count || 0 }} Participants</span>
        </div>
        <div class="stall-details">
          <v-chip small outlined>{{ raffle.floor_name }}</v-chip>
          <v-chip small outlined>{{ raffle.section_name }}</v-chip>
        </div>
      </div>

      <!-- Fixed height container for consistency -->
      <div class="recent-participants-container">
        <div v-if="raffle.recent_participants && raffle.recent_participants.length" class="recent-participants">
          <p class="recent-label">Recent entries:</p>
          <div class="participant-avatars">
            <v-avatar
              v-for="participant in raffle.recent_participants.slice(0, 3)"
              :key="participant.user_id"
              size="24"
              class="participant-avatar"
            >
              <span class="avatar-text">{{ participant.name.charAt(0) }}</span>
            </v-avatar>
            <span v-if="raffle.recent_participants.length > 3" class="more-participants">
              +{{ raffle.recent_participants.length - 3 }} more
            </span>
          </div>
        </div>
        <div v-else class="no-participants">
          <p class="recent-label">No entries yet</p>
        </div>
      </div>
    </v-card-text>

    <!-- Action Buttons -->
    <v-card-actions class="card-actions">
      <v-btn
        small
        text
        color="primary"
        @click="$emit('view-details', raffle)"
      >
        <v-icon small left>mdi-eye</v-icon>
        View Details
      </v-btn>

      <v-spacer></v-spacer>

      <!-- Extend Timer Button -->
      <v-btn
        v-if="canExtendTimer"
        small
        outlined
        color="primary"
        @click="$emit('extend-timer', raffle)"
      >
        <v-icon small left>mdi-timer-plus</v-icon>
        Extend
      </v-btn>

      <!-- Select Winner Button -->
      <v-btn
        v-if="canSelectWinner"
        small
        color="primary"
        @click="$emit('select-winner', raffle)"
      >
        <v-icon small left>mdi-trophy</v-icon>
        Select Winner
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script src="./RaffleCard.js"></script>
<style scoped src="./RaffleCard.css"></style>