// Import components
import VendorSearchFilter from './Components/Search/ApplicantsSearch.vue'
import VendorApplicantsTable from './Components/Table/ApplicantsTable.vue'

export default {
  name: 'Applicants',
  components: {
    VendorSearchFilter,
    VendorApplicantsTable,
  },

  data() {
    return {
      selectedTab: 'vendor',
      searchTerm: '',

      // Dropdown functionality for template
      showDropdown: false,
      applicantTypes: [
        { value: 'vendor', label: 'Vendor' },
        { value: 'stall', label: 'Stall' },
      ],
      currentApplicantType: 'Vendor',

      // Static vendor applicants data
      vendorApplicants: [
        {
          id: 1,
          applicant_full_name: 'John Doe',
          email_address: 'john.doe@email.com',
          contact_number: '09123456789',
          business_name: "John's Food Corner",
          business_category: 'Food & Beverages',
          barangay: 'Barangay 1',
          application_type: 'vendor',
          application_status: 'pending',
          created_at: '2024-01-01',
        },
        {
          id: 2,
          applicant_full_name: 'Jane Smith',
          email_address: 'jane.smith@email.com',
          contact_number: '09987654321',
          business_name: "Jane's Crafts",
          business_category: 'Handicrafts',
          barangay: 'Barangay 2',
          application_type: 'vendor',
          application_status: 'approved',
          created_at: '2024-01-02',
        },
      ],

      // Dynamic stall applicants - fetched from API
      stallApplicants: [],
      selectedStallId: null, // For filtering by specific stall
      selectedBranchId: null, // For filtering by branch
      availableStalls: [], // List of stalls for filtering
      showStallFilter: false, // Show/hide stall filter dropdown
      loading: false,
      error: null,
    }
  },

  computed: {
    filteredApplicants() {
      const applicants =
        this.selectedTab === 'vendor' ? this.vendorApplicants : this.stallApplicants

      if (!this.searchTerm) return applicants

      return applicants.filter((applicant) => {
        const searchLower = this.searchTerm.toLowerCase()
        return (
          (applicant.applicant_full_name || applicant.first_name + ' ' + applicant.last_name)
            .toLowerCase()
            .includes(searchLower) ||
          (applicant.email_address || applicant.email).toLowerCase().includes(searchLower) ||
          applicant.business_name?.toLowerCase().includes(searchLower) ||
          (applicant.business_category || applicant.business_type)
            ?.toLowerCase()
            .includes(searchLower) ||
          applicant.stall_no?.toLowerCase().includes(searchLower)
        )
      })
    },
  },

  methods: {
    async fetchStallApplicants(branchId = null, stallId = null) {
      if (this.selectedTab !== 'stall') return

      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('token')

        if (!token) {
          throw new Error('No authentication token found. Please login again.')
        }

        let url = '/api/applicants'

        // If specific stall ID is provided, fetch applicants for that stall
        if (stallId) {
          url = `/api/applicants/stall/${stallId}`
        }
        // If branch ID is provided, fetch applicants for that branch
        else if (branchId) {
          url = `/api/applicants/branch/${branchId}`
        }
        // Otherwise, get all applicants
        else {
          url = '/api/applicants'
        }

        console.log('Fetching from URL:', url) // Debug log

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            // Clear invalid token and redirect to login
            localStorage.removeItem('token')
            throw new Error('Session expired. Please login again.')
          }
          throw new Error(`Failed to fetch applicants: ${response.status} ${response.statusText}`)
        }

        const result = await response.json()

        if (result.success) {
          // Handle different response structures based on endpoint
          if (stallId) {
            // For stall-specific endpoint: result.data.applicants
            this.stallApplicants = this.formatStallApplicants(result.data.applicants || [])
          } else if (branchId) {
            // For branch-specific endpoint: result.data.applicants
            this.stallApplicants = this.formatBranchApplicants(result.data.applicants || [])
          } else {
            // For general endpoint: result.data
            this.stallApplicants = this.formatGeneralApplicants(result.data || [])
          }
        } else {
          throw new Error(result.message || 'Failed to fetch applicants')
        }
      } catch (error) {
        console.error('Error fetching stall applicants:', error)
        this.error = 'Failed to load stall applicants'
        this.stallApplicants = []
      } finally {
        this.loading = false
      }
    },

    // Format applicants from stall-specific endpoint
    formatStallApplicants(applicants) {
      return applicants.map((applicant) => ({
        id: applicant.applicant_id,
        applicant_id: applicant.applicant_id,
        applicant_full_name: `${applicant.first_name} ${applicant.last_name}`,
        first_name: applicant.first_name,
        last_name: applicant.last_name,
        email_address: applicant.email,
        email: applicant.email,
        contact_number: applicant.contact_number,
        business_name: applicant.business_name,
        business_category: applicant.business_type,
        business_type: applicant.business_type,
        business_description: applicant.business_description,
        address: applicant.address,
        preferred_area: applicant.preferred_area,
        preferred_location: applicant.preferred_location,
        application_status: applicant.current_application_status || applicant.application_status,
        application_date: applicant.application_date,
        applied_date: applicant.applied_date,
        created_at: applicant.created_at,
        updated_at: applicant.updated_at,
        // Raffle/Auction specific data
        raffle_id: applicant.raffle_id,
        raffle_participants: applicant.raffle_participants,
        raffle_status: applicant.raffle_status,
        auction_id: applicant.auction_id,
        current_bid: applicant.current_bid,
        auction_status: applicant.auction_status,
        application_type: 'stall',
      }))
    },

    // Format applicants from branch-specific endpoint
    formatBranchApplicants(applicants) {
      const formattedApplicants = []

      applicants.forEach((applicant) => {
        // Each applicant can have multiple applications
        applicant.applications.forEach((application) => {
          formattedApplicants.push({
            id: `${applicant.applicant_id}_${application.application_id}`,
            applicant_id: applicant.applicant_id,
            applicant_full_name: `${applicant.first_name} ${applicant.last_name}`,
            first_name: applicant.first_name,
            last_name: applicant.last_name,
            email_address: applicant.email,
            email: applicant.email,
            contact_number: applicant.contact_number,
            business_name: applicant.business_name,
            business_category: applicant.business_type,
            business_type: applicant.business_type,
            business_description: applicant.business_description,
            address: applicant.address,
            preferred_area: applicant.preferred_area,
            preferred_location: applicant.preferred_location,
            application_status: application.application_status,
            application_date: application.application_date,
            applied_date: applicant.applied_date,
            created_at: applicant.created_at,
            updated_at: applicant.updated_at,
            // Stall information
            stall_id: application.stall.stall_id,
            stall_no: application.stall.stall_no,
            rental_price: application.stall.rental_price,
            price_type: application.stall.price_type,
            stall_location: application.stall.stall_location,
            stall_status: application.stall.stall_status,
            section_name: application.stall.section_name,
            floor_name: application.stall.floor_name,
            application_type: 'stall',
          })
        })
      })

      return formattedApplicants
    },

    // Fetch available stalls for filtering
    async fetchAvailableStalls() {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          throw new Error('No authentication token found')
        }

        const response = await fetch('/api/stalls', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch stalls: ${response.status}`)
        }

        const result = await response.json()
        if (result.success) {
          this.availableStalls = result.data || []
        }
      } catch (error) {
        console.error('Error fetching available stalls:', error)
        this.availableStalls = []
      }
    },

    // Format applicants from general endpoint
    formatGeneralApplicants(applicants) {
      return applicants.map((applicant) => ({
        id: applicant.applicant_id,
        applicant_id: applicant.applicant_id,
        applicant_full_name: `${applicant.first_name} ${applicant.last_name}`,
        first_name: applicant.first_name,
        last_name: applicant.last_name,
        email_address: applicant.email,
        email: applicant.email,
        contact_number: applicant.contact_number,
        business_name: applicant.business_name,
        business_category: applicant.business_type,
        business_type: applicant.business_type,
        business_description: applicant.business_description,
        address: applicant.address,
        preferred_area: applicant.preferred_area,
        preferred_location: applicant.preferred_location,
        application_status: applicant.application_status,
        applied_date: applicant.applied_date,
        created_at: applicant.created_at,
        updated_at: applicant.updated_at,
        application_type: 'stall',
      }))
    },

    onTabChange(tab) {
      this.selectedTab = tab

      // Fetch stall applicants when switching to stall tab
      if (tab === 'stall') {
        this.fetchStallApplicants(this.selectedBranchId, this.selectedStallId)
      }
    },

    onSearch(searchTerm) {
      this.searchTerm = searchTerm
    },

    refreshData() {
      if (this.selectedTab === 'stall') {
        this.fetchStallApplicants(this.selectedBranchId, this.selectedStallId)
      }
    },

    // Method to filter by specific stall
    filterByStall(stallId) {
      this.selectedStallId = stallId
      this.selectedBranchId = null // Clear branch filter
      if (this.selectedTab === 'stall') {
        this.fetchStallApplicants(null, stallId)
      }
    },

    // Method to filter by specific branch
    filterByBranch(branchId) {
      this.selectedBranchId = branchId
      this.selectedStallId = null // Clear stall filter
      if (this.selectedTab === 'stall') {
        this.fetchStallApplicants(branchId, null)
      }
    },

    // Method to clear all filters
    clearFilters() {
      this.selectedStallId = null
      this.selectedBranchId = null
      if (this.selectedTab === 'stall') {
        this.fetchStallApplicants()
      }
    },

    // Toggle stall filter dropdown
    toggleStallFilter() {
      this.showStallFilter = !this.showStallFilter
      if (this.showStallFilter && this.availableStalls.length === 0) {
        this.fetchAvailableStalls()
      }
    },

    // Select specific stall to filter by
    selectStall(stall) {
      this.selectedStallId = stall.stall_id
      this.selectedBranchId = null
      this.showStallFilter = false

      if (this.selectedTab === 'stall') {
        this.fetchStallApplicants(null, stall.stall_id)
      }
    },

    // Get stall display name
    getStallDisplayName(stallId) {
      if (!stallId) return 'All Stalls'

      const stall = this.availableStalls.find((s) => s.stall_id === stallId)
      if (stall) {
        return `${stall.stall_no} - ${stall.price_type} (₱${stall.rental_price})`
      }
      return `Stall #${stallId}`
    },

    // Dropdown methods for template
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },

    selectApplicantType(type) {
      this.currentApplicantType = type.label
      this.selectedTab = type.value
      this.showDropdown = false

      // Fetch stall applicants when switching to stall tab
      if (type.value === 'stall') {
        this.fetchStallApplicants(this.selectedBranchId, this.selectedStallId)
        // Also fetch available stalls for filtering
        if (this.availableStalls.length === 0) {
          this.fetchAvailableStalls()
        }
      }
    },

    // Search and filter handlers for template
    handleSearch(searchTerm) {
      this.onSearch(searchTerm)
    },

    handleFilter(filters) {
      // Handle additional filters if needed
      console.log('Filters applied:', filters)
    },

    // Action handlers for template
    handleAccept(applicant) {
      console.log('Accept applicant:', applicant)
      // Implement accept logic
    },

    handleDecline(applicant) {
      console.log('Decline applicant:', applicant)
      // Implement decline logic
    },

    // Handle click outside dropdown
    handleClickOutside(event) {
      if (this.$refs.applicantDropdown && !this.$refs.applicantDropdown.contains(event.target)) {
        this.showDropdown = false
      }
    },
  },

  mounted() {
    // Load stall applicants if starting on stall tab
    if (this.selectedTab === 'stall') {
      this.fetchStallApplicants(this.selectedBranchId, this.selectedStallId)
    }

    // Add click outside listener for dropdown
    document.addEventListener('click', this.handleClickOutside)
  },

  beforeUnmount() {
    // Remove click outside listener
    document.removeEventListener('click', this.handleClickOutside)
  },
}
