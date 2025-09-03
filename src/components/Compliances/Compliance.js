import ComplianceTable from '../Compliances/ComplianceComponents/ComplianceTable/ComplianceTable.vue'
import ComplianceSearch from '../Compliances/ComplianceComponents/ComplianceSearch/ComplianceSearch.vue'

import ViewCompliance from '../Compliances/ComplianceComponents/ViewCompliance/ViewCompliance.vue'

export default {
  name: "Compliance",
  components: {
    ComplianceTable,
    ComplianceSearch,
    ViewCompliance,

  },
  data() {
    return {
      pageTitle: "Compliance Management",
      searchQuery: "",
      activeFilter: "all",
      selectedCompliance: {},
      showViewComplianceModal: false,
      complianceList: [], // Compliance data
    }
  },
  mounted() {
    this.initializeCompliance()
  },
  methods: {
    // Search
    handleSearch(searchData) {
      this.searchQuery = searchData.query
      this.activeFilter = searchData.filter
      console.log("Search data:", searchData)
    },

    // Table actions
    handleViewCompliance(compliance) {
      console.log("View compliance:", compliance)
      this.selectedCompliance = compliance
      this.showViewComplianceModal = true
    },

    handleEditCompliance(compliance) {
      console.log("Edit compliance:", compliance)
      this.selectedCompliance = compliance
      // Open edit modal or navigate to edit page
    },

    handleDeleteCompliance(compliance) {
      console.log("Delete compliance:", compliance)
      if (confirm(`Are you sure you want to delete compliance record ${compliance.id}?`)) {
        this.complianceList = this.complianceList.filter(item => item.id !== compliance.id)
        console.log("Compliance record deleted successfully!")
      }
    },



    closeViewComplianceModal() {
      this.showViewComplianceModal = false
      this.selectedCompliance = {}
    },

    // Init
    initializeCompliance() {
      console.log("Compliance page initialized")
      this.loadComplianceData()
    },

    async loadComplianceData() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
        this.complianceList = [
          {
            id: "CMP-0023",
            date: "2024-01-15",
            type: "Sanitay Issue",
            inspector: "Jose Santos",
            stallholder: "Frank Lapuz",
            status: "complete",
            notes: "All health standards met",
          },
          {
            id: "CMP-0024",
            date: "2024-01-18",
            type: "Illegal Vending",
            inspector: "Pedro Cruz",
            stallholder: "Berna Lee",
            status: "pending",
            notes: "Awaiting safety equipment installation",
          },
          {
            id: "CMP-0025",
            date: "2024-01-20",
            type: "Fire Safety",
            inspector: "Dulce Rodriguez",
            stallholder: "Maria Santos",
            status: "incomplete",
            notes: "Fire extinguisher needs replacement",
          },
        ]
        console.log("Compliance data loaded:", this.complianceList)
      } catch (error) {
        console.error("Error loading compliance data:", error)
      }
    },
  },
}
