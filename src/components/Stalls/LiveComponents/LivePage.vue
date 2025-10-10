<template>
  <div class="live-page">
    <!-- Loading State -->
    <div v-if="loading" class="d-flex justify-center align-center" style="height: 100vh">
      <v-progress-circular indeterminate color="#1976d2" size="64"></v-progress-circular>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Header with back button and title -->
      <v-app-bar color="#1976d2" dark elevation="4" class="live-header">
        <v-btn icon @click="goBack" color="white" class="mr-3">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>

        <v-toolbar-title class="font-weight-bold">
          Live {{ itemType }} - {{ stallData.name }}
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn v-if="!isLiveActive" color="success" variant="elevated" class="start-live-btn"
          prepend-icon="mdi-broadcast" @click="startLive">
          Start Live
        </v-btn>

        <v-btn v-else color="error" variant="elevated" class="stop-live-btn" prepend-icon="mdi-stop" @click="stopLive">
          Stop Live
        </v-btn>
      </v-app-bar>

      <!-- Main Live Content -->
      <div class="live-content" :class="{ 'auction-mode': isAuction }">
        <v-container fluid>
          <!-- First Container: Video and Control Panel Side by Side -->
          <v-row class="top-container mb-4" :class="{ 'auction-mode': isAuction }">
            <!-- Video Section -->
            <v-col cols="12" md="8" class="video-section">
              <VideoArea ref="videoArea" :is-live="isLiveActive" :video-flip-horizontal="videoFlipHorizontal"
                :video-flip-vertical="videoFlipVertical" :video-filters="videoFilters" :auto-focus="autoFocusEnabled"
                :current-filter="currentVideoFilter" :is-fullscreen="isFullscreen"
                :custom-height="isAuction ? '33rem' : null" :is-auction="isAuction"
                @toggle-auto-focus="onToggleAutoFocus" @apply-effect="onFilterChanged"
                @toggle-flip-horizontal="onFlipHorizontal" @toggle-flip-vertical="onFlipVertical" />

              <!-- Chat Component below video (for non-auctions) -->
              <ChatBox v-if="!isAuction" :messages="chatMessages" @send-message="sendMessage" class="mt-3" />
            </v-col>

            <!-- Control Panel Section -->
            <v-col cols="12" md="4" class="control-section">
              <v-card class="control-panel h-100" elevation="8">
                <v-card-title class="control-header">
                  <v-icon>mdi-cog</v-icon>
                  <span class="ml-2">Control Panel</span>
                </v-card-title>

                <v-card-text class="control-content" :class="{ 'auction-mode': isAuction }">
                  <!-- Stall Information -->
                  <div class="stall-info mb-4">
                    <div class="info-item">
                      <span class="info-label">Stall:</span>
                      <span class="info-value">{{ stallData.name }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Location:</span>
                      <span class="info-value">{{ stallData.location }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Branch:</span>
                      <span class="info-value">{{ stallData.branch_name }}</span>
                    </div>
                    <div class="info-item">
                      <span class="info-label">Status:</span>
                      <v-chip :color="getStatusColor()" size="small" class="status-chip">
                        {{ stallData.status }}
                      </v-chip>
                    </div>
                    <div v-if="isAuction" class="info-item">
                      <span class="info-label">Current Highest Bid:</span>
                      <span class="info-value price-value" style="color: #4caf50; font-weight: bold">
                        ₱{{ formatPrice(getCurrentHighestBid()) }}
                      </span>
                    </div>
                  </div>

                  <!-- Timer -->
                  <div class="timer-container mb-4">
                    <div class="timer-label">Time Remaining</div>
                    <div class="timer-value" :class="{ expired: timeRemaining <= 0 }">
                      {{ timeRemainingText }}
                    </div>
                  </div>

                  <!-- Auction Controls (Only for auctions) -->
                  <div v-if="isAuction" class="auction-controls-section mb-4">
                    <div class="section-title mb-3">
                      <v-icon class="mr-2" size="20">mdi-gavel</v-icon>
                      Auction Controls
                    </div>
                    <div class="controls-buttons">
                      <v-btn v-if="auctionStatus === 'pending'" color="primary" variant="flat" size="default" block
                        prepend-icon="mdi-play" @click="startAuction" :loading="auctionLoading" class="text-none mb-2">
                        Start Auction
                      </v-btn>

                      <v-btn v-if="auctionStatus === 'live'" color="warning" variant="flat" size="default" block
                        prepend-icon="mdi-pause" @click="pauseAuction" :loading="auctionLoading" class="text-none mb-2">
                        Pause Auction
                      </v-btn>

                      <v-btn v-if="auctionStatus === 'live'" color="error" variant="outlined" size="default" block
                        prepend-icon="mdi-stop" @click="endAuction" :loading="auctionLoading" class="text-none">
                        End Auction
                      </v-btn>

                      <v-chip v-if="auctionStatus" :color="getAuctionStatusColor()" size="small" class="mt-2" block>
                        {{ auctionStatus.toUpperCase() }}
                      </v-chip>
                    </div>
                  </div>

                  <!-- Participants Component -->
                  <ParticipantsList :participants="participants" :bidders="bidders || []" :current-event="{
                    type: itemType.toLowerCase(),
                    itemName: stallData.name,
                    currentBid: getCurrentHighestBid(),
                    startingBid: stallData.starting_price,
                    ticketsSold: 0,
                    maxTickets: 100,
                  }" @remove-participant="removeParticipant" @remove-bidder="removeBidder" />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Bottom Container: Full-width Live Monitor (for auction only) -->
          <v-row v-if="isAuction">
            <v-col cols="12">
              <!-- Auction Live Panel (for auctions) -->
              <AuctionLivePanel :stall-data="stallData" :is-live="isLiveActive" @bid-placed="onBidPlaced"
                @auction-ended="onAuctionEnded" />
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Success/Error Messages -->
      <v-snackbar v-model="showMessage" :color="messageType" :timeout="3000" top right>
        {{ message }}
      </v-snackbar>
    </div>
  </div>
</template>

<script src="./LivePage.js"></script>
<style scoped src="./LivePage.css"></style>
