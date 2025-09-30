import AuctionCard from '../AuctionCard/AuctionCard.vue'

export default {
  name: 'ActiveAuctions',
  components: {
    AuctionCard,
  },
  data() {
    return {
      auctions: [],
      loading: false,
      search: '',
      statusFilter: null,
      sortBy: 'created_desc',

      // Dialog states
      showExtendDialog: false,
      showWinnerDialog: false,
      selectedAuction: null,
      extensionHours: 24,
      extending: false,
      selectingWinner: false,

      // Options
      statusOptions: [
        { text: 'Active (Accepting Bids)', value: 'active' },
        { text: 'Expiring Soon', value: 'expiring' },
        { text: 'Needs Winner Selection', value: 'expired' },
      ],
      sortOptions: [
        { text: 'Newest First', value: 'created_desc' },
        { text: 'Oldest First', value: 'created_asc' },
        { text: 'Expiring Soon', value: 'expires_asc' },
        { text: 'Highest Bid', value: 'bid_desc' },
        { text: 'Most Bidders', value: 'bidders_desc' },
      ],

      // Validation rules
      rules: {
        required: (value) => !!value || 'Required field',
        positiveNumber: (value) => value > 0 || 'Must be greater than 0',
        maxExtension: (value) => value <= 168 || 'Cannot extend more than 7 days (168 hours)',
      },

      // API base URL
      // eslint-disable-next-line no-undef
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:3001',

      // Auto refresh interval
      refreshInterval: null,
    }
  },

  computed: {
    filteredAuctions() {
      let filtered = [...this.auctions]

      // Apply search filter
      if (this.search) {
        const searchLower = this.search.toLowerCase()
        filtered = filtered.filter(
          (auction) =>
            auction.stall_number.toLowerCase().includes(searchLower) ||
            auction.location.toLowerCase().includes(searchLower) ||
            auction.floor_name?.toLowerCase().includes(searchLower) ||
            auction.section_name?.toLowerCase().includes(searchLower),
        )
      }

      // Apply status filter
      if (this.statusFilter) {
        const now = new Date()
        filtered = filtered.filter((auction) => {
          const expiresAt = new Date(auction.expires_at)
          const timeLeft = expiresAt - now
          const hoursLeft = timeLeft / (1000 * 60 * 60)

          switch (this.statusFilter) {
            case 'active':
              return auction.status === 'active' && hoursLeft > 2
            case 'expiring':
              return auction.status === 'active' && hoursLeft <= 2 && hoursLeft > 0
            case 'expired':
              return auction.status === 'expired' || hoursLeft <= 0
            default:
              return true
          }
        })
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'created_desc':
            return new Date(b.created_at) - new Date(a.created_at)
          case 'created_asc':
            return new Date(a.created_at) - new Date(b.created_at)
          case 'expires_asc':
            return new Date(a.expires_at) - new Date(b.expires_at)
          case 'bid_desc':
            return (b.current_highest_bid || 0) - (a.current_highest_bid || 0)
          case 'bidders_desc':
            return (b.bidder_count || 0) - (a.bidder_count || 0)
          default:
            return 0
        }
      })

      return filtered
    },
  },

  mounted() {
    this.loadAuctions()

    // Check if we're focusing on a specific stall
    const { stallId, stallNumber } = this.$route.query
    if (stallId && stallNumber) {
      this.search = stallNumber
      this.$emit('show-message', `Showing auctions for stall ${stallNumber}`, 'info')
    }

    // Set up auto refresh every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.loadAuctions(false) // Silent refresh
    }, 30000)
  },

  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },

  methods: {
    async loadAuctions(showLoading = true) {
      if (showLoading) this.loading = true

      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) {
          this.$emit('show-message', 'Authentication required', 'error')
          return
        }

        const response = await fetch(
          `${this.apiBaseUrl}/api/stalls?price_type=Auction&is_available=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        console.log('Auction API Response:', result)
        if (result.success) {
          // Map stalls data to auction format and filter for actual auctions only
          const allStalls = result.data || []
          console.log('All stalls received:', allStalls)
          console.log('Filtering for price_type=Auction, is_available=1')

          this.auctions = allStalls
            .filter((stall) => {
              console.log(
                `Stall ${stall.stall_no}: price_type=${stall.price_type}, is_available=${stall.is_available}`,
              )
              return (
                stall.price_type === 'Auction' &&
                (stall.is_available === 1 || stall.is_available === true)
              )
            })
            .map((stall) => {
              // Calculate expires_at based on created_at + durationHours
              let expiresAt = stall.expires_at
              if (!expiresAt && stall.created_at && stall.duration_hours) {
                const createdDate = new Date(stall.created_at)
                createdDate.setHours(createdDate.getHours() + parseInt(stall.duration_hours || 72))
                expiresAt = createdDate.toISOString()
              } else if (!expiresAt) {
                // Default 72 hours (3 days) from creation
                const createdDate = new Date(stall.created_at || Date.now())
                createdDate.setHours(createdDate.getHours() + 72)
                expiresAt = createdDate.toISOString()
              }

              return {
                auction_id: stall.stall_id,
                stall_id: stall.stall_id,
                id: stall.stall_id, // Add id for router navigation
                stall_number: stall.stall_no || stall.stall_number,
                location: stall.stall_location || stall.location,
                starting_bid: stall.rental_price,
                current_bid: stall.current_bid || stall.rental_price,
                expires_at: expiresAt,
                created_at: stall.created_at,
                duration_hours: stall.duration_hours || 72,
                status: stall.status?.toLowerCase() || 'active',
                bid_count: stall.bid_count || Math.floor(Math.random() * 10) + 1, // Mock 1-10 bids
                bidder_count: Math.floor(Math.random() * 8) + 1, // Mock 1-8 bidders
                floor_name: stall.floor_name,
                section_name: stall.section_name,
                recent_bids: stall.recent_bids || [
                  { bidder_name: 'John Doe', bid_amount: stall.rental_price + 500 },
                  { bidder_name: 'Jane Smith', bid_amount: stall.rental_price + 300 },
                ],
                highest_bidder: stall.highest_bidder || 'John Doe',
              }
            })

          console.log('Filtered auctions:', this.auctions)
        } else {
          throw new Error(result.message || 'Failed to load auctions')
        }
      } catch (error) {
        console.error('Error loading auctions:', error)
        this.$emit('show-message', `Failed to load auctions: ${error.message}`, 'error')
      } finally {
        if (showLoading) this.loading = false
      }
    },

    handleExtendTimer(auction) {
      this.selectedAuction = auction
      this.extensionHours = 24
      this.showExtendDialog = true
    },

    closeExtendDialog() {
      this.showExtendDialog = false
      this.selectedAuction = null
      this.extensionHours = 24
    },

    async confirmExtendTimer() {
      if (!this.selectedAuction || !this.extensionHours) return

      this.extending = true
      try {
        const token = sessionStorage.getItem('authToken')
        const response = await fetch(
          `${this.apiBaseUrl}/api/auctions/${this.selectedAuction.auction_id}/extend`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              extensionHours: parseInt(this.extensionHours),
            }),
          },
        )

        const result = await response.json()
        if (result.success) {
          this.$emit('show-message', `Timer extended by ${this.extensionHours} hours`, 'success')
          this.loadAuctions(false) // Refresh data
          this.closeExtendDialog()
        } else {
          throw new Error(result.message || 'Failed to extend timer')
        }
      } catch (error) {
        console.error('Error extending timer:', error)
        this.$emit('show-message', `Failed to extend timer: ${error.message}`, 'error')
      } finally {
        this.extending = false
      }
    },

    handleViewDetails(auction) {
      // Emit event to parent component to show auction details
      this.$emit('view-auction-details', auction)
    },

    handleSelectWinner(auction) {
      this.selectedAuction = auction
      this.showWinnerDialog = true
    },

    closeWinnerDialog() {
      this.showWinnerDialog = false
      this.selectedAuction = null
    },

    async confirmSelectWinner() {
      if (!this.selectedAuction) return

      this.selectingWinner = true
      try {
        const token = sessionStorage.getItem('authToken')
        const response = await fetch(
          `${this.apiBaseUrl}/api/auctions/${this.selectedAuction.auction_id}/select-winner`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )

        const result = await response.json()
        if (result.success) {
          this.$emit(
            'show-message',
            `Auction ended for ${this.selectedAuction.stall_number}. Winner: ${result.data.winner_name} with bid ₱${this.formatPrice(result.data.winning_bid)}`,
            'success',
          )
          this.loadAuctions(false) // Refresh data
          this.closeWinnerDialog()
        } else {
          throw new Error(result.message || 'Failed to end auction')
        }
      } catch (error) {
        console.error('Error ending auction:', error)
        this.$emit('show-message', `Failed to end auction: ${error.message}`, 'error')
      } finally {
        this.selectingWinner = false
      }
    },

    formatDateTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    formatPrice(price) {
      if (!price) return '0'
      return parseFloat(price).toLocaleString()
    },
  },
}
