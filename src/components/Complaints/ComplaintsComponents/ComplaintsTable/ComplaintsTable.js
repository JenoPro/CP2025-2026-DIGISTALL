// ComplaintsTable.js
const ComplaintsTable = {
  name: 'ComplaintsTable',
  props: {
    searchQuery: {
      type: String,
      default: ''
    },
    activeFilter: {
      type: String,
      default: ''
    },
    complaintsList: {
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
    filteredComplaints() {
      let filtered = this.complaintsList

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(complaints =>
          complaints.id.toLowerCase().includes(query) ||
          complaints.type.toLowerCase().includes(query) ||
          complaints.sender.toLowerCase().includes(query) ||
          complaints.stallholder.toLowerCase().includes(query) ||
          complaints.status.toLowerCase().includes(query)
        )
      }

      // Apply status filter
      if (this.activeFilter && this.activeFilter !== 'all') {
        filtered = filtered.filter(complaints =>
          complaints.status === this.activeFilter
        )
      }

      return filtered
    },

    // ✅ Paginated list (this is what you’ll use in template)
    paginatedComplaints() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredComplaints.slice(start, end)
    },

    totalPages() {
      return Math.ceil(this.filteredComplaints.length / this.itemsPerPage) || 1
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
        'complete': 'complaints-status-complete',
        'pending': 'complaints-status-pending',
        'incomplete': 'complaints-status-incomplete',
        'in-progress': 'complaints-status-active'
      }
      return statusClasses[status] || 'complaints-status-default'
    },

    viewComplaints(complaints) {
      this.$emit('view-complaints', complaints)
    },

    editComplaints(complaints) {
      this.$emit('edit-complaints', complaints)
    },

    deleteComplaints(complaints) {
      this.$emit('delete-complaints', complaints)
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

export default ComplaintsTable
