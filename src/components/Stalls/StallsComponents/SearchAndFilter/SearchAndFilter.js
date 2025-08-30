export default {
  name: 'SearchFilter',
  emits: ['filtered-stalls', 'show-auction-records'],
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
      showFilters: false,
      searchTimeout: null,
    }
  },
  computed: {
    // Filter options computed from stallsData
    floorOptions() {
      const floors = [...new Set(this.stallsData.map((stall) => stall.floor))]
      return floors.sort()
    },
    sectionOptions() {
      const sections = [...new Set(this.stallsData.map((stall) => stall.section))]
      return sections.sort()
    },
    locationOptions() {
      const locations = [...new Set(this.stallsData.map((stall) => stall.location))]
      return locations.sort()
    },
    priceTypeOptions() {
      return ['Raffle', 'Auction']
    },
    filteredStalls() {
      let filtered = this.stallsData

      // Apply search query filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (stall) =>
            stall.stallNumber.toLowerCase().includes(query) ||
            stall.location.toLowerCase().includes(query) ||
            stall.description.toLowerCase().includes(query) ||
            stall.section.toLowerCase().includes(query),
        )
      }

      // Apply floor filter
      if (this.selectedFloor) {
        filtered = filtered.filter((stall) => stall.floor === this.selectedFloor)
      }

      // Apply section filter
      if (this.selectedSection) {
        filtered = filtered.filter((stall) => stall.section === this.selectedSection)
      }

      // Apply location filter
      if (this.selectedLocation) {
        filtered = filtered.filter((stall) => stall.location === this.selectedLocation)
      }

      // Apply price type filter with improved logic
      if (this.selectedPriceType) {
        filtered = filtered.filter((stall) => {
          const priceText = stall.price.toLowerCase()
          const selectedType = this.selectedPriceType.toLowerCase()

          // More specific matching to avoid false positives
          if (selectedType === 'raffle') {
            return priceText.includes('/ raffle')
          } else if (selectedType === 'auction') {
            return priceText.includes('/ auction')
          }

          return false
        })
      }

      return filtered
    },
    resultCount() {
      return this.filteredStalls.length
    },
    hasActiveFilters() {
      return (
        this.searchQuery.trim() !== '' ||
        this.selectedFloor !== null ||
        this.selectedSection !== null ||
        this.selectedLocation !== null ||
        this.selectedPriceType !== null
      )
    },
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleOutsideClick)
    document.addEventListener('keydown', this.handleKeyDown)

    // Emit initial data
    this.emitFilteredStalls()
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
    document.removeEventListener('keydown', this.handleKeyDown)

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  },
  watch: {
    searchQuery() {
      this.debounceSearch()
    },
    selectedFloor() {
      this.emitFilteredStalls()
    },
    selectedSection() {
      this.emitFilteredStalls()
    },
    selectedLocation() {
      this.emitFilteredStalls()
    },
    selectedPriceType() {
      this.emitFilteredStalls()
    },
  },
  methods: {
    toggleFilter() {
      this.showFilters = !this.showFilters
    },
    debounceSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(() => {
        this.emitFilteredStalls()
      }, 300)
    },
    emitFilteredStalls() {
      this.$emit('filtered-stalls', this.filteredStalls)
    },
    clearAllFilters() {
      this.searchQuery = ''
      this.selectedFloor = null
      this.selectedSection = null
      this.selectedLocation = null
      this.selectedPriceType = null
      this.emitFilteredStalls()
      this.showFilters = false
    },
    applyFilters() {
      this.emitFilteredStalls()
      this.showFilters = false
    },
    handleOutsideClick(event) {
      if (
        this.showFilters &&
        this.$refs.filterContainer &&
        !this.$refs.filterContainer.contains(event.target)
      ) {
        this.showFilters = false
      }
    },
    handleKeyDown(event) {
      if (event.key === 'Escape' && this.showFilters) {
        this.showFilters = false
      }
    },
  },
}
