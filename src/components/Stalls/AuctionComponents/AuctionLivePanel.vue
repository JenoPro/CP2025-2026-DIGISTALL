// Auction Live Panel - Admin view for monitoring live auctions and bidding
<template>
  <v-card class="auction-live-panel" elevation="8">
    <v-card-title class="auction-header">
      <v-icon class="mr-2" color="primary">mdi-gavel</v-icon>
      <span>Live Auction Monitor</span>
      <v-spacer></v-spacer>
      <v-chip :color="auctionStatus === 'live' ? 'success' : 'warning'" size="small">
        {{ auctionStatus.toUpperCase() }}
      </v-chip>
    </v-card-title>

    <v-divider></v-divider>

    <v-card-text class="pa-0">
      <!-- Auction Info Header -->
      <div class="auction-info pa-3">
        <v-row align="center" no-gutters>
          <v-col cols="12" md="6">
            <h3 class="text-h6 mb-1">{{ stallData.name || "Sample Stall" }}</h3>
            <div class="text-subtitle-2 text-grey-darken-1">
              <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
              {{ stallData.location || "Market Area A" }}
            </div>
          </v-col>
          <v-col cols="12" md="6" class="text-right">
            <CountdownTimer
              :timeRemaining="auctionTimeRemaining"
              :isActive="auctionStatus === 'live'"
              @timeUp="handleAuctionEnd"
            />
          </v-col>
        </v-row>
      </div>

      <!-- Main Content Layout -->
      <div class="auction-main-content pa-3">
        <!-- Single Column Layout - Live Auction Monitor takes full width -->
        <v-row>
          <v-col cols="12">
            <HighestBidderPanel
              :currentHighestBid="currentHighestBid"
              :highestBidder="displayHighestBidder"
              :startingPrice="startingPrice"
              :bidIncrement="bidIncrement"
              :totalBidders="totalBidders"
              :canShowIdentity="canShowBidderIdentity"
              @refreshData="fetchAuctionData"
            />

            <!-- Bidder Summary (Only shown when auction ends) -->
            <v-card
              v-if="canShowBidderIdentity && Object.keys(bidderTotalAmounts).length > 0"
              class="mt-3"
              variant="outlined"
            >
              <v-card-title class="pa-3">
                <v-icon class="mr-2">mdi-account-group</v-icon>
                Participant Summary
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pa-3">
                <div class="bidder-summary-list">
                  <div
                    v-for="(bidder, bidderId) in bidderTotalAmounts"
                    :key="bidderId"
                    class="bidder-summary-item pa-3 d-flex align-center"
                  >
                    <v-avatar size="32" color="primary" class="mr-3">
                      <span class="text-white text-caption">{{
                        bidder.bidderInitials
                      }}</span>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <div class="font-weight-medium">{{ bidder.bidderName }}</div>
                      <div class="text-caption text-grey-darken-1">
                        {{ bidder.bidCount }} bid{{ bidder.bidCount !== 1 ? "s" : "" }}
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-h6 text-primary font-weight-bold">
                        ₱{{ formatPrice(bidder.totalAmount) }}
                      </div>
                      <div class="text-caption text-grey-darken-1">Total Bid</div>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Controls & Statistics in horizontal layout -->
            <v-row class="mt-3">
              <v-col cols="12" md="6">
                <!-- Admin Controls -->
                <v-card class="controls-card" variant="outlined">
                  <v-card-title class="pa-3">
                    <v-icon class="mr-2">mdi-cog</v-icon>
                    Auction Controls
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text class="pa-3">
                    <div class="d-flex flex-column gap-2">
                      <v-btn
                        v-if="auctionStatus === 'pending'"
                        color="primary"
                        variant="flat"
                        block
                        prepend-icon="mdi-play"
                        @click="startAuction"
                        :loading="loading"
                        class="text-none"
                      >
                        Start Auction
                      </v-btn>

                      <v-btn
                        v-if="auctionStatus === 'live'"
                        color="warning"
                        variant="flat"
                        block
                        prepend-icon="mdi-pause"
                        @click="pauseAuction"
                        :loading="loading"
                        class="text-none"
                      >
                        Pause Auction
                      </v-btn>

                      <v-btn
                        v-if="auctionStatus === 'live'"
                        color="error"
                        variant="outlined"
                        block
                        prepend-icon="mdi-stop"
                        @click="endAuction"
                        :loading="loading"
                        class="text-none"
                      >
                        End Auction
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <!-- Statistics -->
                <v-card class="statistics-card" variant="outlined">
                  <v-card-title class="pa-3">
                    <v-icon class="mr-2">mdi-chart-line</v-icon>
                    Statistics
                  </v-card-title>
                  <v-divider></v-divider>
                  <v-card-text class="pa-3">
                    <div class="stats-grid">
                      <div class="stat-item">
                        <div class="stat-value text-h6 text-primary">
                          {{ totalBidders }}
                        </div>
                        <div class="stat-label text-caption">Total Bidders</div>
                      </div>
                      <div class="stat-item">
                        <div class="stat-value text-h6 text-primary">{{ totalBids }}</div>
                        <div class="stat-label text-caption">Total Bids</div>
                      </div>
                      <div class="stat-item">
                        <div class="stat-value text-h6 text-primary">
                          {{ activeBidders }}
                        </div>
                        <div class="stat-label text-caption">Active Now</div>
                      </div>
                      <div class="stat-item">
                        <div class="stat-value text-h6 text-primary">
                          ₱{{ formatPrice(averageBid) }}
                        </div>
                        <div class="stat-label text-caption">Avg Bid</div>
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>
    </v-card-text>

    <!-- Winner Modal -->
    <v-dialog v-model="showWinnerModal" max-width="500" persistent>
      <v-card>
        <v-card-title class="text-center pa-4">
          <v-icon size="48" color="success" class="mb-2">mdi-trophy</v-icon>
          <div>Auction Winner!</div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="text-center pa-4">
          <div class="winner-info">
            <v-avatar size="64" color="primary" class="mb-3">
              <span class="text-white text-h5">{{ winnerInitials }}</span>
            </v-avatar>
            <h3 class="text-h5 mb-2">{{ winner?.bidderName }}</h3>
            <div class="text-h4 text-success font-weight-bold mb-2">
              ₱{{ formatPrice(winner?.amount) }}
            </div>
            <div class="text-body-1 text-grey-darken-1">
              Winning bid for {{ stallData.name }}
            </div>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-center pa-4">
          <v-btn
            color="success"
            variant="flat"
            prepend-icon="mdi-check"
            @click="confirmWinner"
          >
            Confirm Winner
          </v-btn>
          <v-btn color="grey" variant="outlined" @click="closeWinnerModal"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script src="./AuctionLivePanel.js"></script>
<style scoped src="./AuctionLivePanel.css"></style>
