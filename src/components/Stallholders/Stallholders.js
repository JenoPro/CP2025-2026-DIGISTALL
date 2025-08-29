// Import the components
import SearchStall from './Components/Search/SearchStall.vue'
import TableStall from './Components/Table/TableStall.vue'
import DocumentsView from './Components/Documents/DocumentsView.vue'
import DocumentDetail from './Components/Documents/View/DocumentDetail.vue'
import AddStallholder from './Components/Add/AddStallholder.vue'

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
      stallholdersList: [], // Add this to store stallholders data
    }
  },
  mounted() {
    this.initializeStallholders()
  },
  methods: {
    // Handle search from SearchStall component
    handleSearch(searchData) {
      this.searchQuery = searchData.query
      this.activeFilter = searchData.filter
      console.log('Search data:', searchData)
    },

    // Handle stallholder actions from TableStall component
    handleViewStallholder(stallholder) {
      console.log('View stallholder:', stallholder)
      this.selectedStallholder = stallholder
      this.showDocumentsModal = true
    },

    handleEditStallholder(stallholder) {
      console.log('Edit stallholder:', stallholder)
      // Add logic to open edit modal or navigate to edit page
    },

    handleDeleteStallholder(stallholder) {
      console.log('Delete stallholder:', stallholder)
      // Add logic to handle deletion (API call, etc.)
      // You can show a confirmation dialog here
      if (confirm(`Are you sure you want to delete ${stallholder.fullName}?`)) {
        // Remove from local list (in a real app, this would be an API call)
        this.stallholdersList = this.stallholdersList.filter((s) => s.id !== stallholder.id)
        console.log('Stallholder deleted successfully')
      }
    },

    handleAddStallholder() {
      console.log('Add new stallholder - opening modal')
      this.showAddStallholderModal = true
    },

    // Handle documents modal
    closeDocumentsModal() {
      this.showDocumentsModal = false
      this.selectedStallholder = {}
    },

    handleViewDocument(document) {
      console.log('View document:', document)
      this.selectedDocument = document
      this.showDocumentDetail = true
    },

    // Handle document detail modal
    closeDocumentDetail() {
      this.showDocumentDetail = false
      this.selectedDocument = {}
    },

    handleAcceptDocument(data) {
      console.log('Accept document:', data)
      // Add logic to handle document acceptance (API call, etc.)
      // You can update the document status in your data store here
    },

    handleDeclineDocument(data) {
      console.log('Decline document:', data)
      // Add logic to handle document decline (API call, etc.)
      // You can update the document status in your data store here
    },

    // Handle Add Stallholder Modal
    closeAddStallholderModal() {
      this.showAddStallholderModal = false
    },

    handleAddStallholderSubmit(stallholderData) {
      console.log('New stallholder data:', stallholderData)

      // Add to local list (in a real app, this would be an API call)
      this.stallholdersList.push(stallholderData)

      // Close the modal
      this.showAddStallholderModal = false

      // You can show a success notification here
      console.log('Stallholder added successfully to the list!')
    },

    handleStallholderAdded(event) {
      if (event.success) {
        console.log('Success:', event.message)
        // You can show a success notification/toast here
        // Example: this.$toast.success(event.message)
      } else {
        console.error('Error:', event.message)
        // You can show an error notification/toast here
        // Example: this.$toast.error(event.message)
      }
    },

    // Initialize stallholders page
    initializeStallholders() {
      console.log('Stallholders page initialized')
      // Add any initialization logic here
      // You can load initial stallholders data here
      this.loadStallholdersData()
    },

    // Load stallholders data (simulate API call)
    async loadStallholdersData() {
      try {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Sample data - replace with actual API call
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
          // Add more sample data as needed
        ]

        console.log('Stallholders data loaded:', this.stallholdersList)
      } catch (error) {
        console.error('Error loading stallholders data:', error)
      }
    },
  },
}
