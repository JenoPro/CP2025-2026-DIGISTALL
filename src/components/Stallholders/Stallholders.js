// Import the components
import SearchStall from '../Stallholders/StallholdersComponents/Search/SearchStall.vue'

import TableStall from '../Stallholders/StallholdersComponents/Table/TableStall.vue'
import DocumentsView from '../Stallholders/StallholdersComponents/Documents/DocumentsView.vue'
import DocumentDetail from '../Stallholders/StallholdersComponents/Documents/View/DocumentDetail.vue'
import AddStallholder from '../Stallholders/StallholdersComponents/Add/AddStallholder.vue'

export default {
  name: 'Stallholders',
  components: {
    SearchStall,
    TableStall,
    DocumentsView,
    DocumentDetail,
    AddStallholder,
  },
  data() {
    return {
      pageTitle: 'Stallholders',
      searchQuery: '',
      activeFilter: 'all',
      showDocumentsModal: false,
      showDocumentDetail: false,
      showAddStallholderModal: false,
      selectedStallholder: {},
      selectedDocument: {},
      stallholdersList: [], // Stallholders data
    }
  },
  mounted() {
    this.initializeStallholders()
  },
  methods: {
    // Search
    handleSearch(searchData) {
      this.searchQuery = searchData.query
      this.activeFilter = searchData.filter
      console.log('Search data:', searchData)
    },

    // Table actions
    handleViewStallholder(stallholder) {
      console.log('View stallholder:', stallholder)
      this.selectedStallholder = stallholder
      this.showDocumentsModal = true
    },

    handleEditStallholder(stallholder) {
      console.log('Edit stallholder:', stallholder)
      // Add edit modal logic if needed
    },

    handleDeleteStallholder(stallholder) {
      console.log('Delete stallholder:', stallholder)
      if (confirm(`Are you sure you want to delete ${stallholder.fullName}?`)) {
        this.stallholdersList = this.stallholdersList.filter(
          (s) => s.id !== stallholder.id
        )
        console.log('Stallholder deleted successfully')
      }
    },

    handleAddStallholder() {
      console.log('Add new stallholder - opening modal')
      this.showAddStallholderModal = true
    },

    // Documents
    closeDocumentsModal() {
      this.showDocumentsModal = false
      this.selectedStallholder = {}
    },

    handleViewDocument(document) {
      console.log('View document:', document)
      this.selectedDocument = document
      this.showDocumentDetail = true
    },

    closeDocumentDetail() {
      this.showDocumentDetail = false
      this.selectedDocument = {}
    },

    handleAcceptDocument(data) {
      console.log('Accept document:', data)
    },

    handleDeclineDocument(data) {
      console.log('Decline document:', data)
    },

    // Add Stallholder
    closeAddStallholderModal() {
      this.showAddStallholderModal = false
    },

    handleAddStallholderSubmit(stallholderData) {
      console.log('New stallholder data:', stallholderData)
      this.stallholdersList.push(stallholderData)
      this.showAddStallholderModal = false
      console.log('Stallholder added successfully to the list!')
    },

    handleStallholderAdded(event) {
      if (event.success) {
        console.log('Success:', event.message)
      } else {
        console.error('Error:', event.message)
      }
    },

    // Init
    initializeStallholders() {
      console.log('Stallholders page initialized')
      this.loadStallholdersData()
    },

    async loadStallholdersData() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        this.stallholdersList = [
          {
            id: 1,
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phoneNumber: '09123456789',
            address: 'Sample Address 1',
            status: 'Active',
            dateAdded: '2024-01-15',
            stallNumber: 'A-01',
            businessName: "John's Food Stall",
          },
          // More sample data here
        ]
        console.log('Stallholders data loaded:', this.stallholdersList)
      } catch (error) {
        console.error('Error loading stallholders data:', error)
      }
    },
  },
}
