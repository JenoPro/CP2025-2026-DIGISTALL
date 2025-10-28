<template>
  <div class="active-auctions">
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon left color="rgb(0, 33, 129)">mdi-gavel</v-icon>
        Active Auctions
      </v-card-title>

      <v-card-text>
        <!-- Search and Filters -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field v-model="search" label="Search auctions..." prepend-inner-icon="mdi-magnify" outlined dense
              clearable />
          </v-col>
          <v-col cols="12" md="3">
            <v-select v-model="statusFilter" :items="statusOptions" label="Status Filter" outlined dense clearable />
          </v-col>
          <v-col cols="12" md="3">
            <v-select v-model="sortBy" :items="sortOptions" label="Sort By" outlined dense />
          </v-col>
        </v-row>

        <!-- Loading State -->
        <div v-if="loading && auctions.length === 0" class="text-center py-8">
          <v-progress-circular indeterminate color="primary" size="60"></v-progress-circular>
          <p class="mt-4">Loading active auctions...</p>
        </div>

        <!-- No Data State -->
        <div v-else-if="!loading && filteredAuctions.length === 0" class="text-center py-8">
          <v-icon size="64" color="grey lighten-1">mdi-gavel</v-icon>
          <h3 class="mt-4 grey--text">No Active Auctions</h3>
          <p class="grey--text">Create a new auction stall to get started.</p>
        </div>

        <!-- Auctions Grid -->
        <v-row v-else>
          <v-col v-for="auction in filteredAuctions" :key="auction.auction_id" cols="12" md="6" lg="4">
            <auction-card :auction="auction" @extend-timer="handleExtendTimer" @view-details="handleViewDetails"
              @view-participants="handleViewParticipants" @select-winner="handleSelectWinner" />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Extend Timer Dialog -->
    <v-dialog v-model="showExtendDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title>Extend Auction Timer</v-card-title>
        <v-card-text>
          <p class="mb-4">
            Current expiry: {{ formatDateTime(selectedAuction?.expires_at) }}
          </p>
          <v-text-field v-model="extensionHours" label="Additional Hours" type="number" min="1" max="168" outlined dense
            :rules="[rules.required, rules.positiveNumber, rules.maxExtension]" />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeExtendDialog">Cancel</v-btn>
          <v-btn color="primary" @click="confirmExtendTimer" :loading="extending">
            Extend
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Select Winner Confirmation Dialog -->
    <v-dialog v-model="showWinnerDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title class="error--text">
          <v-icon left color="error">mdi-alert</v-icon>
          End Auction Now?
        </v-card-title>
        <v-card-text>
          <p>
            Are you sure you want to end the auction for
            <strong>{{ selectedAuction?.stall_number }}</strong> now?
          </p>
          <p class="mt-2">
            Current highest bid: ₱{{ formatPrice(selectedAuction?.current_highest_bid) }}
          </p>
          <p>
            Total bidders: {{ selectedAuction?.bidder_count || 0 }}
          </p>
          <v-alert type="warning" outlined class="mt-3">
            This action cannot be undone. The auction will end immediately.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeWinnerDialog">Cancel</v-btn>
          <v-btn color="error" @click="confirmSelectWinner" :loading="selectingWinner">
            End Auction
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script src="./ActiveAuctions.js"></script>
<style scoped src="./ActiveAuctions.css"></style>
