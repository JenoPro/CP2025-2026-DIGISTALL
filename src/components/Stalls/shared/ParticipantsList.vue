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

<script>
export default {
  name: "ParticipantsList",
  props: {
    participants: {
      type: Array,
      default: () => [],
    },
    itemType: {
      type: String,
      default: "Raffle",
    },
    canSelectWinner: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["select-winner"],
  methods: {
    getStatusColor() {
      return this.participants.length > 0 ? "primary" : "grey";
    },

    getParticipantStatusColor(status) {
      switch (status) {
        case "Winner":
          return "success";
        case "Highest Bidder":
          return "warning";
        case "Participating":
        case "Bidding":
          return "primary";
        default:
          return "grey";
      }
    },

    formatPrice(price) {
      if (!price) return "0";
      return parseFloat(price).toLocaleString();
    },

    formatDateTime(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>

<style scoped>
.participants-card {
  border-radius: 8px !important;
  background: #1976d2 !important;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.1);
  color: white;
  min-height: 0;
}

.participants-header {
  background: linear-gradient(135deg, #1976d2, #1565c0);
  color: white !important;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px 8px 0 0 !important;
  min-height: 56px;
  padding: 16px 20px !important;
}

.compact-header {
  border-radius: 8px !important;
  min-height: 48px;
  padding-bottom: 8px !important;
}

.participants-header :deep(.v-icon) {
  color: white !important;
}

.participants-content {
  background: #fff;
  color: #222;
  border-radius: 0 0 8px 8px;
  display: flex;
  flex-direction: column;
}

.participants-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.participant-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  margin-bottom: 8px;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.participant-item:hover {
  background: #f0f0f0;
  transform: translateY(-1px);
}

.participant-info {
  flex: 1;
}

.participant-name {
  font-weight: 600;
  color: #333;
  font-size: 14px;
  margin-bottom: 4px;
}

.participant-details {
  font-size: 12px;
  color: #666;
}

.participants-actions {
  padding: 16px;
  border-top: 1px solid #e0e0e0;
}

/* Custom scrollbar */
.participants-list::-webkit-scrollbar {
  width: 6px;
}

.participants-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.participants-list::-webkit-scrollbar-thumb {
  background: #1976d2;
  border-radius: 3px;
}

.participants-list::-webkit-scrollbar-thumb:hover {
  background: #1565c0;
}
</style>
