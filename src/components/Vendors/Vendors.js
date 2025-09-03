/* eslint-disable no-dupe-keys */
import AddVendorDialog from './Components/AddVendorDialog.vue'
import VendorDetailsDialog from './Components/VendorDetailsDialog.vue'
import EditVendorDialog from './Components/EditVendorDialog.vue'

export default {
  name: 'Vendors',
  components: { AddVendorDialog, VendorDetailsDialog, EditVendorDialog },
  data() {
    return {
      addDialog: false,
      detailsDialog: false,
      detailsData: null,
      editDialog: false,
      editData: null, // payload for the dialog (item.raw)
      editTargetId: null, // which row to update

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
