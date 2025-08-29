// ComplianceTable.js
const ComplianceTable = {
  name: 'ComplianceTable',
  props: {
    searchQuery: {
      type: String,
      default: ''
    },
    activeFilter: {
      type: String,
      default: ''
    },
    complianceList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
    }
  },
  computed: {
    filteredCompliance() {
      let filtered = this.complianceList

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(compliance =>
          compliance.id.toLowerCase().includes(query) ||
          compliance.type.toLowerCase().includes(query) ||
          compliance.inspector.toLowerCase().includes(query) ||
          compliance.stallholder.toLowerCase().includes(query) ||
          compliance.status.toLowerCase().includes(query)
        )
      }

      // Apply status filter
      if (this.activeFilter && this.activeFilter !== 'all') {
        filtered = filtered.filter(compliance =>
          compliance.status === this.activeFilter
        )
      }

      return filtered
    },

    // ✅ Paginated list (this is what you’ll use in template)
    paginatedCompliance() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredCompliance.slice(start, end)
    },

    totalPages() {
      return Math.ceil(this.filteredCompliance.length / this.itemsPerPage) || 1
    }
  },
  methods: {
    getInitials(name) {
      return name.split(' ')
        .map(word => word.charAt(0))
        .join('')
        .substring(0, 2)
        .toUpperCase()
    },

    getStatusClass(status) {
      const statusClasses = {
        'complete': 'compliance-status-complete',
        'pending': 'compliance-status-pending',
        'incomplete': 'compliance-status-incomplete',
        'in-progress': 'compliance-status-active'
      }
      return statusClasses[status] || 'compliance-status-default'
    },

    viewCompliance(compliance) {
      this.$emit('view-compliance', compliance)
    },

    editCompliance(compliance) {
      this.$emit('edit-compliance', compliance)
    },

    deleteCompliance(compliance) {
      this.$emit('delete-compliance', compliance)
    },

    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    }
  },

  watch: {
    searchQuery() {
      this.currentPage = 1 // Reset to first page when search changes
    },
    activeFilter() {
      this.currentPage = 1 // Reset to first page when filter changes
    }
  }
}

export default ComplianceTable
