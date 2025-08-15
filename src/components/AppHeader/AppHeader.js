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
    };
  },
  computed: {
    currentUsername() {
      // Try to get username from props first, then from localStorage, then from Vuex/store
      return (
        this.username ||
        localStorage.getItem("currentUser") ||
        this.$store?.state?.auth?.username ||
        "User"
      );
    },
  },
  methods: {
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
    handleLogoutClick() {
      console.log("Logout clicked");
      this.closeProfilePopup();

      // Clear any stored user data
      localStorage.removeItem("currentUser");
      localStorage.removeItem("authToken");

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
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};