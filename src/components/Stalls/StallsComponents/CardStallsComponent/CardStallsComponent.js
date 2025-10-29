export default {
  name: 'CardStallsComponent',
  props: {
    stalls: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      expandedDescriptions: {},
    }
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
    handleCardClick(stall) {
      console.log('Card clicked for stall:', stall)
      this.$emit('stall-edit', stall)
    },

    handleModify(stall) {
      console.log('Edit stall:', stall)
      this.$emit('stall-edit', stall)
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
          return 'primary'
        case 'Auction':
          return 'primary'
        case 'Fixed Price':
        default:
          return 'primary'
      }
    },

    // NEW: Check if description is long enough to need truncation
    isDescriptionLong(description) {
      if (!description) return false
      return description.length > 80 // Show "show more" if description is longer than 80 characters
    },

    // NEW: Check if description is expanded
    isDescriptionExpanded(stallId) {
      return this.expandedDescriptions[stallId] || false
    },

    // NEW: Toggle description visibility
    toggleDescription(stall) {
      const stallId = stall.stallNumber || stall.id
      // Use Vue.set or direct assignment for reactivity
      if (this.$set) {
        this.$set(this.expandedDescriptions, stallId, !this.expandedDescriptions[stallId])
      } else {
        // Fallback for Vue 3 or when $set is not available
        this.expandedDescriptions = {
          ...this.expandedDescriptions,
          [stallId]: !this.expandedDescriptions[stallId],
        }
      }
    },
  },
}
