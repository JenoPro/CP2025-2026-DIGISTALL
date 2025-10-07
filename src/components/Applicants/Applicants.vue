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
                        :class="{ active: currentApplicantType === type.label }"
                        @click="selectApplicantType(type)"
                      >
                        {{ type.label }}
                      </div>
                    </div>
                  </transition>
                </div>
              </div>

              <!-- Search and Filter Section -->
              <VendorSearchFilter @search="handleSearch" @filter="handleFilter" />

              <!-- Loading State -->
              <div
                v-if="loading && currentApplicantType === 'Stall Applicants'"
                class="text-center py-8"
              >
                <v-progress-circular
                  indeterminate
                  color="primary"
                  size="64"
                ></v-progress-circular>
                <p class="mt-4 text-h6">Loading stall applicants...</p>
              </div>

              <!-- Error State -->
              <div
                v-else-if="error && currentApplicantType === 'Stall Applicants'"
                class="text-center py-8"
              >
                <v-icon color="error" size="64">mdi-alert-circle</v-icon>
                <p class="mt-4 text-h6 error--text">{{ error }}</p>
                <v-btn @click="refreshStallApplicants" color="primary" class="mt-4">
                  <v-icon left>mdi-refresh</v-icon>
                  Retry
                </v-btn>
              </div>

              <!-- Applicants Table -->
              <VendorApplicantsTable
                v-else
                :applicants="filteredApplicants"
                :applicant-type="currentApplicantType"
                @accept="handleAccept"
                @decline="handleDecline"
                @recheck="handleRecheck"
                @refresh="refreshStallApplicants"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <!-- Approve Applicant Modal -->
      <ApproveApplicants
        :applicant="selectedApplicant"
        :show="showApproveModal"
        @close="closeApproveModal"
        @approved="onApplicantApproved"
      />

      <!-- Decline Applicant Modal -->
      <DeclineApplicants
        :applicant="selectedApplicant"
        :show="showDeclineModal"
        @close="closeDeclineModal"
        @declined="onApplicantDeclined"
        @applicant-status-updated="onApplicantStatusUpdated"
      />
    </div>
  </v-app>
</template>

<script src="./Applicants.js"></script>
<style scoped src="./Applicants.css"></style>
