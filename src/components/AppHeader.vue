<!-- components/AppHeader.vue -->
<template>
  <v-app-bar app color="white" elevation="1" height="80">
    <div class="d-flex align-center">
      <h2 class="title-text ml-4">{{ title }}</h2>
    </div>

    <v-spacer></v-spacer>

    <div class="d-flex align-center">
      <v-btn icon class="mr-2" @click="handleNotificationClick">
        <v-icon size="28" color="dark">mdi-bell-outline</v-icon>
      </v-btn>

      <!-- Profile Button -->
      <div class="profile-container" ref="profileContainer">
        <v-btn icon class="profile-btn" @click="toggleProfilePopup" ref="profileButton">
          <v-icon size="28" color="dark">mdi-account-circle</v-icon>
        </v-btn>

        <!-- Profile Popup -->
        <div
          v-if="showProfilePopup"
          class="profile-popup"
          :style="popupPosition"
          @click.stop
        >
          <div class="popup-arrow"></div>
          <div class="popup-content">
            <div class="profile-info" @click="handleProfileClick">
              <v-icon class="profile-icon">mdi-account</v-icon>
              <div class="profile-details">
                <div class="profile-name">{{ currentUsername || "User" }}</div>
                <div class="profile-role">Designation</div>
              </div>
            </div>
            <div class="popup-divider"></div>
            <div class="popup-item" @click="handleSettingsClick">
              <v-icon class="item-icon">mdi-cog</v-icon>
              <span>Settings</span>
            </div>
            <div class="popup-item" @click="handleLogoutClick">
              <v-icon class="item-icon">mdi-logout</v-icon>
              <span>Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay to close popup when clicking outside -->
    <div v-if="showProfilePopup" class="popup-overlay" @click="closeProfilePopup"></div>
  </v-app-bar>
</template>

<script>
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
</script>

<style scoped>
/* Top Navigation Bar Styles */
.v-app-bar {
  border-bottom: 1px solid #e0e0e0;
}

.title-text {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  font-family: "Poppins", sans-serif;
}

.profile-container {
  position: relative;
}

.profile-btn {
  margin-right: 16px;
}

/* Profile Popup Styles */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  background: transparent;
}

.profile-popup {
  position: fixed;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid #e0e0e0;
  min-width: 220px;
  overflow: hidden;
  animation: popupSlideIn 0.2s ease-out;
}

@keyframes popupSlideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.popup-arrow {
  position: absolute;
  top: -8px;
  right: 20px;
  width: 16px;
  height: 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-bottom: none;
  border-right: none;
  transform: rotate(45deg);
  z-index: 1;
}

.popup-content {
  position: relative;
  z-index: 2;
  background: white;
  border-radius: 12px;
}

.profile-info {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.profile-info:hover {
  background-color: #f8f9fa;
}

.profile-icon {
  margin-right: 12px;
  color: #666;
}

.profile-details {
  flex: 1;
}

.profile-name {
  font-weight: 500;
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}

.profile-role {
  font-size: 12px;
  color: #666;
}

.popup-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 0 12px;
}

.popup-item {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 14px;
  color: #333;
}

.popup-item:hover {
  background-color: #f8f9fa;
}

.popup-item:last-child:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

.popup-item:last-child .item-icon {
  color: #dc2626;
}

.item-icon {
  margin-right: 12px;
  color: #666;
  font-size: 18px;
}

/* Responsive Design */
@media (max-width: 960px) {
  .title-text {
    font-size: 20px;
  }

  .profile-popup {
    min-width: 200px;
  }
}

@media (max-width: 600px) {
  .title-text {
    font-size: 18px;
  }

  .profile-btn {
    margin-right: 8px;
  }

  .profile-popup {
    min-width: 180px;
    right: 8px !important;
  }

  .popup-arrow {
    right: 16px;
  }
}
</style>
