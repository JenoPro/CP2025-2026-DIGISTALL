import ActiveAuctions from '../ActiveAuctions/ActiveAuctions.vue'
import StallParticipants from '../../StallsComponents/StallParticipants/StallParticipants.vue'

export default {
  name: 'AuctionsPage',
  components: {
    ActiveAuctions,
    StallParticipants,
  },
  data() {
    return {
      // Message and Modal data
      showMessage: false,
      message: '',
      messageType: 'info',
      messageTimeout: 5000,
      showDetailsModal: false,
      selectedAuction: null,
      showParticipantsModal: false,
      selectedAuctionForParticipants: null,
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

    handleViewParticipants(auction) {
      this.selectedAuctionForParticipants = auction
      this.showParticipantsModal = true
      console.log('View auction participants:', auction)
    },

    closeParticipantsModal() {
      this.showParticipantsModal = false
      this.selectedAuctionForParticipants = null
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
