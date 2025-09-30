import RaffleCard from '../RaffleCard/RaffleCard.vue'

export default {
  name: 'ActiveRaffles',
  components: {
    RaffleCard,
  },
  data() {
    return {
      raffles: [],
      loading: false,
      search: '',
      statusFilter: null,
      sortBy: 'created_desc',

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
    filteredRaffles() {
      let filtered = [...this.raffles]

      // Apply search filter
      if (this.search) {
        const searchLower = this.search.toLowerCase()
        filtered = filtered.filter(
          (raffle) =>
            raffle.stall_number.toLowerCase().includes(searchLower) ||
            raffle.location.toLowerCase().includes(searchLower) ||
            raffle.floor_name?.toLowerCase().includes(searchLower) ||
            raffle.section_name?.toLowerCase().includes(searchLower),
        )
      }

      // Apply status filter
      if (this.statusFilter) {
        const now = new Date()
        filtered = filtered.filter((raffle) => {
          const expiresAt = new Date(raffle.expires_at)
          const timeLeft = expiresAt - now
          const hoursLeft = timeLeft / (1000 * 60 * 60)

          switch (this.statusFilter) {
            case 'active':
              return raffle.status === 'active' && hoursLeft > 2
            case 'expiring':
              return raffle.status === 'active' && hoursLeft <= 2 && hoursLeft > 0
            case 'expired':
              return raffle.status === 'expired' || hoursLeft <= 0
            default:
              return true
          }
        })
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'created_desc':
            return new Date(b.created_at) - new Date(a.created_at)
          case 'created_asc':
            return new Date(a.created_at) - new Date(b.created_at)
          case 'expires_asc':
            return new Date(a.expires_at) - new Date(b.expires_at)
          case 'participants_desc':
            return (b.participant_count || 0) - (a.participant_count || 0)
          default:
            return 0
        }
      })

      return filtered
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
                participant_count: stall.participant_count || Math.floor(Math.random() * 15) + 1, // Mock 1-15 participants
                floor_name: stall.floor_name,
                section_name: stall.section_name,
                recent_participants: stall.recent_participants || [
                  { user_id: 1, name: 'John Doe' },
                  { user_id: 2, name: 'Jane Smith' },
                  { user_id: 3, name: 'Mike Johnson' },
                ],
              }
            })

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
        const token = sessionStorage.getItem('authToken')
        const response = await fetch(
          `${this.apiBaseUrl}/api/raffles/${this.selectedRaffle.raffle_id}/select-winner`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        )

        const result = await response.json()
        if (result.success) {
          this.$emit(
            'show-message',
            `Winner selected for ${this.selectedRaffle.stall_number}: ${result.data.winner_name}`,
            'success',
          )
          this.loadRaffles(false) // Refresh data
          this.closeWinnerDialog()
        } else {
          throw new Error(result.message || 'Failed to select winner')
        }
      } catch (error) {
        console.error('Error selecting winner:', error)
        this.$emit('show-message', `Failed to select winner: ${error.message}`, 'error')
      } finally {
        this.selectingWinner = false
      }
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
  },
}
