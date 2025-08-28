
import VendorApplicantsTable from "../Applicants/ApplicantsComponents/ApplicantsTable/ApplicantsTable.vue";
import VendorSearchFilter from "../Applicants/ApplicantsComponents/ApplicantsSearch/ApplicantsSearch.vue";

export default {
  name: "Applicants",
  components: {
    VendorSearchFilter,
    VendorApplicantsTable,
  },
  data() {
    return {
      searchQuery: "",
      filterCriteria: null,

      // Dropdown functionality (Vendor vs Stall Applicants)
      currentApplicantType: "Vendor Applicants",
      showDropdown: false,
      applicantTypes: [
        { value: "vendor", label: "Vendor Applicants" },
        { value: "stall", label: "Stall Applicants" }
      ],

      // Sample data for vendor applicants
      vendorApplicants: [
        {
          id: "#0023",
          fullName: "Juan Perez Dela Cruz Jr.",
          email: "juan.delacruz@email.com",
          phoneNumber: "09123456789",
          address: "Block 6 Lot 15 Maharlika Village Barangay Rosario Naga City",
          type: "vendor"
        },
        {
          id: "#0024",
          fullName: "Maria Santos Rodriguez",
          email: "maria.santos@email.com",
          phoneNumber: "09123456790",
          address: "Block 2 Lot 8 San Francisco Village Barangay Centro Naga City",
          type: "vendor"
        },
        {
          id: "#0025",
          fullName: "Pedro Garcia Mendoza",
          email: "pedro.garcia@email.com",
          phoneNumber: "09123456791",
          address: "Block 3 Lot 12 Rizal Street Barangay Sabang Naga City",
          type: "vendor"
        },
        {
          id: "#0026",
          fullName: "Ana Reyes Villanueva",
          email: "ana.reyes@email.com",
          phoneNumber: "09123456792",
          address: "Block 1 Lot 5 Magsaysay Avenue Barangay Triangulo Naga City",
          type: "vendor"
        },
        {
          id: "#0027",
          fullName: "Carlos Fernandez Castro",
          email: "carlos.fernandez@email.com",
          phoneNumber: "09123456793",
          address: "Block 4 Lot 20 Peñafrancia Street Barangay Balatas Naga City",
          type: "vendor"
        },
      ],

      // Sample data for stall applicants
      stallApplicants: [
        {
          id: "#S001",
          fullName: "Rosa Martinez Santos",
          email: "rosa.martinez@email.com",
          phoneNumber: "09123456794",
          address: "Block 5 Lot 10 Bagumbayan Street Barangay San Felipe Naga City",
          stallType: "Food Stall",
          type: "stall"
        },
        {
          id: "#S002",
          fullName: "Miguel Torres Reyes",
          email: "miguel.torres@email.com",
          phoneNumber: "09123456795",
          address: "Block 7 Lot 22 Elias Angeles Street Barangay Concepcion Grande Naga City",
          stallType: "Retail Stall",
          type: "stall"
        },
        {
          id: "#S003",
          fullName: "Carmen Cruz Villanueva",
          email: "carmen.cruz@email.com",
          phoneNumber: "09123456796",
          address: "Block 1 Lot 3 General Luna Street Barangay Dayangdang Naga City",
          stallType: "Service Stall",
          type: "stall"
        },
      ],
    };
  },
  computed: {
    // Get current applicants based on selected type
    currentApplicants() {
      return this.currentApplicantType === "Vendor Applicants"
        ? this.vendorApplicants
        : this.stallApplicants;
    },

    // Apply search + filter
    filteredApplicants() {
      let filtered = [...this.currentApplicants];

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (applicant) =>
            applicant.fullName.toLowerCase().includes(query) ||
            applicant.email.toLowerCase().includes(query) ||
            applicant.phoneNumber.includes(query) ||
            applicant.address.toLowerCase().includes(query) ||
            (applicant.stallType && applicant.stallType.toLowerCase().includes(query))
        );
      }

      if (this.filterCriteria) {
        // extend filter logic if needed
      }

      return filtered;
    },
  },
  mounted() {
    this.initializeApplicants();
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    // Dropdown toggle
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    // Switch applicant type
    selectApplicantType(type) {
      this.currentApplicantType = type.label;
      this.showDropdown = false;
      this.searchQuery = "";
      console.log("Switched to:", type.label);
    },

    // Close dropdown when clicking outside
    handleOutsideClick(event) {
      const dropdown = this.$refs.applicantDropdown;
      if (dropdown && !dropdown.contains(event.target)) {
        this.showDropdown = false;
      }
    },

    // Initialize page
    initializeApplicants() {
      console.log("Applicants page initialized");
    },

    // Handle search
    handleSearch(query) {
      this.searchQuery = query;
    },

    // Handle filter
    handleFilter(criteria) {
      this.filterCriteria = criteria;
    },

    // Accept applicant
    handleAccept(applicant) {
      console.log("Accept applicant:", applicant);
      // TODO: API call
    },

    // Decline applicant
    handleDecline(applicant) {
      console.log("Decline applicant:", applicant);
      // TODO: API call
    },
  },
};

