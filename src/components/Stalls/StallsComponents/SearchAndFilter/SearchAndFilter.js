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
      showFilters: false, // toggle visibility
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
          (this.selectedPriceType === 'Auction' && stall.price.includes('Auction'))

        return (
          matchesSearch && matchesFloor && matchesSection && matchesLocation && matchesPriceType
        )
      })
    },
    resultCount() {
      return this.filteredStalls.length
    },
  },
  watch: {
    filteredStalls: {
      handler(newFilteredStalls) {
        this.$emit('filtered-stalls', newFilteredStalls)
      },
      immediate: true,
    },
  },
  methods: {
    clearAllFilters() {
      this.searchQuery = ''
      this.selectedFloor = null
      this.selectedSection = null
      this.selectedLocation = null
      this.selectedPriceType = null
      this.$emit('filtered-stalls', this.stallsData)
    },
  },
}
