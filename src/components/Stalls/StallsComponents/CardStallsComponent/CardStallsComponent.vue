<template>
    <div class="stalls-grid">
        <v-card v-for="stall in stalls" :key="stall.id" class="stall-card" elevation="2">
            <!-- Stall Image -->
            <v-img :src="stall.image" height="200" cover class="stall-image">
                <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                        <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
                    </div>
                </template>
            </v-img>

            <!-- Stall Details -->
            <v-card-text class="stall-details">
                <!-- Stall Number Badge -->
                <div class="stall-badge">
                    <v-chip color="#002181" size="small" variant="elevated">
                        {{ stall.stallNumber }}
                    </v-chip>
                </div>

                <!-- Price and Payment Info -->
                <div class="price-section">
                    <span class="price">{{ stall.price }}</span>
                    <!-- Price Type Badge -->
                    <v-chip 
                      v-if="stall.priceType && stall.priceType !== 'Fixed Price'"
                      :color="getPriceTypeColor(stall.priceType)"
                      size="small"
                      variant="outlined"
                      class="ml-2"
                    >
                      {{ stall.priceType }}
                    </v-chip>
                </div>

                <!-- Stall Information -->
                <div class="stall-info">
                    <div class="info-row">
                        <v-icon size="small" color="grey-darken-1">mdi-floor-plan</v-icon>
                        <span>{{ stall.floor }} / {{ stall.section }}</span>
                    </div>
                    <div class="info-row">
                        <v-icon size="small" color="grey-darken-1">mdi-ruler</v-icon>
                        <span>{{ stall.size }}</span>
                    </div>
                    <div class="info-row">
                        <v-icon size="small" color="grey-darken-1">mdi-map-marker</v-icon>
                        <span>{{ stall.location }}</span>
                    </div>
                    <div class="description-row">
                        <p class="stall-description">{{ stall.description }}</p>
                    </div>
                </div>
            </v-card-text>

            <!-- Action Buttons -->
            <v-card-actions class="pa-4 button-actions">
                <!-- Standard Edit Button for all stall types -->
                <v-btn 
                  color="primary" 
                  variant="elevated" 
                  size="small" 
                  @click="handleModify(stall)" 
                  class="action-btn"
                >
                    <v-icon left size="small" class="me-2">mdi-pencil</v-icon>
                    MODIFY
                </v-btn>

                <!-- Raffle Management Button -->
                <v-btn 
                  v-if="stall.priceType === 'Raffle'"
                  color="success" 
                  variant="elevated" 
                  size="small"
                  @click="handleRaffleManagement(stall)" 
                  class="action-btn"
                >
                    <v-icon left size="small" class="me-2">mdi-ticket-percent</v-icon>
                    MANAGE RAFFLE
                </v-btn>

                <!-- Auction Management Button -->
                <v-btn 
                  v-if="stall.priceType === 'Auction'"
                  color="error" 
                  variant="elevated" 
                  size="small"
                  @click="handleAuctionManagement(stall)" 
                  class="action-btn"
                >
                    <v-icon left size="small" class="me-2">mdi-gavel</v-icon>
                    MANAGE AUCTION
                </v-btn>

                <!-- Live button for other managers/locations -->
                <v-btn 
                  v-if="stall.location === `Naga City People's Mall` && stall.priceType !== 'Auction' && stall.priceType !== 'Raffle'" 
                  color="success" 
                  variant="elevated"
                  size="small" 
                  @click="handleLive(stall)" 
                  class="action-btn"
                >
                    <v-icon left size="small" class="me-2">mdi-broadcast</v-icon>
                    LIVE
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script src="./CardStallsComponent.js"></script>
<style scoped src="./CardStallStyle.css"></style>
