import ActiveRaffles from '../ActiveRaffles/ActiveRaffles.vue'

export default {
  name: 'RafflesPage',
  components: {
    ActiveRaffles,
  },
  data() {
    return {
      showMessage: false,
      message: '',
      messageType: 'info',
      messageTimeout: 5000,
      showDetailsModal: false,
      selectedRaffle: null,
    }
  },
  methods: {
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
