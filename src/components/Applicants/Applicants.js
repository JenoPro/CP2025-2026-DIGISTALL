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
            capitalization: 150000.00,
            source_of_capital: 'Personal Savings',
            previous_business_experience: 'Worked in electronics store for 5 years',
            relative_stall_owner: 'No'
          },
          spouse: {
            spouse_full_name: 'Maria Dela Cruz',
            spouse_birthdate: '1987-07-22',
            spouse_educational_attainment: 'High School Graduate',
            spouse_contact_number: '09123456788',
            spouse_occupation: 'Housewife'
          },
          other_information: {
            email_address: 'juan.delacruz@email.com',
            signature_of_applicant: 'juan_signature.jpg',
            house_sketch_location: 'house_sketch_juan.jpg',
            valid_id: 'juan_valid_id.jpg'
          }
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
            capitalization: 200000.00,
            source_of_capital: 'Bank Loan',
            previous_business_experience: 'Online clothing business for 3 years',
            relative_stall_owner: 'Yes'
          },
          spouse: null,
          other_information: {
            email_address: 'maria.santos@email.com',
            signature_of_applicant: 'maria_signature.jpg',
            house_sketch_location: 'house_sketch_maria.jpg',
            valid_id: 'maria_valid_id.jpg'
          }
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
            capitalization: 80000.00,
            source_of_capital: 'Family Support',
            previous_business_experience: 'Street food vendor for 2 years',
            relative_stall_owner: 'No'
          },
          spouse: {
            spouse_full_name: 'Ana Garcia',
            spouse_birthdate: '1984-12-10',
            spouse_educational_attainment: 'High School Graduate',
            spouse_contact_number: '09123456792',
            spouse_occupation: 'Seamstress'
          },
          other_information: {
            email_address: 'pedro.garcia@email.com',
            signature_of_applicant: 'pedro_signature.jpg',
            house_sketch_location: 'house_sketch_pedro.jpg',
            valid_id: 'pedro_valid_id.jpg'
          }
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
            capitalization: 120000.00,
            source_of_capital: 'Investment from Partner',
            previous_business_experience: 'Cosmetics sales representative for 4 years',
            relative_stall_owner: 'No'
          },
          spouse: null,
          other_information: {
            email_address: 'ana.reyes@email.com',
            signature_of_applicant: 'ana_signature.jpg',
            house_sketch_location: 'house_sketch_ana.jpg',
            valid_id: 'ana_valid_id.jpg'
          }
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
            capitalization: 300000.00,
            source_of_capital: 'Business Partnership',
            previous_business_experience: 'Construction materials supplier for 8 years',
            relative_stall_owner: 'Yes'
          },
          spouse: {
            spouse_full_name: 'Carmen Castro',
            spouse_birthdate: '1981-06-18',
            spouse_educational_attainment: 'College Graduate',
            spouse_contact_number: '09123456794',
            spouse_occupation: 'Teacher'
          },
          other_information: {
            email_address: 'carlos.fernandez@email.com',
            signature_of_applicant: 'carlos_signature.jpg',
            house_sketch_location: 'house_sketch_carlos.jpg',
            valid_id: 'carlos_valid_id.jpg'
          }
        },
      ],
      // Sample data for stall applicants with detailed information
      stallApplicants: [
        {
          id: '#S001',
          applicant_id: 6,
          fullName: 'Rosa Martinez Santos',
          email: 'rosa.martinez@email.com',
          phoneNumber: '09123456794',
          address: 'Block 5 Lot 10 Bagumbayan Street Barangay San Felipe Naga City',
          stallType: 'Food Stall',
          type: 'stall',
          applicant_birthdate: '1992-04-25',
          applicant_civil_status: 'Single',
          applicant_educational_attainment: 'College Graduate',
          business_information: {
            nature_of_business: 'Fast Food Service',
            capitalization: 100000.00,
            source_of_capital: 'Personal Savings',
            previous_business_experience: 'Restaurant crew for 3 years',
            relative_stall_owner: 'No'
          },
          spouse: null,
          other_information: {
            email_address: 'rosa.martinez@email.com',
            signature_of_applicant: 'rosa_signature.jpg',
            house_sketch_location: 'house_sketch_rosa.jpg',
            valid_id: 'rosa_valid_id.jpg'
          }
        },
        {
          id: '#S002',
          applicant_id: 7,
          fullName: 'Miguel Torres Reyes',
          email: 'miguel.torres@email.com',
          phoneNumber: '09123456795',
          address: 'Block 7 Lot 22 Elias Angeles Street Barangay Concepcion Grande Naga City',
          stallType: 'Retail Stall',
          type: 'stall',
          applicant_birthdate: '1986-12-03',
          applicant_civil_status: 'Married',
          applicant_educational_attainment: 'High School Graduate',
          business_information: {
            nature_of_business: 'General Merchandise',
            capitalization: 180000.00,
            source_of_capital: 'Family Investment',
            previous_business_experience: 'Sari-sari store owner for 5 years',
            relative_stall_owner: 'Yes'
          },
          spouse: {
            spouse_full_name: 'Linda Reyes',
            spouse_birthdate: '1988-08-15',
            spouse_educational_attainment: 'College Graduate',
            spouse_contact_number: '09123456796',
            spouse_occupation: 'Accountant'
          },
          other_information: {
            email_address: 'miguel.torres@email.com',
            signature_of_applicant: 'miguel_signature.jpg',
            house_sketch_location: 'house_sketch_miguel.jpg',
            valid_id: 'miguel_valid_id.jpg'
          }
        },
        {
          id: '#S003',
          applicant_id: 8,
          fullName: 'Carmen Cruz Villanueva',
          email: 'carmen.cruz@email.com',
          phoneNumber: '09123456796',
          address: 'Block 1 Lot 3 General Luna Street Barangay Dayangdang Naga City',
          stallType: 'Service Stall',
          type: 'stall',
          applicant_birthdate: '1983-10-12',
          applicant_civil_status: 'Widowed',
          applicant_educational_attainment: 'Vocational Graduate',
          business_information: {
            nature_of_business: 'Tailoring Services',
            capitalization: 60000.00,
            source_of_capital: 'Personal Savings',
            previous_business_experience: 'Home-based tailoring for 6 years',
            relative_stall_owner: 'No'
          },
          spouse: null,
          other_information: {
            email_address: 'carmen.cruz@email.com',
            signature_of_applicant: 'carmen_signature.jpg',
            house_sketch_location: 'house_sketch_carmen.jpg',
            valid_id: 'carmen_valid_id.jpg'
          }
        },
      ],
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
            (applicant.stallType && applicant.stallType.toLowerCase().includes(query)),
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

      // You can add additional logic here for API calls or data fetching
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
  },
}