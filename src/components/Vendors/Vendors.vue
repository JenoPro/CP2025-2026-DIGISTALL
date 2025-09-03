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
          <v-col cols="6" md="3">
            <v-select
              v-model="collectorFilter"
              :items="collectors"
              label="Assigned Collector"
              variant="outlined"
              density="comfortable"
              clearable
            />
          </v-col>
          <v-col cols="6" md="3">
            <v-select
              v-model="statusFilter"
              :items="statuses"
              label="Status"
              variant="outlined"
              density="comfortable"
              clearable
            />
          </v-col>
        </v-row>

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
