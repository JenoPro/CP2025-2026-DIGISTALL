<template>
  <div class="search-filter-section mb-6">
    <div class="search-wrapper">
      <!-- Search Bar -->
      <div class="search-input-wrapper">
        <div class="search-input-container">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search stallholders..." 
            class="search-input"
            @input="handleSearch"
          />
          <button v-if="searchQuery" class="clear-search-btn" @click="clearSearch">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Filter Button -->
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
                <div class="filter-header-content">
                  <v-icon icon="mdi-filter-variant" size="small" class="mr-2"></v-icon>
                  <h6 class="filter-title">Filter Options</h6>
                </div>
                <button class="close-btn" @click="showFilterPanel = false">
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
                      :class="{ active: activeFilter === 'active' }"
                      @click="setFilter('active')"
                    >
                      Active
                    </button>
                    <button 
                      class="status-btn"
                      :class="{ active: activeFilter === 'inactive' }"
                      @click="setFilter('inactive')"
                    >
                      Inactive
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
                  <button class="clear-btn" @click="clearAllFilters">
                    Clear All
                  </button>
                  <button class="apply-btn" @click="applyFilters">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script src="./SearchStall.js"></script>
<style scoped src="./SearchStall.css"></style>