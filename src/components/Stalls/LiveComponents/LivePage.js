// Import components
import VideoArea from './videoComponents/VideoArea/VideoArea.vue'
import ChatBox from './chatBoxComponents/ChatBox/ChatBox.vue'
import ParticipantsList from './controlPanelComponents/ParticipantsList/ParticipantsList.vue'
import AuctionLivePanel from '../AuctionComponents/AuctionLivePanel/AuctionLivePanel.vue'

export default {
  name: 'LivePage',
  components: {
    VideoArea,
    ChatBox,
    ParticipantsList,
    AuctionLivePanel,
  },
  props: {
    stallId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['raffle', 'auction'].includes(value.toLowerCase()),
    },
  },
  data() {
    return {
      stallData: {},
      itemType: '',
      chatMessages: [
        {
          id: 1,
          sender: 'John Doe',
          text: 'Good luck everyone!',
          timestamp: new Date(),
          isOwn: false,
        },
        {
          id: 2,
          sender: 'Jane Smith',
          text: 'Excited for this raffle!',
          timestamp: new Date(),
          isOwn: false,
        },
      ],
      showMessage: false,
      message: '',
      messageType: 'info',
      loading: false,
      showWinnerDialog: false,
      selectedWinner: null,
      showParticipantsModal: false,
      apiBaseUrl: 'http://localhost:3000',
      isLiveActive: false,

      // Auction Control Properties
      auctionStatus: 'pending', // pending, live, paused, ended
      auctionLoading: false,

      videoStream: null,
      currentVideoFilter: 'none',
      videoFlipHorizontal: false,
      videoFlipVertical: false,
      autoFocusEnabled: true,
      isFullscreen: false,
      showVideoSettings: false,
      participants: [],
      bidders: [],
      videoFilters: [
        { name: 'None', value: 'none', icon: 'mdi-filter-off' },
        { name: 'Blur', value: 'blur', icon: 'mdi-blur' },
        { name: 'Brightness', value: 'brightness', icon: 'mdi-brightness-6' },
        { name: 'Contrast', value: 'contrast', icon: 'mdi-contrast-box' },
        { name: 'Grayscale', value: 'grayscale', icon: 'mdi-palette-swatch' },
        { name: 'Sepia', value: 'sepia', icon: 'mdi-image-filter-vintage' },
        { name: 'Saturate', value: 'saturate', icon: 'mdi-palette' },
        { name: 'Hue Rotate', value: 'hue-rotate', icon: 'mdi-rotate-360' },
      ],
      currentTime: new Date(),
      countdown: 300,
      auctionCountdown: 1200, // 20 minutes (20 * 60 = 1200 seconds)
      raffleWinner: null,
      auctionWinner: null,
      ticketsSold: 0,
      maxTickets: 100,
    }
  },
  computed: {
    formattedCountdown() {
      const minutes = Math.floor(this.countdown / 60)
      const seconds = this.countdown % 60
      return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
    },
    formattedAuctionCountdown() {
      const minutes = Math.floor(this.auctionCountdown / 60)
      const seconds = this.auctionCountdown % 60
      return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
    },
    timeRemaining() {
      if (this.isRaffle) {
        return this.countdown
      } else if (this.isAuction) {
        return this.auctionCountdown
      }
      return 0
    },
    timeRemainingText() {
      if (this.isRaffle) {
        return this.formattedCountdown
      } else if (this.isAuction) {
        return this.formattedAuctionCountdown
      }
      return '00:00'
    },
    isRaffle() {
      return this.type.toLowerCase() === 'raffle'
    },
    isAuction() {
      return this.type.toLowerCase() === 'auction'
    },
  },
  mounted() {
    this.startCountdown()
    this.updateTime()
    this.fetchStallData()
  },
  beforeUnmount() {
    this.stopVideoStream()
  },
  methods: {
    // Get current highest bid for auction display
    getCurrentHighestBid() {
      if (this.isAuction && this.bidders.length > 0) {
        return Math.max(...this.bidders.map((bidder) => bidder.bid_amount || bidder.lastBid || 0))
      }
      return this.stallData.starting_price || 0
    },

    // Format price with commas
    formatPrice(price) {
      if (!price) return '0'
      return Number(price).toLocaleString()
    },
    getStatusColor() {
      if (!this.stallData.status) return 'grey'
      const status = this.stallData.status.toLowerCase()
      switch (status) {
        case 'active':
        case 'live':
          return 'success'
        case 'inactive':
        case 'closed':
          return 'error'
        case 'pending':
        case 'waiting':
          return 'warning'
        default:
          return 'info'
      }
    },

    // Helper method for auction status colors
    getAuctionStatusColor() {
      switch (this.auctionStatus) {
        case 'live':
          return 'success'
        case 'pending':
          return 'warning'
        case 'paused':
          return 'info'
        case 'ended':
          return 'error'
        default:
          return 'grey'
      }
    },

    goBack() {
      this.$router.go(-1)
    },
    startLive() {
      this.initializeVideoStream()
    },
    stopLive() {
      this.stopVideoStream()
    },
    async fetchStallData() {
      try {
        const response = await fetch(this.apiBaseUrl + '/stalls/' + this.stallId)
        if (response.ok) {
          this.stallData = await response.json()
          this.itemType = this.stallData.type
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.stallData = {
          name: 'Sample Stall',
          location: 'Market Area A',
          branch_name: 'Main Branch',
          status: 'Active',
          type: this.type,
          starting_price: 100,
        }
        this.itemType = this.type
      }
      // Fetch participants/bidders after stall data
      if (this.isRaffle) {
        this.fetchRaffleParticipants()
      } else if (this.isAuction) {
        this.fetchAuctionBidders()
      }
    },
    async fetchRaffleParticipants() {
      if (this.isRaffle) {
        try {
          const response = await fetch(
            this.apiBaseUrl + '/raffle/' + this.stallId + '/participants',
          )
          if (response.ok) {
            const data = await response.json()
            this.participants = data.participants || []
          }
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          // Mock data
          this.participants = [
            {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
              entry_date: new Date().toISOString(),
              status: 'Active',
            },
            {
              id: 2,
              name: 'Jane Smith',
              email: 'jane@example.com',
              entry_date: new Date().toISOString(),
              status: 'Active',
            },
            {
              id: 3,
              name: 'Mike Johnson',
              email: 'mike@example.com',
              entry_date: new Date().toISOString(),
              status: 'Active',
            },
          ]
        }
      }
    },
    async fetchAuctionBidders() {
      if (this.isAuction) {
        try {
          const response = await fetch(this.apiBaseUrl + '/auction/' + this.stallId + '/bidders')
          if (response.ok) {
            const data = await response.json()
            this.bidders = data.bidders || []
          }
          // eslint-disable-next-line no-unused-vars
        } catch (error) {
          // Mock data
          this.bidders = [
            {
              id: 1,
              name: 'Sample Bidder',
              email: 'bidder@example.com',
              lastBid: 100,
              bid_amount: 100,
              bid_date: new Date().toISOString(),
              status: 'Bidding',
            },
            {
              id: 2,
              name: 'High Bidder',
              email: 'high@example.com',
              lastBid: 250,
              bid_amount: 250,
              bid_date: new Date().toISOString(),
              status: 'Bidding',
            },
          ]
        }
      }
    },
    async initializeVideoStream() {
      try {
        this.videoStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: true,
        })
        this.isLiveActive = true
        this.$nextTick(() => {
          const videoElement = document.getElementById('live-video')
          if (videoElement && this.videoStream) {
            videoElement.srcObject = this.videoStream
          }
        })
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        this.handleMessage('Camera access denied', 'error')
      }
    },
    stopVideoStream() {
      if (this.videoStream) {
        this.videoStream.getTracks().forEach((track) => track.stop())
        this.videoStream = null
        this.isLiveActive = false
      }
    },
    onFilterChanged(filter) {
      this.currentVideoFilter = filter
    },
    onFlipHorizontal() {
      this.videoFlipHorizontal = !this.videoFlipHorizontal
    },
    onFlipVertical() {
      this.videoFlipVertical = !this.videoFlipVertical
    },
    onToggleAutoFocus() {
      this.autoFocusEnabled = !this.autoFocusEnabled
    },
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        if (this.countdown > 0) this.countdown--
        if (this.auctionCountdown > 0) this.auctionCountdown--
      }, 1000)
    },
    updateTime() {
      setInterval(() => {
        this.currentTime = new Date()
      }, 1000)
    },
    sendMessage(messageData) {
      this.chatMessages.push({
        id: Date.now(),
        sender: messageData.sender || 'Anonymous',
        text: messageData.text,
        timestamp: new Date(),
        isOwn: messageData.isOwn || false,
      })
    },
    handleMessage(text, type = 'info') {
      this.message = text
      this.messageType = type
      this.showMessage = true
      setTimeout(() => {
        this.showMessage = false
      }, 3000)
    },

    // Auction Control Methods
    async startAuction() {
      try {
        this.auctionLoading = true

        // API call to start auction - replace with actual endpoint
        // await this.apiCall('POST', `/auctions/${this.stallData.id}/start`)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.auctionStatus = 'live'
        this.isLiveActive = true

        this.handleMessage('Auction started successfully!', 'success')
      } catch (error) {
        console.error('Error starting auction:', error)
        this.handleMessage('Failed to start auction', 'error')
      } finally {
        this.auctionLoading = false
      }
    },

    async pauseAuction() {
      try {
        this.auctionLoading = true

        // API call to pause auction
        // await this.apiCall('POST', `/auctions/${this.stallData.id}/pause`)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.auctionStatus = 'paused'

        this.handleMessage('Auction paused', 'info')
      } catch (error) {
        console.error('Error pausing auction:', error)
        this.handleMessage('Failed to pause auction', 'error')
      } finally {
        this.auctionLoading = false
      }
    },

    async endAuction() {
      try {
        this.auctionLoading = true

        // API call to end auction
        // await this.apiCall('POST', `/auctions/${this.stallData.id}/end`)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        this.auctionStatus = 'ended'
        this.isLiveActive = false

        // Handle winner determination if bidders exist
        if (this.bidders.length > 0) {
          const highestBidder = this.bidders.reduce((prev, current) => {
            return (prev.bid_amount || prev.lastBid || 0) >
              (current.bid_amount || current.lastBid || 0)
              ? prev
              : current
          })
          this.auctionWinner = highestBidder
          this.selectedWinner = this.auctionWinner
          this.showWinnerDialog = true
          this.handleMessage(
            `Auction won by: ${this.auctionWinner.name} with bid ₱${this.formatPrice(this.auctionWinner.bid_amount || this.auctionWinner.lastBid)}`,
            'success',
          )
        } else {
          this.handleMessage('Auction ended with no bids', 'info')
        }
      } catch (error) {
        console.error('Error ending auction:', error)
        this.handleMessage('Failed to end auction', 'error')
      } finally {
        this.auctionLoading = false
      }
    },

    selectRaffleWinner() {
      if (this.participants.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.participants.length)
        this.raffleWinner = this.participants[randomIndex]
        this.showWinnerDialog = true
      }
    },
    removeParticipant(participantId) {
      this.participants = this.participants.filter((p) => p.id !== participantId)
      this.handleMessage('Participant removed', 'info')
    },
    removeBidder(bidderId) {
      this.bidders = this.bidders.filter((b) => b.id !== bidderId)
      this.handleMessage('Bidder removed', 'info')
    },
    // Modal methods
    openParticipantsModal() {
      this.showParticipantsModal = true
    },
    closeParticipantsModal() {
      this.showParticipantsModal = false
    },
    closeWinnerDialog() {
      this.showWinnerDialog = false
      this.selectedWinner = null
    },
    // Restart functionality
    restartCountdown() {
      if (this.isRaffle) {
        this.countdown = 300
        this.raffleWinner = null
      } else if (this.isAuction) {
        this.auctionCountdown = 1200 // Reset to 20 minutes
        this.auctionWinner = null
      }
      this.selectedWinner = null
      this.showWinnerDialog = false
      this.handleMessage('Countdown restarted', 'info')
    },
    selectWinner() {
      if (this.isRaffle) {
        this.selectRaffleWinner()
      } else if (this.isAuction) {
        this.endAuction()
      }
    },

    // Auction event handlers
    onBidPlaced(bidData) {
      // Handle bid placement from auction panel
      // Update bidders list if needed
      this.handleMessage(`New bid placed: ₱${this.formatPrice(bidData.amount)}`, 'success')
    },

    onAuctionEnded(winnerData) {
      // Handle auction end from auction panel
      this.auctionWinner = winnerData
      this.handleMessage(`Auction ended! Winner: ${winnerData.name}`, 'success')
    },
  },
}
