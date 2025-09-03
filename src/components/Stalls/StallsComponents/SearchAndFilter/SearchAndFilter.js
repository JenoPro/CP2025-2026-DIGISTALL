export default {
  name: 'SearchFilter',
  props: {
    stallsData: {
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
      selectedPriceType: null,
      selectedAvailability: null,
      priceRange: [0, 100000],
      showFilterPanel: false,
      searchTimeout: null,
      loading: false,
      // API configuration
      // eslint-disable-next-line no-undef
      apiBaseUrl: process.env.VUE_APP_API_URL || 'http://localhost:3001',
    }
  },
  computed: {
    floorOptions() {
      const floors = [...new Set(this.stallsData.map((stall) => stall.floor))].filter(Boolean)
      return floors.sort()
    },
    sectionOptions() {
      const sections = [...new Set(this.stallsData.map((stall) => stall.section))].filter(Boolean)
      return sections.sort()
    },
    locationOptions() {
      const locations = [...new Set(this.stallsData.map((stall) => stall.location))].filter(Boolean)
      return locations.sort()
    },
    priceTypeOptions() {
      const types = this.stallsData.map((stall) => {
        if (stall.price.includes('Raffle')) return 'Raffle'
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
    // Get price range from actual data
    actualPriceRange() {
      if (this.stallsData.length === 0) return [0, 100000]

      const prices = this.stallsData.map((stall) => {
        // Extract numeric price from formatted string
        const match = stall.price.match(/₱([\d,]+)/)
        return match ? parseFloat(match[1].replace(/,/g, '')) : 0
      })

      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      return [Math.floor(minPrice), Math.ceil(maxPrice)]
    },
    filteredStalls() {
      return this.stallsData.filter((stall) => {
        const matchesSearch =
          !this.searchQuery ||
          stall.stallNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          stall.location.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          stall.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          stall.section.toLowerCase().includes(this.searchQuery.toLowerCase())

        const matchesFloor = !this.selectedFloor || stall.floor === this.selectedFloor
        const matchesSection = !this.selectedSection || stall.section === this.selectedSection
        const matchesLocation = !this.selectedLocation || stall.location === this.selectedLocation

        const matchesPriceType =
          !this.selectedPriceType ||
          (this.selectedPriceType === 'Raffle' && stall.price.includes('Raffle')) ||
          (this.selectedPriceType === 'Auction' && stall.price.includes('Auction')) ||
          (this.selectedPriceType === 'Fixed Price' && stall.price.includes('Fixed Price')) ||
          (this.selectedPriceType === 'Other' &&
            !stall.price.includes('Raffle') &&
            !stall.price.includes('Auction') &&
            !stall.price.includes('Fixed Price'))

        // Availability filter
        const matchesAvailability =
          this.selectedAvailability === null || stall.isAvailable === this.selectedAvailability

        // Price range filter
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
    },
    resultCount() {
      return this.filteredStalls.length
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
        // Update price range when data changes
        this.priceRange = this.actualPriceRange
      },
      immediate: true,
    },
    filteredStalls: {
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
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleOutsideClick)
    document.addEventListener('keydown', this.handleKeyDown)

    // Initialize price range
    if (this.stallsData.length > 0) {
      this.priceRange = this.actualPriceRange
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
    document.removeEventListener('keydown', this.handleKeyDown)

    // Clear any pending search timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  },
  methods: {
    onSearchInput() {
      // Clear previous timeout to debounce search
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      // Debounce search to avoid too many emissions
      this.searchTimeout = setTimeout(() => {
        // The watcher on filteredStalls will automatically emit the filtered results
      }, 150)
    },
    toggleFilter() {
      this.showFilterPanel = !this.showFilterPanel
    },
    applyFilters() {
      // The computed filteredStalls and watcher will handle the filtering
      this.showFilterPanel = false
      console.log('Filters applied:', {
        floor: this.selectedFloor,
        section: this.selectedSection,
        location: this.selectedLocation,
        priceType: this.selectedPriceType,
        availability: this.selectedAvailability,
        priceRange: this.priceRange,
        search: this.searchQuery.trim(),
      })
    },
    // Alternative: Use backend filtering (if you want to implement server-side filtering)
    async fetchFilteredStalls() {
      this.loading = true
      try {
        const params = new URLSearchParams()

        if (this.selectedFloor) params.append('floor', this.selectedFloor)
        if (this.selectedSection) params.append('section', this.selectedSection)
        if (this.selectedLocation) params.append('location', this.selectedLocation)
        if (this.selectedAvailability !== null)
          params.append('isAvailable', this.selectedAvailability)
        if (this.selectedPriceType) params.append('priceType', this.selectedPriceType)
        if (this.searchQuery) params.append('search', this.searchQuery)
        if (this.priceRange && this.priceRange.length === 2) {
          params.append('minPrice', this.priceRange[0])
          params.append('maxPrice', this.priceRange[1])
        }

        const url = `${this.apiBaseUrl}/api/stalls/filter?${params.toString()}`
        console.log('Fetching filtered stalls:', url)

        const response = await fetch(url)
        const result = await response.json()

        if (result.success) {
          const transformedStalls = result.data.map((stall) => this.transformStallData(stall))
          this.$emit('filtered-stalls', transformedStalls)
        } else {
          throw new Error(result.message)
        }
      } catch (error) {
        console.error('Error fetching filtered stalls:', error)
        this.$emit('show-message', {
          type: 'error',
          text: 'Failed to apply filters. Using local filtering instead.',
        })
        // Fallback to local filtering - the computed property will handle this
      } finally {
        this.loading = false
      }
    },
    // Transform backend data
    transformStallData(stall) {
      return {
        id: stall.ID,
        stallNumber: stall.stall_number,
        price: this.formatPrice(stall.price, stall.price_type),
        floor: stall.floor,
        section: stall.section,
        dimensions: stall.dimensions,
        location: stall.location,
        description: stall.description,
        image: stall.image_data || stall.image_url,
        isAvailable: stall.is_available,
        priceType: stall.price_type,
        status: stall.status,
      }
    },
    // Format price display
    formatPrice(price, priceType) {
      const formattedPrice = `₱${parseFloat(price).toLocaleString()}`

      switch (priceType) {
        case 'Raffle':
          return `${formattedPrice} / Raffle`
        case 'Auction':
          return `${formattedPrice} Min. / Auction`
        case 'Fixed Price':
        default:
          return `${formattedPrice} / Fixed Price`
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

      console.log('All filters cleared')
      // The watcher will automatically emit the unfiltered data
    },
    resetFilters() {
      this.clearAllFilters()
    },
    handleOutsideClick(event) {
      if (this.$refs.filterContainer && !this.$refs.filterContainer.contains(event.target)) {
        this.showFilterPanel = false
      }
    },
    handleKeyDown(event) {
      // Close on Escape key
      if (event.key === 'Escape' && this.showFilterPanel) {
        this.showFilterPanel = false
      }
    },
  },
}
