export default {
  name: 'SearchFilter',
  props: {
    stallsData: {
      type: Array,
      required: true,
      default: () => [],
    },
    showAuctionButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchQuery: '',
      selectedFloor: null,
      selectedSection: null,
      selectedLocation: null,
      selectedPriceType: null,
      selectedAvailability: null,
      priceRange: [0, 100000],
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
        { title: 'Price', value: 'price' },
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
        title: section.title || section.section_name,
        value: section.section_id || section.value,
      }))
    },
    locationOptions() {
      const locations = [...new Set(this.stallsData.map((stall) => stall.location))].filter(Boolean)
      return locations.sort()
    },
    priceTypeOptions() {
      const types = this.stallsData.map((stall) => {
        if (stall.price.includes('Auction')) return 'Auction'
        if (stall.price.includes('Fixed Price')) return 'Fixed Price'
        return 'Other'
      })
      return [...new Set(types)].filter(Boolean).sort()
    },
    availabilityOptions() {
      return [
        { text: 'All', value: null },
        { text: 'Available', value: true },
        { text: 'Occupied', value: false },
      ]
    },
    actualPriceRange() {
      if (this.stallsData.length === 0) return [0, 100000]
      const prices = this.stallsData.map((stall) => {
        const match = stall.price.match(/₱([\d,]+)/)
        return match ? parseFloat(match[1].replace(/,/g, '')) : 0
      })
      return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
    },
    filteredAndSortedStalls() {
      let filtered = this.stallsData.filter((stall) => {
        const matchesSearch =
          !this.searchQuery ||
          (stall.stallNumber &&
            stall.stallNumber.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (stall.location &&
            stall.location.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (stall.description &&
            stall.description.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
          (stall.section_name &&
            stall.section_name.toLowerCase().includes(this.searchQuery.toLowerCase()))

        // REFACTORED: Use == for type coercion
        const matchesFloor =
          !this.selectedFloor ||
          stall.floor_id == this.selectedFloor ||
          stall.floor_name == this.selectedFloor
        const matchesSection =
          !this.selectedSection ||
          stall.section_id == this.selectedSection ||
          stall.section_name == this.selectedSection
        const matchesLocation = !this.selectedLocation || stall.location === this.selectedLocation
        const matchesPriceType =
          !this.selectedPriceType ||
          (this.selectedPriceType === 'Auction' && stall.price.includes('Auction')) ||
          (this.selectedPriceType === 'Fixed Price' && stall.price.includes('Fixed Price')) ||
          (this.selectedPriceType === 'Other' &&
            !stall.price.includes('Auction') &&
            !stall.price.includes('Fixed Price'))
        const matchesAvailability =
          this.selectedAvailability === null || stall.isAvailable === this.selectedAvailability
        let matchesPriceRange = true
        if (this.priceRange && this.priceRange.length === 2) {
          const match = stall.price.match(/₱([\d,]+)/)
          if (match) {
            const price = parseFloat(match[1].replace(/,/g, ''))
            matchesPriceRange = price >= this.priceRange[0] && price <= this.priceRange[1]
          }
        }
        return (
          matchesSearch &&
          matchesFloor &&
          matchesSection &&
          matchesLocation &&
          matchesPriceType &&
          matchesAvailability &&
          matchesPriceRange
        )
      })
      if (this.sortField && this.sortField !== 'default') {
        filtered = this.sortStalls(filtered)
      }
      return filtered
    },
    resultCount() {
      return this.filteredAndSortedStalls.length
    },
    hasActiveFilters() {
      return (
        this.selectedFloor !== null ||
        this.selectedSection !== null ||
        this.selectedLocation !== null ||
        this.selectedPriceType !== null ||
        this.selectedAvailability !== null ||
        this.searchQuery.trim() !== '' ||
        this.priceRange[0] !== this.actualPriceRange[0] ||
        this.priceRange[1] !== this.actualPriceRange[1]
      )
    },
  },
  watch: {
    stallsData: {
      handler() {
        this.priceRange = this.actualPriceRange
      },
      immediate: true,
    },
    filteredAndSortedStalls: {
      handler(newFilteredStalls) {
        this.$emit('filtered-stalls', newFilteredStalls)
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
    document.addEventListener('click', this.handleOutsideClick)
    document.addEventListener('keydown', this.handleKeyDown)
    if (this.stallsData.length > 0) {
      this.priceRange = this.actualPriceRange
    }
    await this.loadFilterOptions()
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
    document.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    async loadFilterOptions() {
      try {
        const token = sessionStorage.getItem('authToken')
        if (!token) {
          this.setFallbackOptions()
          return
        }

        console.log('🔄 Loading filter options (floors & sections)...')
        console.log('API Base URL:', this.apiBaseUrl)
        console.log('Auth token available:', !!token)

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
            } else {
              console.warn('Floors API returned success=false or invalid data:', floorsResult)
              this.availableFloors = []
            }
          } else {
            console.error(
              '❌ GET /api/floors failed:',
              floorsResponse.status,
              floorsResponse.statusText,
            )
            const errorData = await floorsResponse.text()
            console.error('Error details:', errorData)
            this.availableFloors = []
          }
        } catch (error) {
          console.error('❌ Network error loading floors:', error)
          this.availableFloors = []
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
                title: `${section.section_name} (${section.section_code})`,
                value: section.section_id,
                section_id: section.section_id,
                section_name: section.section_name,
                section_code: section.section_code,
                floor_id: section.floor_id, // Include floor_id for filtering
              }))
            } else {
              console.warn('Sections API returned success=false or invalid data:', sectionsResult)
              this.availableSections = []
            }
          } else {
            console.error(
              '❌ GET /api/sections failed:',
              sectionsResponse.status,
              sectionsResponse.statusText,
            )
            const errorData = await sectionsResponse.text()
            console.error('Error details:', errorData)
            this.availableSections = []
          }
        } catch (error) {
          console.error('❌ Network error loading sections:', error)
          this.availableSections = []
        }
      } catch (error) {
        console.error('❌ BACKEND ERROR: Failed to load filter options:', error)
        console.error('📋 Backend Issues to Check:')
        console.error('   1. Ensure floorController.js returns proper response format')
        console.error('   2. Ensure sectionController.js returns proper response format')
        console.error('   3. Check authentication middleware (req.user.branchManagerId)')
        console.error('   4. Verify database connection and table existence')
        console.error('   5. Check server logs for detailed error information')
        this.setFallbackOptions()
      }
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
      // Clear previous timeout to debounce search
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      // Debounce search to avoid too many emissions
      this.searchTimeout = setTimeout(() => {
        // The watcher on filteredAndSortedStalls will automatically emit the filtered results
      }, 150)
    },
    toggleFilter() {
      this.showFilters = !this.showFilters
    },
    applyFilters() {
      this.showFilters = false
    },
    sortStalls(stalls) {
      return [...stalls].sort((a, b) => {
        let aValue, bValue
        switch (this.sortField) {
          case 'stallNumber':
            aValue = this.extractNumericId(a.stallNumber)
            bValue = this.extractNumericId(b.stallNumber)
            break
          case 'price':
            aValue = this.extractPrice(a.price)
            bValue = this.extractPrice(b.price)
            break
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
      const match = priceString.match(/₱([\d,]+)/)
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
      this.selectedPriceType = null
      this.selectedAvailability = null
      this.priceRange = this.actualPriceRange
      this.sortField = 'default'
    },
    resetFilters() {
      this.clearAllFilters()
    },
  },
}
