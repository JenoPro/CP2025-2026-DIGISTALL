<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-slot -->
<!--eslint-disable-next-line vue/multi-word-component-names-->
<template>
  <div>
    <!-- Main Content -->
    <v-main>
      <v-container fluid class="main-content">
        <!-- Page heading row (left: Vendors + total; right: Add button) -->
        <v-row class="align-center mb-4">
          <v-col cols="12" md="6">
            <div class="d-flex align-center ga-4">
              <h2 class="text-h6 text-md-h5 font-weight-bold mb-0">Vendors</h2>
              <div class="text-medium-emphasis">
                Total Vendors: {{ filteredVendors.length }}
              </div>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right">
            <v-btn
              color="primary"
              rounded="lg"
              prepend-icon="mdi-plus"
              @click="openAddDialog"
            >
              Add Vendor
            </v-btn>
          </v-col>
        </v-row>

        <!-- Search and Filter Section -->
        <div class="search-filter-section mb-6">
          <v-row no-gutters class="align-center justify-space-between">
            <!-- Search Field -->
            <v-col cols="12" md="6" lg="4">
              <v-text-field
                v-model="search"
                label="Search vendors"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                clearable
                hide-details
                class="search-field"
                placeholder="Search by name, email, business..."
              ></v-text-field>
            </v-col>

            <!-- Filter Button -->
            <v-col cols="auto">
              <div class="filter-container" ref="filterContainer">
                <v-btn
                  variant="outlined"
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
                </v-btn>

                <!-- Filter Dropdown Panel -->
                <transition name="slide-down">
                  <div v-show="showFilterPanel" class="filter-dropdown">
                    <div class="filter-card">
                      <div class="filter-header">
                        <span class="filter-title">Filter Options</span>
                        <v-btn
                          icon
                          size="small"
                          variant="plain"
                          class="close-btn"
                          @click="showFilterPanel = false"
                        >
                          <v-icon icon="mdi-close" size="small"></v-icon>
                        </v-btn>
                      </div>

                      <div class="filter-content">
                        <!-- Status Filter -->
                        <div class="filter-group">
                          <label class="filter-label">Status</label>
                          <div class="status-buttons">
                            <v-btn
                              variant="outlined"
                              class="status-btn"
                              :class="{ active: statusFilter === null }"
                              @click="statusFilter = null"
                            >
                              All
                            </v-btn>
                            <v-btn
                              v-for="status in statuses"
                              :key="status.value"
                              variant="outlined"
                              class="status-btn"
                              :class="{ active: statusFilter === status.value }"
                              @click="statusFilter = status.value"
                            >
                              {{ status.title }}
                            </v-btn>
                          </div>
                        </div>

                        <!-- Collector Filter -->
                        <div class="filter-group">
                          <label class="filter-label">Assigned Collector</label>
                          <v-select
                            v-model="collectorFilter"
                            :items="collectors"
                            label="Select collector"
                            variant="outlined"
                            clearable
                            density="comfortable"
                          />
                        </div>

                        <!-- Action Buttons -->
                        <div class="filter-actions">
                          <v-btn
                            variant="outlined"
                            class="action-btn"
                            @click="clearAllFilters"
                          >
                            Clear All
                          </v-btn>
                          <v-btn
                            color="primary"
                            class="action-btn"
                            @click="applyFilters"
                          >
                            Apply Filters
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Data Table -->
        <v-data-table
          :headers="headers"
          :items="filteredVendors"
          item-key="id"
          class="vendors-table elevation-1"
          :items-per-page="12"
          density="comfortable"
          hover
        >
          <template #item.actions="{ item }">
            <div class="d-flex ga-2">
              <v-btn
                variant="text"
                size="small"
                class="text-primary"
                @click="edit(item.raw)"
                >Edit</v-btn
              >
              <v-btn
                variant="text"
                size="small"
                class="text-primary"
                @click="view(item.raw)"
                >View</v-btn
              >
            </div>
          </template>
          <template #no-data>
            <div class="text-medium-emphasis py-8">No vendors found.</div>
          </template>
        </v-data-table>

        <!-- Add Vendor Dialog -->
        <AddVendorDialog v-model="addDialog" @save="handleSave" />
        <VendorDetailsDialog
          v-model="detailsDialog"
          :data="detailsData"
          photo="https://i.pravatar.cc/200?img=12"
        />

        <!-- Edit Vendor Details Dialog -->
        <EditVendorDialog
          v-model="editDialog"
          :data="editData"
          @update="handleEditUpdate"
        />
      </v-container>
    </v-main>
  </div>
</template>

<script src="./Vendors.js"></script>
<style scoped src="./Vendors.css"></style>
