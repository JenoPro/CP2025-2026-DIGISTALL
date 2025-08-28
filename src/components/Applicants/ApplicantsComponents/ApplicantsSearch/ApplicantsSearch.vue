<template>
  <div class="search-filter-section mb-6">
    <v-row align="center">
      <!-- Search Bar -->
      <v-col cols="12" md="6" lg="4">
        <v-text-field
          v-model="searchQuery"
          placeholder="Search"
          variant="outlined"
          density="comfortable"
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
        <v-btn
          variant="outlined"
          color="primary"
          prepend-icon="mdi-filter-outline"
          @click="toggleFilter"
          class="filter-btn"
        >
          Filter
        </v-btn>
      </v-col>
    </v-row>

    <!-- Filter Panel (expandable) -->
    <v-expand-transition>
      <div v-show="showFilterPanel" class="filter-panel mt-4">
        <v-card elevation="1" class="pa-4">
          <v-row>
            <v-col cols="12" md="6" lg="3">
              <v-select
                v-model="filters.status"
                :items="statusOptions"
                label="Status"
                variant="outlined"
                density="comfortable"
                hide-details
                clearable
              ></v-select>
            </v-col>

            <v-col cols="12" md="6" lg="3">
              <v-text-field
                v-model="filters.location"
                label="Location"
                variant="outlined"
                density="comfortable"
                hide-details
                clearable
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6" lg="3">
              <v-text-field
                v-model="filters.dateFrom"
                label="Date From"
                type="date"
                variant="outlined"
                density="comfortable"
                hide-details
                clearable
              ></v-text-field>
            </v-col>

            <v-col cols="12" md="6" lg="3">
              <v-text-field
                v-model="filters.dateTo"
                label="Date To"
                type="date"
                variant="outlined"
                density="comfortable"
                hide-details
                clearable
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="mt-3">
            <v-col cols="12" class="d-flex justify-end gap-2">
              <v-btn variant="outlined" color="grey" @click="clearFilters">
                Clear Filters
              </v-btn>
              <v-btn variant="flat" color="primary" @click="applyFilters">
                Apply Filters
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-expand-transition>
  </div>
</template>

<script src="./ApplicantsSearch.js"></script>
<style scoped src="./ApplicantsSearch.css"></style>
