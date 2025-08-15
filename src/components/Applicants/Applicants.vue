<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-app>
    <!-- Sidebar Component -->
    <AppSidebar :items="menuItems" @menu-item-click="handleMenuItemClick" />

    <div class="main-wrapper">
      <!-- Header Component -->
      <AppHeader
        :title="pageTitle"
        @notification-click="handleNotificationClick"
        @profile-click="handleProfileClick"
        @settings-click="handleSettingsClick"
        @logout-click="handleLogoutClick"
      />

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

              <!-- Search and Filter Section -->
              <VendorSearchFilter @search="handleSearch" @filter="handleFilter" />

              <!-- Applicants Table -->
              <VendorApplicantsTable
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