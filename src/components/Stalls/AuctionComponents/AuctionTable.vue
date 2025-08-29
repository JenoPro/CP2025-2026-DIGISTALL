<template>
    <div class="auction-table-wrapper">
        <v-card class="auction-card" elevation="3">
            <v-card-title class="d-flex justify-space-between align-center">
                <span>Auction Participants - {{ stall?.stallNumber || 'No Stall Selected' }}</span>
                <v-btn color="primary" size="small" prepend-icon="mdi-history" @click="showAuctionRecords = true">
                    View Auction History
                </v-btn>
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

        <!-- Auction Records Dialog -->
        <AuctionRecords v-if="showAuctionRecords" :stallId="stall?.id" @close="showAuctionRecords = false" />
    </div>
</template>

<script src="./AuctionTable.js"></script>
<style scoped src="./AuctionStyles.css"></style>