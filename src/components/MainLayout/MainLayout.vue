<template>
  <v-app>
    <AppSidebar :items="menuItems" @menu-item-click="handleMenuItemClick" />

    <AppHeader
      :title="pageTitle"
      @notification-click="handleNotificationClick"
      @profile-click="handleProfileClick"
      @settings-click="handleSettingsClick"
      @logout-click="handleLogoutClick"
    />

    <v-main class="main-content-wrapper">
      <v-container fluid class="main-content">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppHeader from "../AppHeader/AppHeader.vue";
import AppSidebar from "../AppSidebar/AppSidebar.vue";

export default {
  name: "MainLayout",
  components: { AppSidebar, AppHeader },
  data() {
    return {
      pageTitle: "Dashboard",
      // Base menu items - will be updated based on user type
      menuItems: [],
      // Define menu items for different user types
      adminMenuItems: [
        { id: 1, icon: "mdi-view-dashboard", name: "Dashboard", route: "/dashboard" },
        { id: 2, icon: "mdi-credit-card", name: "Payment", route: "/payment" },
        { id: 3, icon: "mdi-domain", name: "Branch", route: "/branch" },
      ],
      branchManagerMenuItems: [
        { id: 1, icon: "mdi-view-dashboard", name: "Dashboard", route: "/dashboard" },
        { id: 2, icon: "mdi-credit-card", name: "Payment", route: "/payment" },
        { id: 3, icon: "mdi-account-group", name: "Applicants", route: "/applicants" },
        { id: 4, icon: "mdi-chart-line", name: "Complaints", route: "/complaints" },
        { id: 5, icon: "mdi-shield-check", name: "Compliances", route: "/compliances" },
      ],
      // Define all possible menu routes including "more items" (6-10)
      allMenuRoutes: {
        1: "/dashboard",
        2: "/payment",
        3: "/applicants", // For branch manager, will be /branch for admin
        4: "/complaints",
        5: "/compliances",
        6: "/vendors",
        7: "/stallholders",
        8: "/collectors",
        9: "/stalls",
      },
    };
  },
  mounted() {
    this.setMenuItemsBasedOnUserType();
  },
  watch: {
    // update header title on route change
    $route: {
      immediate: true,
      handler(to) {
        this.pageTitle = to.meta?.title || to.name || "Dashboard";
        // Also check if user type has changed and update menu items
        this.setMenuItemsBasedOnUserType();
      },
    },
  },
  methods: {
    setMenuItemsBasedOnUserType() {
      const userType = sessionStorage.getItem("userType");
      const currentUser = JSON.parse(sessionStorage.getItem("currentUser") || "{}");

      console.log("🔧 Setting menu items for user type:", userType);

      if (userType === "admin" || currentUser.userType === "admin") {
        this.menuItems = [...this.adminMenuItems];
        // Update routes for admin
        this.allMenuRoutes[3] = "/branch";
      } else {
        // Default to branch manager menu
        this.menuItems = [...this.branchManagerMenuItems];
        this.allMenuRoutes[3] = "/applicants";
      }
    },
    handleMenuItemClick(payload) {
      // Handle both main menu items (1-5) and more items (6-10)
      const itemId = typeof payload === "object" ? payload.id : payload;

      // First check if it's a main menu item with route property
      const mainItem = this.menuItems.find((i) => i.id === itemId);
      if (mainItem?.route) {
        this.$router.push(mainItem.route);
        return;
      }

      // If not found in main items, check the allMenuRoutes for items 6-10
      const route = this.allMenuRoutes[itemId];
      if (route) {
        console.log("Navigating to:", route);
        this.$router.push(route);
      } else {
        console.warn("No route found for menu item ID:", itemId);
      }
    },
    handleNotificationClick() {
      console.log("Notification clicked");
    },
    handleProfileClick() {
      console.log("Profile clicked");
    },
    handleSettingsClick() {
      console.log("Settings clicked");
    },
    handleLogoutClick() {
      console.log("Logout clicked");
      // Clear authentication data
      sessionStorage.removeItem("currentUser");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("userType");
      sessionStorage.removeItem("branchManagerId");
      sessionStorage.removeItem("adminId");

      // Redirect to login page
      this.$router.push("/").catch(() => {
        window.location.href = "/";
      });
    },
  },
};
</script>

<style scoped>
/* Main Layout - Clean and Simple */
.v-application {
  background-color: #fafafa !important;
}

.main-content-wrapper {
  margin-left: 80px; /* Space for sidebar */
  margin-top: 80px; /* Space for header */
  transition: margin-left 0.3s ease;
  background-color: #fafafa;
  min-height: calc(100vh - 80px);
}

.main-content {
  padding: 24px;
  background-color: transparent;
  min-height: calc(100vh - 80px);
}

/* Custom scrollbar for content */
.main-content::-webkit-scrollbar {
  width: 6px;
}

.main-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.main-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .main-content-wrapper {
    margin-left: 60px;
  }
  .main-content {
    padding: 16px;
  }
}

@media (max-width: 600px) {
  .main-content-wrapper {
    margin-left: 50px;
  }
  .main-content {
    padding: 12px;
  }
}

/* Remove any v-main padding conflicts */
.v-main {
  padding: 0 !important;
}

.v-main__wrap {
  padding: 0 !important;
}

/* Ensure proper layering */
.v-app-bar {
  z-index: 1300 !important;
}
</style>
