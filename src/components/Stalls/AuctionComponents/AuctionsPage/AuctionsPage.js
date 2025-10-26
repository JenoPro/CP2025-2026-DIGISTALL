import ActiveAuctions from '../ActiveAuctions/ActiveAuctions.vue'

export default {
  name: 'AuctionsPage',
  components: {
    ActiveAuctions,
  },
  data() {
    return {
      showMessage: false,
      message: '',
      messageType: 'info',
      messageTimeout: 5000,
      showDetailsModal: false,
      selectedAuction: null,
    }
  },
  methods: {
    handleMessage(message, type = 'info') {
      this.message = message
      this.messageType = type
      this.showMessage = true
    },

    handleViewDetails(auction) {
      this.selectedAuction = auction
      this.showDetailsModal = true
      console.log('View auction details:', auction)
    },

    closeDetailsModal() {
      this.showDetailsModal = false
      this.selectedAuction = null
    },

    formatPrice(price) {
      if (!price) return '0'
      return parseFloat(price).toLocaleString()
    },

    formatDateTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },
  },
}
