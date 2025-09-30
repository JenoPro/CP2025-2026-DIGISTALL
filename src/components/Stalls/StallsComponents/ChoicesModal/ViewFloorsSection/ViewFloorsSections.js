export default {
  name: 'ViewFloorsSections',
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      floors: [],
      searchQuery: '',
      selectedFilter: 'all',
      expandedFloors: [],
      filterOptions: [
        { title: 'All', value: 'all' },
        { title: 'Floors Only', value: 'floors' },
        { title: 'With Sections', value: 'with_sections' },
        { title: 'Without Sections', value: 'without_sections' },
      ],
    }
  },
  computed: {
    filteredFloors() {
      let filtered = this.floors

      // Apply search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter((floor) => {
          const floorMatch = floor.name.toLowerCase().includes(query)
          const sectionMatch = floor.sections?.some((section) =>
            section.name.toLowerCase().includes(query),
          )
          return floorMatch || sectionMatch
        })
      }

      // Apply category filter
      if (this.selectedFilter !== 'all') {
        switch (this.selectedFilter) {
          case 'floors':
            // Show all floors (no additional filtering)
            break
          case 'with_sections':
            filtered = filtered.filter((floor) => floor.sections && floor.sections.length > 0)
            break
          case 'without_sections':
            filtered = filtered.filter((floor) => !floor.sections || floor.sections.length === 0)
            break
        }
      }

      return filtered
    },
  },
  watch: {
    showModal(newVal) {
      if (newVal) {
        this.loadFloorsAndSections()
      }
    },
  },
  methods: {
    // Close the modal
    closeModal() {
      this.$emit('close-modal')
    },

    // Go to Add Floor Section modal
    goToAddFloorSection() {
      this.closeModal()
      // Emit event to parent to open Add Floor Section modal
      this.$emit('open-add-floor-section')
    },

    // Toggle floor expansion
    toggleFloorExpansion(floorId) {
      const index = this.expandedFloors.indexOf(floorId)
      if (index > -1) {
        this.expandedFloors.splice(index, 1)
      } else {
        this.expandedFloors.push(floorId)
      }
    },

    // Load floors and sections data
    async loadFloorsAndSections() {
      this.loading = true
      try {
        console.log('🔄 Attempting to fetch floors with sections...')

        // Check if we have a token (try multiple possible key names)
        // Get the authentication token (stored in sessionStorage as 'authToken')
        const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken')
        console.log('Token exists:', !!token)

        if (token) {
          console.log('Token preview:', token.substring(0, 20) + '...')
        } else {
          console.warn('No authentication token found!')
        }

        const url = 'http://localhost:3001/api/branch-manager/floors-with-sections'
        console.log('🌐 Making request to:', url)

        const headers = {
          'Content-Type': 'application/json',
        }

        // Add authorization header if we have a token
        if (token) {
          headers.Authorization = `Bearer ${token}`
          console.log(
            '🔑 Authorization header added:',
            headers.Authorization.substring(0, 20) + '...',
          )
        } else {
          console.warn('⚠️ No token available - request will likely fail!')
        }

        console.log('📤 Request headers:', headers)

        const response = await fetch(url, {
          method: 'GET',
          headers: headers,
          credentials: 'include', // Include cookies for session-based auth
        })

        console.log('📡 Response status:', response.status)
        console.log('📡 Response status text:', response.statusText)

        if (!response.ok) {
          // Get the error response for better debugging
          let errorText = ''
          try {
            const errorData = await response.json()
            errorText = errorData.message || JSON.stringify(errorData)
            console.error('Server error response:', errorData)
          } catch {
            errorText = await response.text()
            console.error('Server error text:', errorText)
          }
          console.log(
            `Combined endpoint failed with ${response.status}: ${response.statusText} - ${errorText}`,
          )
          console.log('Trying separate endpoints...')
          await this.loadSeparateFloorsAndSections()
          return
        }

        const result = await response.json()
        console.log('API Response:', result)

        if (result.success) {
          this.floors = result.data || []
          console.log('Successfully loaded floors:', this.floors.length)
        } else {
          throw new Error(result.message || 'Failed to load floors and sections')
        }
      } catch (error) {
        console.error('Error loading floors and sections:', error)
        // Don't show error message popup, just log it
        console.log('API call failed, falling back to mock data...')

        // Fallback to mock data for development
        if (import.meta.env.DEV) {
          console.log('Loading mock data...')
          await this.mockLoadData()
        }
      } finally {
        this.loading = false
      }
    },

    // Fallback, Load floors and sections separately if combined endpoint fails
    async loadSeparateFloorsAndSections() {
      try {
        console.log('Loading floors and sections separately...')

        // Check if we have a token for the separate calls too
        const token =
          localStorage.getItem('token') ||
          sessionStorage.getItem('token') ||
          localStorage.getItem('authToken') ||
          sessionStorage.getItem('authToken') ||
          localStorage.getItem('accessToken') ||
          sessionStorage.getItem('accessToken') ||
          localStorage.getItem('jwt') ||
          sessionStorage.getItem('jwt')
        if (!token) {
          console.log('No authentication token found, loading mock data...')
          await this.mockLoadData()
          return
        }

        // Load floors first
        const floorsResponse = await fetch('http://localhost:3001/api/floors', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        })

        if (!floorsResponse.ok) {
          console.log('Floors API failed with status:', floorsResponse.status)
          throw new Error('Failed to load floors')
        }

        const floorsResult = await floorsResponse.json()

        // Load sections
        const sectionsResponse = await fetch('http://localhost:3001/api/sections', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        })

        if (!sectionsResponse.ok) {
          console.log('Sections API failed with status:', sectionsResponse.status)
          throw new Error('Failed to load sections')
        }

        const sectionsResult = await sectionsResponse.json()

        // Combine floors with their sections
        if (floorsResult.success && sectionsResult.success) {
          const floors = floorsResult.data || []
          const sections = sectionsResult.data || []

          // Group sections by floor_id
          const sectionsByFloor = sections.reduce((acc, section) => {
            if (!acc[section.floor_id]) {
              acc[section.floor_id] = []
            }
            acc[section.floor_id].push({
              id: section.section_id,
              name: section.section_name,
              section_code: section.section_code,
              stall_count: 0, // We don't have stall count from separate endpoints
            })
            return acc
          }, {})

          // Add sections to floors
          this.floors = floors.map((floor) => ({
            id: floor.floor_id,
            floor_number: floor.floor_number,
            name: floor.floor_name,
            description: floor.description,
            status: floor.status,
            sections: sectionsByFloor[floor.floor_id] || [],
          }))

          console.log('Successfully loaded floors and sections separately:', this.floors.length)
        }
      } catch (error) {
        console.error('Error loading separate floors and sections:', error)
        console.log('Loading mock data as final fallback...')
        await this.mockLoadData()
      }
    },

    // Mock data loading (fallbackfor development)
    async mockLoadData() {
      return new Promise((resolve) => {
        setTimeout(() => {
          this.floors = [
            {
              id: 1,
              floor_number: 1,
              name: 'Ground Floor',
              description: 'Main entrance floor',
              status: 'active',
              sections: [
                { id: 1, name: 'Section A', section_code: 'A01', stall_count: 12 },
                { id: 2, name: 'Section B', section_code: 'B01', stall_count: 8 },
                { id: 3, name: 'Section C', section_code: 'C01', stall_count: 15 },
              ],
            },
            {
              id: 2,
              floor_number: 2,
              name: 'Second Floor',
              description: 'Upper level marketplace',
              status: 'active',
              sections: [
                { id: 4, name: 'Section D', section_code: 'D01', stall_count: 10 },
                { id: 5, name: 'Section E', section_code: 'E01', stall_count: 6 },
              ],
            },
            {
              id: 3,
              floor_number: 3,
              name: 'Third Floor',
              description: 'Premium section',
              status: 'inactive',
              sections: [],
            },
          ]
          resolve()
        }, 1000)
      })
    },

    // Show success message
    showMessage(message) {
      this.$emit('show-message', message)
    },

    // Refresh data
    refreshData() {
      this.loadFloorsAndSections()
      this.$emit('refresh-data')
    },

    // Force refresh - can be called from parent components
    forceRefresh() {
      this.floors = []
      this.loadFloorsAndSections()
    },
  },
}
