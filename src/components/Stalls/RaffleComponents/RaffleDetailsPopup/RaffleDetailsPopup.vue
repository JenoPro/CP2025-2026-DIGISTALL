<template>
  <div>
    <!-- Enhanced View Details Modal -->
    <v-dialog v-model="showDetailsModal" max-width="700px" persistent>
      <v-card class="raffle-details-card">
        <!-- Simple Header -->
        <v-card-title class="d-flex align-center justify-space-between simple-header">
          <span class="header-title">Raffle Details</span>
          <v-btn icon @click="$emit('close-details-modal')" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <!-- Enhanced Content -->
        <v-card-text v-if="selectedRaffle" class="raffle-content">
          <!-- Status Badge -->
          <div class="status-section">
            <v-chip
              :color="selectedRaffle.status === 'active' ? 'success' : 'warning'"
              variant="flat"
              size="large"
              class="status-chip"
            >
              <v-icon start>{{
                selectedRaffle.status === "active" ? "mdi-check-circle" : "mdi-clock"
              }}</v-icon>
              {{ selectedRaffle.status.toUpperCase() }}
            </v-chip>
          </div>

          <!-- Information Cards -->
          <div class="info-cards">
            <!-- Stall Information Card -->
            <div class="info-card">
              <div class="card-header">
                <v-icon color="primary" size="24">mdi-store</v-icon>
                <h3 class="card-title">Stall Information</h3>
              </div>
              <div class="card-content">
                <div class="detail-item">
                  <span class="detail-label">Stall Number</span>
                  <span class="detail-value">{{ selectedRaffle.stall_number }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Location</span>
                  <span class="detail-value">{{ selectedRaffle.location }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Floor</span>
                  <span class="detail-value">{{ selectedRaffle.floor_name }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Section</span>
                  <span class="detail-value">{{ selectedRaffle.section_name }}</span>
                </div>
                <div class="detail-item highlight">
                  <span class="detail-label">Entry Fee</span>
                  <span class="detail-value price"
                    >₱{{ formatPrice(selectedRaffle.entry_fee) }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Raffle Status Card -->
            <div class="info-card">
              <div class="card-header">
                <v-icon color="primary" size="24">mdi-information</v-icon>
                <h3 class="card-title">Raffle Status</h3>
              </div>
              <div class="card-content">
                <div class="detail-item">
                  <span class="detail-label">Status</span>
                  <span class="detail-value">{{ selectedRaffle.status }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Created</span>
                  <span class="detail-value">{{
                    formatDateTime(selectedRaffle.created_at)
                  }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Expires</span>
                  <span class="detail-value">{{
                    formatDateTime(selectedRaffle.expires_at)
                  }}</span>
                </div>
                <div class="detail-item highlight">
                  <span class="detail-label">Participants</span>
                  <span class="detail-value participant-count">
                    <v-icon color="primary" size="18">mdi-account-group</v-icon>
                    {{ selectedRaffle.participant_count || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Participants Section -->
          <div
            class="recent-participants-section"
            v-if="
              selectedRaffle.recent_participants &&
              selectedRaffle.recent_participants.length > 0
            "
          >
            <div class="section-header">
              <v-icon color="primary" size="24">mdi-account-multiple</v-icon>
              <h3 class="section-title">Recent Participants</h3>
            </div>
            <div class="participants-chips">
              <v-chip
                v-for="participant in selectedRaffle.recent_participants.slice(0, 5)"
                :key="participant.id"
                class="participant-chip"
                color="primary"
                outlined
              >
                <v-avatar left class="chip-avatar">
                  {{ participant.name?.charAt(0)?.toUpperCase() || "U" }}
                </v-avatar>
                {{ participant.name || "Unknown" }}
              </v-chip>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Enhanced View Participants Modal -->
    <v-dialog v-model="showParticipantsModal" max-width="900px" persistent>
      <v-card class="participants-modal-card">
        <stall-participants
          :stall-id="selectedRaffleForParticipants?.stall_id"
          @close="$emit('close-participants-modal')"
        />
      </v-card>
    </v-dialog>
  </div>
</template>

<script src="./RaffleDetailsPopup.js"></script>
<style src="./RaffleDetailsPopup.css"></style>
