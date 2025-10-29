export default {
  name: 'RaffleSearchFilter',
  props: {
    rafflesData: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      searchQuery: '',
      selectedFloor: null,
      selectedSection: null,
      selectedLocation: null,
      selectedStatus: null,
      showFilters: false,
      sortField: 'default',
      loading: false,
      availableFloors: [],
      availableSections: [],
      apiBaseUrl: 'http://localhost:3001',
    }
  },
  computed: {
    sortOptions() {
      return [
        { title: 'Default', value: 'default' },
        { title: 'Stall ID', value: 'stallNumber' },
        { title: 'Ticket Price', value: 'ticketPrice' },
        { title: 'Total Tickets', value: 'totalTickets' },
        { title: 'Tickets Sold', value: 'ticketsSold' },
        { title: 'Draw Date', value: 'drawDate' },
        { title: 'Floor', value: 'floor' },
        { title: 'Section', value: 'section' },
      ]
    },
    floorOptions() {
      return this.availableFloors.map((floor) => ({
        title: floor.title || floor.floor_name,
        value: floor.floor_id || floor.value,
      }))
    },
    sectionOptions() {
      return this.availableSections.map((section) => ({
        title: section.section_name || section.title,
        value: section.section_id || section.value,
      }))
    },
    locationOptions() {
      const locations = [...new Set(this.rafflesData.map((raffle) => raffle.location))].filter(
        Boolean,
      )
      return locations.sort()
    },
    statusOptions() {
      return [
        { text: 'All', value: null },
        { text: 'Active', value: 'Active' },
        { text: 'Ended', value: 'Ended' },
      ]
    },
    filteredAndSortedRaffles() {
      let filtered = this.rafflesData.filter((raffle) => {
        // Search filter
        const matchesSearch =
          !this.searchQuery ||
          (raffle.stallNumber &&
            raffle.stallNumber.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (raffle.location &&
            raffle.location.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (raffle.description &&
            raffle.description.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (raffle.section_name &&
            raffle.section_name.toLowerCase().includes(this.searchQuery.toLowerCase()))

        // Floor filter
        const matchesFloor =
          !this.selectedFloor ||
          raffle.floor_id === this.selectedFloor ||
          raffle.floorId === this.selectedFloor

        // Section filter
        const matchesSection =
          !this.selectedSection ||
          raffle.section_id === this.selectedSection ||
          raffle.sectionId === this.selectedSection

        // Location filter
        const matchesLocation =
          !this.selectedLocation || (raffle.location && raffle.location === this.selectedLocation)

        // Status filter
        const matchesStatus = !this.selectedStatus || raffle.status === this.selectedStatus

        return matchesSearch && matchesFloor && matchesSection && matchesLocation && matchesStatus
      })

      // Apply sorting
      if (this.sortField !== 'default') {
        filtered = this.sortRaffles(filtered)
      }

      return filtered
    },
  },
  watch: {
    filteredAndSortedRaffles: {
      handler(newFilteredRaffles) {
        this.$emit('filtered-raffles', newFilteredRaffles)
      },
      immediate: true,
    },
    searchQuery: {
      handler() {
        this.onSearchInput()
      },
      immediate: false,
    },
  },
  async mounted() {
    // Check if user has permission to access raffles data
    const hasPermission = this.checkRafflesPermission()

    if (!hasPermission) {
      console.log('❌ User does not have raffles permission, skipping filter options load')
      this.setFallbackOptions()
      return
    }

    document.addEventListener('click', this.handleOutsideClick)
    document.addEventListener('keydown', this.handleKeyDown)
    await this.loadFilterOptions()
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
    document.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    // Check if user has permission to access raffles
    checkRafflesPermission() {
      const userType = sessionStorage.getItem('userType')

      // Admins and branch managers always have access
      if (userType === 'admin' || userType === 'branch-manager' || userType === 'branch_manager') {
        return true
      }

      // For employees, check specific permissions
      if (userType === 'employee') {
        // Try new format first (object)
        const permissions = JSON.parse(sessionStorage.getItem('permissions') || '{}')
        if (permissions.stalls === true) {
          return true
        }

        // Fallback to old format (array)
        const employeePermissions = JSON.parse(
          sessionStorage.getItem('employeePermissions') || '[]',
        )
        return employeePermissions.includes('stalls') || employeePermissions.stalls === true
      }

      return false
    },

    async loadFilterOptions() {
      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) {
          console.warn('No auth token found, using fallback options')
          this.setFallbackOptions()
          return
        }

        console.log('🔄 Loading filter options (floors & sections)...')

        // Load floors
        try {
          const floorsResponse = await fetch(`${this.apiBaseUrl}/api/floors`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (floorsResponse.ok) {
            const floorsResult = await floorsResponse.json()
            if (floorsResult.success && Array.isArray(floorsResult.data)) {
              this.availableFloors = floorsResult.data.map((floor) => ({
                title: floor.floor_name,
                value: floor.floor_id,
                floor_id: floor.floor_id,
                floor_name: floor.floor_name,
                floor_number: floor.floor_number,
              }))
              console.log('✅ Loaded floors:', this.availableFloors)
            } else {
              this.extractFloorsFromRaffles()
            }
          } else {
            console.error('❌ GET /api/floors failed:', floorsResponse.status)
            this.extractFloorsFromRaffles()
          }
        } catch (error) {
          console.error('❌ Network error loading floors:', error)
          this.extractFloorsFromRaffles()
        }

        // Load sections
        try {
          const sectionsResponse = await fetch(`${this.apiBaseUrl}/api/sections`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })

          if (sectionsResponse.ok) {
            const sectionsResult = await sectionsResponse.json()
            if (sectionsResult.success && Array.isArray(sectionsResult.data)) {
              this.availableSections = sectionsResult.data.map((section) => ({
                title: section.section_name,
                value: section.section_id,
                section_id: section.section_id,
                section_name: section.section_name,
                section_code: section.section_code,
                floor_id: section.floor_id,
              }))
              console.log('✅ Loaded sections:', this.availableSections)
            } else {
              this.extractSectionsFromRaffles()
            }
          } else {
            console.error('❌ GET /api/sections failed:', sectionsResponse.status)
            this.extractSectionsFromRaffles()
          }
        } catch (error) {
          console.error('❌ Network error loading sections:', error)
          this.extractSectionsFromRaffles()
        }
      } catch (error) {
        console.error('❌ Failed to load filter options:', error)
        this.setFallbackOptions()
      }
    },

    extractFloorsFromRaffles() {
      console.log('📋 Extracting floors from raffles data...')
      const floors = new Map()
      this.rafflesData.forEach((raffle) => {
        if (raffle.floor_id && raffle.floor_name) {
          floors.set(raffle.floor_id, {
            title: raffle.floor_name,
            value: raffle.floor_id,
            floor_id: raffle.floor_id,
            floor_name: raffle.floor_name,
          })
        }
      })
      this.availableFloors = Array.from(floors.values())
      console.log('✅ Extracted floors:', this.availableFloors)
    },

    extractSectionsFromRaffles() {
      console.log('📋 Extracting sections from raffles data...')
      const sections = new Map()
      this.rafflesData.forEach((raffle) => {
        if (raffle.section_id && raffle.section_name) {
          sections.set(raffle.section_id, {
            title: raffle.section_name,
            value: raffle.section_id,
            section_id: raffle.section_id,
            section_name: raffle.section_name,
            floor_id: raffle.floor_id,
          })
        }
      })
      this.availableSections = Array.from(sections.values())
      console.log('✅ Extracted sections:', this.availableSections)
    },

    setFallbackOptions() {
      this.availableFloors = [
        { title: '1st Floor', value: 'floor_1', floor_name: '1st Floor' },
        { title: '2nd Floor', value: 'floor_2', floor_name: '2nd Floor' },
        { title: '3rd Floor', value: 'floor_3', floor_name: '3rd Floor' },
      ]
      this.availableSections = [
        { title: 'Electronics Section', value: 'electronics', section_name: 'Electronics Section' },
        { title: 'Clothing Section', value: 'clothing', section_name: 'Clothing Section' },
        { title: 'Food Court', value: 'food_court', section_name: 'Food Court' },
        { title: 'Fresh Produce', value: 'produce', section_name: 'Fresh Produce' },
        { title: 'Meat Section', value: 'meat', section_name: 'Meat Section' },
        { title: 'General Section', value: 'general', section_name: 'General Section' },
      ]
    },

    onSearchInput() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        // The watcher on filteredAndSortedRaffles will automatically emit the filtered results
      }, 150)
    },

    toggleFilter() {
      this.showFilters = !this.showFilters
    },

    applyFilters() {
      console.log('Applying filters:', {
        floor: this.selectedFloor,
        section: this.selectedSection,
        location: this.selectedLocation,
        status: this.selectedStatus,
      })
      this.showFilters = false
    },

    sortRaffles(raffles) {
      return [...raffles].sort((a, b) => {
        let aValue, bValue
        switch (this.sortField) {
          case 'stallNumber':
            aValue = this.extractNumericId(a.stallNumber)
            bValue = this.extractNumericId(b.stallNumber)
            break
          case 'ticketPrice':
            aValue = this.extractPrice(a.ticketPrice)
            bValue = this.extractPrice(b.ticketPrice)
            break
          case 'totalTickets':
            aValue = parseInt(a.totalTickets) || 0
            bValue = parseInt(b.totalTickets) || 0
            break
          case 'ticketsSold':
            aValue = parseInt(a.ticketsSold) || 0
            bValue = parseInt(b.ticketsSold) || 0
            break
          case 'drawDate':
            aValue = new Date(a.drawDate).getTime()
            bValue = new Date(b.drawDate).getTime()
            break
          case 'floor':
            aValue = a.floor_name || ''
            bValue = b.floor_name || ''
            return aValue.localeCompare(bValue)
          case 'section':
            aValue = a.section_name || ''
            bValue = b.section_name || ''
            return aValue.localeCompare(bValue)
          default:
            return 0
        }
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return aValue - bValue
        } else {
          aValue = String(aValue).toLowerCase()
          bValue = String(bValue).toLowerCase()
          return aValue.localeCompare(bValue)
        }
      })
    },

    extractNumericId(stallNumber) {
      const match = stallNumber.match(/\d+/)
      return match ? parseInt(match[0], 10) : 0
    },

    extractPrice(priceString) {
      if (!priceString) return 0
      const match = priceString.toString().match(/₱?([\d,]+)/)
      return match ? parseFloat(match[1].replace(/,/g, '')) : 0
    },

    handleOutsideClick(event) {
      if (this.$refs.filterContainer && !this.$refs.filterContainer.contains(event.target)) {
        this.showFilters = false
      }
    },

    handleKeyDown(event) {
      if (event.key === 'Escape') {
        if (this.showFilters) {
          this.showFilters = false
        }
      }
    },

    clearAllFilters() {
      this.searchQuery = ''
      this.selectedFloor = null
      this.selectedSection = null
      this.selectedLocation = null
      this.selectedStatus = null
      this.sortField = 'default'
    },

    resetFilters() {
      this.clearAllFilters()
    },

    getSortFieldLabel(field) {
      const option = this.sortOptions.find((opt) => opt.value === field)
      return option ? option.title : field
    },

    clearSort() {
      this.sortField = 'default'
    },
  },
}
