<template>
  <v-card class="participants-card" elevation="8">
    <v-card-title
      class="participants-header"
      :class="{ 'compact-header': participants.length === 0 }"
    >
      <v-icon class="mr-2">mdi-account-group</v-icon>
      {{ itemType === "Raffle" ? "Participants" : "Bidders" }}
      <v-spacer></v-spacer>
      <v-chip :color="getStatusColor()" size="small" variant="tonal">
        {{ participants.length }}
      </v-chip>
    </v-card-title>
    <template v-if="participants.length > 0">
      <v-divider></v-divider>
      <div class="participants-content">
        <div class="participants-list">
          <div
            v-for="participant in participants"
            :key="participant.id"
            class="participant-item"
          >
            <div class="participant-info">
              <div class="participant-name">{{ participant.name }}</div>
              <div class="participant-details">
                <span v-if="itemType === 'Raffle'">
                  {{ formatDateTime(participant.entry_date) }}
                </span>
                <span v-else>
                  ₱{{ formatPrice(participant.bid_amount) }} •
                  {{ formatDateTime(participant.bid_date) }}
                </span>
              </div>
            </div>
            <v-chip
              :color="getParticipantStatusColor(participant.status)"
              size="small"
              variant="tonal"
            >
              {{ participant.status }}
            </v-chip>
          </div>
        </div>
        <div class="participants-actions" v-if="canSelectWinner">
          <v-btn color="success" variant="tonal" block @click="$emit('select-winner')">
            <v-icon class="mr-2">mdi-trophy</v-icon>
            Select Winner
          </v-btn>
        </div>
      </div>
    </template>
  </v-card>
</template>

<script src="./ParticipantsList.js"></script>
<style scoped src="./ParticipantsList.css"></style>
