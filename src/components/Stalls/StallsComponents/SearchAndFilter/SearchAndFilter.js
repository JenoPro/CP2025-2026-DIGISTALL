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
        title: section.section_name || section.title,
        value: section.section_id || section.value,
      }))
    },
    locationOptions() {
      const locations = [...new Set(this.stallsData.map((stall) => stall.location))].filter(Boolean)
      return locations.sort()
    },
    priceTypeOptions() {
      const types = this.stallsData.map((stall) => {
        const priceType = stall.priceType || stall.price_type || ''
        if (priceType.toLowerCase().includes('auction')) return 'Auction'
        if (priceType.toLowerCase().includes('raffle')) return 'Raffle'
        if (priceType.toLowerCase().includes('fixed')) return 'Fixed Price'
        // Also check the price string
        if (stall.price) {
          if (stall.price.includes('Auction')) return 'Auction'
          if (stall.price.includes('Raffle')) return 'Raffle'
          if (stall.price.includes('Fixed Price')) return 'Fixed Price'
        }
        return null
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
        // Search filter
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

        // Floor filter - compare IDs (check both camelCase and snake_case)
        const matchesFloor =
          !this.selectedFloor ||
          stall.floor_id == this.selectedFloor ||
          stall.floorId == this.selectedFloor

        // Section filter - compare IDs (check both camelCase and snake_case)
        const matchesSection =
          !this.selectedSection ||
          stall.section_id == this.selectedSection ||
          stall.sectionId == this.selectedSection

        // Location filter
        const matchesLocation = !this.selectedLocation || stall.location === this.selectedLocation

        // Price type filter
        const matchesPriceType =
          !this.selectedPriceType ||
          (this.selectedPriceType === 'Auction' &&
            (stall.price.includes('Auction') ||
              (stall.priceType && stall.priceType.toLowerCase().includes('auction')))) ||
          (this.selectedPriceType === 'Raffle' &&
            (stall.price.includes('Raffle') ||
              (stall.priceType && stall.priceType.toLowerCase().includes('raffle')))) ||
          (this.selectedPriceType === 'Fixed Price' &&
            (stall.price.includes('Fixed Price') ||
              (stall.priceType && stall.priceType.toLowerCase().includes('fixed'))))

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

        // Debug logging
        if (this.selectedFloor && !matchesFloor) {
          console.log('Floor filter failed for stall:', {
            stallNumber: stall.stallNumber,
            stall_floor_id: stall.floor_id,
            stall_floor_name: stall.floor_name,
            selectedFloor: this.selectedFloor,
            comparison: stall.floor_id == this.selectedFloor,
          })
        }

        if (this.selectedSection && !matchesSection) {
          console.log('Section filter failed for stall:', {
            stallNumber: stall.stallNumber,
            stall_section_id: stall.section_id,
            stall_section_name: stall.section_name,
            selectedSection: this.selectedSection,
            comparison: stall.section_id == this.selectedSection,
          })
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
    selectedFloor(newVal) {
      console.log('Floor filter changed to:', newVal)
      console.log(
        'Available stalls:',
        this.stallsData.map((s) => ({
          id: s.stallNumber,
          floor_id: s.floor_id,
          floor_name: s.floor_name,
        })),
      )
    },
    selectedSection(newVal) {
      console.log('Section filter changed to:', newVal)
      console.log(
        'Available stalls:',
        this.stallsData.map((s) => ({
          id: s.stallNumber,
          section_id: s.section_id,
          section_name: s.section_name,
        })),
      )
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
          console.warn('No auth token found, using fallback options')
          this.setFallbackOptions()
          return
        }

        console.log('🔄 Loading filter options (floors & sections)...')
        console.log('API Base URL:', this.apiBaseUrl)

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
              console.warn('Floors API returned success=false or invalid data:', floorsResult)
              this.extractFloorsFromStalls()
            }
          } else {
            console.error('❌ GET /api/floors failed:', floorsResponse.status)
            this.extractFloorsFromStalls()
          }
        } catch (error) {
          console.error('❌ Network error loading floors:', error)
          this.extractFloorsFromStalls()
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
              console.warn('Sections API returned success=false or invalid data:', sectionsResult)
              this.extractSectionsFromStalls()
            }
          } else {
            console.error('❌ GET /api/sections failed:', sectionsResponse.status)
            this.extractSectionsFromStalls()
          }
        } catch (error) {
          console.error('❌ Network error loading sections:', error)
          this.extractSectionsFromStalls()
        }
      } catch (error) {
        console.error('❌ Failed to load filter options:', error)
        this.setFallbackOptions()
      }
    },
    extractFloorsFromStalls() {
      console.log('📋 Extracting floors from stalls data...')
      const floors = new Map()
      this.stallsData.forEach((stall) => {
        if (stall.floor_id && stall.floor_name) {
          floors.set(stall.floor_id, {
            title: stall.floor_name,
            value: stall.floor_id,
            floor_id: stall.floor_id,
            floor_name: stall.floor_name,
          })
        }
      })
      this.availableFloors = Array.from(floors.values())
      console.log('✅ Extracted floors:', this.availableFloors)
    },
    extractSectionsFromStalls() {
      console.log('📋 Extracting sections from stalls data...')
      const sections = new Map()
      this.stallsData.forEach((stall) => {
        if (stall.section_id && stall.section_name) {
          sections.set(stall.section_id, {
            title: stall.section_name,
            value: stall.section_id,
            section_id: stall.section_id,
            section_name: stall.section_name,
            floor_id: stall.floor_id,
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
        // The watcher on filteredAndSortedStalls will automatically emit the filtered results
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
        priceType: this.selectedPriceType,
        availability: this.selectedAvailability,
      })
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
    getSortFieldLabel(field) {
      const option = this.sortOptions.find((opt) => opt.value === field)
      return option ? option.title : field
    },
    clearSort() {
      this.sortField = 'default'
    },
  },
}
