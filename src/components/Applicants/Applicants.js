// Import components
import VendorSearchFilter from './Components/Search/ApplicantsSearch.vue'
import VendorApplicantsTable from './Components/Table/ApplicantsTable.vue'
import ApproveApplicants from './Components/ApproveApplicants/ApproveApplicants.vue'
import DeclineApplicants from './Components/DeclineApplicants/DeclineApplicants.vue'

export default {
  name: 'Applicants',
  components: {
    VendorSearchFilter,
    VendorApplicantsTable,
    ApproveApplicants,
    DeclineApplicants,
  },
  data() {
    return {
      pageTitle: 'Applicants',
      searchQuery: '',
      filterCriteria: null,
      // Dropdown functionality
      currentApplicantType: 'Vendor Applicants',
      showDropdown: false,
      applicantTypes: [
        { value: 'vendor', label: 'Vendor Applicants' },
        { value: 'stall', label: 'Stall Applicants' },
      ],
      // Modal states for approve/decline
      showApproveModal: false,
      showDeclineModal: false,
      selectedApplicant: null,
      // Sample data for vendor applicants with detailed information
      vendorApplicants: [
        {
          id: '#0023',
          applicant_id: 1,
          fullName: 'Juan Perez Dela Cruz Jr.',
          email: 'juan.delacruz@email.com',
          phoneNumber: '09123456789',
          address: 'Block 6 Lot 15 Maharlika Village Barangay Rosario Naga City',
          type: 'vendor',
          status: 'Approved', // Add status for testing (using DB enum values)
          application_status: 'Approved', // Database field
          approved_at: '2025-10-03T10:30:00Z', // Add approval date
          // Additional detailed information
          applicant_birthdate: '1985-03-15',
          applicant_civil_status: 'Married',
          applicant_educational_attainment: 'College Graduate',
          business_information: {
            nature_of_business: 'Electronics Retail',
            capitalization: 150000.0,
            source_of_capital: 'Personal Savings',
            previous_business_experience: 'Worked in electronics store for 5 years',
            relative_stall_owner: 'No',
          },
          spouse_information: {
            spouse_full_name: 'Maria Dela Cruz',
            spouse_birthdate: '1987-07-22',
            spouse_educational_attainment: 'High School Graduate',
            spouse_contact_number: '09123456788',
            spouse_occupation: 'Housewife',
          },
          other_information: {
            email_address: 'juan.delacruz@email.com',
            signature_of_applicant: 'juan_signature.jpg',
            house_sketch_location: 'house_sketch_juan.jpg',
            valid_id: 'juan_valid_id.jpg',
          },
        },
        {
          id: '#0024',
          applicant_id: 2,
          fullName: 'Maria Santos Rodriguez',
          email: 'maria.santos@email.com',
          phoneNumber: '09123456790',
          address: 'Block 2 Lot 8 San Francisco Village Barangay Centro Naga City',
          type: 'vendor',
          status: 'Rejected', // Add declined status for testing (using DB enum values)
          application_status: 'Rejected', // Database field
          declined_at: '2025-10-04T14:15:00Z', // Add decline date
          applicant_birthdate: '1990-11-08',
          applicant_civil_status: 'Single',
          applicant_educational_attainment: 'College Graduate',
          business_information: {
            nature_of_business: 'Clothing Retail',
            capitalization: 200000.0,
            source_of_capital: 'Bank Loan',
            previous_business_experience: 'Online clothing business for 3 years',
            relative_stall_owner: 'Yes',
          },
          spouse_information: null,
          other_information: {
            email_address: 'maria.santos@email.com',
            signature_of_applicant: 'maria_signature.jpg',
            house_sketch_location: 'house_sketch_maria.jpg',
            valid_id: 'maria_valid_id.jpg',
          },
        },
        {
          id: '#0025',
          applicant_id: 3,
          fullName: 'Pedro Garcia Mendoza',
          email: 'pedro.garcia@email.com',
          phoneNumber: '09123456791',
          address: 'Block 3 Lot 12 Rizal Street Barangay Sabang Naga City',
          type: 'vendor',
          application_status: 'Pending', // Database field for pending status
          applicant_birthdate: '1982-05-20',
          applicant_civil_status: 'Married',
          applicant_educational_attainment: 'High School Graduate',
          business_information: {
            nature_of_business: 'Food Service',
            capitalization: 80000.0,
            source_of_capital: 'Family Support',
            previous_business_experience: 'Street food vendor for 2 years',
            relative_stall_owner: 'No',
          },
          spouse_information: {
            spouse_full_name: 'Ana Garcia',
            spouse_birthdate: '1984-12-10',
            spouse_educational_attainment: 'High School Graduate',
            spouse_contact_number: '09123456792',
            spouse_occupation: 'Seamstress',
          },
          other_information: {
            email_address: 'pedro.garcia@email.com',
            signature_of_applicant: 'pedro_signature.jpg',
            house_sketch_location: 'house_sketch_pedro.jpg',
            valid_id: 'pedro_valid_id.jpg',
          },
        },
        {
          id: '#0026',
          applicant_id: 4,
          fullName: 'Ana Reyes Villanueva',
          email: 'ana.reyes@email.com',
          phoneNumber: '09123456792',
          address: 'Block 1 Lot 5 Magsaysay Avenue Barangay Triangulo Naga City',
          type: 'vendor',
          applicant_birthdate: '1988-09-14',
          applicant_civil_status: 'Divorced',
          applicant_educational_attainment: 'College Graduate',
          business_information: {
            nature_of_business: 'Beauty Products',
            capitalization: 120000.0,
            source_of_capital: 'Investment from Partner',
            previous_business_experience: 'Cosmetics sales representative for 4 years',
            relative_stall_owner: 'No',
          },
          spouse_information: null,
          other_information: {
            email_address: 'ana.reyes@email.com',
            signature_of_applicant: 'ana_signature.jpg',
            house_sketch_location: 'house_sketch_ana.jpg',
            valid_id: 'ana_valid_id.jpg',
          },
        },
        {
          id: '#0027',
          applicant_id: 5,
          fullName: 'Carlos Fernandez Castro',
          email: 'carlos.fernandez@email.com',
          phoneNumber: '09123456793',
          address: 'Block 4 Lot 20 Peñafrancia Street Barangay Balatas Naga City',
          type: 'vendor',
          applicant_birthdate: '1979-01-30',
          applicant_civil_status: 'Married',
          applicant_educational_attainment: 'Vocational Graduate',
          business_information: {
            nature_of_business: 'Hardware Supplies',
            capitalization: 300000.0,
            source_of_capital: 'Business Partnership',
            previous_business_experience: 'Construction materials supplier for 8 years',
            relative_stall_owner: 'Yes',
          },
          spouse_information: {
            spouse_full_name: 'Carmen Castro',
            spouse_birthdate: '1981-06-18',
            spouse_educational_attainment: 'College Graduate',
            spouse_contact_number: '09123456794',
            spouse_occupation: 'Teacher',
          },
          other_information: {
            email_address: 'carlos.fernandez@email.com',
            signature_of_applicant: 'carlos_signature.jpg',
            house_sketch_location: 'house_sketch_carlos.jpg',
            valid_id: 'carlos_valid_id.jpg',
          },
        },
      ],
      // Dynamic data for stall applicants - fetched from database
      stallApplicants: [],
      // Loading and error states
      loading: false,
      error: null,
      // Email sending state
      emailSending: false,
      // Auto-cleanup timer for 30-day rejected applicants removal
      autoCleanupTimer: null,
    }
  },
  computed: {
    // Get current applicants based on selected type
    currentApplicants() {
      return this.currentApplicantType === 'Vendor Applicants'
        ? this.vendorApplicants
        : this.stallApplicants
    },

    filteredApplicants() {
      let filtered = [...this.currentApplicants]

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (applicant) =>
            applicant.fullName.toLowerCase().includes(query) ||
            applicant.email.toLowerCase().includes(query) ||
            applicant.phoneNumber.includes(query) ||
            applicant.address.toLowerCase().includes(query) ||
            (applicant.stallType && applicant.stallType.toLowerCase().includes(query)) ||
            // For stall applicants, also search stall information
            (applicant.stall_info &&
              (applicant.stall_info.stall_no.toLowerCase().includes(query) ||
                applicant.stall_info.stall_location.toLowerCase().includes(query) ||
                applicant.stall_info.section_name.toLowerCase().includes(query) ||
                applicant.stall_info.floor_name.toLowerCase().includes(query) ||
                applicant.stall_info.price_type.toLowerCase().includes(query))) ||
            // Search business information
            (applicant.business_information &&
              (applicant.business_information.nature_of_business.toLowerCase().includes(query) ||
                (applicant.business_information.business_name &&
                  applicant.business_information.business_name.toLowerCase().includes(query)))),
        )
      }

      // Apply additional filter criteria if needed
      if (this.filterCriteria) {
        // Add filter logic based on filterCriteria
        // This can be extended based on specific filter requirements
      }

      return filtered
    },
  },
  mounted() {
    this.initializeApplicants()
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleOutsideClick)
    // Fetch stall applicants when component mounts if stall applicants is selected
    if (this.currentApplicantType === 'Stall Applicants') {
      this.fetchStallApplicants()
    }

    // Start auto-cleanup for declined applicants older than 30 days
    this.startAutoCleanupTimer()
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
    // Clear auto-cleanup timer
    if (this.autoCleanupTimer) {
      clearInterval(this.autoCleanupTimer)
    }
  },
  methods: {
    // Handle dropdown toggle
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },

    // Handle applicant type selection
    selectApplicantType(type) {
      this.currentApplicantType = type.label
      this.showDropdown = false

      // Clear search when switching types
      this.searchQuery = ''

      // Fetch data based on type
      if (type.label === 'Stall Applicants') {
        this.fetchStallApplicants()
      }

      console.log('Switched to:', type.label)
    },

    // Handle clicks outside dropdown
    handleOutsideClick(event) {
      const dropdown = this.$refs.applicantDropdown
      if (dropdown && !dropdown.contains(event.target)) {
        this.showDropdown = false
      }
    },

    // Initialize applicants page
    initializeApplicants() {
      console.log('Applicants page initialized')
      // Debug localStorage contents
      console.log('🔍 Debug Auth Status:', {
        sessionAuthToken: sessionStorage.getItem('authToken')
          ? `Present (${sessionStorage.getItem('authToken').length} chars)`
          : 'Not found',
        localStorageToken: localStorage.getItem('token')
          ? `Present (${localStorage.getItem('token').length} chars)`
          : 'Not found',
        localStorageAuthToken: localStorage.getItem('authToken')
          ? `Present (${localStorage.getItem('authToken').length} chars)`
          : 'Not found',
        currentUser: sessionStorage.getItem('currentUser') ? 'Present' : 'Not found',
        userType: sessionStorage.getItem('userType') || 'Not set',
      })
      console.log('- user:', localStorage.getItem('user'))
      console.log('- branch_manager_id:', localStorage.getItem('branch_manager_id'))
      console.log('- branch_id:', localStorage.getItem('branch_id'))

      // Parse and log user info details
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
        console.log('- userInfo parsed:', userInfo)
      } catch (e) {
        console.log('- userInfo parse error:', e.message)
      }

      // Add any initialization logic here
    },

    // Handle search functionality
    handleSearch(query) {
      this.searchQuery = query
    },

    // Handle filter functionality
    handleFilter(criteria) {
      this.filterCriteria = criteria
    },

    // Handle view more info
    handleViewMoreInfo(applicant) {
      console.log('View more info for:', applicant)
      // This will be handled by the table component
    },

    // Handle accept applicant action
    handleAccept(applicant) {
      console.log('🎯 Opening approve modal for:', applicant)
      this.selectedApplicant = applicant
      this.showApproveModal = true
    },

    // Handle decline applicant action
    handleDecline(applicant) {
      console.log('🚫 Opening decline modal for:', applicant)
      this.selectedApplicant = applicant
      this.showDeclineModal = true
    },

    // Handle re-check applicant action (for rejected applicants) - FIXED TO USE BACKEND API
    async handleRecheck(applicant) {
      console.log('🔄 Re-checking rejected applicant:', applicant)

      try {
        // Make API call to update status to "Under Review" in the backend database
        const token =
          sessionStorage.getItem('authToken') ||
          localStorage.getItem('token') ||
          localStorage.getItem('authToken')

        if (!token) {
          throw new Error('Authentication token not found. Please log in again.')
        }

        const response = await fetch(
          `http://localhost:3001/api/applicants/${applicant.applicant_id || applicant.id}/status`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'Under Review',
            }),
          },
        )

        console.log('📡 Recheck API response status:', response.status)

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Your session has expired. Please log in again.')
          } else if (response.status === 403) {
            throw new Error('You do not have permission to update this applicant.')
          } else if (response.status === 404) {
            throw new Error('Applicant not found.')
          } else {
            throw new Error(`Server error: ${response.status}`)
          }
        }

        const result = await response.json()
        console.log('📦 Recheck API result:', result)

        if (result.success) {
          // Update local data only after successful backend update
          this.updateApplicantStatus(applicant.applicant_id || applicant.id, 'Under Review')

          // Show success message
          if (this.$toast) {
            this.$toast.success(
              `✅ ${applicant.fullName} application successfully moved to Under Review for re-checking`,
            )
          }
        } else {
          throw new Error(result.message || 'Failed to update status')
        }
      } catch (error) {
        console.error('❌ Error updating applicant status to Under Review:', error)

        if (this.$toast) {
          this.$toast.error(`❌ Failed to update status: ${error.message}`)
        }
      }
    },

    // Handle approve modal close
    closeApproveModal() {
      this.showApproveModal = false
      this.selectedApplicant = null
    },

    // Handle decline modal close
    closeDeclineModal() {
      this.showDeclineModal = false
      this.selectedApplicant = null
    },

    // Handle successful approval
    onApplicantApproved(result) {
      console.log('✅ Applicant approved:', result)

      // Update the applicant status immediately for better UX
      if (result.applicant) {
        this.updateApplicantStatus(result.applicant.applicant_id, 'Approved', {
          approved_at: new Date().toISOString(),
        })
      }

      // Refresh the applicant list
      if (this.currentApplicantType === 'Stall Applicants') {
        this.refreshStallApplicants()
      }

      // Close the modal
      this.closeApproveModal()
    },

    // Handle successful decline
    onApplicantDeclined(result) {
      console.log('✅ Applicant declined:', result)

      // Update status instead of removing from list
      if (result.applicant && result.statusUpdated) {
        this.updateApplicantStatus(
          result.applicant.applicant_id || result.applicant.id,
          'Rejected',
          {
            declined_at: new Date().toISOString(),
          },
        )
      }

      // Refresh the applicant list to show updated status
      if (this.currentApplicantType === 'Stall Applicants') {
        this.refreshStallApplicants()
      }

      // Close the modal
      this.closeDeclineModal()
    },

    // Handle status updates from decline modal
    onApplicantStatusUpdated(updateData) {
      console.log('📊 Status updated:', updateData)
      this.updateApplicantStatus(updateData.id, updateData.status, {
        declined_at: updateData.declined_at,
      })
    },

    // Helper method to update applicant status in local data
    updateApplicantStatus(applicantId, status, additionalData = {}) {
      // Update vendor applicants
      const vendorIndex = this.vendorApplicants.findIndex(
        (applicant) => applicant.applicant_id === applicantId,
      )
      if (vendorIndex !== -1) {
        this.vendorApplicants[vendorIndex] = {
          ...this.vendorApplicants[vendorIndex],
          status: status,
          application_status: status, // Update database field
          ...additionalData,
        }
      }

      // Update stall applicants
      const stallIndex = this.stallApplicants.findIndex(
        (applicant) => applicant.applicant_id === applicantId,
      )
      if (stallIndex !== -1) {
        this.stallApplicants[stallIndex] = {
          ...this.stallApplicants[stallIndex],
          status: status,
          application_status: status, // Update database field
          ...additionalData,
        }
      }
    },

    // Helper method to remove applicant from local data (for declined applicants)
    removeApplicantFromList(applicantId) {
      // Remove from vendor applicants
      this.vendorApplicants = this.vendorApplicants.filter(
        (applicant) => applicant.applicant_id !== applicantId,
      )

      // Remove from stall applicants
      this.stallApplicants = this.stallApplicants.filter(
        (applicant) => applicant.applicant_id !== applicantId,
      )
    },

    // Fetch stall applicants from database
    async fetchStallApplicants() {
      if (this.currentApplicantType !== 'Stall Applicants') return

      this.loading = true
      this.error = null

      try {
        console.log('🎯 Fetching stall applicants...')

        // Check if we have a token (check multiple storage locations)
        const token =
          sessionStorage.getItem('authToken') ||
          localStorage.getItem('token') ||
          localStorage.getItem('authToken')

        if (!token) {
          throw new Error('Authentication token not found. Please log in again.')
        }

        console.log('🔑 Token found, making API request...')

        // Use the endpoint that automatically gets branch manager ID from token
        const response = await fetch(`http://localhost:3001/api/applicants/my-stall-applicants`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        console.log('📡 Response status:', response.status)

        // Handle different error responses
        if (!response.ok) {
          if (response.status === 401) {
            // Clear all possible token storage locations
            localStorage.removeItem('token')
            localStorage.removeItem('authToken')
            localStorage.removeItem('userInfo')
            localStorage.removeItem('user')
            sessionStorage.removeItem('authToken')
            sessionStorage.removeItem('currentUser')
            sessionStorage.removeItem('userType')
            sessionStorage.removeItem('branchManagerId')
            sessionStorage.removeItem('adminId')
            throw new Error('Your session has expired. Please log in again.')
          } else if (response.status === 403) {
            throw new Error('You do not have permission to view these applicants.')
          } else if (response.status === 404) {
            throw new Error('Branch manager information not found.')
          } else {
            throw new Error(`Server error: ${response.status}`)
          }
        }

        const result = await response.json()
        console.log('📦 API Response:', result)

        if (result.success) {
          // Check if we have applicants data
          if (!result.data || !result.data.applicants) {
            console.warn('⚠️ No applicants data in response')
            this.stallApplicants = []
            return
          }

          // Transform the API data to match our component structure
          this.stallApplicants = result.data.applicants.map((applicant) => {
            try {
              return this.transformApplicantData(applicant)
            } catch (transformError) {
              console.error('❌ Error transforming applicant:', applicant, transformError)
              // Return a basic object so one bad record doesn't break everything
              return {
                id: `#${String(applicant.applicant_id).padStart(4, '0')}`,
                applicant_id: applicant.applicant_id,
                fullName: `${applicant.first_name || ''} ${applicant.last_name || ''}`.trim(),
                email: applicant.email || '',
                phoneNumber: applicant.contact_number || '',
                address: applicant.address || '',
                type: 'stall',
                error: 'Data transformation error',
              }
            }
          })

          console.log(`✅ Successfully fetched ${this.stallApplicants.length} stall applicants`)

          // Log branch manager info if available
          if (result.data.branch_manager) {
            console.log('👤 Branch Manager:', result.data.branch_manager.manager_name)
            console.log('🏢 Branch:', result.data.branch_manager.branch_name)
          }

          // Log statistics if available
          if (result.data.statistics) {
            console.log('📊 Statistics:', result.data.statistics)
          }

          // Show success message if toast is available
          if (this.$toast) {
            this.$toast.success(`Loaded ${this.stallApplicants.length} applicant(s)`)
          }
        } else {
          throw new Error(result.message || 'Failed to fetch applicants')
        }
      } catch (error) {
        console.error('❌ Error fetching stall applicants:', error)
        this.error = error.message

        // Add mock stall applicants with status for testing status display functionality
        this.stallApplicants = [
          {
            id: '#0025',
            applicant_id: 25,
            fullName: 'Roberto Miguel Santos',
            email: 'roberto.santos@email.com',
            phoneNumber: '09123456791',
            address: 'Block 4 Lot 12 Bagumbayan Village Barangay Tabuco Naga City',
            stallType: 'Food Stall - Filipino Cuisine',
            type: 'stall',
            status: 'Approved', // Add approved status for testing (using DB enum values)
            application_status: 'Approved', // Database field
            approved_at: '2025-10-02T09:15:00Z', // Add approval date
            // Complete stall information
            stall_info: {
              stall_no: 'FS-A15',
              stall_location: 'Food Court Area A',
              section_name: 'Filipino Cuisine Section',
              rental_price: 5000.0,
              price_type: 'Monthly',
              preferred_stall_type: 'Food Stall',
              stall_category: 'Filipino Cuisine',
              stall_size: 'Medium (3x3m)',
              stall_location_preference: 'Main Street Area',
            },
            applicant_birthdate: '1988-05-20',
            applicant_civil_status: 'Married',
            applicant_educational_attainment: 'Vocational Graduate',
            business_information: {
              nature_of_business: 'Food Service - Filipino Dishes',
              capitalization: 80000.0,
              source_of_capital: 'Family Loan',
              previous_business_experience: 'Operated small eatery for 3 years',
              relative_stall_owner: 'No',
            },
          },
          {
            id: '#0026',
            applicant_id: 26,
            fullName: 'Elena Reyes Morales',
            email: 'elena.morales@email.com',
            phoneNumber: '09123456792',
            address: 'Block 1 Lot 5 San Isidro Village Barangay Cararayan Naga City',
            stallType: 'Retail Stall - Clothing & Accessories',
            type: 'stall',
            status: 'Rejected', // Add declined status for testing (using DB enum values)
            application_status: 'Rejected', // Database field
            declined_at: '2025-10-04T11:30:00Z', // Add decline date
            stall_info: {
              stall_no: 'RS-B08',
              stall_location: 'Retail Area B',
              section_name: 'Fashion & Accessories',
              rental_price: 7500.0,
              price_type: 'Monthly',
              preferred_stall_type: 'Retail Stall',
              stall_category: 'Clothing & Accessories',
              stall_size: 'Large (4x4m)',
              stall_location_preference: 'Fashion District',
            },
            applicant_birthdate: '1992-08-14',
            applicant_civil_status: 'Single',
            applicant_educational_attainment: 'College Graduate',
            business_information: {
              nature_of_business: 'Fashion Retail',
              capitalization: 120000.0,
              source_of_capital: 'Personal Savings',
              previous_business_experience: 'Managed clothing boutique for 2 years',
              relative_stall_owner: 'Yes - Sister owns Stall #12',
            },
          },
          {
            id: '#0027',
            applicant_id: 27,
            fullName: 'Carlos David Fernandez',
            email: 'carlos.fernandez@email.com',
            phoneNumber: '09123456793',
            address: 'Block 8 Lot 20 Villa Mercedes Subdivision Barangay Dayangdang Naga City',
            stallType: 'Service Stall - Gadget Repair',
            type: 'stall',
            status: 'Pending', // Add pending status for testing (using DB enum values)
            application_status: 'Pending', // Database field
            stall_info: {
              stall_no: 'SS-C03',
              stall_location: 'Service Area C',
              section_name: 'Electronics & Repair',
              rental_price: 3500.0,
              price_type: 'Monthly',
              preferred_stall_type: 'Service Stall',
              stall_category: 'Electronics Repair',
              stall_size: 'Small (2x2m)',
              stall_location_preference: 'Tech Hub Area',
            },
            applicant_birthdate: '1985-12-03',
            applicant_civil_status: 'Married',
            applicant_educational_attainment: 'Technical Vocational Graduate',
            business_information: {
              nature_of_business: 'Mobile Phone & Gadget Repair',
              capitalization: 45000.0,
              source_of_capital: 'Personal Savings + Equipment Loan',
              previous_business_experience: 'Worked as technician for 8 years',
              relative_stall_owner: 'No',
            },
          },
        ]

        // Show error message to user
        const errorMessage =
          error.message.includes('Authentication') || error.message.includes('session')
            ? error.message
            : `Failed to load stall applicants: ${error.message}`

        if (this.$toast) {
          this.$toast.error(errorMessage)
        } else {
          console.error('📢', errorMessage)
          alert(errorMessage) // Fallback if no toast
        }

        // Redirect to login if authentication error
        if (
          error.message.includes('log in again') ||
          error.message.includes('session has expired')
        ) {
          setTimeout(() => {
            // Redirect to login page
            this.$router.push('/login')
          }, 2000)
        }
      } finally {
        this.loading = false
      }
    },

    // Transform API response data to component format
    transformApplicantData(apiData) {
      // Debug: Log the API data structure
      console.log('🔍 Transform Debug - API Data:', apiData)
      console.log('🔍 Civil Status:', apiData.applicant_civil_status)
      console.log('🔍 Spouse Data:', apiData.spouse)
      console.log('🔍 Business Info:', apiData.business_information)
      console.log('🔍 Other Info:', apiData.other_information)

      // Ensure applications array exists and has items
      const applications = apiData.applications || []

      // Get the most recent application (first item, assuming sorted by date DESC from backend)
      const latestApplication = applications.length > 0 ? applications[0] : null

      // Base applicant object
      const transformedData = {
        id: `#${String(apiData.applicant_id).padStart(4, '0')}`,
        applicant_id: apiData.applicant_id,
        fullName: `${apiData.first_name || ''} ${apiData.last_name || ''}`.trim(),
        email: apiData.email || '',
        phoneNumber: apiData.contact_number || '',
        address: apiData.address || '',
        type: 'stall',

        // Complete personal information from applicant table
        first_name: apiData.first_name || '',
        last_name: apiData.last_name || '',
        applicant_birthdate: apiData.applicant_birthdate || null,
        applicant_civil_status: apiData.applicant_civil_status || null,
        applicant_educational_attainment: apiData.applicant_educational_attainment || null,

        // Spouse information (if married and has spouse data)
        spouse_information: apiData.spouse
          ? {
              spouse_full_name: apiData.spouse.spouse_full_name || '',
              spouse_birthdate: apiData.spouse.spouse_birthdate || null,
              spouse_educational_attainment: apiData.spouse.spouse_educational_attainment || '',
              spouse_contact_number: apiData.spouse.spouse_contact_number || '',
              spouse_occupation: apiData.spouse.spouse_occupation || '',
            }
          : null,

        // Business information
        business_information: apiData.business_information
          ? {
              nature_of_business:
                apiData.business_information.nature_of_business || 'Not specified',
              capitalization: apiData.business_information.capitalization || 0,
              source_of_capital: apiData.business_information.source_of_capital || 'Not specified',
              previous_business_experience:
                apiData.business_information.previous_business_experience || 'None',
              relative_stall_owner: apiData.business_information.relative_stall_owner || 'No',
            }
          : {
              nature_of_business: 'Not specified',
              capitalization: 0,
              source_of_capital: 'Not specified',
              previous_business_experience: 'None',
              relative_stall_owner: 'No',
            },

        // Other information (documents and additional data)
        other_information: apiData.other_information
          ? {
              signature_of_applicant: apiData.other_information.signature_of_applicant || null,
              house_sketch_location: apiData.other_information.house_sketch_location || null,
              valid_id: apiData.other_information.valid_id || null,
              email_address: apiData.other_information.email_address || apiData.email || '',
            }
          : {
              signature_of_applicant: null,
              house_sketch_location: null,
              valid_id: null,
              email_address: apiData.email || '',
            },

        // Dates
        applied_date: apiData.applied_date || null,
        created_at: apiData.created_at || null,
        updated_at: apiData.updated_at || null,

        // All applications for reference
        all_applications: applications,
      }

      // Add latest application details if available
      if (latestApplication) {
        transformedData.application_id = latestApplication.application_id
        transformedData.application_date = latestApplication.application_date
        transformedData.application_status = latestApplication.application_status || 'Pending'

        // Add stall information if available
        if (latestApplication.stall) {
          transformedData.stall_info = {
            stall_id: latestApplication.stall.stall_id,
            stall_no: latestApplication.stall.stall_no,
            stall_location: latestApplication.stall.stall_location,
            rental_price: latestApplication.stall.rental_price,
            price_type: latestApplication.stall.price_type,
            section_name: latestApplication.stall.section_name,
            floor_name: latestApplication.stall.floor_name,
            stall_status: latestApplication.stall.stall_status,
            is_available: latestApplication.stall.is_available,
            raffle_auction_deadline: latestApplication.stall.raffle_auction_deadline,
            deadline_active: latestApplication.stall.deadline_active,
          }
        } else {
          transformedData.stall_info = null
        }
      } else {
        // No applications yet
        transformedData.application_id = null
        transformedData.application_date = null
        transformedData.application_status = 'No Application'
        transformedData.stall_info = null
      }

      // Debug: Log the final transformed data
      console.log('✅ Transform Result:', transformedData)
      console.log('✅ Spouse Info in Result:', transformedData.spouse_information)

      return transformedData
    },

    // Optional: Add method to get application count per applicant
    getApplicationCount(applicant) {
      return applicant.all_applications?.length || 0
    },

    // Optional: Get all stalls an applicant has applied for
    getAppliedStalls(applicant) {
      if (!applicant.all_applications) return []

      return applicant.all_applications
        .filter((app) => app.stall)
        .map((app) => ({
          stall_no: app.stall.stall_no,
          location: `${app.stall.floor_name} - ${app.stall.section_name}`,
          status: app.application_status,
          price_type: app.stall.price_type,
          rental_price: app.stall.rental_price,
        }))
    },

    // Refresh stall applicants data
    async refreshStallApplicants() {
      await this.fetchStallApplicants()
    },

    // Start auto-cleanup timer for 30-day rejected applicants removal
    startAutoCleanupTimer() {
      // Run cleanup every 24 hours (86400000 ms)
      this.autoCleanupTimer = setInterval(() => {
        this.autoCleanupDeclinedApplicants()
      }, 86400000) // 24 hours

      // Also run cleanup immediately on component mount
      this.autoCleanupDeclinedApplicants()
    },

    // Auto-cleanup function to remove rejected applicants older than 30 days
    async autoCleanupDeclinedApplicants() {
      console.log('🧹 Starting auto-cleanup for declined applicants older than 30 days...')

      try {
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        // Find rejected applicants older than 30 days
        const expiredApplicants = [...this.vendorApplicants, ...this.stallApplicants].filter(
          (applicant) => {
            if (applicant.application_status !== 'Rejected' || !applicant.declined_at) {
              return false
            }

            const declinedDate = new Date(applicant.declined_at)
            return declinedDate < thirtyDaysAgo
          },
        )

        console.log(`🔍 Found ${expiredApplicants.length} rejected applicants older than 30 days`)

        // Remove each expired applicant
        for (const applicant of expiredApplicants) {
          try {
            await this.deleteExpiredApplicant(applicant.applicant_id || applicant.id)
            this.removeApplicantFromList(applicant.applicant_id || applicant.id)
            console.log(`🗑️ Removed expired applicant: ${applicant.fullName}`)
          } catch (error) {
            console.error(`❌ Failed to remove expired applicant ${applicant.fullName}:`, error)
          }
        }

        if (expiredApplicants.length > 0) {
          console.log(
            `✅ Auto-cleanup completed: ${expiredApplicants.length} expired applicants removed`,
          )
        }
      } catch (error) {
        console.error('❌ Error during auto-cleanup:', error)
      }
    },

    // Delete expired applicant from database
    async deleteExpiredApplicant(applicantId) {
      try {
        const token =
          sessionStorage.getItem('authToken') ||
          localStorage.getItem('token') ||
          localStorage.getItem('authToken')

        if (!token) {
          throw new Error('Authentication token not found')
        }

        const response = await fetch(`http://localhost:3001/api/applicants/${applicantId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to delete applicant: ${response.status}`)
        }

        const result = await response.json()
        return result
      } catch (error) {
        console.error('❌ Error deleting expired applicant:', error)
        throw error
      }
    },
  },
}
