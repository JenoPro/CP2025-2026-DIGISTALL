export default {
  name: 'CardStallsComponent',
  props: {
    stalls: {
      type: Array,
      required: true,
      default: () => [],
    },
    showAuctionFeatures: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    // Check if auction features should be visible
    console.log('CardStallsComponent mounted')
    console.log('showAuctionFeatures:', this.showAuctionFeatures)
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
    handleAuction(stall) {
      console.log('Auction stall:', stall)
      this.$emit('stall-auction', stall)
    },
    handleLive(stall) {
      console.log('Go live with stall:', stall)
      this.$emit('stall-live', stall)
    },
  },
}
