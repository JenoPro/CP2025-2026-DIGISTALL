import axios from 'axios'

export default {
  name: "AppHeader",
  props: {
    title: {
      type: String,
      default: "Title",
    },
    username: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      showProfilePopup: false,
      popupPosition: {},
      adminData: null,
      loading: false,
      error: null,
    };
  },
  computed: {
    displayUsername() {
      // Show the actual username from database
      return this.adminData?.username || "admin";
    },
    displayDesignation() {
      // Combine first_name and last_name as designation
      if (this.adminData?.first_name && this.adminData?.last_name) {
        return `${this.adminData.first_name} ${this.adminData.last_name}`;
      }
      return "System Administrator";
    },
  },
  methods: {
    // Simple method to fetch admin data
    async fetchAdminData() {
      try {
        this.loading = true;
        this.error = null;
        
        console.log('🔍 Fetching admin data...');
        
        // Simple GET request to fetch admin info
        const response = await axios.get('http://localhost:3001/api/admin-info');
        
        if (response.data.success && response.data.admin) {
          this.adminData = response.data.admin;
          console.log('✅ Admin data loaded:', this.adminData);
          
          // Store in sessionStorage for quick access
          sessionStorage.setItem('adminData', JSON.stringify(this.adminData));
        } else {
          console.warn('⚠️ No admin data found');
          this.error = 'Admin data not found';
        }
        
      } catch (error) {
        console.error('❌ Failed to fetch admin data:', error);
        this.error = 'Failed to load admin information';
        
        // Try to use stored data as fallback
        const storedData = sessionStorage.getItem('adminData');
        if (storedData) {
          try {
            this.adminData = JSON.parse(storedData);
            console.log('📦 Using stored admin data as fallback');
            this.error = null;
          } catch (parseError) {
            console.error('Error parsing stored admin data:', parseError);
          }
        }
      } finally {
        this.loading = false;
      }
    },

    handleNotificationClick() {
      console.log("Notification clicked");
      this.$emit("notification-click");
    },
    
    handleProfileClick() {
      console.log("Profile clicked");
      this.closeProfilePopup();
      this.$emit("profile-click");
    },
    
    handleSettingsClick() {
      console.log("Settings clicked");
      this.closeProfilePopup();
      this.$emit("settings-click");
    },
    
    async handleLogoutClick() {
      console.log("Logout clicked");
      this.closeProfilePopup();

      // Clear any stored user data
      sessionStorage.removeItem("currentUser");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("adminData");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("authToken");
      
      // Clear axios header
      delete axios.defaults.headers.common['Authorization'];

      // Clear component data
      this.adminData = null;

      // Clear Vuex store if you're using it
      if (this.$store && this.$store.dispatch) {
        this.$store.dispatch("auth/logout");
      }

      // Navigate to login page
      this.$router.push("/");

      // Emit logout event
      this.$emit("logout-click");
    },
    
    toggleProfilePopup() {
      if (this.showProfilePopup) {
        this.closeProfilePopup();
      } else {
        this.openProfilePopup();
      }
    },
    
    openProfilePopup() {
      this.showProfilePopup = true;
      this.$nextTick(() => {
        this.calculatePopupPosition();
      });
    },
    
    closeProfilePopup() {
      this.showProfilePopup = false;
    },
    
    calculatePopupPosition() {
      const button = this.$refs.profileButton.$el;
      const buttonRect = button.getBoundingClientRect();

      this.popupPosition = {
        position: "fixed",
        top: `${buttonRect.bottom + 8}px`,
        right: `${window.innerWidth - buttonRect.right}px`,
        zIndex: "9999",
      };
    },
    
    handleClickOutside(event) {
      if (this.showProfilePopup && !this.$refs.profileContainer.contains(event.target)) {
        this.closeProfilePopup();
      }
    },
    
    // Refresh admin data
    async refreshAdminData() {
      await this.fetchAdminData();
    }
  },
  
  async mounted() {
    document.addEventListener("click", this.handleClickOutside);
    
    // Fetch admin data when component mounts
    await this.fetchAdminData();
  },
  
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};