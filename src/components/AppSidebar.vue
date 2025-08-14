<!-- components/AppSidebar.vue -->
<template>
  <div>
    <!-- Collapsed Sidebar -->
    <v-navigation-drawer
      fixed
      permanent
      :width="isExpanded ? 250 : 80"
      class="sidebar"
      @mouseenter="isExpanded = true"
      @mouseleave="isExpanded = false"
    >
      <!-- Logo Section -->
      <div class="logo-section" @click="toggleSidebar">
        <div class="logo-container">
          <img src="../assets/food-stand.png" alt="Logo" class="logo-icon" />
          <div v-if="isExpanded" class="logo-text">
            <h3>Naga Stall</h3>
          </div>
        </div>
      </div>

      <v-divider class="my-2"></v-divider>

      <!-- Activity Section -->
      <div v-if="isExpanded" class="section-title">Activity</div>

      <!-- Menu Items -->
      <v-list class="pa-0">
        <v-list-item
          v-for="item in menuItems"
          :key="item.id"
          class="sidebar-item"
          :class="{ active: item.active, collapsed: !isExpanded }"
          @click="setActiveItem(item.id)"
        >
          <v-tooltip right :disabled="isExpanded">
            <template v-slot:activator="{ on, attrs }">
              <div class="item-container" v-bind="attrs" v-on="on">
                <v-list-item-icon class="sidebar-icon">
                  <v-icon :color="item.active ? 'white' : 'dark'">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content v-if="isExpanded">
                  <v-list-item-title class="sidebar-text">{{
                    item.name
                  }}</v-list-item-title>
                </v-list-item-content>
              </div>
            </template>
            <span>{{ item.name }}</span>
          </v-tooltip>
        </v-list-item>

        <!-- More Section -->
        <v-list-item
          v-if="isExpanded"
          class="sidebar-item more-item"
          :class="{ active: showMoreItems }"
          @click="toggleMoreItems"
        >
          <div class="item-container">
            <v-list-item-icon class="sidebar-icon">
              <v-icon
                :class="{ 'rotate-180': showMoreItems }"
                :color="showMoreItems ? 'white' : 'dark'"
              >
                mdi-chevron-down
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="sidebar-text">{{
                showMoreItems ? "Less" : "More"
              }}</v-list-item-title>
            </v-list-item-content>
          </div>
        </v-list-item>

        <!-- Additional Items (when More is expanded) -->
        <div v-if="isExpanded && showMoreItems" class="more-items">
          <v-list-item
            v-for="item in moreItems"
            :key="item.id"
            class="sidebar-item sub-item"
            :class="{ active: item.active }"
            @click="setActiveItem(item.id)"
          >
            <div class="item-container">
              <v-list-item-icon class="sidebar-icon">
                <v-icon :color="item.active ? 'white' : 'dark'">{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="sidebar-text">{{
                  item.name
                }}</v-list-item-title>
              </v-list-item-content>
            </div>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "AppSidebar",
  props: {
    items: {
      type: Array,
      default: () => [
        { id: 1, icon: "mdi-view-dashboard", name: "Dashboard", active: true },
        { id: 2, icon: "mdi-credit-card", name: "Payments", active: false },
        { id: 3, icon: "mdi-account-plus", name: "Applicants", active: false },
        { id: 4, icon: "mdi-chart-line", name: "Complaints", active: false },
        { id: 5, icon: "mdi-clipboard-check", name: "Compliances", active: false },
      ],
    },
  },
  data() {
    return {
      menuItems: [...this.items],
      isExpanded: false,
      showMoreItems: false,
      moreItems: [
        { id: 6, icon: "mdi-account-group", name: "Vendors", active: false },
        { id: 7, icon: "mdi-account-multiple", name: "Stallholders", active: false },
        { id: 8, icon: "mdi-account-cash", name: "Collectors", active: false },
        { id: 9, icon: "mdi-store", name: "Stalls", active: false },
      ],
    };
  },
  watch: {
    items: {
      handler(newItems) {
        this.menuItems = [...newItems];
      },
      deep: true,
    },
  },
  methods: {
    toggleSidebar() {
      this.isExpanded = !this.isExpanded;
      if (!this.isExpanded) {
        this.showMoreItems = false;
      }
    },

    toggleMoreItems() {
      this.showMoreItems = !this.showMoreItems;
    },

    setActiveItem(itemId) {
      // Set all main items to inactive
      this.menuItems.forEach((item) => {
        item.active = false;
      });

      // Set all more items to inactive
      this.moreItems.forEach((item) => {
        item.active = false;
      });

      // Set clicked item to active (check both main and more items)
      const selectedMainItem = this.menuItems.find((item) => item.id === itemId);
      const selectedMoreItem = this.moreItems.find((item) => item.id === itemId);

      if (selectedMainItem) {
        selectedMainItem.active = true;
        // Close more items if a main item is selected
        this.showMoreItems = false;
      } else if (selectedMoreItem) {
        selectedMoreItem.active = true;
      }

      // Emit the navigation event to parent
      this.$emit("menu-item-click", itemId);
      this.handleNavigation(itemId);
    },

    handleNavigation(itemId) {
      // Add your routing logic here based on the selected menu item
      const routes = {
        1: "/dashboard",
        2: "/payments",
        3: "/applicants",
        4: "/Complaints",
        5: "/compliances",
        6: "/vendors",
        7: "/stallholders",
        8: "/collectors",
        9: "/stalls",
      };

      console.log("Navigating to:", routes[itemId] || "/dashboard");
      // this.$router.push(routes[itemId] || '/dashboard');
    },
  },
};
</script>

<style scoped>
/* Sidebar Styles - HIGHEST Z-INDEX */
.sidebar {
  background-color: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  width: 80px;
  transition: width 0.3s ease;
  z-index: 99999 !important; /* Highest z-index - above everything including header */
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Logo Section */
.logo-section {
  padding: 16px;
  cursor: pointer;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.logo-text {
  margin-left: 12px;
}

.logo-text h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
  font-family: "Poppins", sans-serif;
}

/* Section Title */
.section-title {
  padding: 16px 20px 8px;
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Menu Items */
.sidebar .v-list {
  padding-top: 8px;
}

.sidebar-item {
  margin: 4px 16px;
  border-radius: 8px;
  min-height: 48px !important;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.sidebar-item.collapsed {
  margin: 4px 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 56px;
  padding: 0 !important;
}

.item-container {
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: row;
}

.sidebar-item.collapsed .item-container {
  justify-content: center;
  width: 48px;
  height: 48px;
}

.sidebar-item:hover {
  background-color: #e8e8e8;
}

.sidebar-item.active {
  background-color: #1565c0 !important;
  color: white;
}

.sidebar-item.active:hover {
  background-color: #1976d2 !important;
}

.sidebar-icon {
  margin-right: 16px !important;
  margin-left: 8px !important;
  min-width: 24px !important;
  flex-shrink: 0;
}

.sidebar-item.collapsed .sidebar-icon {
  margin: 0 !important;
  min-width: 24px !important;
}

.sidebar-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-item.active .sidebar-text {
  color: white;
}

/* More Items Styling */
.more-item {
  margin-top: 8px;
}

.more-item .item-container {
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: row;
}

.more-item.active {
  background-color: #1565c0 !important;
}

.more-item.active .sidebar-text {
  color: white;
}

.more-items {
  margin-top: 4px;
}

.sub-item {
  margin: 2px 16px;
  padding-left: 16px !important;
}

.sub-item .item-container {
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: row;
}

.sub-item .sidebar-icon {
  margin-right: 16px !important;
  margin-left: 8px !important;
  min-width: 24px !important;
  flex-shrink: 0;
}

.sub-item .sidebar-text {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sub-item.active .sidebar-text {
  color: white;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

/* Responsive Design */
@media (max-width: 960px) {
  .sidebar {
    width: 60px !important;
  }

  .sidebar-item.collapsed {
    width: 44px;
    margin: 4px 8px;
  }

  .sidebar-item.collapsed .item-container {
    width: 44px;
    height: 44px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
  }

  .sidebar-item {
    min-height: 44px !important;
  }
}

@media (max-width: 600px) {
  .sidebar {
    width: 50px !important;
  }

  .sidebar-item.collapsed {
    width: 38px;
    margin: 4px 6px;
  }

  .sidebar-item.collapsed .item-container {
    width: 38px;
    height: 38px;
  }

  .logo-icon {
    width: 28px;
    height: 28px;
  }
}

/* Tooltip Styling */
.v-tooltip .v-overlay__content {
  background: rgba(0, 0, 0, 0.8) !important;
  color: white !important;
  font-size: 12px !important;
  padding: 8px 12px !important;
  border-radius: 4px !important;
  margin-left: 8px !important;
}

/* Animation for smooth transitions */
.sidebar-item {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Focus styles for accessibility */
.sidebar-item:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

/* Vuetify overrides to ensure proper layout */
.sidebar .v-list-item__content {
  flex: 1 1 auto;
  overflow: hidden;
}

.sidebar .v-list-item__icon {
  align-self: center;
  color: inherit;
  display: inline-flex;
  min-width: 24px;
  justify-content: flex-start;
  margin-right: 16px;
}
</style>
