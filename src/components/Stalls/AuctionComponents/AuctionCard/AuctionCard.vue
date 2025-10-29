<template>
  <v-card class="auction-card" :class="cardClass" elevation="3">
    <!-- Status Banner -->
    <div class="status-banner" :class="`status-${statusType}`">
      <v-icon small class="status-icon">{{ statusIcon }}</v-icon>
      <span class="status-text">{{ statusText }}</span>
    </div>

    <!-- Card Header -->
    <v-card-title class="card-header">
      <div class="stall-info">
        <h3 class="stall-number">{{ auction.stall_number }}</h3>
        <p class="stall-location">{{ auction.location }}</p>
      </div>
      <div class="bid-info">
        <span class="bid-label">Current Highest</span>
        <span class="bid-amount">₱{{ formatPrice(auction.current_highest_bid || auction.starting_bid) }}</span>
      </div>
    </v-card-title>

    <!-- Timer Section -->
    <div class="timer-section" :class="`timer-${statusType}`">
      <div class="timer-display">
        <v-icon class="timer-icon" :color="timerColor">mdi-timer</v-icon>
        <div class="timer-text">
          <span class="time-remaining">{{ timeRemainingText }}</span>
          <span class="expiry-date">{{ formatDateTime(auction.expires_at) }}</span>
        </div>
      </div>
      <v-progress-linear :value="progressPercentage" :color="timerColor" height="4" rounded
        class="timer-progress"></v-progress-linear>
    </div>

    <!-- Bidders Section -->
    <v-card-text class="bidders-section">
      <div class="bidders-info">
        <div class="bidder-count">
          <v-icon color="primary">mdi-account-multiple</v-icon>
          <span>{{ auction.bidder_count || 0 }} Bidders</span>
        </div>
        <div class="stall-details">
          <v-chip small outlined>{{ auction.floor_name }}</v-chip>
          <v-chip small outlined>{{ auction.section_name }}</v-chip>
        </div>
      </div>

      <!-- Bid History Preview -->
      <div class="recent-bids-container">
        <div v-if="auction.recent_bids && auction.recent_bids.length" class="recent-bids">
          <p class="recent-label">Recent bids:</p>
          <div class="bid-items">
            <div v-for="bid in auction.recent_bids.slice(0, 2)" :key="bid.bid_id" class="bid-item">
              <v-avatar size="20" class="bid-avatar">
                <span class="avatar-text">{{ bid.bidder_name.charAt(0) }}</span>
              </v-avatar>
              <span class="bid-details">
                {{ bid.bidder_name }} - ₱{{ formatPrice(bid.bid_amount) }}
              </span>
            </div>
            <span v-if="auction.recent_bids.length > 2" class="more-bids">
              +{{ auction.recent_bids.length - 2 }} more bids
            </span>
          </div>
        </div>

        <!-- Starting Bid Info (if no bids yet) -->
        <div v-else class="starting-bid-info">
          <p class="starting-label">Starting bid:</p>
          <p class="starting-amount">₱{{ formatPrice(auction.starting_bid) }}</p>
        </div>
      </div>
    </v-card-text>

    <!-- Action Buttons -->
    <v-card-actions class="card-actions">
      <v-btn small text color="primary" @click="$emit('view-details', auction)">
        <v-icon small left>mdi-eye</v-icon>
        View Details
      </v-btn>

      <v-spacer></v-spacer>

      <!-- Extend Timer Button -->
      <v-btn v-if="canExtendTimer" small outlined color="primary" @click="$emit('extend-timer', auction)">
        <v-icon small left>mdi-timer-plus</v-icon>
        Extend
      </v-btn>

      <!-- End Auction Button -->
      <v-btn v-if="canSelectWinner" small color="primary" @click="$emit('select-winner', auction)">
        <v-icon small left>mdi-gavel</v-icon>
        End Auction
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script src="./AuctionCard.js"></script>
<style scoped src="./AuctionCard.css"></style>