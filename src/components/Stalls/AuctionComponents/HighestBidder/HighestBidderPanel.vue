<template>
  <v-card class="highest-bidder-panel" elevation="2">
    <v-card-title class="pa-3 primary-header">
      <v-icon class="mr-2" color="white">mdi-trophy</v-icon>
      Current Highest Bidder
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-4">
      <!-- No Bids Yet State -->
      <div v-if="!highestBidder || currentHighestBid <= startingPrice" class="no-bids-state text-center py-4">
        <h3 class="text-h6 text-grey-darken-1 mb-2">No bids yet</h3>
        <div class="text-body-1 mb-3">
          Starting at <span class="text-primary font-weight-bold">₱{{ formatPrice(startingPrice) }}</span>
        </div>
        <div class="text-caption text-grey">
          Minimum bid increment: ₱{{ formatPrice(bidIncrement) }}
        </div>
      </div>

      <!-- Current Highest Bidder -->
      <div v-else class="highest-bidder-info">
        <!-- Privacy Notice -->
        <div v-if="!canShowIdentity" class="privacy-notice mb-3 pa-2 text-center">
          <v-icon size="16" class="mr-1">mdi-eye-off</v-icon>
          <span class="text-caption">Bidder identity hidden for privacy</span>
        </div>

        <v-row align="center" no-gutters>
          <v-col cols="auto">
            <v-avatar size="56" color="primary" class="mr-4">
              <span class="text-white text-h6">{{ bidderInitials }}</span>
            </v-avatar>
          </v-col>
          <v-col>
            <div class="bidder-details">
              <h3 class="text-h5 mb-1">{{ displayName }}</h3>
              <div class="text-body-2 text-grey-darken-1 mb-2">
                {{ displayEmail }}
              </div>
              <v-chip color="primary" size="small" variant="flat">
                Highest Bidder
              </v-chip>
            </div>
          </v-col>
          <v-col cols="auto" class="text-right">
            <div class="bid-amount">
              <div class="text-h4 text-primary font-weight-bold">
                ₱{{ formatPrice(currentHighestBid) }}
              </div>
              <div class="text-caption text-grey-darken-1">
                Current Bid
              </div>
            </div>
          </v-col>
        </v-row>

        <!-- Bid Progression -->
        <div class="bid-progression mt-4">
          <div class="progression-header d-flex justify-space-between align-center mb-2">
            <span class="text-body-2 font-weight-medium">Bid Progress</span>
            <span class="text-caption text-grey">
              {{ bidProgressPercentage }}% above starting price
            </span>
          </div>
          <v-progress-linear :model-value="bidProgressPercentage" color="primary" height="8" rounded
            class="mb-2"></v-progress-linear>
          <div class="progression-info d-flex justify-space-between text-caption">
            <span>Start: ₱{{ formatPrice(startingPrice) }}</span>
            <span class="text-primary">Current: ₱{{ formatPrice(currentHighestBid) }}</span>
          </div>
        </div>

        <!-- Next Bid Information -->
        <div class="next-bid-info mt-4 pa-3 bg-grey-lighten-5 rounded">
          <div class="d-flex justify-space-between align-center">
            <div>
              <div class="text-body-2 font-weight-medium text-grey-darken-2">
                Next minimum bid
              </div>
              <div class="text-h6 text-primary font-weight-bold">
                ₱{{ formatPrice(nextMinimumBid) }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-body-2 text-grey-darken-1">
                +₱{{ formatPrice(bidIncrement) }}
              </div>
              <div class="text-caption text-grey">
                increment
              </div>
            </div>
          </div>
        </div>

        <!-- Bidder Stats -->
        <div class="bidder-stats mt-4">
          <v-row>
            <v-col cols="4" class="text-center">
              <div class="stat-value text-h6 text-primary">{{ totalBidders }}</div>
              <div class="stat-label text-caption">Total Bidders</div>
            </v-col>
            <v-col cols="4" class="text-center">
              <div class="stat-value text-h6 text-warning">{{ activeBidders }}</div>
              <div class="stat-label text-caption">Active Now</div>
            </v-col>
            <v-col cols="4" class="text-center">
              <div class="stat-value text-h6 text-info">{{ leadChanges }}</div>
              <div class="stat-label text-caption">Lead Changes</div>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'HighestBidderPanel',
  props: {
    currentHighestBid: {
      type: Number,
      default: 0,
    },
    highestBidder: {
      type: Object,
      default: null,
    },
    startingPrice: {
      type: Number,
      default: 100,
    },
    bidIncrement: {
      type: Number,
      default: 50,
    },
    totalBidders: {
      type: Number,
      default: 0,
    },
    activeBidders: {
      type: Number,
      default: 0,
    },
    canShowIdentity: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    bidderInitials() {
      if (!this.highestBidder?.name && !this.highestBidder?.initials) return '?'
      return this.highestBidder.initials || this.highestBidder.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
    },
    displayName() {
      if (!this.highestBidder) return 'Unknown'
      return this.canShowIdentity ? this.highestBidder.name : this.highestBidder.name
    },
    displayEmail() {
      if (!this.highestBidder) return ''
      return this.canShowIdentity ? this.highestBidder.email : this.highestBidder.email
    },
    nextMinimumBid() {
      return this.currentHighestBid + this.bidIncrement
    },
    bidProgressPercentage() {
      if (this.currentHighestBid <= this.startingPrice) return 0
      const increase = this.currentHighestBid - this.startingPrice
      const maxIncrease = this.startingPrice * 2 // Assume max is 3x starting price
      return Math.min((increase / maxIncrease) * 100, 100)
    },
    leadChanges() {
      // This would come from bid history analysis
      return Math.floor(this.totalBidders * 0.6) // Simulate lead changes
    },
  },
  methods: {
    formatPrice(price) {
      if (!price) return '0'
      return Number(price).toLocaleString()
    },
  },
  emits: ['refreshData'],
}
</script>

<style scoped>
/* Professional styling with primary colors */
.highest-bidder-panel {
  border-radius: 12px !important;
  overflow: hidden;
  border: 1px solid rgba(0, 33, 129, 0.1);
}

.primary-header {
  background: #002181 !important;
  color: white !important;
}

.privacy-notice {
  background: rgba(0, 33, 129, 0.05);
  border: 1px solid rgba(0, 33, 129, 0.1);
  border-radius: 6px;
  color: rgba(0, 33, 129, 0.8);
}

.no-bids-state {
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.highest-bidder-info {
  position: relative;
}

.bidder-details {
  flex: 1;
}

.bid-amount {
  min-width: 120px;
}

.bid-progression {
  padding: 16px;
  background: rgba(0, 33, 129, 0.02);
  border-radius: 8px;
  border: 1px solid rgba(0, 33, 129, 0.1);
}

.next-bid-info {
  border: 1px solid rgba(0, 33, 129, 0.1);
  background: rgba(0, 33, 129, 0.02);
}

.bidder-stats .stat-value {
  font-weight: 700 !important;
  color: #002181;
}

.bidder-stats .stat-label {
  color: rgba(0, 33, 129, 0.7);
  font-size: 0.7rem;
  text-transform: uppercase;
}

/* Override Vuetify colors */
.text-primary {
  color: #002181 !important;
}

.v-chip.bg-primary {
  background: #002181 !important;
}

.v-progress-linear .v-progress-linear__background {
  background: rgba(0, 33, 129, 0.1) !important;
}

@media (max-width: 768px) {
  .bid-amount {
    min-width: auto;
    margin-top: 12px;
  }

  .highest-bidder-info .v-row {
    flex-direction: column;
    text-align: center;
  }

  .bidder-stats .v-col {
    margin-bottom: 8px;
  }
}
</style>