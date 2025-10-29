import RaffleCard from '../RaffleCard/RaffleCard.vue'
import SearchAndFilter from '../SearchAndFilter/SearchAndFilter.vue'

import participantsService from '../../../../services/participantsService.js'

export default {
  name: 'ActiveRaffles',
  components: {
    RaffleCard,
    SearchAndFilter,
  },
  data() {
    return {
      raffles: [],
      filteredRaffles: [], // Will be populated by the SearchAndFilter component
      loading: false,
      search: '',
      statusFilter: null,
      sortBy: 'created_desc',
      showFilterPanel: false,

      // Dialog states
      showExtendDialog: false,
      showWinnerDialog: false,
      selectedRaffle: null,
      extensionHours: 24,
      extending: false,
      selectingWinner: false,

      // Options
      statusOptions: [
        { text: 'Active (Accepting)', value: 'active' },
        { text: 'Expiring Soon', value: 'expiring' },
        { text: 'Needs Winner Selection', value: 'expired' },
      ],
      sortOptions: [
        { text: 'Newest First', value: 'created_desc' },
        { text: 'Oldest First', value: 'created_asc' },
        { text: 'Expiring Soon', value: 'expires_asc' },
        { text: 'Most Participants', value: 'participants_desc' },
      ],

      // Validation rules
      rules: {
        required: (value) => !!value || 'Required field',
        positiveNumber: (value) => value > 0 || 'Must be greater than 0',
        maxExtension: (value) => value <= 168 || 'Cannot extend more than 7 days (168 hours)',
      },

      // API base URL
      // eslint-disable-next-line no-undef
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:3001',

      // Auto refresh interval
      refreshInterval: null,
    }
  },

  computed: {
    activeRaffles() {
      // Return raffles data for the SearchAndFilter component
      return this.raffles.map((raffle) => ({
        ...raffle,
        stallNumber: raffle.stall_number,
        location: raffle.location || '',
        floor_id: raffle.floor_id,
        floor_name: raffle.floor_name,
        section_id: raffle.section_id,
        section_name: raffle.section_name,
        status: this.getRaffleStatus(raffle),
        ticketPrice: raffle.ticket_price,
        totalTickets: raffle.total_tickets,
        ticketsSold: raffle.tickets_sold,
        drawDate: raffle.draw_date,
      }))
    },
  },

  mounted() {
    this.loadRaffles()

    // Check if we're focusing on a specific stall
    const { stallId, stallNumber } = this.$route.query
    if (stallId && stallNumber) {
      this.search = stallNumber
      this.$emit('show-message', `Showing raffles for stall ${stallNumber}`, 'info')
    }

    // Set up auto refresh every 30 seconds
    this.refreshInterval = setInterval(() => {
      this.loadRaffles(false) // Silent refresh
    }, 30000)
  },

  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },

  methods: {
    // Filter methods
    toggleFilter() {
      this.showFilterPanel = !this.showFilterPanel
    },

    applyFilters() {
      // Filters are applied automatically through computed property
      this.showFilterPanel = false
      this.$emit('show-message', 'Filters applied successfully', 'success')
    },

    clearFilters() {
      this.statusFilter = null
      this.search = ''
      this.sortBy = 'created_desc'
      this.showFilterPanel = false
      this.$emit('show-message', 'Filters cleared', 'info')
    },

    // New method to handle filtered raffles from SearchAndFilter component
    handleFilteredRaffles(filteredRaffles) {
      this.filteredRaffles = filteredRaffles
    },

    // Helper method to get raffle status
    getRaffleStatus(raffle) {
      const now = new Date()
      const drawDate = new Date(raffle.draw_date)

      if (raffle.status === 'ended' || raffle.status === 'completed') {
        return 'Ended'
      } else if (drawDate <= now) {
        return 'Ended'
      } else {
        return 'Active'
      }
    },

    async loadRaffles(showLoading = true) {
      if (showLoading) this.loading = true

      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) {
          this.$emit('show-message', 'Authentication required', 'error')
          return
        }

        const response = await fetch(
          `${this.apiBaseUrl}/api/stalls?price_type=Raffle&is_available=1`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const result = await response.json()
        console.log('Raffle API Response:', result)
        if (result.success) {
          // Map stalls data to raffle format and filter for actual raffles only
          const allStalls = result.data || []
          console.log('All stalls received:', allStalls)
          console.log('Filtering for price_type=Raffle, is_available=1')

          this.raffles = allStalls
            .filter((stall) => {
              console.log(
                `Stall ${stall.stall_no}: price_type=${stall.price_type}, is_available=${stall.is_available}`,
              )
              return (
                stall.price_type === 'Raffle' &&
                (stall.is_available === 1 || stall.is_available === true)
              )
            })
            .map((stall) => {
              // Calculate expires_at based on created_at + durationHours
              let expiresAt = stall.expires_at
              if (!expiresAt && stall.created_at && stall.duration_hours) {
                const createdDate = new Date(stall.created_at)
                createdDate.setHours(createdDate.getHours() + parseInt(stall.duration_hours || 72))
                expiresAt = createdDate.toISOString()
              } else if (!expiresAt) {
                // Default 72 hours (3 days) from creation
                const createdDate = new Date(stall.created_at || Date.now())
                createdDate.setHours(createdDate.getHours() + 72)
                expiresAt = createdDate.toISOString()
              }

              return {
                raffle_id: stall.stall_id,
                stall_id: stall.stall_id,
                id: stall.stall_id, // Add id for router navigation
                stall_number: stall.stall_no || stall.stall_number,
                location: stall.stall_location || stall.location,
                entry_fee: stall.rental_price,
                expires_at: expiresAt,
                created_at: stall.created_at,
                duration_hours: stall.duration_hours || 72,
                status: stall.status?.toLowerCase() || 'active',
                participant_count: 0, // Will be loaded from participants service
                floor_name: stall.floor_name,
                section_name: stall.section_name,
                recent_participants: [], // Will be loaded from participants service
              }
            })

          // Load participants for each raffle
          await this.loadParticipantsForRaffles(this.raffles)

          console.log('Filtered raffles:', this.raffles)
        } else {
          throw new Error(result.message || 'Failed to load raffles')
        }
      } catch (error) {
        console.error('Error loading raffles:', error)
        this.$emit('show-message', `Failed to load raffles: ${error.message}`, 'error')
      } finally {
        if (showLoading) this.loading = false
      }
    },

    handleExtendTimer(raffle) {
      this.selectedRaffle = raffle
      this.extensionHours = 24
      this.showExtendDialog = true
    },

    closeExtendDialog() {
      this.showExtendDialog = false
      this.selectedRaffle = null
      this.extensionHours = 24
    },

    async confirmExtendTimer() {
      if (!this.selectedRaffle || !this.extensionHours) return

      this.extending = true
      try {
        const token = sessionStorage.getItem('authToken')
        const response = await fetch(
          `${this.apiBaseUrl}/api/raffles/${this.selectedRaffle.raffle_id}/extend`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              extensionHours: parseInt(this.extensionHours),
            }),
          },
        )

        const result = await response.json()
        if (result.success) {
          this.$emit('show-message', `Timer extended by ${this.extensionHours} hours`, 'success')
          this.loadRaffles(false) // Refresh data
          this.closeExtendDialog()
        } else {
          throw new Error(result.message || 'Failed to extend timer')
        }
      } catch (error) {
        console.error('Error extending timer:', error)
        this.$emit('show-message', `Failed to extend timer: ${error.message}`, 'error')
      } finally {
        this.extending = false
      }
    },

    handleViewDetails(raffle) {
      // Emit event to parent component to show raffle details
      this.$emit('view-raffle-details', raffle)
    },

    handleViewParticipants(raffle) {
      // Emit event to parent component to show raffle participants
      this.$emit('view-raffle-participants', raffle)
    },

    handleSelectWinner(raffle) {
      this.selectedRaffle = raffle
      this.showWinnerDialog = true
    },

    closeWinnerDialog() {
      this.showWinnerDialog = false
      this.selectedRaffle = null
    },

    async confirmSelectWinner() {
      if (!this.selectedRaffle) return

      this.selectingWinner = true
      try {
        // TODO: Replace with actual API endpoint when backend is implemented
        // For now, simulate selecting a winner locally
        const participants = await this.getRaffleParticipants()
        if (!participants || participants.length === 0) {
          throw new Error('No participants found for this raffle')
        }

        // Randomly select a winner from participants
        const randomIndex = Math.floor(Math.random() * participants.length)
        const winner = participants[randomIndex]

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock successful response
        const mockResult = {
          success: true,
          data: {
            winner_name: winner.name || `Participant ${randomIndex + 1}`,
            winner_id: winner.id || randomIndex + 1,
            raffle_id: this.selectedRaffle.raffle_id,
            selected_at: new Date().toISOString(),
          },
        }

        this.$emit(
          'show-message',
          `Winner selected for ${this.selectedRaffle.stall_number}: ${mockResult.data.winner_name}`,
          'success',
        )

        // Update the raffle status locally
        const raffleIndex = this.raffles.findIndex(
          (r) => r.raffle_id === this.selectedRaffle.raffle_id,
        )
        if (raffleIndex !== -1) {
          this.raffles[raffleIndex].status = 'completed'
          this.raffles[raffleIndex].winner_name = mockResult.data.winner_name
        }

        this.closeWinnerDialog()
      } catch (error) {
        console.error('Error selecting winner:', error)
        this.$emit('show-message', `Failed to select winner: ${error.message}`, 'error')
      } finally {
        this.selectingWinner = false
      }
    },

    async getRaffleParticipants() {
      // Mock participants data - replace with actual API call when available
      return [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Mike Johnson' },
        { id: 4, name: 'Sarah Wilson' },
        { id: 5, name: 'David Brown' },
      ]
    },

    formatDateTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    /**
     * Load participants for all raffles from the database
     * @param {Array} raffles - Array of raffle objects
     */
    async loadParticipantsForRaffles(raffles) {
      console.log('🔍 Loading participants for raffles...')

      // Don't fail the entire process if participants can't be loaded
      const participantPromises = raffles.map(async (raffle) => {
        try {
          console.log(
            `🔍 Loading participants for raffle ${raffle.stall_number} (stall_id: ${raffle.stall_id})`,
          )
          const response = await participantsService.getRaffleParticipants(raffle.stall_id)
          if (response.success) {
            raffle.participant_count = response.count
            raffle.recent_participants = response.data.slice(0, 3) // Show only recent 3
            console.log(
              `✅ Loaded ${response.count} participants for raffle ${raffle.stall_number}`,
            )
          } else {
            console.warn(
              `⚠️ Failed to load participants for raffle ${raffle.stall_number}:`,
              response.message,
            )
            // Set default values instead of failing
            raffle.participant_count = 0
            raffle.recent_participants = []
          }
        } catch (error) {
          console.error(`❌ Error loading participants for raffle ${raffle.stall_number}:`, error)
          // Set default values to prevent UI from breaking
          raffle.participant_count = 0
          raffle.recent_participants = []

          // Show a user-friendly message for debugging
          if (error.status === 404) {
            console.warn(`⚠️ No participants endpoint found for stall ${raffle.stall_id}`)
          } else if (error.status === 401) {
            console.warn(
              `⚠️ Authentication failed when loading participants for stall ${raffle.stall_id}`,
            )
          } else if (!error.status) {
            console.warn(`⚠️ Network error when loading participants for stall ${raffle.stall_id}`)
          }
        }
      })

      // Wait for all participant loading attempts to complete
      await Promise.allSettled(participantPromises)
      console.log('✅ Finished loading participants for all raffles (with fallbacks)')
    },
  },
}
