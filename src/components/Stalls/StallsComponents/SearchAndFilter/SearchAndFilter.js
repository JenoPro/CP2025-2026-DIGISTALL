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
      showFilterPanel: false,
      searchTimeout: null,
    }
  },
  computed: {
    floorOptions() {
      return [...new Set(this.stallsData.map((stall) => stall.floor))].sort()
    },
    sectionOptions() {
      return [...new Set(this.stallsData.map((stall) => stall.section))].sort()
    },
    locationOptions() {
      return [...new Set(this.stallsData.map((stall) => stall.location))].sort()
    },
    priceTypeOptions() {
      const types = this.stallsData.map((stall) => {
        if (stall.price.includes('Raffle')) return 'Raffle'
        if (stall.price.includes('Auction')) return 'Auction'
        return 'Other'
      })
      return [...new Set(types)].sort()
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
          (this.selectedPriceType === 'Other' && !stall.price.includes('Raffle') && !stall.price.includes('Auction'))

        return (
          matchesSearch && matchesFloor && matchesSection && matchesLocation && matchesPriceType
        )
      })
    },
    resultCount() {
      return this.filteredStalls.length
    },
    hasActiveFilters() {
      return this.selectedFloor !== null || 
             this.selectedSection !== null || 
             this.selectedLocation !== null || 
             this.selectedPriceType !== null || 
             this.searchQuery.trim() !== ''
    },
  },
  watch: {
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
        search: this.searchQuery.trim()
      })
    },
    clearAllFilters() {
      this.searchQuery = ''
      this.selectedFloor = null
      this.selectedSection = null
      this.selectedLocation = null
      this.selectedPriceType = null
      
      console.log('All filters cleared')
      // The watcher will automatically emit the unfiltered data
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