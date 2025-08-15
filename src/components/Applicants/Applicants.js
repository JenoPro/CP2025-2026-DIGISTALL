// Import components
import VendorSearchFilter from "./Components/Search/ApplicantsSearch.vue";
import VendorApplicantsTable from "./Components/Table/ApplicantsTable.vue";
import AppSidebar from '../AppSidebar/AppSidebar.vue';
import AppHeader from '../AppHeader/AppHeader.vue';

export default {
  name: "Applicants",
  components: {
    VendorSearchFilter,
    VendorApplicantsTable,
    AppSidebar,
    AppHeader,
  },
  data() {
    return {
      pageTitle: "Applicants",
      searchQuery: "",
      filterCriteria: null,
      // Dropdown functionality
      currentApplicantType: "Vendor Applicants",
      showDropdown: false,
      applicantTypes: [
        { value: "vendor", label: "Vendor Applicants" },
        { value: "stall", label: "Stall Applicants" }
      ],
      menuItems: [
        { id: 1, icon: 'mdi-view-dashboard', name: 'Dashboard', active: false },
        { id: 2, icon: 'mdi-credit-card', name: 'Payments', active: false },
        { id: 3, icon: 'mdi-account-group', name: 'Applicants', active: false },
        { id: 4, icon: 'mdi-chart-line', name: 'Complaints', active: false },
        { id: 5, icon: 'mdi-shield-check', name: 'Compliances', active: false },
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

      // Apply additional filter criteria if needed
      if (this.filterCriteria) {
        // Add filter logic based on filterCriteria
        // This can be extended based on specific filter requirements
      }

      return filtered;
    },
  },
  mounted() {
    this.initializeApplicants();
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    // Handle dropdown toggle
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    // Handle applicant type selection
    selectApplicantType(type) {
      this.currentApplicantType = type.label;
      this.showDropdown = false;
      
      // Clear search when switching types
      this.searchQuery = "";
      
      // You can add additional logic here for API calls or data fetching
      console.log("Switched to:", type.label);
    },

    // Handle clicks outside dropdown
    handleOutsideClick(event) {
      const dropdown = this.$refs.applicantDropdown;
      if (dropdown && !dropdown.contains(event.target)) {
        this.showDropdown = false;
      }
    },

    // Handle menu item clicks from sidebar
    handleMenuItemClick(item) {
      console.log("Menu item clicked:", item);
      
      // Handle both object with id and direct item
      const itemId = item.id || item;
      
      // Update active state in menu items
      this.menuItems.forEach(menuItem => {
        if (menuItem.id) {
          menuItem.active = menuItem.id === itemId;
        }
      });
      
      this.updatePageTitle(itemId);
      this.navigateToPage(itemId, item);
    },

    // Handle notification clicks from header
    handleNotificationClick() {
      console.log("Notification clicked");
      // Add notification logic here
    },

    // Handle profile clicks from header
    handleProfileClick() {
      console.log("Profile clicked");
      // Add profile logic here
    },

    // Handle settings clicks from header dropdown
    handleSettingsClick() {
      console.log("Settings clicked");
      // Navigate to settings or open settings modal
    },

    // Handle logout clicks from header dropdown
    handleLogoutClick() {
      console.log("Logout clicked");
      // Handle logout logic - clear session, redirect to login, etc.
    },

    // Update page title based on menu selection
    updatePageTitle(itemId) {
      const titleMap = {
        1: "Dashboard",
        2: "Payments", 
        3: "Applicants",
        4: "Complaints",
        5: "Compliances",
      };
      this.pageTitle = titleMap[itemId] || "Applicants";
    },

    // Navigate to different pages
    navigateToPage(itemId, item) {
      let targetRoute;
      
      // Handle route from item object or map from itemId
      if (item && item.route) {
        targetRoute = item.route;
      } else {
        const routes = {
          1: "/dashboard",
          2: "/payments",
          3: "/applicants", 
          4: "/complaints",
          5: "/compliances",
        };
        targetRoute = routes[itemId];
      }

      // Navigate if route exists and is different from current
      if (targetRoute && this.$router && this.$router.currentRoute.value.path !== targetRoute) {
        this.$router.push(targetRoute);
      }
    },

    // Initialize applicants page
    initializeApplicants() {
      console.log("Applicants page initialized");
      // Add any initialization logic here
    },

    // Handle search functionality
    handleSearch(query) {
      this.searchQuery = query;
    },

    // Handle filter functionality
    handleFilter(criteria) {
      this.filterCriteria = criteria;
    },

    // Handle accept applicant action
    handleAccept(applicant) {
      console.log("Accept applicant:", applicant);
      // Here you would typically make an API call to accept the applicant
      // Example: this.$api.acceptApplicant(applicant.id)
    },

    // Handle decline applicant action
    handleDecline(applicant) {
      console.log("Decline applicant:", applicant);
      // Here you would typically make an API call to decline the applicant
      // Example: this.$api.declineApplicant(applicant.id)
    },
  },
};