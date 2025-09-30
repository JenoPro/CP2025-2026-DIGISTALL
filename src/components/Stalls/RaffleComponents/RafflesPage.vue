<template>
  <div class="raffles-page">
    <div class="page-header">
      <h1 class="page-title">
        <v-icon large color="primary" class="mr-3">mdi-ticket-percent</v-icon>
        Active Raffles
      </h1>
      <p class="page-subtitle">
        Manage and monitor all active raffle stalls with live countdown timers
      </p>
    </div>

    <active-raffles 
      @show-message="handleMessage"
      @view-raffle-details="handleViewDetails"
    />

    <!-- View Details Modal -->
    <v-dialog v-model="showDetailsModal" max-width="600px" persistent>
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Raffle Details</span>
          <v-btn icon @click="closeDetailsModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text v-if="selectedRaffle">
          <v-row>
            <v-col cols="12" md="6">
              <h4 class="mb-2">Stall Information</h4>
              <p><strong>Stall Number:</strong> {{ selectedRaffle.stall_number }}</p>
              <p><strong>Location:</strong> {{ selectedRaffle.location }}</p>
              <p><strong>Floor:</strong> {{ selectedRaffle.floor_name }}</p>
              <p><strong>Section:</strong> {{ selectedRaffle.section_name }}</p>
              <p><strong>Entry Fee:</strong> ₱{{ formatPrice(selectedRaffle.entry_fee) }}</p>
            </v-col>
            <v-col cols="12" md="6">
              <h4 class="mb-2">Raffle Status</h4>
              <p><strong>Status:</strong> {{ selectedRaffle.status }}</p>
              <p><strong>Created:</strong> {{ formatDateTime(selectedRaffle.created_at) }}</p>
              <p><strong>Expires:</strong> {{ formatDateTime(selectedRaffle.expires_at) }}</p>
              <p><strong>Participants:</strong> {{ selectedRaffle.participant_count || 0 }}</p>
            </v-col>
          </v-row>
          
          <!-- Recent Participants -->
          <div v-if="selectedRaffle.recent_participants && selectedRaffle.recent_participants.length" class="mt-4">
            <h4 class="mb-2">Recent Participants</h4>
            <v-chip 
              v-for="participant in selectedRaffle.recent_participants" 
              :key="participant.user_id"
              class="mr-2 mb-2"
              small
            >
              {{ participant.name }}
            </v-chip>
          </div>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDetailsModal">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Message Snackbar -->
    <v-snackbar
      v-model="showMessage"
      :color="messageType"
      :timeout="messageTimeout"
      top
    >
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="showMessage = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import ActiveRaffles from './ActiveRaffles/ActiveRaffles.vue'

export default {
  name: 'RafflesPage',
  components: {
    ActiveRaffles
  },
  data() {
    return {
      showMessage: false,
      message: '',
      messageType: 'info',
      messageTimeout: 5000,
      showDetailsModal: false,
      selectedRaffle: null
    }
  },
  methods: {
    handleMessage(message, type = 'info') {
      this.message = message
      this.messageType = type
      this.showMessage = true
    },

    handleViewDetails(raffle) {
      this.selectedRaffle = raffle
      this.showDetailsModal = true
      console.log('View raffle details:', raffle)
    },

    closeDetailsModal() {
      this.showDetailsModal = false
      this.selectedRaffle = null
    },

    formatPrice(price) {
      if (!price) return '0'
      return parseFloat(price).toLocaleString()
    },

    formatDateTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.raffles-page {
  padding: 0;
  height: 100%;
}

.page-header {
  background: white;
  color: black;
  padding: 32px 24px;
  margin-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  color: #1976d2;
}

.page-subtitle {
  font-size: 1rem;
  margin: 0;
  font-weight: 400;
  color: #424242;
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header {
    padding: 24px 16px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-subtitle {
    font-size: 0.9rem;
  }
}
</style>