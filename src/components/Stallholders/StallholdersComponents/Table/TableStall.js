export default {
  name: 'TableStall',
  props: {
    searchQuery: {
      type: String,
      default: ''
    },
    activeFilter: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10,
      stallholders: [
        {
          id: '#0023',
          fullName: 'John Doe',
          email: 'johndoe@unc.edu.ph',
          phone: '09247195291',
          address: 'Lot 5, Block 2, Phase 1, Villa Grande Subdivision, Naga City',
          status: 'active'
        },
        {
          id: '#0024', 
          fullName: 'Berna Lee',
          email: 'bernalee@unc.edu.ph',
          phone: '09765195321',
          address: 'Lot 2, Block 4, Phase 1, Villa Grande Subdivision, Naga City',
          status: 'active'
        },
        {
          id: '#0025',
          fullName: 'Maria Santos',
          email: 'maria.santos@gmail.com',
          phone: '09123456789',
          address: 'Block 3, Lot 12, Green Valley Subdivision, Naga City',
          status: 'inactive'
        },
        {
          id: '#0026',
          fullName: 'Pedro Cruz',
          email: 'pedro.cruz@yahoo.com',
          phone: '09987654321',
          address: 'Unit 5A, Sunrise Apartments, Magsaysay Avenue, Naga City',
          status: 'pending'
        },
        {
          id: '#0027',
          fullName: 'Ana Rodriguez',
          email: 'ana.rodriguez@hotmail.com',
          phone: '09456789123',
          address: 'House 18, Oak Street, Carolina Village, Naga City',
          status: 'active'
        }
      ]
    }
  },
  computed: {
    filteredStallholders() {
      let filtered = this.stallholders

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(stallholder => 
          stallholder.fullName.toLowerCase().includes(query) ||
          stallholder.email.toLowerCase().includes(query) ||
          stallholder.phone.includes(query) ||
          stallholder.id.toLowerCase().includes(query) ||
          stallholder.address.toLowerCase().includes(query)
        )
      }

      // Apply status filter
      if (this.activeFilter !== 'all') {
        filtered = filtered.filter(stallholder => 
          stallholder.status === this.activeFilter
        )
      }

      return filtered
    },
    
    totalPages() {
      return Math.ceil(this.filteredStallholders.length / this.itemsPerPage)
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
        'active': 'status-active',
        'inactive': 'status-inactive', 
        'pending': 'status-pending',
        'complete': 'status-complete'
      }
      return statusClasses[status] || 'status-default'
    },
    
    viewStallholder(stallholder) {
      console.log('View stallholder:', stallholder)
      this.$emit('view-stallholder', stallholder)
    },
    
    editStallholder(stallholder) {
      console.log('Edit stallholder:', stallholder)
      this.$emit('edit-stallholder', stallholder)
    },
    
    deleteStallholder(stallholder) {
      if (confirm(`Are you sure you want to delete ${stallholder.fullName}?`)) {
        console.log('Delete stallholder:', stallholder)
        this.$emit('delete-stallholder', stallholder)
        
        // Remove from local data (in a real app, this would be an API call)
        const index = this.stallholders.findIndex(s => s.id === stallholder.id)
        if (index !== -1) {
          this.stallholders.splice(index, 1)
        }
      }
    },
    
    addStallholder() {
      console.log('Add new stallholder')
      this.$emit('add-stallholder')
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