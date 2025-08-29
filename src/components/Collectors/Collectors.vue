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

<script>
import AppSidebar from '../AppSidebar.vue'
import AppHeader from '../AppHeader.vue'
import AddCollectorDialog from './AddCollectorDialog.vue'
import EditCollectorDialog from './EditCollectorDialog.vue'
import CollectorDetailsDialog from './CollectorDetailsDialog.vue'

export default {
  name: 'Collectors',
  components: {
    AppSidebar,
    AppHeader,
    AddCollectorDialog,
    EditCollectorDialog,
    CollectorDetailsDialog,
  },
  data() {
    return {
      pageTitle: 'Collectors',
      addDialog: false,
      editDialog: false,
      detailsDialog: false,
      editData: null,
      detailsData: null,

      // sidebar menu (same structure as Vendors.vue)
      menuItems: [
        { id: 1, icon: 'mdi-view-dashboard', name: 'Dashboard', active: false },
        { id: 2, icon: 'mdi-credit-card', name: 'Payments', active: false },
        { id: 3, icon: 'mdi-account-plus', name: 'Applicants', active: false },
        { id: 4, icon: 'mdi-chart-line', name: 'Complaints', active: false },
        { id: 5, icon: 'mdi-clipboard-check', name: 'Compliances', active: false },
      ],

      headers: [
        { title: "Collector's Name", value: 'name' },
        { title: 'Contact No.', value: 'contact', width: 180 },
        { title: 'Assigned Location', value: 'location' },
        { title: 'Action', value: 'actions', sortable: false, align: 'end', width: 140 },
      ],

      // mock data
      collectors: Array.from({ length: 14 }, (_, i) => ({
        id: 1000 + i,
        name: 'Peter Corpuz',
        contact: '09123456789',
        location: 'Panganiban',
      })),

      locations: ['Panganiban', 'Naga City Market', 'Triangulo', 'Concepcion Pequeña'],

      search: '',
      locationFilter: null,

      addDialog: false,
      newCollector: { name: '', contact: '', location: 'Panganiban' },
    }
  },
  computed: {
    filteredCollectors() {
      const term = (this.search || '').toLowerCase().trim()
      return this.collectors.filter((c) => {
        const hitsSearch =
          !term ||
          c.name.toLowerCase().includes(term) ||
          c.contact.toLowerCase().includes(term) ||
          c.location.toLowerCase().includes(term)
        const hitsLocation = !this.locationFilter || c.location === this.locationFilter
        return hitsSearch && hitsLocation
      })
    },
  },
  mounted() {
    console.log('Collectors page initialized')
  },
  methods: {
    // sidebar & header handlers
    handleMenuItemClick(id) {
      this.updatePageTitle(id)
    },
    handleNotificationClick() {
      console.log('Notification clicked in Collectors')
    },
    handleProfileClick() {
      console.log('Profile clicked in Collectors')
    },
    handleSettingsClick() {
      console.log('Settings clicked in Collectors')
    },
    handleLogoutClick() {
      console.log('Logout clicked in Collectors')
    },
    updatePageTitle(itemId) {
      const titleMap = {
        1: 'Dashboard',
        2: 'Payments',
        3: 'Applicants',
        4: 'Complaints',
        5: 'Compliances',
        6: 'Vendors',
        8: 'Collectors',
      }
      this.pageTitle = titleMap[itemId] || 'Collectors'
    },

    edit(row) {
      // row is item.raw; if missing, map from compact row
      const raw = row?.raw ||
        row || {
          lastName: 'Corpuz',
          firstName: 'Peter',
          middleName: 'Reyes',
          suffix: '',
          birthdate: '1994-10-04',
          gender: 'Male',
          phone: '09123456789',
          email: 'peter.corpuz@email.com',
          collectorId: String(row?.id || '123456'),
          address: 'Block 6 Lot 15 Maharlika Village Barangay Rosario Naga City',
          location: 'Panganiban',
          picture: null,
        }
      this.editData = raw
      this.editDialog = true
    },
    view(row) {
      // If row.raw exists (from Add/Edit form), use it; else fallback sample
      this.detailsData = row?.raw || {
        lastName: 'Corpuz',
        firstName: 'Peter',
        middleName: 'Reyes',
        suffix: '',
        birthdate: '1994-10-04',
        gender: 'Male',
        phone: '09123456789',
        email: 'peter.corpuz@email.com',
        collectorId: '123456',
        address: 'Block 6 Lot 15 Maharlika Village Barangay Rosario Naga City',
        location: 'Panganiban',
        picture: 'https://i.pravatar.cc/200?img=32', // sample avatar
      }
      this.detailsDialog = true
    },
    openAddDialog() {
      this.addDialog = true
    },
    handleAddSave(newRow) {
      // newRow: { id, name, contact, location, raw }
      this.collectors.unshift(newRow)
    },
    handleEditUpdate(updatedRow) {
      const idx = this.collectors.findIndex((c) => String(c.id) === String(updatedRow.id))
      if (idx !== -1) this.collectors[idx] = { ...this.collectors[idx], ...updatedRow }
    },
    saveNew() {
      if (!this.newCollector.name || !this.newCollector.contact) return
      this.collectors.unshift({
        id: Date.now(),
        ...this.newCollector,
      })
      this.addDialog = false
    },
  },
}
</script>

<style scoped>
/* Layout (match Vendors.vue) */
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

/* Navy table header like the screenshot */
.collectors-table :deep(thead tr) {
  background: #0e2e6f;
}
.collectors-table :deep(thead th) {
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

/* nice scrollbar like Vendors.vue */
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
</style>
