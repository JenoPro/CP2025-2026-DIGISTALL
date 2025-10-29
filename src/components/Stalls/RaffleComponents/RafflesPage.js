import ActiveRaffles from './ActiveRaffles/ActiveRaffles.vue'
import StallParticipants from '../StallsComponents/StallParticipants/StallParticipants.vue'
import RaffleDetailsPopup from './RaffleDetailsPopup/RaffleDetailsPopup.vue'

export default {
  name: 'RafflesPage',
  components: {
    ActiveRaffles,
    StallParticipants,
    RaffleDetailsPopup,
  },
  data() {
    return {
      // Message and Modal data
      showMessage: false,
      message: '',
      messageType: 'info',
      messageTimeout: 5000,
      showDetailsModal: false,
      selectedRaffle: null,
      showParticipantsModal: false,
      selectedRaffleForParticipants: null,
    }
  },
  methods: {
    // Message and Modal methods
    handleMessage(message, type = 'info') {
      this.message = message
      this.messageType = type
      this.showMessage = true
    },

    handleViewDetails(raffle) {
      this.selectedRaffle = raffle
      this.showDetailsModal = true
      console.log('View raffle details:', raffle)
    },

    closeDetailsModal() {
      this.showDetailsModal = false
      this.selectedRaffle = null
    },

    handleViewParticipants(raffle) {
      this.selectedRaffleForParticipants = raffle
      this.showParticipantsModal = true
      console.log('View raffle participants:', raffle)
    },

    closeParticipantsModal() {
      this.showParticipantsModal = false
      this.selectedRaffleForParticipants = null
    },

    formatPrice(price) {
      return parseFloat(price).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    },

    formatDateTime(dateTime) {
      if (!dateTime) return 'N/A'

      const date = new Date(dateTime)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    },
  },
}
