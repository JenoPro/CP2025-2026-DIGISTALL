<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app>
    <div>
      <!-- Main Content -->
      <v-main>
        <v-container fluid class="main-content">
          <v-row>
            <v-col cols="12">
              <!-- Page Title with Dropdown -->
              <div class="page-header mb-6">
                <div class="title-dropdown-container" ref="applicantDropdown">
                  <h2 
                    class="text-h4 font-weight-bold title-with-arrow" 
                    @click="toggleDropdown"
                  >
                    {{ currentApplicantType }}
                    <v-icon 
                      :class="{ 'arrow-rotated': showDropdown }"
                      class="dropdown-arrow"
                    >
                      mdi-chevron-down
                    </v-icon>
                  </h2>
                  
                  <!-- Dropdown Menu -->
                  <transition name="dropdown">
                    <div v-if="showDropdown" class="dropdown-menu">
                      <div 
                        v-for="type in applicantTypes" 
                        :key="type.value"
                        class="dropdown-item"
                        :class="{ 'active': currentApplicantType === type.label }"
                        @click="selectApplicantType(type)"
                      >
                        {{ type.label }}
                      </div>
                    </div>
                  </transition>
                </div>
              </div>

              <!-- Stall Filter Section (only show for stall applicants) -->
              <div v-if="selectedTab === 'stall'" class="stall-filter-section mb-4">
                <v-row align="center">
                  <v-col cols="auto">
                    <v-chip
                      :color="selectedStallId ? 'primary' : 'default'"
                      variant="outlined"
                      @click="toggleStallFilter"
                      class="stall-filter-chip"
                    >
                      <v-icon start>mdi-store</v-icon>
                      {{ getStallDisplayName(selectedStallId) }}
                      <v-icon end>mdi-chevron-down</v-icon>
                    </v-chip>
                  </v-col>
                  <v-col cols="auto" v-if="selectedStallId">
                    <v-btn
                      size="small"
                      variant="text"
                      color="error"
                      @click="clearFilters"
                    >
                      <v-icon start>mdi-close</v-icon>
                      Clear Filter
                    </v-btn>
                  </v-col>
                  <v-col cols="auto">
                    <v-chip color="info" variant="outlined">
                      <v-icon start>mdi-account-group</v-icon>
                      {{ filteredApplicants.length }} Applicant{{ filteredApplicants.length !== 1 ? 's' : '' }}
                    </v-chip>
                  </v-col>
                </v-row>
                
                <!-- Stall Filter Dropdown -->
                <v-menu
                  v-model="showStallFilter"
                  :close-on-content-click="false"
                  location="bottom start"
                  max-height="300"
                >
                  <v-list>
                    <v-list-item @click="selectStall({ stall_id: null })">
                      <v-list-item-title>
                        <v-icon start>mdi-all-inclusive</v-icon>
                        All Stalls
                      </v-list-item-title>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item
                      v-for="stall in availableStalls"
                      :key="stall.stall_id"
                      @click="selectStall(stall)"
                      :active="selectedStallId === stall.stall_id"
                    >
                      <v-list-item-title>
                        <v-icon start>mdi-store</v-icon>
                        {{ stall.stall_no }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ stall.price_type }} • ₱{{ stall.rental_price }}
                        <br>
                        {{ stall.section_name }} - {{ stall.floor_name }}
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>

              <!-- Search and Filter Section -->
              <VendorSearchFilter @search="handleSearch" @filter="handleFilter" />

              <!-- Loading State -->
              <div v-if="loading" class="loading-container">
                <v-progress-circular
                  indeterminate
                  color="primary"
                  size="64"
                ></v-progress-circular>
                <span class="ml-4">Loading applicants...</span>
              </div>

              <!-- Error State -->
              <div v-else-if="error" class="error-container">
                <v-icon>mdi-alert-circle</v-icon>
                {{ error }}
                <v-btn
                  size="small"
                  variant="outlined"
                  color="error"
                  class="ml-4"
                  @click="refreshData"
                >
                  <v-icon start>mdi-refresh</v-icon>
                  Retry
                </v-btn>
              </div>

              <!-- Applicants Table -->
              <VendorApplicantsTable
                v-else
                :applicants="filteredApplicants"
                @accept="handleAccept"
                @decline="handleDecline"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script src="./Applicants.js"></script>
<style scoped src="./Applicants.css"></style>