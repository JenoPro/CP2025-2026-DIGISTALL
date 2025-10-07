
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