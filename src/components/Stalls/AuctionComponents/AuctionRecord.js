export default {
  name: 'AuctionRecords',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue', 'close'],
  data() {
    return {
      loading: false,
      error: null,
      searchQuery: '',
      selectedStatus: null,
      sortBy: 'auctionDate',
      auctionRecords: [],
      // eslint-disable-next-line no-undef
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:3001',

      headers: [
        { title: 'Stall #', value: 'stallNumber', sortable: true },
        { title: 'Auction Date', value: 'auctionDate', sortable: true },
        { title: 'Starting Price', value: 'startingPrice', sortable: true },
        { title: 'Winning Bid', value: 'winningBid', sortable: true },
        { title: 'Winner', value: 'winner', sortable: true },
        { title: 'Status', value: 'status', sortable: true },
        { title: 'Actions', value: 'actions', sortable: false, align: 'center' },
      ],

      statusOptions: [
        { title: 'All', value: null },
        { title: 'Completed', value: 'completed' },
        { title: 'In Progress', value: 'in_progress' },
        { title: 'Cancelled', value: 'cancelled' },
        { title: 'Pending', value: 'pending' },
      ],

      sortOptions: [
        { title: 'Latest First', value: 'auctionDate' },
        { title: 'Oldest First', value: 'auctionDate_asc' },
        { title: 'Highest Bid', value: 'winningBid' },
        { title: 'Stall Number', value: 'stallNumber' },
      ],
    }
  },

  computed: {
    showDialog: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      },
    },

    filteredRecords() {
      let filtered = [...this.auctionRecords]

      // Filter by status
      if (this.selectedStatus) {
        filtered = filtered.filter((record) => record.status === this.selectedStatus)
      }

      // Sort records
      if (this.sortBy) {
        filtered.sort((a, b) => {
          switch (this.sortBy) {
            case 'auctionDate':
              return new Date(b.auctionDate) - new Date(a.auctionDate)
            case 'auctionDate_asc':
              return new Date(a.auctionDate) - new Date(b.auctionDate)
            case 'winningBid':
              return (b.winningBid || 0) - (a.winningBid || 0)
            case 'stallNumber':
              return a.stallNumber.localeCompare(b.stallNumber)
            default:
              return 0
          }
        })
      }

      return filtered
    },
  },

  watch: {
    modelValue(newValue) {
      if (newValue && this.auctionRecords.length === 0) {
        this.fetchAuctionRecords()
      }
    },
  },

  methods: {
    async fetchAuctionRecords() {
      this.loading = true
      this.error = null

      try {
        console.log('Fetching auction records from:', `${this.apiBaseUrl}/api/auctions/records`)

        const response = await fetch(`${this.apiBaseUrl}/api/auctions/records`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(localStorage.getItem('authToken') && {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }),
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        console.log('Auction Records API Response:', result)

        if (result.success) {
          this.auctionRecords = result.data || []
          console.log(`Successfully loaded ${this.auctionRecords.length} auction records`)
        } else {
          throw new Error(result.message || 'Failed to fetch auction records')
        }
      } catch (error) {
        console.error('Error fetching auction records:', error)
        this.error = error.message

        // Fallback to mock data for development
        this.loadMockData()
      } finally {
        this.loading = false
      }
    },

    loadMockData() {
      // Mock data for development/testing
      this.auctionRecords = [
        {
          id: 1,
          stallNumber: 'A-001',
          auctionDate: '2024-01-15T10:00:00Z',
          startingPrice: 50000,
          winningBid: 75000,
          winner: 'John Doe',
          winnerContact: '+63 912 345 6789',
          status: 'completed',
          totalBids: 15,
        },
        {
          id: 2,
          stallNumber: 'B-005',
          auctionDate: '2024-01-20T14:30:00Z',
          startingPrice: 60000,
          winningBid: 85000,
          winner: 'Jane Smith',
          winnerContact: '+63 922 456 7890',
          status: 'completed',
          totalBids: 22,
        },
        {
          id: 3,
          stallNumber: 'C-012',
          auctionDate: '2024-02-01T09:00:00Z',
          startingPrice: 45000,
          winningBid: null,
          winner: null,
          winnerContact: null,
          status: 'cancelled',
          totalBids: 3,
        },
      ]
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    },

    formatTime(dateString) {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    getStatusColor(status) {
      const colors = {
        completed: 'success',
        in_progress: 'warning',
        cancelled: 'error',
        pending: 'info',
      }
      return colors[status] || 'grey'
    },

    viewDetails(record) {
      // TODO: Implement detailed view modal
      console.log('View details for record:', record)
    },

    downloadRecord(record) {
      // TODO: Implement record download functionality
      console.log('Download record:', record)
    },

    exportRecords() {
      // TODO: Implement export all records functionality
      console.log('Export all records')
    },

    closeDialog() {
      this.showDialog = false
      this.$emit('close')
    },
  },
}
