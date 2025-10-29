<template>
  <div class="active-raffles">
    <!-- Search and Filters Section -->
    <SearchAndFilter 
      :raffles-data="activeRaffles" 
      @filtered-raffles="handleFilteredRaffles"
    />

    <!-- Raffles Cards Section -->
    <v-card>
      <v-card-text>

        <!-- Loading State -->
        <div v-if="loading && raffles.length === 0" class="text-center py-8">
          <v-progress-circular
            indeterminate
            color="primary"
            size="60"
          ></v-progress-circular>
          <p class="mt-4">Loading active raffles...</p>
        </div>

        <!-- No Data State -->
        <div
          v-else-if="!loading && filteredRaffles.length === 0"
          class="text-center py-8"
        >
          <v-icon size="64" color="grey lighten-1">mdi-ticket-outline</v-icon>
          <h3 class="mt-4 grey--text">No Active Raffles</h3>
          <p class="grey--text">Create a new raffle stall to get started.</p>
        </div>

        <!-- Raffles Grid -->
        <v-row v-else>
          <v-col
            v-for="raffle in filteredRaffles"
            :key="raffle.raffle_id"
            cols="12"
            md="6"
            lg="4"
          >
            <raffle-card
              :raffle="raffle"
              @extend-timer="handleExtendTimer"
              @view-details="handleViewDetails"
              @view-participants="handleViewParticipants"
              @select-winner="handleSelectWinner"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Extend Timer Dialog -->
    <v-dialog v-model="showExtendDialog" max-width="400px" persistent>
      <v-card>
        <v-card-title>Extend Raffle Timer</v-card-title>
        <v-card-text>
          <p class="mb-4">
            Current expiry: {{ formatDateTime(selectedRaffle?.expires_at) }}
          </p>
          <v-text-field
            v-model="extensionHours"
            label="Additional Hours"
            type="number"
            min="1"
            max="168"
            outlined
            dense
            :rules="[rules.required, rules.positiveNumber, rules.maxExtension]"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="closeExtendDialog">Cancel</v-btn>
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
          Select Winner Now?
        </v-card-title>
        <v-card-text>
          <p>
            Are you sure you want to select a winner for
            <strong>{{ selectedRaffle?.stall_number }}</strong> now?
          </p>
          <p class="mt-2">
            Current participants: {{ selectedRaffle?.participant_count || 0 }}
          </p>
          <v-alert type="warning" outlined class="mt-3">
            This action cannot be undone. The raffle will end immediately.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="outlined" @click="closeWinnerDialog">Cancel</v-btn>
          <v-btn color="primary" @click="confirmSelectWinner" :loading="selectingWinner">
            Select Winner
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script src="./ActiveRaffles.js"></script>
<style scoped src="./ActiveRaffles.css"></style>
