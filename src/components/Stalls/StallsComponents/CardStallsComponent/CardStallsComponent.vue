<template>
  <div class="stalls-grid">
    <v-card
      v-for="stall in stalls"
      :key="stall.id"
      class="stall-card clickable-card"
      elevation="2"
      @click="handleCardClick(stall)"
    >
      <!-- Stall Image with floating price type badge -->
      <div class="image-container">
        <v-img :src="stall.image" height="200" cover class="stall-image">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular
                color="grey-lighten-4"
                indeterminate
              ></v-progress-circular>
            </div>
          </template>
        </v-img>

        <!-- Floating Price Type Badge -->
        <v-chip
          v-if="stall.priceType && stall.priceType !== 'Fixed Price'"
          :color="getPriceTypeColor(stall.priceType)"
          size="small"
          variant="elevated"
          class="floating-badge"
        >
          {{ stall.priceType }}
        </v-chip>
      </div>

      <!-- Stall Details -->
      <v-card-text class="stall-details flex-grow-1">
        <!-- Stall Number and Price Section -->
        <div class="header-section">
          <div class="stall-info-header">
            <v-chip
              color="primary"
              size="small"
              variant="elevated"
              class="stall-number-chip"
            >
              {{ stall.stallNumber || stall.id }}
            </v-chip>
            <span class="price">{{ stall.price }}</span>
          </div>
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
            <div class="description-container">
              <p
                class="stall-description"
                :class="{
                  'description-truncated': !isDescriptionExpanded(
                    stall.stallNumber || stall.id
                  ),
                }"
              >
                {{ stall.description }}
              </p>
              <span
                v-if="isDescriptionLong(stall.description)"
                @click="toggleDescription(stall)"
                class="show-more-text"
              >
                {{
                  isDescriptionExpanded(stall.stallNumber || stall.id) ? "less" : "more"
                }}
                <v-icon
                  size="x-small"
                  :class="{
                    'rotate-180': isDescriptionExpanded(stall.stallNumber || stall.id),
                  }"
                  class="transition-transform"
                >
                  mdi-chevron-down
                </v-icon>
              </span>
            </div>
          </div>
        </div>
      </v-card-text>

      <!-- Special Manage Buttons for Raffle and Auction -->
      <v-card-actions
        v-if="stall.priceType === 'Raffle' || stall.priceType === 'Auction'"
        class="button-actions"
      >
        <div class="buttons-container">
          <!-- Raffle Management Button -->
          <v-btn
            v-if="stall.priceType === 'Raffle'"
            color="primary"
            variant="elevated"
            size="small"
            @click.stop="handleRaffleManagement(stall)"
            class="action-btn"
          >
            <v-icon left size="small" class="me-2">mdi-ticket-percent</v-icon>
            MANAGE RAFFLE
          </v-btn>

          <!-- Auction Management Button -->
          <v-btn
            v-if="stall.priceType === 'Auction'"
            color="primary"
            variant="elevated"
            size="small"
            @click.stop="handleAuctionManagement(stall)"
            class="action-btn"
          >
            <v-icon left size="small" class="me-2">mdi-gavel</v-icon>
            MANAGE AUCTION
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script src="./CardStallsComponent.js"></script>
<style scoped src="./CardStallStyle.css"></style>
