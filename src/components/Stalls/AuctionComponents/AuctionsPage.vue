<template>
  <div class="auctions-page">
    <div class="page-header">
      <h1 class="page-title">
        <v-icon large color="white" class="mr-3">mdi-gavel</v-icon>
        Active Auctions
      </h1>
      <p class="page-subtitle">
        Manage and monitor all active auction stalls with live bidding
      </p>
    </div>

    <active-auctions 
      @show-message="handleMessage"
      @view-auction-details="handleViewDetails"
    />

    <!-- View Details Modal -->
    <v-dialog v-model="showDetailsModal" max-width="600px" persistent>
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Auction Details</span>
          <v-btn icon @click="closeDetailsModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text v-if="selectedAuction">
          <v-row>
            <v-col cols="12" md="6">
              <h4 class="mb-2">Stall Information</h4>
              <p><strong>Stall Number:</strong> {{ selectedAuction.stall_number }}</p>
              <p><strong>Location:</strong> {{ selectedAuction.location }}</p>
              <p><strong>Floor:</strong> {{ selectedAuction.floor_name }}</p>
              <p><strong>Section:</strong> {{ selectedAuction.section_name }}</p>
              <p><strong>Starting Bid:</strong> ₱{{ formatPrice(selectedAuction.starting_bid) }}</p>
              <p><strong>Current Bid:</strong> ₱{{ formatPrice(selectedAuction.current_bid) }}</p>
            </v-col>
            <v-col cols="12" md="6">
              <h4 class="mb-2">Auction Status</h4>
              <p><strong>Status:</strong> {{ selectedAuction.status }}</p>
              <p><strong>Created:</strong> {{ formatDateTime(selectedAuction.created_at) }}</p>
              <p><strong>Expires:</strong> {{ formatDateTime(selectedAuction.expires_at) }}</p>
              <p><strong>Total Bids:</strong> {{ selectedAuction.bid_count || 0 }}</p>
              <p v-if="selectedAuction.highest_bidder"><strong>Highest Bidder:</strong> {{ selectedAuction.highest_bidder }}</p>
            </v-col>
          </v-row>
          
          <!-- Recent Bids -->
          <div v-if="selectedAuction.recent_bids && selectedAuction.recent_bids.length" class="mt-4">
            <h4 class="mb-2">Recent Bids</h4>
            <v-chip 
              v-for="bid in selectedAuction.recent_bids" 
              :key="bid.bid_id"
              class="mr-2 mb-2"
              small
            >
              {{ bid.bidder_name }}: ₱{{ formatPrice(bid.amount) }}
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
import ActiveAuctions from '../AuctionComponents/ActiveAuctions/ActiveAuctions.vue'

export default {
  name: 'AuctionsPage',
  components: {
    ActiveAuctions
  },
  data() {
    return {
      showMessage: false,
      message: '',
      messageType: 'info',
      messageTimeout: 5000,
      showDetailsModal: false,
      selectedAuction: null
    }
  },
  methods: {
    handleMessage(message, type = 'info') {
      this.message = message
      this.messageType = type
      this.showMessage = true
    },

    handleViewDetails(auction) {
      this.selectedAuction = auction
      this.showDetailsModal = true
      console.log('View auction details:', auction)
    },

    closeDetailsModal() {
      this.showDetailsModal = false
      this.selectedAuction = null
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
.auctions-page {
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
  color: #1565c0;
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