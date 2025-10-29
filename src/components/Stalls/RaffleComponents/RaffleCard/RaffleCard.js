export default {
  name: 'RaffleCard',
  props: {
    raffle: {
      type: Object,
      required: true,
    },
  },

  computed: {
    timeRemaining() {
      const now = new Date()
      const expires = new Date(this.raffle.expires_at)
      return expires - now
    },

    timeRemainingText() {
      if (this.timeRemaining <= 0) {
        return 'Expired'
      }

      const hours = Math.floor(this.timeRemaining / (1000 * 60 * 60))
      const minutes = Math.floor((this.timeRemaining % (1000 * 60 * 60)) / (1000 * 60))

      if (hours >= 24) {
        const days = Math.floor(hours / 24)
        const remainingHours = hours % 24
        return `${days}d ${remainingHours}h remaining`
      } else if (hours > 0) {
        return `${hours}h ${minutes}m remaining`
      } else {
        return `${minutes}m remaining`
      }
    },

    progressPercentage() {
      const created = new Date(this.raffle.created_at)
      const expires = new Date(this.raffle.expires_at)
      const now = new Date()

      const totalDuration = expires - created
      const elapsed = now - created

      return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100))
    },

    statusType() {
      if (this.timeRemaining <= 0) {
        return 'expired'
      } else if (this.timeRemaining <= 2 * 60 * 60 * 1000) {
        // 2 hours
        return 'expiring'
      } else {
        return 'active'
      }
    },

    statusText() {
      switch (this.statusType) {
        case 'expired':
          return 'Needs Winner Selection'
        case 'expiring':
          return 'Expiring Soon'
        case 'active':
        default:
          return 'Active'
      }
    },

    statusIcon() {
      switch (this.statusType) {
        case 'expired':
          return 'mdi-alert-circle'
        case 'expiring':
          return 'mdi-clock-alert'
        case 'active':
        default:
          return 'mdi-check-circle'
      }
    },

    timerColor() {
      // Always use primary color
      return 'primary'
    },

    cardClass() {
      return `status-${this.statusType}`
    },

    canExtendTimer() {
      // Can extend if raffle is active or expiring
      return this.statusType === 'active' || this.statusType === 'expiring'
    },

    canSelectWinner() {
      // Can select winner if raffle is expired and has participants
      return this.statusType === 'expired' && (this.raffle.participant_count || 0) > 0
    },
  },

  methods: {
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
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    selectWinner() {
      // Emit event to parent component to handle winner selection
      this.$emit('select-winner', this.raffle)
    },
  },
}
