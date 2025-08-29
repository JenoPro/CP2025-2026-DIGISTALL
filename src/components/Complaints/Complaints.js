import ComplaintsTable from '../Complaints/ComplaintsComponents/ComplaintsTable/ComplaintsTable.vue'
import ComplaintsSearch from '../Complaints/ComplaintsComponents/ComplaintsSearch/ComplaintsSearch.vue'

import ViewComplaints from '../Complaints/ComplaintsComponents/ViewComplaints/ViewComplaints.vue'

export default {
  name: "Complaints",
  components: {
    ComplaintsTable,
    ComplaintsSearch,
    ViewComplaints,

  },
  data() {
    return {
      pageTitle: "Complaints Management",
      searchQuery: "",
      activeFilter: "all",
      selectedComplaints: {},
      showViewComplaintsModal: false,
      complaintsList: [], // Complaints data
    }
  },
  mounted() {
    this.initializeComplaints()
  },
  methods: {
    // Search
    handleSearch(searchData) {
      this.searchQuery = searchData.query
      this.activeFilter = searchData.filter
      console.log("Search data:", searchData)
    },

    // Table actions
    handleViewComplaints(complaints) {
      console.log("View complaints:", complaints)
      this.selectedComplaints = complaints
      this.showViewComplaintsModal = true
    },

    handleEditComplaints(complaints) {
      console.log("Edit complaints:", complaints)
      this.selectedComplaints = complaints
      // Open edit modal or navigate to edit page
    },

    handleDeleteComplaints(complaints) {
      console.log("Delete complaints:", complaints)
      if (confirm(`Are you sure you want to delete complaints record ${complaints.id}?`)) {
        this.complaintsList = this.complaintsList.filter(item => item.id !== complaints.id)
        console.log("Complaints record deleted successfully!")
      }
    },



    closeViewComplaintsModal() {
      this.showViewComplaintsModal = false
      this.selectedComplaints = {}
    },

    // Init
    initializeComplaints() {
      console.log("Complaints page initialized")
      this.loadComplaintsData()
    },

    async loadComplaintsData() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        this.complaintsList = [
          {
            id: "CMPT-0023",
            date: "2024-01-15",
            type: "Sanitay Issue",
            sender: "Jonathan Reyna",
            stallholder: "Juan Miguel",
            status: "complete",
            notes: "All health standards met",
          },
          {
            id: "CMPT-0024",
            date: "2024-01-18",
            type: "Illegal Vending",
            sender: "Pedro Cruz",
            stallholder: "Patrick Lee",
            status: "pending",
            notes: "Awaiting safety equipment installation",
          },
          {
            id: "CMPT-0025",
            date: "2024-01-20",
            type: "Faulty Weighing Scale",
            sender: "Miguel Ohara",
            stallholder: "Maria Santos",
            status: "incomplete",
            notes: "Fire extinguisher needs replacement",
          },
        ]
        console.log("Complaints data loaded:", this.complaintsList)
      } catch (error) {
        console.error("Error loading complaints data:", error)
      }
    },
  },
}
