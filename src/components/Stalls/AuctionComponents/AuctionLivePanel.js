import HighestBidderPanel from './HighestBidder/HighestBidderPanel.vue'
import CountdownTimer from './CountdownTimer/CountdownTimer.vue'

export default {
  name: 'AuctionLivePanel',
  components: {
    HighestBidderPanel,
    CountdownTimer,
  },
  props: {
    auctionId: {
      type: [String, Number],
      required: true,
    },
    stallData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      // Auction state
      auctionStatus: 'pending', // pending, live, paused, ended
      auctionTimeRemaining: 300, // seconds
      loading: false,
      loadingBids: false,

      // Bidding data
      currentHighestBid: 0,
      highestBidder: null,
      startingPrice: 100,
      bidIncrement: 50,
      recentBids: [],
      allBidders: [],

      // Statistics
      totalBidders: 0,
      totalBids: 0,
      activeBidders: 0,
      averageBid: 0,

      // Modals
      showWinnerModal: false,
      winner: null,

      // API
      apiBaseUrl: 'http://localhost:3000',
      refreshInterval: null,
      socketConnection: null,
    }
  },
  computed: {
    winnerInitials() {
      if (!this.winner?.bidderName) return '?'
      return this.winner.bidderName
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
    },

    // Check if auction has ended and winners can be revealed
    canShowBidderIdentity() {
      return this.auctionStatus === 'ended' || this.showWinnerModal
    },

    // Anonymized highest bidder for privacy
    displayHighestBidder() {
      if (!this.highestBidder) return null

      if (this.canShowBidderIdentity) {
        return this.highestBidder
      }

      // Return anonymized version during active bidding
      return {
        ...this.highestBidder,
        name: `Bidder ${this.highestBidder.id || 'X'}`,
        email: 'Hidden for privacy',
        initials: `B${this.highestBidder.id || 'X'}`,
      }
    },

    // Anonymized recent bids for privacy
    displayRecentBids() {
      if (!this.recentBids) return []

      return this.recentBids.map((bid, index) => {
        if (this.canShowBidderIdentity) {
          return bid
        }

        // Return anonymized version during active bidding
        return {
          ...bid,
          bidderName: `Bidder ${bid.id || index + 1}`,
          bidderInitials: `B${bid.id || index + 1}`,
        }
      })
    },

    // Track total bid amounts per participant
    bidderTotalAmounts() {
      const totals = {}
      this.recentBids.forEach((bid) => {
        const bidderId = bid.id || bid.bidderName
        if (!totals[bidderId]) {
          totals[bidderId] = {
            bidderName: bid.bidderName,
            bidderInitials: bid.bidderInitials,
            totalAmount: 0,
            bidCount: 0,
          }
        }
        totals[bidderId].totalAmount += bid.amount
        totals[bidderId].bidCount += 1
      })
      return totals
    },
  },
  mounted() {
    this.initializeAuction()
    this.setupRealTimeUpdates()
  },
  beforeUnmount() {
    this.cleanup()
  },
  methods: {
    // Initialize auction data
    async initializeAuction() {
      await this.fetchAuctionData()
      this.startAutoRefresh()
    },

    // Fetch auction data from API
    async fetchAuctionData() {
      this.loading = true
      try {
        const response = await fetch(`${this.apiBaseUrl}/auctions/${this.auctionId}`)
        if (response.ok) {
          const data = await response.json()
          this.updateAuctionData(data)
        } else {
          this.useMockData()
        }
      } catch (error) {
        console.error('Failed to fetch auction data:', error)
        this.useMockData()
      } finally {
        this.loading = false
      }
    },

    // Update auction data
    updateAuctionData(data) {
      this.auctionStatus = data.status || 'pending'
      this.auctionTimeRemaining = data.timeRemaining || 300
      this.currentHighestBid = data.currentHighestBid || this.startingPrice
      this.highestBidder = data.highestBidder
      this.startingPrice = data.startingPrice || 100
      this.bidIncrement = data.bidIncrement || 50
      this.recentBids = data.recentBids || []
      this.allBidders = data.allBidders || []
      this.updateStatistics()
    },

    // Use mock data for demonstration
    useMockData() {
      this.auctionStatus = 'live'
      this.auctionTimeRemaining = 180
      this.currentHighestBid = 750
      this.startingPrice = 100
      this.bidIncrement = 50

      this.highestBidder = {
        id: 1,
        name: 'John Smith',
        email: 'john@example.com',
        avatar: null,
      }

      this.recentBids = [
        {
          id: 5,
          bidderName: 'John Smith',
          bidderInitials: 'JS',
          amount: 750,
          timestamp: new Date(Date.now() - 30000),
          isHighest: true,
        },
        {
          id: 4,
          bidderName: 'Mary Johnson',
          bidderInitials: 'MJ',
          amount: 700,
          timestamp: new Date(Date.now() - 120000),
          isHighest: false,
        },
        {
          id: 3,
          bidderName: 'David Wilson',
          bidderInitials: 'DW',
          amount: 650,
          timestamp: new Date(Date.now() - 180000),
          isHighest: false,
        },
        {
          id: 2,
          bidderName: 'Sarah Davis',
          bidderInitials: 'SD',
          amount: 600,
          timestamp: new Date(Date.now() - 240000),
          isHighest: false,
        },
        {
          id: 1,
          bidderName: 'Mike Brown',
          bidderInitials: 'MB',
          amount: 550,
          timestamp: new Date(Date.now() - 300000),
          isHighest: false,
        },
      ]

      this.allBidders = [
        { id: 1, name: 'John Smith', isActive: true, totalBids: 3, highestBid: 750 },
        { id: 2, name: 'Mary Johnson', isActive: true, totalBids: 2, highestBid: 700 },
        { id: 3, name: 'David Wilson', isActive: false, totalBids: 1, highestBid: 650 },
        { id: 4, name: 'Sarah Davis', isActive: true, totalBids: 1, highestBid: 600 },
        { id: 5, name: 'Mike Brown', isActive: false, totalBids: 1, highestBid: 550 },
      ]

      this.updateStatistics()
    },

    // Update statistics
    updateStatistics() {
      this.totalBidders = this.allBidders.length
      this.totalBids = this.recentBids.length
      this.activeBidders = this.allBidders.filter((bidder) => bidder.isActive).length

      if (this.recentBids.length > 0) {
        const totalAmount = this.recentBids.reduce((sum, bid) => sum + bid.amount, 0)
        this.averageBid = Math.round(totalAmount / this.recentBids.length)
      } else {
        this.averageBid = 0
      }
    },

    // Fetch bid history
    async fetchBidHistory() {
      this.loadingBids = true
      try {
        const response = await fetch(`${this.apiBaseUrl}/auctions/${this.auctionId}/bids`)
        if (response.ok) {
          const data = await response.json()
          this.recentBids = data.bids || []
        }
      } catch (error) {
        console.error('Failed to fetch bid history:', error)
      } finally {
        this.loadingBids = false
      }
    },

    // Setup real-time updates (WebSocket simulation)
    setupRealTimeUpdates() {
      // Simulate real-time bid updates
      this.refreshInterval = setInterval(() => {
        if (this.auctionStatus === 'live') {
          this.simulateNewBid()
        }
      }, 15000) // New bid every 15 seconds
    },

    // Simulate new bid (for demo purposes)
    simulateNewBid() {
      const bidders = ['Alex Thompson', 'Lisa Garcia', 'Tom Anderson', 'Emma Wilson']
      const randomBidder = bidders[Math.floor(Math.random() * bidders.length)]
      const newBidAmount =
        this.currentHighestBid + this.bidIncrement + Math.floor(Math.random() * 100)

      const newBid = {
        id: Date.now(),
        bidderName: randomBidder,
        bidderInitials: randomBidder
          .split(' ')
          .map((n) => n[0])
          .join(''),
        amount: newBidAmount,
        timestamp: new Date(),
        isHighest: true,
      }

      // Mark previous highest as not highest
      this.recentBids.forEach((bid) => (bid.isHighest = false))

      // Add new bid to the beginning
      this.recentBids.unshift(newBid)

      // Update highest bid
      this.currentHighestBid = newBidAmount
      this.highestBidder = {
        id: Date.now(),
        name: randomBidder,
        email: `${randomBidder.toLowerCase().replace(' ', '.')}@example.com`,
      }

      this.updateStatistics()
      this.$emit('newBid', newBid)
    },

    // Start auto refresh
    startAutoRefresh() {
      if (this.refreshInterval) return

      this.refreshInterval = setInterval(() => {
        if (this.auctionStatus === 'live') {
          this.auctionTimeRemaining -= 1
          if (this.auctionTimeRemaining <= 0) {
            this.handleAuctionEnd()
          }
        }
      }, 1000)
    },

    // Auction control methods
    async startAuction() {
      this.loading = true
      try {
        const response = await fetch(`${this.apiBaseUrl}/auctions/${this.auctionId}/start`, {
          method: 'POST',
        })
        if (response.ok) {
          this.auctionStatus = 'live'
          this.handleMessage('Auction started successfully', 'success')
        }
      } catch (error) {
        console.error('Failed to start auction:', error)
        // Simulate success for demo
        this.auctionStatus = 'live'
        this.handleMessage('Auction started successfully', 'success')
      } finally {
        this.loading = false
      }
    },

    async pauseAuction() {
      this.loading = true
      try {
        const response = await fetch(`${this.apiBaseUrl}/auctions/${this.auctionId}/pause`, {
          method: 'POST',
        })
        if (response.ok) {
          this.auctionStatus = 'paused'
          this.handleMessage('Auction paused', 'warning')
        }
      } catch (error) {
        console.error('Failed to pause auction:', error)
        // Simulate success for demo
        this.auctionStatus = 'paused'
        this.handleMessage('Auction paused', 'warning')
      } finally {
        this.loading = false
      }
    },

    async endAuction() {
      this.loading = true
      try {
        const response = await fetch(`${this.apiBaseUrl}/auctions/${this.auctionId}/end`, {
          method: 'POST',
        })
        if (response.ok) {
          this.auctionStatus = 'ended'
          this.showWinnerModal = true
          this.winner = this.recentBids.find((bid) => bid.isHighest)
          this.handleMessage('Auction ended', 'info')
        }
      } catch (error) {
        console.error('Failed to end auction:', error)
        // Simulate success for demo
        this.auctionStatus = 'ended'
        this.showWinnerModal = true
        this.winner = this.recentBids.find((bid) => bid.isHighest)
        this.handleMessage('Auction ended', 'info')
      } finally {
        this.loading = false
      }
    },

    async extendAuction() {
      this.loading = true
      try {
        const response = await fetch(`${this.apiBaseUrl}/auctions/${this.auctionId}/extend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ minutes: 5 }),
        })
        if (response.ok) {
          this.auctionTimeRemaining += 300 // Add 5 minutes
          this.handleMessage('Auction extended by 5 minutes', 'success')
        }
      } catch (error) {
        console.error('Failed to extend auction:', error)
        // Simulate success for demo
        this.auctionTimeRemaining += 300
        this.handleMessage('Auction extended by 5 minutes', 'success')
      } finally {
        this.loading = false
      }
    },

    // Event handlers
    handleAuctionEnd() {
      if (this.auctionStatus === 'live') {
        this.endAuction()
      }
    },

    handleNewBid(bid) {
      console.log('New bid received:', bid)
      // Handle real-time bid updates
    },

    handleBidderJoined(bidder) {
      console.log('Bidder joined:', bidder)
      this.allBidders.push(bidder)
      this.updateStatistics()
    },

    handleBidderLeft(bidderId) {
      console.log('Bidder left:', bidderId)
      this.allBidders = this.allBidders.filter((bidder) => bidder.id !== bidderId)
      this.updateStatistics()
    },

    // Winner modal methods
    confirmWinner() {
      this.handleMessage(`Winner confirmed: ${this.winner?.bidderName}`, 'success')
      this.closeWinnerModal()
      this.$emit('auctionCompleted', this.winner)
    },

    closeWinnerModal() {
      this.showWinnerModal = false
      this.winner = null
    },

    // Utility methods
    formatPrice(price) {
      if (!price) return '0'
      return Number(price).toLocaleString()
    },

    formatDateTime(date) {
      if (!date) return ''
      return new Date(date).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    handleMessage(text, type = 'info') {
      this.$emit('message', { text, type })
    },

    // Cleanup
    cleanup() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
      }
      if (this.socketConnection) {
        this.socketConnection.close()
        this.socketConnection = null
      }
    },
  },
}
