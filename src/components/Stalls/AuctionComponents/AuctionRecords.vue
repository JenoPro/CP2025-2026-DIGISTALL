<template>
    <v-dialog v-model="showDialog" persistent max-width="1200px" scrollable>
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center pa-4">
                <div class="d-flex align-center">
                    <v-icon class="mr-2" color="primary">mdi-history</v-icon>
                    <span class="text-h5">Auction Records</span>
                </div>
                <v-btn icon variant="text" @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="pa-0">
                <!-- Loading State -->
                <div v-if="loading" class="d-flex justify-center align-center pa-8">
                    <v-progress-circular indeterminate size="64" color="primary"></v-progress-circular>
                    <span class="ml-4 text-h6">Loading auction records...</span>
                </div>

                <!-- Error State -->
                <v-alert v-if="error && !loading" type="error" class="ma-4">
                    <div class="text-h6">Failed to load auction records</div>
                    <div>{{ error }}</div>
                    <template v-slot:append>
                        <v-btn color="red" variant="text" @click="fetchAuctionRecords">
                            Retry
                        </v-btn>
                    </template>
                </v-alert>

                <!-- Auction Records Table -->
                <div v-if="!loading && !error">
                    <!-- Search and Filter Bar -->
                    <div class="pa-4 border-b">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="searchQuery" label="Search auction records"
                                    prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" clearable
                                    hide-details placeholder="Search by stall number, winner, or date"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-select v-model="selectedStatus" :items="statusOptions" label="Status"
                                    variant="outlined" density="compact" clearable hide-details></v-select>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-select v-model="sortBy" :items="sortOptions" label="Sort By" variant="outlined"
                                    density="compact" hide-details></v-select>
                            </v-col>
                        </v-row>
                    </div>

                    <!-- Records Count -->
                    <div class="pa-4 bg-grey-lighten-4">
                        <v-chip color="info" variant="outlined">
                            {{ filteredRecords.length }} record{{ filteredRecords.length !== 1 ? 's' : '' }} found
                        </v-chip>
                    </div>

                    <!-- Data Table -->
                    <v-data-table :headers="headers" :items="filteredRecords" :loading="loading" class="elevation-0"
                        :items-per-page="10" :search="searchQuery">
                        <!-- Stall Number Column -->
                        <template v-slot:[`item.stallNumber`]="{ item }">
                            <v-chip size="small" color="primary" variant="outlined">
                                {{ item.stallNumber }}
                            </v-chip>
                        </template>

                        <!-- Auction Date Column -->
                        <template v-slot:[`item.auctionDate`]="{ item }">
                            <div>
                                <div class="text-body-2">{{ formatDate(item.auctionDate) }}</div>
                                <div class="text-caption text-grey">{{ formatTime(item.auctionDate) }}</div>
                            </div>
                        </template>

                        <!-- Starting Price Column -->
                        <template v-slot:[`item.startingPrice`]="{ item }">
                            <div class="text-body-2 font-weight-medium">
                                ₱{{ Number(item.startingPrice).toLocaleString() }}
                            </div>
                        </template>

                        <!-- Winning Bid Column -->
                        <template v-slot:[`item.winningBid`]="{ item }">
                            <div class="text-body-2 font-weight-bold text-success">
                                ₱{{ Number(item.winningBid).toLocaleString() }}
                            </div>
                        </template>

                        <!-- Winner Column -->
                        <template v-slot:[`item.winner`]="{ item }">
                            <div v-if="item.winner">
                                <div class="text-body-2 font-weight-medium">{{ item.winner }}</div>
                                <div class="text-caption text-grey">{{ item.winnerContact }}</div>
                            </div>
                            <v-chip v-else size="small" color="grey" variant="outlined">
                                No Winner
                            </v-chip>
                        </template>

                        <!-- Status Column -->
                        <template v-slot:[`item.status`]="{ item }">
                            <v-chip :color="getStatusColor(item.status)" size="small" variant="elevated">
                                {{ item.status }}
                            </v-chip>
                        </template>

                        <!-- Actions Column -->
                        <template v-slot:[`item.actions`]="{ item }">
                            <div class="d-flex gap-1">
                                <v-btn icon size="small" variant="text" color="primary" @click="viewDetails(item)">
                                    <v-icon size="small">mdi-eye</v-icon>
                                </v-btn>
                                <v-btn icon size="small" variant="text" color="info" @click="downloadRecord(item)">
                                    <v-icon size="small">mdi-download</v-icon>
                                </v-btn>
                            </div>
                        </template>

                        <!-- No Data State -->
                        <template v-slot:no-data>
                            <div class="text-center pa-8">
                                <v-icon size="64" color="grey-lighten-2">mdi-database-off</v-icon>
                                <div class="text-h6 mt-4 mb-2 text-grey">No auction records found</div>
                                <div class="text-body-2 text-grey">
                                    There are no auction records matching your search criteria.
                                </div>
                            </div>
                        </template>
                    </v-data-table>
                </div>
            </v-card-text>

            <!-- Dialog Actions -->
            <v-divider></v-divider>
            <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn color="primary" variant="outlined" @click="exportRecords" prepend-icon="mdi-export">
                    Export All
                </v-btn>
                <v-btn color="primary" variant="elevated" @click="closeDialog">
                    Close
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script src="./AuctionRecord.js"></script>

<style scoped>
.border-b {
    border-bottom: 1px solid #e0e0e0;
}

.gap-1 {
    gap: 4px;
}

.v-data-table {
    border-radius: 0;
}

.v-data-table th {
    background-color: #f5f5f5;
    font-weight: 600;
}
</style>
