<template>
  <div class="search-filter-container">
    <div class="search-filter-section">
      <v-row align="center">
        <!-- Search Bar -->
        <v-col cols="12" md="6" lg="4">
          <v-text-field
            v-model="searchQuery"
            label="Search Stalls"
            placeholder="Search by stall number, location, or description..."
            variant="outlined"
            clearable
            hide-details
            prepend-inner-icon="mdi-magnify"
            class="search-field"
          ></v-text-field>
        </v-col>

        <!-- Spacer -->
        <v-col cols="12" md="4" lg="6" class="d-none d-md-block">
          <!-- Empty space to push filter to the right -->
        </v-col>

        <!-- Filter Button -->
        <v-col cols="12" md="2" lg="2" class="text-right">
          <div class="filter-container" ref="filterContainer">
            <v-btn
              variant="outlined"
              prepend-icon="mdi-filter-variant"
              @click="toggleFilter"
              class="filter-btn"
              :class="{ 'filter-active': showFilterPanel }"
            >
              Filters
              <v-icon
                :icon="showFilterPanel ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                size="small"
                class="ml-1"
              ></v-icon>
            </v-btn>

            <!-- Filter Dropdown Panel -->
            <transition name="slide-down">
              <div v-show="showFilterPanel" class="filter-dropdown">
                <v-card elevation="8" class="filter-card">
                  <div class="filter-header">
                    <div class="d-flex align-center">
                      <v-icon
                        icon="mdi-filter-variant"
                        size="small"
                        class="mr-2"
                      ></v-icon>
                      <span class="filter-title">FILTER OPTIONS</span>
                    </div>
                    <v-btn
                      icon="mdi-close"
                      variant="text"
                      size="small"
                      class="close-btn"
                      @click="showFilterPanel = false"
                    ></v-btn>
                  </div>

                  <div class="filter-content">
                    <!-- Filter Groups in Rows -->
                    <div class="filter-groups">
                      <!-- First Row - Floor and Section -->
                      <div class="filter-row">
                        <div class="filter-group">
                          <div class="filter-label">
                            <v-icon size="small" class="mr-1">mdi-floor-plan</v-icon>
                            FLOOR
                          </div>
                          <v-select
                            v-model="selectedFloor"
                            :items="floorOptions"
                            placeholder="Select floor"
                            variant="outlined"
                            clearable
                            hide-details
                            class="filter-select"
                            density="compact"
                          ></v-select>
                        </div>

                        <div class="filter-group">
                          <div class="filter-label">
                            <v-icon size="small" class="mr-1">mdi-store</v-icon>
                            SECTION
                          </div>
                          <v-select
                            v-model="selectedSection"
                            :items="sectionOptions"
                            placeholder="Select section"
                            variant="outlined"
                            clearable
                            hide-details
                            class="filter-select"
                            density="compact"
                          ></v-select>
                        </div>
                      </div>

                      <!-- Second Row - Location and Price Type -->
                      <div class="filter-row">
                        <div class="filter-group">
                          <div class="filter-label">
                            <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
                            LOCATION
                          </div>
                          <v-select
                            v-model="selectedLocation"
                            :items="locationOptions"
                            placeholder="Select location"
                            variant="outlined"
                            clearable
                            hide-details
                            class="filter-select"
                            density="compact"
                          ></v-select>
                        </div>

                        <div class="filter-group">
                          <div class="filter-label">
                            <v-icon size="small" class="mr-1">mdi-currency-php</v-icon>
                            PRICE TYPE
                          </div>
                          <v-select
                            v-model="selectedPriceType"
                            :items="priceTypeOptions"
                            placeholder="Select price type"
                            variant="outlined"
                            clearable
                            hide-details
                            class="filter-select"
                            density="compact"
                          ></v-select>
                        </div>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="filter-actions">
                      <v-btn
                        variant="outlined"
                        color="grey"
                        class="action-btn clear-btn"
                        prepend-icon="mdi-filter-remove"
                        @click="clearAllFilters"
                      >
                        Clear Filters
                      </v-btn>
                      <v-btn
                        variant="flat"
                        color="primary"
                        class="action-btn apply-btn"
                        @click="applyFilters"
                      >
                        Apply Filters
                      </v-btn>
                    </div>
                  </div>
                </v-card>
              </div>
            </transition>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Results Info -->
    <div class="results-info">
      <v-chip variant="outlined" class="results-chip">
        <v-icon size="small" class="mr-1">mdi-store</v-icon>
        {{ resultCount }} stall{{ resultCount !== 1 ? "s" : "" }} found
      </v-chip>
    </div>
  </div>
</template>

<script src="../SearchAndFilter/SearchAndFilter.js"></script>
<style scoped src="../SearchAndFilter/SearchAndFilterStyle.css"></style>
