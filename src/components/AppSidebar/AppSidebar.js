export default {
  name: "AppSidebar",
  props: {
    items: {
      type: Array,
      default: () => [
        { id: 1, icon: "mdi-view-dashboard", name: "Dashboard", route: "/dashboard" },
        { id: 2, icon: "mdi-credit-card", name: "Payments", route: "/payments" },
        { id: 3, icon: "mdi-account-plus", name: "Applicants", route: "/applicants" },
        { id: 4, icon: "mdi-chart-line", name: "Complaints", route: "/complaints" },
        {
          id: 5,
          icon: "mdi-clipboard-check",
          name: "Compliances",
          route: "/compliances",
        },
      ],
    },
  },
  data() {
    return {
      menuItems: [...this.items],
      isExpanded: false,
      showMoreItems: false,
      moreItems: [
        { id: 6, icon: "mdi-account-group", name: "Vendors", route: "/vendors" },
        {
          id: 7,
          icon: "mdi-account-multiple",
          name: "Stallholders",
          route: "/stallholders",
        },
        { id: 8, icon: "mdi-account-cash", name: "Collectors", route: "/collectors" },
        { id: 9, icon: "mdi-store", name: "Stalls", route: "/stalls" },
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
    // Watch for route changes to update active state
    $route: {
      handler() {
        this.updateActiveStates();
      },
      immediate: true,
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

    setActiveItem(itemId, route) {
      // Navigate to the route
      if (route && this.$route.path !== route) {
        this.$router.push(route).catch((err) => {
          // Handle navigation errors (e.g., navigating to same route)
          console.log("Navigation handled:", err.message);
        });
      }

      // Close more items if a main item is selected
      const isMainItem = this.menuItems.find((item) => item.id === itemId);
      if (isMainItem) {
        this.showMoreItems = false;
      }

      // Emit the navigation event to parent
      this.$emit("menu-item-click", itemId, route);
    },

    // Check if the current route matches the item route
    isActiveRoute(route) {
      return this.$route.path === route;
    },

    // Update active states based on current route
    updateActiveStates() {
      // This method is called when route changes
      // The active state is now determined by isActiveRoute method
      // which compares current route with item route
    },
  },
};