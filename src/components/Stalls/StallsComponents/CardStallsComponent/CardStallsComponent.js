export default {
  name: 'CardStallsComponent',
  props: {
    stalls: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  mounted() {
    // Check stalls data
    console.log('CardStallsComponent mounted')
    console.log('Number of stalls:', this.stalls.length)
    if (this.stalls.length > 0) {
      console.log('Sample stall data:', this.stalls[0])
      console.log('Sample stall location:', this.stalls[0].location)
    }
  },
  methods: {
    handleModify(stall) {
      console.log('Edit stall:', stall)
      this.$emit('stall-edit', stall)
    },

    handleLive(stall) {
      console.log('Go live with stall:', stall)
      this.$emit('stall-live', stall)
    },

    // NEW: Handle raffle management
    handleRaffleManagement(stall) {
      console.log('Manage raffle stall:', stall)
      this.$emit('stall-raffle-management', stall)
    },

    // NEW: Handle auction management
    handleAuctionManagement(stall) {
      console.log('Manage auction stall:', stall)
      this.$emit('stall-auction-management', stall)
    },

    // NEW: Get color for price type badge
    getPriceTypeColor(priceType) {
      switch (priceType) {
        case 'Raffle':
          return 'success'
        case 'Auction':
          return 'error'
        case 'Fixed Price':
        default:
          return 'primary'
      }
    },
  },
}
