export default {
  name: 'HighestBidderPanel',
  props: {
    currentHighestBid: {
      type: Number,
      default: 0,
    },
    highestBidder: {
      type: Object,
      default: null,
    },
    startingPrice: {
      type: Number,
      default: 100,
    },
    bidIncrement: {
      type: Number,
      default: 50,
    },
    totalBidders: {
      type: Number,
      default: 0,
    },
    activeBidders: {
      type: Number,
      default: 0,
    },
    canShowIdentity: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    bidderInitials() {
      if (!this.highestBidder?.name && !this.highestBidder?.initials) return '?'
      return this.highestBidder.initials || this.highestBidder.name
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
    },
    displayName() {
      if (!this.highestBidder) return 'Unknown'
      return this.canShowIdentity ? this.highestBidder.name : this.highestBidder.name
    },
    displayEmail() {
      if (!this.highestBidder) return ''
      return this.canShowIdentity ? this.highestBidder.email : this.highestBidder.email
    },
    nextMinimumBid() {
      return this.currentHighestBid + this.bidIncrement
    },
    bidProgressPercentage() {
      if (this.currentHighestBid <= this.startingPrice) return 0
      const increase = this.currentHighestBid - this.startingPrice
      const maxIncrease = this.startingPrice * 2 // Assume max is 3x starting price
      return Math.min((increase / maxIncrease) * 100, 100)
    },
    leadChanges() {
      // This would come from bid history analysis
      return Math.floor(this.totalBidders * 0.6) // Simulate lead changes
    },
  },
  methods: {
    formatPrice(price) {
      if (!price) return '0'
      return Number(price).toLocaleString()
    },
  },
  emits: ['refreshData'],
}
