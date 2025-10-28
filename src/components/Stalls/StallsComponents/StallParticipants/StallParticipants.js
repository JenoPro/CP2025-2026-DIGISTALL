import participantsService from '../../../../services/participantsService.js'

export default {
  name: 'StallParticipants',
  props: {
    stallId: {
      type: [String, Number],
      required: true,
    },
  },
  emits: ['close'],
  data() {
    return {
      loading: false,
      error: null,
      participants: [],
      stallInfo: null,
      snackbar: {
        show: false,
        text: '',
        color: 'success',
      },
    }
  },
  async mounted() {
    await this.fetchParticipants()
  },
  methods: {
    /**
     * Fetch participants for the current stall
     */
    async fetchParticipants() {
      this.loading = true
      this.error = null

      try {
        console.log(`🔍 Fetching participants for stall ID: ${this.stallId}`)

        const response = await participantsService.getParticipantsByStall(this.stallId)

        if (response.success) {
          this.participants = response.data || []
          this.stallInfo = response.stallInfo || null

          console.log(`✅ Successfully loaded ${this.participants.length} participants`)

          if (this.participants.length === 0) {
            this.showMessage('No participants found for this stall', 'info')
          }
        } else {
          throw new Error(response.message || 'Failed to fetch participants')
        }
      } catch (error) {
        console.error('❌ Error fetching participants:', error)
        this.error = error.message || 'Failed to load participants'
        this.showMessage('Failed to load participants', 'error')
      } finally {
        this.loading = false
      }
    },

    /**
     * Show snackbar message
     * @param {string} message - Message to show
     * @param {string} color - Color of the snackbar
     */
    showMessage(message, color = 'success') {
      this.snackbar = {
        show: true,
        text: message,
        color: color,
      }
    },
  },

  watch: {
    /**
     * Watch for stallId changes and refetch data
     */
    stallId: {
      handler(newStallId, oldStallId) {
        if (newStallId && newStallId !== oldStallId) {
          console.log(`🔄 Stall ID changed from ${oldStallId} to ${newStallId}`)
          this.fetchParticipants()
        }
      },
      immediate: false,
    },
  },
}
