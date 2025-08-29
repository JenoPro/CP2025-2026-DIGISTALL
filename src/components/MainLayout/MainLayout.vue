<template>
  <v-app>
    <AppSidebar :items="menuItems" @menu-item-click="handleMenuItemClick" />

    <div class="main-wrapper">
      <AppHeader
        :title="pageTitle"
        @notification-click="handleNotificationClick"
        @profile-click="handleProfileClick"
        @settings-click="handleSettingsClick"
        @logout-click="handleLogoutClick"
      />

      <v-main>
        <v-container fluid class="main-content">
          <router-view />
        </v-container>
      </v-main>
    </div>
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
      // give each item a route so clicks can navigate
      menuItems: [
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
        3: "/applicants",
        4: "/complaints",
        5: "/compliances",
        6: "/vendors",
        7: "/stallholders",
        8: "/collectors",
        9: "/stalls",
      },
    };
  },
  watch: {
    // update header title on route change
    $route: {
      immediate: true,
      handler(to) {
        this.pageTitle = to.meta?.title || to.name || "Dashboard";
      },
    },
  },
  methods: {
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
    },
  },
};
</script>

<style scoped>
.v-main {
  padding-left: 0 !important;
}
.main-wrapper {
  margin-left: 80px;
  transition: none;
  min-height: 100vh;
}
.main-content {
  background-color: #fafafa;
  min-height: calc(100vh - 64px);
  padding: 24px;
}
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
@media (max-width: 960px) {
  .main-wrapper {
    margin-left: 60px;
  }
  .main-content {
    padding: 16px;
  }
}
@media (max-width: 600px) {
  .main-wrapper {
    margin-left: 50px;
  }
}
</style>
