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
    </div>
</template>

<script src="./AuctionTable.js"></script>
<style scoped src="./AuctionStyles.css"></style>