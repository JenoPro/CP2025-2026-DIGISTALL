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
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
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
        userType: sessionStorage.getItem('userType') || 'Not set'
      });
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
      console.log('Accept applicant:', applicant)
      // Here you would typically make an API call to accept the applicant
      // Example: this.$api.acceptApplicant(applicant.id)
    },

    // Handle decline applicant action
    handleDecline(applicant) {
      console.log('Decline applicant:', applicant)
      // Here you would typically make an API call to decline the applicant
      // Example: this.$api.declineApplicant(applicant.id)
    },

        // Fetch stall applicants from database
    async fetchStallApplicants() {
      if (this.currentApplicantType !== 'Stall Applicants') return;

      this.loading = true;
      this.error = null;

      try {
        console.log('🎯 Fetching stall applicants...');
        
        // Check if we have a token (check multiple storage locations)
        const token = sessionStorage.getItem('authToken') || 
                     localStorage.getItem('token') || 
                     localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('Authentication token not found. Please log in again.');
        }

        console.log('🔑 Token found, making API request...');

        // Use the endpoint that automatically gets branch manager ID from token
        const response = await fetch(`http://localhost:3001/api/applicants/my-stall-applicants`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('📡 Response status:', response.status);

        // Handle different error responses
        if (!response.ok) {
          if (response.status === 401) {
            // Clear all possible token storage locations
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
            localStorage.removeItem('user');
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('currentUser');
            sessionStorage.removeItem('userType');
            sessionStorage.removeItem('branchManagerId');
            sessionStorage.removeItem('adminId');
            throw new Error('Your session has expired. Please log in again.');
          } else if (response.status === 403) {
            throw new Error('You do not have permission to view these applicants.');
          } else if (response.status === 404) {
            throw new Error('Branch manager information not found.');
          } else {
            throw new Error(`Server error: ${response.status}`);
          }
        }

        const result = await response.json();
        console.log('📦 API Response:', result);

        if (result.success) {
          // Check if we have applicants data
          if (!result.data || !result.data.applicants) {
            console.warn('⚠️ No applicants data in response');
            this.stallApplicants = [];
            return;
          }

          // Transform the API data to match our component structure
          this.stallApplicants = result.data.applicants.map(applicant => {
            try {
              return this.transformApplicantData(applicant);
            } catch (transformError) {
              console.error('❌ Error transforming applicant:', applicant, transformError);
              // Return a basic object so one bad record doesn't break everything
              return {
                id: `#${String(applicant.applicant_id).padStart(4, '0')}`,
                applicant_id: applicant.applicant_id,
                fullName: `${applicant.first_name || ''} ${applicant.last_name || ''}`.trim(),
                email: applicant.email || '',
                phoneNumber: applicant.contact_number || '',
                address: applicant.address || '',
                type: 'stall',
                error: 'Data transformation error'
              };
            }
          });

          console.log(`✅ Successfully fetched ${this.stallApplicants.length} stall applicants`);

          // Log branch manager info if available
          if (result.data.branch_manager) {
            console.log('👤 Branch Manager:', result.data.branch_manager.manager_name);
            console.log('🏢 Branch:', result.data.branch_manager.branch_name);
          }

          // Log statistics if available
          if (result.data.statistics) {
            console.log('📊 Statistics:', result.data.statistics);
          }

          // Show success message if toast is available
          if (this.$toast) {
            this.$toast.success(`Loaded ${this.stallApplicants.length} applicant(s)`);
          }

        } else {
          throw new Error(result.message || 'Failed to fetch applicants');
        }

      } catch (error) {
        console.error('❌ Error fetching stall applicants:', error);
        this.error = error.message;
        this.stallApplicants = [];
        
        // Show error message to user
        const errorMessage = error.message.includes('Authentication') || error.message.includes('session')
          ? error.message 
          : `Failed to load stall applicants: ${error.message}`;
        
        if (this.$toast) {
          this.$toast.error(errorMessage);
        } else {
          console.error('📢', errorMessage);
          alert(errorMessage); // Fallback if no toast
        }

        // Redirect to login if authentication error
        if (error.message.includes('log in again') || error.message.includes('session has expired')) {
          setTimeout(() => {
            // Redirect to login page
            this.$router.push('/login');
          }, 2000);
        }

      } finally {
        this.loading = false;
      }
    },

    // Transform API response data to component format
    transformApplicantData(apiData) {
      // Debug: Log the API data structure
      console.log('🔍 Transform Debug - API Data:', apiData);
      console.log('🔍 Civil Status:', apiData.applicant_civil_status);
      console.log('🔍 Spouse Data:', apiData.spouse);
      console.log('🔍 Business Info:', apiData.business_information);
      console.log('🔍 Other Info:', apiData.other_information);
      
      // Ensure applications array exists and has items
      const applications = apiData.applications || [];
      
      // Get the most recent application (first item, assuming sorted by date DESC from backend)
      const latestApplication = applications.length > 0 ? applications[0] : null;

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
        spouse_information: apiData.spouse ? {
          spouse_full_name: apiData.spouse.spouse_full_name || '',
          spouse_birthdate: apiData.spouse.spouse_birthdate || null,
          spouse_educational_attainment: apiData.spouse.spouse_educational_attainment || '',
          spouse_contact_number: apiData.spouse.spouse_contact_number || '',
          spouse_occupation: apiData.spouse.spouse_occupation || ''
        } : null,
        
        // Business information
        business_information: apiData.business_information ? {
          nature_of_business: apiData.business_information.nature_of_business || 'Not specified',
          capitalization: apiData.business_information.capitalization || 0,
          source_of_capital: apiData.business_information.source_of_capital || 'Not specified',
          previous_business_experience: apiData.business_information.previous_business_experience || 'None',
          relative_stall_owner: apiData.business_information.relative_stall_owner || 'No'
        } : {
          nature_of_business: 'Not specified',
          capitalization: 0,
          source_of_capital: 'Not specified',
          previous_business_experience: 'None',
          relative_stall_owner: 'No'
        },
        
        // Other information (documents and additional data)
        other_information: apiData.other_information ? {
          signature_of_applicant: apiData.other_information.signature_of_applicant || null,
          house_sketch_location: apiData.other_information.house_sketch_location || null,
          valid_id: apiData.other_information.valid_id || null,
          email_address: apiData.other_information.email_address || apiData.email || ''
        } : {
          signature_of_applicant: null,
          house_sketch_location: null,
          valid_id: null,
          email_address: apiData.email || ''
        },
        
        // Dates
        applied_date: apiData.applied_date || null,
        created_at: apiData.created_at || null,
        updated_at: apiData.updated_at || null,
        
        // All applications for reference
        all_applications: applications
      };

      // Add latest application details if available
      if (latestApplication) {
        transformedData.application_id = latestApplication.application_id;
        transformedData.application_date = latestApplication.application_date;
        transformedData.application_status = latestApplication.application_status || 'Pending';
        
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
            deadline_active: latestApplication.stall.deadline_active
          };
        } else {
          transformedData.stall_info = null;
        }
      } else {
        // No applications yet
        transformedData.application_id = null;
        transformedData.application_date = null;
        transformedData.application_status = 'No Application';
        transformedData.stall_info = null;
      }

      // Debug: Log the final transformed data
      console.log('✅ Transform Result:', transformedData);
      console.log('✅ Spouse Info in Result:', transformedData.spouse_information);

      return transformedData;
    },

    // Optional: Add method to get application count per applicant
    getApplicationCount(applicant) {
      return applicant.all_applications?.length || 0;
    },

    // Optional: Get all stalls an applicant has applied for
    getAppliedStalls(applicant) {
      if (!applicant.all_applications) return [];
      
      return applicant.all_applications
        .filter(app => app.stall)
        .map(app => ({
          stall_no: app.stall.stall_no,
          location: `${app.stall.floor_name} - ${app.stall.section_name}`,
          status: app.application_status,
          price_type: app.stall.price_type,
          rental_price: app.stall.rental_price
        }));
    },

    // Refresh stall applicants data
    async refreshStallApplicants() {
      await this.fetchStallApplicants()
    },
  },
}
