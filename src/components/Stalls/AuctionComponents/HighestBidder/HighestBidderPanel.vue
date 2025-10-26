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

<script src="./HighestBidderPanel.js"></script>

<style scoped src="./HighestBidderPanel.css"></style>
