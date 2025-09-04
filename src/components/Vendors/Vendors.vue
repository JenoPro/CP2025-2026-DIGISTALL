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
        <!-- Page heading row (left: Vendors + total; right: Add button) -->
        <v-row class="align-center mb-4">
          <v-col cols="12" md="6">
            <div class="d-flex align-center ga-4">
              <h2 class="text-h6 text-md-h5 font-weight-bold mb-0">Vendors</h2>
              <div class="text-medium-emphasis">Total Vendors: {{ filteredVendors.length }}</div>
            </div>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right">
            <v-btn color="primary" rounded="lg" prepend-icon="mdi-plus" @click="openAddDialog">
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

          <v-col cols="12" md="8">
            <div class="filters-right d-flex justify-end ga-3">
              <v-select
                class="filter"
                v-model="collectorFilter"
                :items="collectors"
                label="Assigned Collector"
                variant="outlined"
                density="comfortable"
                clearable
              />
              <v-select
                class="filter"
                v-model="statusFilter"
                :items="statuses"
                label="Status"
                variant="outlined"
                density="comfortable"
                clearable
              />
            </div>
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
              <v-btn variant="text" size="small" class="text-primary" @click="edit(item.raw)"
                >Edit</v-btn
              >
              <v-btn variant="text" size="small" class="text-primary" @click="view(item.raw)"
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
        <EditVendorDialog v-model="editDialog" :data="editData" @update="handleEditUpdate" />
      </v-container>
    </v-main>
  </div>
</template>

<script>
import { computed } from 'vue'
import AppSidebar from '../AppSidebar.vue'
import AppHeader from '../AppHeader.vue'
import AddVendorDialog from './AddVendorDialog.vue'
import VendorDetailsDialog from './VendorDetailsDialog.vue'
import EditVendorDialog from './EditVendorDialog.vue'

export default {
  name: 'Vendors',
  components: { AppSidebar, AppHeader, AddVendorDialog, VendorDetailsDialog, EditVendorDialog },
  data() {
    return {
      pageTitle: 'Vendors',
      addDialog: false,
      detailsDialog: false,
      detailsData: null,
      editDialog: false,
      editData: null, // payload for the dialog (item.raw)
      editTargetId: null, // which row to update

      menuItems: [
        { id: 1, icon: 'mdi-view-dashboard', name: 'Dashboard', active: false },
        { id: 2, icon: 'mdi-credit-card', name: 'Payments', active: false },
        { id: 3, icon: 'mdi-account-plus', name: 'Applicants', active: false },
        { id: 4, icon: 'mdi-chart-line', name: 'Complaints', active: false },
        { id: 5, icon: 'mdi-clipboard-check', name: 'Compliances', active: false },
      ],
      headers: [
        { title: 'Vendor ID', value: 'id', width: 120 },
        { title: "Vendor's Name", value: 'name' },
        { title: 'Business Name', value: 'business' },
        { title: 'Assigned Collector', value: 'collector' },
        { title: 'Status', value: 'status', width: 120 },
        { title: 'Action', value: 'actions', sortable: false, align: 'end', width: 140 },
      ],
      collectors: ['John Smith', 'Jane Garcia', 'Marco Reyes', 'Ava Santos'],
      statuses: ['Active', 'Inactive', 'On Hold'],

      vendors: Array.from({ length: 15 }, (_, i) => ({
        id: 123456 + i,
        name: 'John Doe',
        business: 'Street Fisbol',
        collector: 'John Smith',
        status: 'Active',
      })),

      search: '',
      collectorFilter: null,
      statusFilter: null,

      newVendor: {
        id: '',
        name: '',
        business: '',
        collector: 'John Smith',
        status: 'Active',
      },
    }
  },
  computed: {
    filteredVendors() {
      const term = (this.search || '').toLowerCase().trim()
      return this.vendors.filter((v) => {
        const hitsSearch =
          !term ||
          String(v.id).includes(term) ||
          v.name.toLowerCase().includes(term) ||
          v.business.toLowerCase().includes(term) ||
          v.collector.toLowerCase().includes(term) ||
          v.status.toLowerCase().includes(term)

        const hitsCollector = !this.collectorFilter || v.collector === this.collectorFilter
        const hitsStatus = !this.statusFilter || v.status === this.statusFilter

        return hitsSearch && hitsCollector && hitsStatus
      })
    },
  },
  mounted() {
    this.initializeVendors()
  },
  methods: {
    // open the two-page form
    openAddDialog() {
      this.addDialog = true
    },

    // receive new row and add to table
    handleSave(newRow) {
      this.vendors.unshift(newRow)
    },

    handleMenuItemClick(itemId) {
      this.updatePageTitle(itemId)
    },
    handleNotificationClick() {
      console.log('Notification clicked in Vendors')
    },
    handleProfileClick() {
      console.log('Profile clicked in Vendors')
    },
    handleSettingsClick() {
      console.log('Settings clicked in Vendors')
    },
    handleLogoutClick() {
      console.log('Logout clicked in Vendors')
    },

    updatePageTitle(itemId) {
      const titleMap = {
        1: 'Dashboard',
        2: 'Payments',
        3: 'Applicants',
        4: 'Complaints',
        5: 'Compliances',
        6: 'Vendors',
        7: 'Stallholders',
        8: 'Collectors',
        9: 'Stalls',
      }
      this.pageTitle = titleMap[itemId] || 'Vendors'
    },

    initializeVendors() {
      console.log('Vendors page initialized')
    },

    edit(row) {
      console.log('edit', row)
    },

    view(row) {
      this.detailsData = row || {
        lastName: 'Dela Cruz',
        firstName: 'Juan',
        middleName: 'Perez',
        suffix: 'Jr.',
        birthdate: '1990-10-05',
        gender: 'Male',
        phone: '09123456789',
        email: 'juan.delacruz@email.com',
        vendorId: '123456',
        address: 'Block 6 Lot 15 Maharlika Village Barangay Rosario Naga City',
        spouseFirst: 'Jessa',
        spouseMiddle: 'Caceres',
        spouseLast: 'Dela Cruz',
        childFirst: 'Pedro',
        childMiddle: 'Caceres',
        childLast: 'Dela Cruz',
        businessName: "Juan's Street Foods",
        businessType: 'Street Foods',
        productsSold: 'Street Foods',
        vendStart: '09:00',
        vendEnd: '13:00',
        businessAddress: 'Panganiban Naga City',
        files: {
          clearance: 'Clearance.pdf',
          votersId: 'VotersID.pdf',
          cedula: 'Cedula.pdf',
          picture: 'Picture.png',
          association: 'Association.pdf',
          healthcard: 'healthcard.png',
        },
      }
      this.detailsDialog = true
    },
    edit(row) {
      // row is the compact row or item.raw (prefer item.raw from your Add form)
      // If you only have the compact row, you can still open with fallback data.
      const raw = row?.raw ||
        row || {
          lastName: 'Dela Cruz',
          firstName: 'Juan',
          middleName: 'Perez',
          suffix: 'Jr.',
          birthdate: '1990-10-05',
          gender: 'Male',
          phone: '09123456789',
          email: 'juan.delacruz@email.com',
          vendorId: String(row?.id || '123456'),
          address: 'Block 6 Lot 15 Maharlika Village Barangay Rosario Naga City',
          spouseFirst: 'Jessa',
          spouseMiddle: 'Caceres',
          spouseLast: 'Dela Cruz',
          childFirst: 'Pedro',
          childMiddle: 'Caceres',
          childLast: 'Dela Cruz',
          businessName: "Juan's Street Foods",
          businessType: 'Street Foods',
          productsSold: 'Street Foods',
          vendStart: '09:00',
          vendEnd: '13:00',
          businessAddress: 'Panganiban Naga City',
          files: {
            clearance: 'Clearance.pdf',
            votersId: 'VotersID.pdf',
            cedula: 'Cedula.pdf',
            picture: 'Picture.png',
            association: 'Association.pdf',
            healthcard: 'healthcard.png',
          },
        }

      this.editData = raw
      this.editTargetId = row?.id || raw?.vendorId
      this.editDialog = true
    },

    // called when Edit dialog submits
    handleEditUpdate(updatedRow) {
      // find row by previous id (editTargetId), then update fields + raw payload
      const idx = this.vendors.findIndex((v) => String(v.id) === String(this.editTargetId))
      if (idx !== -1) {
        this.vendors[idx] = { ...this.vendors[idx], ...updatedRow }
      } else {
        // if not found, add it (edge case)
        this.vendors.unshift(updatedRow)
      }
    },
  },
}
</script>

<style scoped>
.v-main {
  padding-left: 0 !important;
}
.main-wrapper {
  margin-left: 80px;
  transition: none;
  min-height: 100vh;
}
.main-content {
  background: #fafafa;
  min-height: calc(100vh - 64px);
  padding: 24px;
}
.vendors-table :deep(thead tr) {
  background: #0e2e6f;
}
.vendors-table :deep(thead th) {
  color: #fff;
  font-weight: 700;
}

/* Utilities */
.text-md-right {
  text-align: right;
}
@media (max-width: 959px) {
  .text-md-right {
    text-align: left;
  }
}
.main-content::-webkit-scrollbar {
  width: 6px;
}
.main-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.main-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
.main-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
.filters-right {
  gap: 12px;
}
.filter {
  max-width: 280px;
  min-width: 220px;
}

@media (max-width: 959px) {
  .filters-right {
    justify-content: stretch;
  }
  .filter {
    flex: 1;
  }
}
</style>
