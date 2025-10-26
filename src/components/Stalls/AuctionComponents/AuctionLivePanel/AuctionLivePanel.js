import HighestBidderPanel from './HighestBidder/HighestBidderPanel.vue'

export default {
  name: 'AuctionLivePanel',
  components: {
    HighestBidderPanel,
  },
  props: {
    stallData: {
      type: Object,
      default: () => ({
        name: 'Sample Stall',
        location: 'Market Area A',
        id: null,
      }),
    },
    auctionId: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      auctionStatus: 'pending', // pending, live, paused, ended
      currentHighestBid: 5000,
      startingPrice: 5000,
      bidIncrement: 100,
      totalBidders: 0,
      totalBids: 0,
      activeBidders: 0,
      averageBid: 0,
      showWinnerModal: false,
      winner: null,

      // Sample highest bidder data
      displayHighestBidder: {
        bidderName: 'Anonymous Bidder',
        bidderInitials: 'AB',
        amount: 5000,
        bidTime: new Date().toISOString(),
      },

      // Bidder summary data
      bidderTotalAmounts: {},

      // Polling intervals
      auctionPollingInterval: null,
      bidderPollingInterval: null,
    }
  },
  computed: {
    canShowBidderIdentity() {
      return this.auctionStatus === 'ended'
    },
    winnerInitials() {
      if (!this.winner?.bidderName) return 'W'
      return this.winner.bidderName
        .split(' ')
        .map((name) => name.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2)
    },
  },
  mounted() {
    this.initializeAuction()
    this.startPolling()
  },
  beforeUnmount() {
    this.stopPolling()
  },
  methods: {
    initializeAuction() {
      // Initialize auction data
      this.fetchAuctionData()
      this.fetchBidderData()
    },

    async fetchAuctionData() {
      try {
        this.loading = true

        // Simulate API call - replace with actual API endpoint
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Sample data - replace with actual API response
        const sampleData = {
          status: this.auctionStatus,
          currentHighestBid: this.currentHighestBid,
          startingPrice: this.startingPrice,
          bidIncrement: this.bidIncrement,
          totalBidders: Math.floor(Math.random() * 15) + 5,
          totalBids: Math.floor(Math.random() * 50) + 20,
          activeBidders: Math.floor(Math.random() * 8) + 2,
          highestBidder: {
            bidderName: this.canShowBidderIdentity ? 'John Doe' : 'Anonymous Bidder',
            bidderInitials: this.canShowBidderIdentity ? 'JD' : 'AB',
            amount: this.currentHighestBid,
            bidTime: new Date().toISOString(),
          },
        }

        // Update component data
        this.auctionStatus = sampleData.status
        this.currentHighestBid = sampleData.currentHighestBid
        this.totalBidders = sampleData.totalBidders
        this.totalBids = sampleData.totalBids
        this.activeBidders = sampleData.activeBidders
        this.displayHighestBidder = sampleData.highestBidder
        this.calculateAverageBid()
      } catch (error) {
        console.error('Error fetching auction data:', error)
        this.$emit('show-message', {
          type: 'error',
          message: 'Failed to fetch auction data',
        })
      } finally {
        this.loading = false
      }
    },

    async fetchBidderData() {
      if (!this.canShowBidderIdentity) return

      try {
        // Simulate API call for bidder summary
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Sample bidder data
        this.bidderTotalAmounts = {
          bidder1: {
            bidderName: 'John Doe',
            bidderInitials: 'JD',
            totalAmount: 15000,
            bidCount: 8,
          },
          bidder2: {
            bidderName: 'Jane Smith',
            bidderInitials: 'JS',
            totalAmount: 12000,
            bidCount: 6,
          },
          bidder3: {
            bidderName: 'Mike Johnson',
            bidderInitials: 'MJ',
            totalAmount: 8000,
            bidCount: 4,
          },
        }
      } catch (error) {
        console.error('Error fetching bidder data:', error)
      }
    },

    calculateAverageBid() {
      if (this.totalBids > 0) {
        // Simple calculation - in real app, get this from API
        this.averageBid = Math.floor(this.currentHighestBid * 0.7)
      }
    },

    startPolling() {
      // Poll auction data every 2 seconds when live
      if (this.auctionStatus === 'live') {
        this.auctionPollingInterval = setInterval(() => {
          this.fetchAuctionData()
        }, 2000)
      }

      // Poll bidder data every 5 seconds when auction ended
      if (this.canShowBidderIdentity) {
        this.bidderPollingInterval = setInterval(() => {
          this.fetchBidderData()
        }, 5000)
      }
    },

    stopPolling() {
      if (this.auctionPollingInterval) {
        clearInterval(this.auctionPollingInterval)
        this.auctionPollingInterval = null
      }
      if (this.bidderPollingInterval) {
        clearInterval(this.bidderPollingInterval)
        this.bidderPollingInterval = null
      }
    },

    async startAuction() {
      try {
        this.loading = true

        // API call to start auction
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.auctionStatus = 'live'
        this.startPolling()

        this.$emit('show-message', {
          type: 'success',
          message: 'Auction started successfully!',
        })
      } catch (error) {
        console.error('Error starting auction:', error)
        this.$emit('show-message', {
          type: 'error',
          message: 'Failed to start auction',
        })
      } finally {
        this.loading = false
      }
    },

    async pauseAuction() {
      try {
        this.loading = true

        // API call to pause auction
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.auctionStatus = 'paused'
        this.stopPolling()

        this.$emit('show-message', {
          type: 'info',
          message: 'Auction paused',
        })
      } catch (error) {
        console.error('Error pausing auction:', error)
        this.$emit('show-message', {
          type: 'error',
          message: 'Failed to pause auction',
        })
      } finally {
        this.loading = false
      }
    },

    async endAuction() {
      try {
        this.loading = true

        // API call to end auction
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.auctionStatus = 'ended'
        this.stopPolling()

        // Show winner if there are bids
        if (this.currentHighestBid > this.startingPrice) {
          this.winner = {
            bidderName: 'John Doe',
            amount: this.currentHighestBid,
          }
          this.showWinnerModal = true
        }

        // Fetch final bidder data
        this.fetchBidderData()

        this.$emit('show-message', {
          type: 'success',
          message: 'Auction ended successfully!',
        })
      } catch (error) {
        console.error('Error ending auction:', error)
        this.$emit('show-message', {
          type: 'error',
          message: 'Failed to end auction',
        })
      } finally {
        this.loading = false
      }
    },

    handleAuctionEnd() {
      // Called when countdown timer reaches zero
      this.endAuction()
    },

    confirmWinner() {
      // Handle winner confirmation
      this.showWinnerModal = false
      this.$emit('show-message', {
        type: 'success',
        message: `Winner confirmed: ${this.winner?.bidderName}`,
      })
    },

    closeWinnerModal() {
      this.showWinnerModal = false
    },

    formatPrice(amount) {
      if (!amount && amount !== 0) return '0.00'
      return new Intl.NumberFormat('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    },
  },
}
