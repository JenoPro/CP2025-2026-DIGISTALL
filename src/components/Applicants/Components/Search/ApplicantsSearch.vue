<template>
  <div class="search-filter-section mb-6">
    <v-row align="center">
      <!-- Search Bar -->
      <v-col cols="12" md="6" lg="4">
        <v-text-field
          v-model="searchQuery"
          label="Search Applicants"
          placeholder="Search applicants..."
          variant="outlined"
          clearable
          hide-details
          prepend-inner-icon="mdi-magnify"
          @input="onSearchInput"
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
            Filter
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
                    <v-icon icon="mdi-filter-variant" size="small" class="mr-2"></v-icon>
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
                  <!-- Status Filter -->
                  <div class="filter-group">
                    <div class="filter-label">STATUS</div>
                    <div class="status-buttons">
                      <v-btn
                        v-for="status in statusOptions"
                        :key="status.value"
                        :variant="selectedStatus === status.value ? 'flat' : 'outlined'"
                        :color="selectedStatus === status.value ? 'primary' : 'default'"
                        class="status-btn"
                        @click="selectStatus(status.value)"
                      >
                        {{ status.title }}
                      </v-btn>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="filter-actions">
                    <v-btn
                      variant="outlined"
                      color="grey"
                      class="action-btn clear-btn"
                      @click="clearFilters"
                    >
                      Clear All
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
</template>

<script src="./ApplicantsSearch.js"></script>
<style scoped src="./ApplicantsSearch.css"></style>
