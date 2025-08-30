<template>
    <v-dialog v-model="dialog" max-width="1000px">
        <v-card>
            <v-card-title class="headline">
                Auction History
                <v-spacer></v-spacer>
                <v-btn icon @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-card-text>
                <!-- Stall Selector -->
                <div class="stall-selector mb-4">
                    <v-select
                        v-model="selectedStallId"
                        :items="availableStalls"
                        item-title="stallNumber"
                        item-value="id"
                        label="Select Stall"
                        placeholder="Choose a stall to view auction records"
                        variant="outlined"
                        density="comfortable"
                        prepend-inner-icon="mdi-store"
                        clearable
                        class="stall-dropdown"
                    >
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props">
                                <v-list-item-subtitle>{{ item.raw.location }}</v-list-item-subtitle>
                            </v-list-item>
                        </template>
                    </v-select>
                </div>

                <!-- Show message when no stall is selected -->
                <v-alert
                    v-if="!selectedStallId"
                    type="info"
                    variant="tonal"
                    class="mb-4"
                >
                    Please select a stall to view auction records.
                </v-alert>

                <!-- Show tabs and data only when stall is selected -->
                <div v-if="selectedStallId">
                    <v-tabs v-model="activeTab">
                        <v-tab value="winners">Winners</v-tab>
                        <v-tab value="losers">Non-Winners</v-tab>
                        <v-tab value="all">All Participants</v-tab>
                    </v-tabs>

                    <v-window v-model="activeTab">
                    <!-- Winners Tab -->
                    <v-window-item value="winners">
                        <v-data-table :headers="headers" :items="filteredWinners" class="mt-4" density="compact"
                            :item-class="() => 'winner-row'">
                            <template v-slot:[`item.address`]="{ item }">
                                <div class="address-cell">{{ item.address }}</div>
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                <v-chip color="green" dark size="small" class="status-chip winner-chip">
                                    {{ item.status }}
                                </v-chip>
                            </template>
                            <template v-slot:[`item.auctionDate`]="{ item }">
                                {{ formatDate(item.auctionDate) }}
                            </template>
                        </v-data-table>
                    </v-window-item>

                    <!-- Losers Tab -->
                    <v-window-item value="losers">
                        <v-data-table :headers="headers" :items="filteredLosers" class="mt-4" density="compact"
                            :item-class="() => 'loser-row'">
                            <template v-slot:[`item.address`]="{ item }">
                                <div class="address-cell">{{ item.address }}</div>
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                <v-chip color="red" dark size="small" class="status-chip loser-chip">
                                    {{ item.status }}
                                </v-chip>
                            </template>
                            <template v-slot:[`item.auctionDate`]="{ item }">
                                {{ formatDate(item.auctionDate) }}
                            </template>
                        </v-data-table>
                    </v-window-item>

                    <!-- All Participants Tab -->
                    <v-window-item value="all">
                        <v-data-table :headers="headers" :items="auctionRecords" class="mt-4" density="compact"
                            :item-class="item => item.status === 'Won' ? 'winner-row' : 'loser-row'">
                            <template v-slot:[`item.address`]="{ item }">
                                <div class="address-cell">{{ item.address }}</div>
                            </template>
                            <template v-slot:[`item.status`]="{ item }">
                                <v-chip :color="item.status === 'Won' ? 'green' : 'red'" dark size="small"
                                    class="status-chip" :class="item.status === 'Won' ? 'winner-chip' : 'loser-chip'">
                                    {{ item.status }}
                                </v-chip>
                            </template>
                            <template v-slot:[`item.auctionDate`]="{ item }">
                                {{ formatDate(item.auctionDate) }}
                            </template>
                        </v-data-table>
                    </v-window-item>
                </v-window>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script src="./AuctionRecords.js"></script>
<style scoped src="./AuctionRecords.css"></style>