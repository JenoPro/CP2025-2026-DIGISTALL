export default {
  name: "VendorSearchFilter",
  emits: ["search", "filter"],
  data() {
    return {
      searchQuery: "",
      showFilterPanel: false,
      filters: {
        status: null,
        location: "",
        dateFrom: "",
        dateTo: "",
      },
      statusOptions: [
        { title: "Pending", value: "pending" },
        { title: "Approved", value: "approved" },
        { title: "Rejected", value: "rejected" },
        { title: "Under Review", value: "under_review" },
      ],
    };
  },
  methods: {
    onSearchInput() {
      this.$emit("search", this.searchQuery);
    },
    toggleFilter() {
      this.showFilterPanel = !this.showFilterPanel;
    },
    applyFilters() {
      this.$emit("filter", { ...this.filters });
      this.showFilterPanel = false;
    },
    clearFilters() {
      this.filters = {
        status: null,
        location: "",
        dateFrom: "",
        dateTo: "",
      };
      this.$emit("filter", null);
    },
  },
};