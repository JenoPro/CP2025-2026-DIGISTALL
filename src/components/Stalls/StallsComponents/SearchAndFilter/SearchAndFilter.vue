<template>
  <div class="search-filter-section mb-6">
    <div class="search-wrapper">
      <!-- Search Bar -->
      <v-col cols="12" md="6" lg="4">
        <v-text-field v-model="searchQuery" label="Search stalls" prepend-inner-icon="mdi-magnify" variant="outlined"
          clearable hide-details class="search-field"
          placeholder="Search by stall number, location, or description"></v-text-field>
      </v-col>

      <!-- Filter Button -->
      <div class="filter-sort-container">
        <div class="filter-container" ref="filterContainer">
          <button class="filter-btn" :class="{ 'filter-active': showFilters }" @click="toggleFilter">
            <v-icon icon="mdi-filter-variant" size="small" class="mr-2"></v-icon>
            Filter & Sort
            <v-icon :icon="showFilters ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="small" class="ml-1"></v-icon>
          </button>

          <!-- Filter Dropdown Panel -->
          <transition name="slide-down">
            <div v-show="showFilters" class="filter-dropdown">
              <div class="filter-card">
                <div class="filter-header">
                  <div class="filter-header-content">
                    <v-icon icon="mdi-filter-variant" size="small" class="mr-2"></v-icon>
                    <h6 class="filter-title">Filter Options</h6>
                  </div>
                  <button class="close-btn" @click="showFilters = false">
                    <v-icon icon="mdi-close" size="small"></v-icon>
                  </button>
                </div>

                <div class="filter-content">
                  <!-- Floor Filter -->
                  <div class="filter-group">
                    <label class="filter-label">Floor</label>
                    <v-select v-model="selectedFloor" :items="floorOptions" variant="outlined" density="comfortable"
                      clearable hide-details prepend-inner-icon="mdi-floor-plan"></v-select>
                  </div>

                  <!-- Section Filter -->
                  <div class="filter-group">
                    <label class="filter-label">Section</label>
                    <v-select v-model="selectedSection" :items="sectionOptions" variant="outlined" density="comfortable"
                      clearable hide-details prepend-inner-icon="mdi-store"></v-select>
                  </div>

                  <!-- Location Filter -->
                  <div class="filter-group">
                    <label class="filter-label">Location</label>
                    <v-select v-model="selectedLocation" :items="locationOptions" variant="outlined"
                      density="comfortable" clearable hide-details prepend-inner-icon="mdi-map-marker"></v-select>
                  </div>

                  <!-- Sort By -->
                  <div class="filter-group">
                    <label class="filter-label">Sort By</label>
                    <v-select v-model="sortField" :items="sortOptions" variant="outlined" density="comfortable"
                      hide-details prepend-inner-icon="mdi-sort-alphabetical-ascending">
                    </v-select>
                  </div>

                  <!-- Price Type Filter -->
                  <div class="filter-group">
                    <label class="filter-label">Price Type</label>
                    <div class="status-buttons">
                      <button class="status-btn" :class="{ active: selectedPriceType === 'Fixed Price' }"
                        @click="selectedPriceType = selectedPriceType === 'Fixed Price' ? null : 'Fixed Price'">
                        Fixed Price
                      </button>
                      <button class="status-btn" :class="{ active: selectedPriceType === 'Auction' }"
                        @click="selectedPriceType = selectedPriceType === 'Auction' ? null : 'Auction'">
                        Auction
                      </button>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="filter-actions">
                    <button class="clear-btn" @click="clearAllFilters">Clear All</button>
                    <button class="apply-btn" @click="applyFilters">Apply</button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Results Info -->
    <div class="results-info mt-4 d-flex justify-space-between align-center">
      <div class="results-left">
        <v-chip variant="outlined" class="results-chip">
          {{ resultCount }} stall{{ resultCount !== 1 ? 's' : '' }} found
        </v-chip>
        <!-- Active Sort Indicator -->
        <v-chip v-if="sortField && sortField !== 'default'" variant="outlined" class="sort-indicator ml-2">
          <v-icon icon="mdi-sort" size="small" class="mr-1"></v-icon>
          Sorted by {{ getSortFieldLabel(sortField) }}
          <v-icon icon="mdi-close" size="small" class="ml-1 cursor-pointer" @click="clearSort"></v-icon>
        </v-chip>
      </div>
      <v-btn color="info" variant="outlined" size="small" prepend-icon="mdi-history"
        @click="$emit('show-auction-records')">
        View All Auction Records
      </v-btn>
    </div>
  </div>
</template>

<script src="../SearchAndFilter/SearchAndFilter.js"></script>
<style scoped src="../SearchAndFilter/SearchAndFilterStyle.css"></style>