<template>
  <div class="auctions-page">
    <div class="page-header">
      <h1 class="page-title">
        <v-icon large color="white" class="mr-3">mdi-gavel</v-icon>
        Active Auctions
      </h1>
      <p class="page-subtitle">
        Manage and monitor all active auction stalls
      </p>
    </div>

    <active-auctions @show-message="handleMessage" @view-auction-details="handleViewDetails" @view-auction-participants="handleViewParticipants" />

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
              <p v-if="selectedAuction.highest_bidder"><strong>Highest Bidder:</strong> {{
                selectedAuction.highest_bidder }}</p>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDetailsModal">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- View Participants Modal -->
    <v-dialog v-model="showParticipantsModal" max-width="800px" persistent>
      <v-card>
        <v-card-title class="d-flex align-center justify-space-between">
          <span>Auction Bidders</span>
          <v-btn icon @click="closeParticipantsModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text v-if="selectedAuctionForParticipants">
          <stall-participants 
            :stall-id="selectedAuctionForParticipants.stall_id"
            @close="closeParticipantsModal"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Message Snackbar -->
    <v-snackbar v-model="showMessage" :color="messageType" :timeout="messageTimeout" top>
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="showMessage = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script src="./AuctionsPage.js"></script>

<style scoped src="./AuctionsPage.css"></style>
