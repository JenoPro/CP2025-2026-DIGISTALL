export default {
  name: 'CardStallsComponent',
  props: {
    stalls: {
      type: Array,
      required: true,
      default: () => [],
    },
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
