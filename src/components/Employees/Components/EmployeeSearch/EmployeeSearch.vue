<template>
  <div class="search-filter-section mb-6">
    <v-row align="center">
      <!-- Search Bar -->
      <v-col cols="12" md="6" lg="4">
        <v-text-field
          :model-value="search"
          @update:model-value="$emit('update:search', $event)"
          label="Search Employees"
          placeholder="Search employees..."
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
                </div>
                
                <div class="filter-content">
                  <v-select
                    :model-value="statusFilter"
                    @update:model-value="$emit('update:statusFilter', $event)"
                    :items="statusOptions"
                    item-title="title"
                    item-value="value"
                    label="Filter by Status"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                    class="mb-3"
                  ></v-select>
                  
                  <v-select
                    :model-value="permissionFilter"
                    @update:model-value="$emit('update:permissionFilter', $event)"
                    :items="permissionOptions"
                    item-title="title"
                    item-value="value"
                    label="Filter by Permission"
                    variant="outlined"
                    density="compact"
                    clearable
                    hide-details
                    class="mb-3"
                  ></v-select>
                  
                  <div class="filter-actions">
                    <v-btn 
                      color="primary" 
                      variant="outlined"
                      size="small"
                      @click="$emit('reset')"
                    >
                      <v-icon left>mdi-refresh</v-icon>
                      Reset
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

<script src="./EmployeeSearch.js"></script>

<style scoped src="./EmployeeSearch.css"></style>
