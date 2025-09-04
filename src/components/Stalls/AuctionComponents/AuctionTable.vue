<template>
    <div class="auction-table-wrapper">
        <v-card class="auction-card" elevation="3">
            <v-card-title>
                Auction Participants - {{ stall?.stallNumber || 'No Stall Selected' }}
            </v-card-title>

            <!-- Vuetify Data Table -->
            <v-data-table :headers="headers" :items="participants" class="auction-table" density="compact"
                :item-class="item => item.status === 'Won' ? 'winner' : item.status === 'Lost' ? 'lost' : ''">
                <!-- Status Column -->
                <template v-slot:[`item.status`]="{ item }">
                    <v-chip :color="item.status === 'Won' ? 'green' : item.status === 'Lost' ? 'red' : 'grey'" dark
                        size="small">
                        {{ item.status }}
                    </v-chip>
                </template>

                <!-- Actions Column -->
                <template v-slot:[`item.actions`]="{ item }">
                    <v-btn size="small" color="success" variant="outlined" :disabled="item.status !== 'Pending'"
                        @click="markAsWon(item)">
                        Mark as Winner
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>

        <!-- Custom Success Popup Modal -->
        <v-dialog v-model="showSuccessPopup" max-width="400px" persistent @click:outside="closeSuccessPopup">
            <v-card class="success-popup-card">
                <div class="popup-content">
                    <!-- Close Button -->
                    <v-btn icon class="close-btn" @click="closeSuccessPopup">
                        <v-icon color="white">mdi-close</v-icon>
                    </v-btn>

                    <!-- Loading State -->
                    <div v-if="popupState === 'loading'" class="popup-state">
                        <div class="loading-spinner">
                            <div class="spinner-ring"></div>
                            <div class="spinner-ring"></div>
                            <div class="spinner-ring"></div>
                        </div>
                        <p class="popup-text">Processing auction result...</p>
                    </div>

                    <!-- Success State -->
                    <div v-else-if="popupState === 'success'" class="popup-state">
                        <div class="success-icon">
                            <div class="checkmark-circle">
                                <div class="checkmark"></div>
                            </div>
                        </div>
                        <h3 class="success-title">Success!</h3>
                        <p class="popup-text">{{ successMessage }}</p>
                    </div>
                </div>
            </v-card>
        </v-dialog>
    </div>
</template>

<script src="./AuctionTable.js"></script>
<style scoped src="./AuctionStyles.css"></style>