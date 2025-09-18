<template>
  <div class="search-filter-section">
    <v-row no-gutters class="align-center justify-space-between">
      <!-- Search Field -->
      <v-col cols="12" md="6" lg="4">
        <v-text-field
          v-model="searchQuery"
          label="Search compliance"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          hide-details
          class="search-field"
          placeholder="Search by stallholder, stall, violation..."
        ></v-text-field>
      </v-col>

      <!-- Filter Button -->
      <v-col cols="auto">
        <div class="filter-container" ref="filterContainer">
          <button
            class="filter-btn"
            :class="{ 'filter-active': showFilterPanel }"
            @click="toggleFilter"
          >
            <v-icon icon="mdi-filter-variant" size="small" class="mr-2"></v-icon>
            Filter
            <v-icon
              :icon="showFilterPanel ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              size="small"
              class="ml-1"
            ></v-icon>
          </button>

          <!-- Filter Dropdown Panel -->
          <transition name="slide-down">
            <div v-show="showFilterPanel" class="filter-dropdown">
              <div class="filter-card">
                <div class="filter-header">
                  <span class="filter-title">Filter Options</span>
                  <button
                    class="close-btn"
                    @click="showFilterPanel = false"
                  >
                    <v-icon icon="mdi-close" size="small"></v-icon>
                  </button>
                </div>

                <div class="filter-content">
                  <!-- Status Filter -->
                  <div class="filter-group">
                    <label class="filter-label">Status</label>
                    <div class="status-buttons">
                      <button
                        class="status-btn"
                        :class="{ active: activeFilter === 'all' }"
                        @click="setFilter('all')"
                      >
                        All
                      </button>
                      <button
                        class="status-btn"
                        :class="{ active: activeFilter === 'complete' }"
                        @click="setFilter('complete')"
                      >
                        Complete
                      </button>
                      <button
                        class="status-btn"
                        :class="{ active: activeFilter === 'incomplete' }"
                        @click="setFilter('incomplete')"
                      >
                        Incomplete
                      </button>
                      <button
                        class="status-btn"
                        :class="{ active: activeFilter === 'pending' }"
                        @click="setFilter('pending')"
                      >
                        Pending
                      </button>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="filter-actions">
                    <button class="action-btn secondary" @click="clearAllFilters">
                      Clear All
                    </button>
                    <button class="action-btn primary" @click="applyFilters">
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script src="./ComplianceSearch.js"></script>
<style scoped src="./ComplianceSearch.css"></style>
