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
                </div>

                <!-- Stall Information -->
                <div class="stall-info">
                    <div class="info-row">
                        <v-icon size="small" color="grey-darken-1">mdi-floor-plan</v-icon>
                        <span>{{ stall.floor }} / {{ stall.section }}</span>
                    </div>
                    <div class="info-row">
                        <v-icon size="small" color="grey-darken-1">mdi-ruler</v-icon>
                        <span>{{ stall.dimensions }}</span>
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
                <v-btn color="primary" variant="elevated" size="small" @click="handleModify(stall)" class="action-btn">
                    <v-icon left size="small" class="me-2">mdi-pencil</v-icon>
                    MODIFY STALL
                </v-btn>

                <!-- Conditional Buttons (for auction and for raffle) added by 28/08/25 -->
                <v-btn v-if="stall.location === 'Satellite Market'" color="secondary" variant="elevated" size="small"
                    @click="handleAuction(stall)" class="action-btn">
                    <v-icon left size="small" class="me-2">mdi-gavel</v-icon>
                    AUCTION
                </v-btn>

                <v-btn v-else-if="stall.location === `Naga City People's Mall`" color="success" variant="elevated"
                    size="small" @click="handleLive(stall)" class="action-btn">
                    <v-icon left size="small" class="me-2">mdi-broadcast</v-icon>
                    LIVE
                </v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script src="../Card/CardStallsComponent.js"></script>
<style scoped src="../Card/CardStallStyle.css"></style>
