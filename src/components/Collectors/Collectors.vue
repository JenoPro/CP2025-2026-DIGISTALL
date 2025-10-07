<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <!-- Sidebar -->
  <AppSidebar :items="menuItems" @menu-item-click="handleMenuItemClick" />

  <div class="main-wrapper">
    <!-- Header -->
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
        <!-- Title / Add -->
        <v-row class="align-center mb-4">
          <v-col cols="12" md="6">
            <div class="d-flex align-center ga-4">
              <h2 class="text-h6 text-md-h5 font-weight-bold mb-0">Collectors</h2>
              <div class="text-medium-emphasis">
                Total Collectors: {{ filteredCollectors.length }}
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right">
            <v-btn color="primary" rounded="lg" prepend-icon="mdi-plus" @click="openAddDialog">
              Add Collector
            </v-btn>
          </v-col>
        </v-row>

        <!-- Filters -->
        <v-row class="mb-4" align="center">
          <v-col cols="12" md="4">
            <v-text-field
              v-model="search"
              label="Search"
              variant="outlined"
              density="comfortable"
              clearable
              prepend-inner-icon="mdi-magnify"
            />
          </v-col>
          <v-col cols="12" md="3" class="ml-auto">
            <v-select
              v-model="locationFilter"
              :items="locations"
              label="Assigned Location"
              variant="outlined"
              density="comfortable"
              clearable
            />
          </v-col>
        </v-row>

        <!-- Table -->
        <v-data-table
          :headers="headers"
          :items="filteredCollectors"
          item-key="id"
          class="collectors-table elevation-1"
          :items-per-page="12"
          density="comfortable"
          hover
        >
          <template #item.actions="{ item }">
            <div class="d-flex ga-2">
              <v-btn variant="text" size="small" class="text-primary" @click="edit(item.raw)"
                >Edit</v-btn
              >
              <v-btn variant="text" size="small" class="text-primary" @click="view(item.raw)"
                >View</v-btn
              >
            </div>
          </template>
          <template #no-data>
            <div class="text-medium-emphasis py-8">No collectors found.</div>
          </template>
        </v-data-table>

        <AddCollectorDialog v-model="addDialog" :locations="locations" @save="handleAddSave" />

        <EditCollectorDialog
          v-model="editDialog"
          :data="editData"
          :locations="locations"
          @update="handleEditUpdate"
        />

        <CollectorDetailsDialog
          v-model="detailsDialog"
          :data="detailsData"
          photo="https://i.pravatar.cc/200?img=14"
        />
      </v-container>
    </v-main>
  </div>
</template>

<script src="./Collectors.js"></script>
<style scoped src="./Collectors.css"></style>
