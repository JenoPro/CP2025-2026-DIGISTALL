export default {
  name: 'ComplaintsSearch',
  data() {
    return {
      searchQuery: '',
      activeFilter: 'all',
      showFilterPanel: false,
      searchTimeout: null,
    }
  },
  computed: {
    hasActiveFilters() {
      return this.activeFilter !== 'all' || this.searchQuery.trim() !== '';
    }
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleOutsideClick);
    document.addEventListener('keydown', this.handleKeyDown);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
    document.removeEventListener('keydown', this.handleKeyDown);

    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', {
        query: this.searchQuery.trim(),
        filter: this.activeFilter,
      });
    },

    setFilter(filter) {
      this.activeFilter = filter;
      this.handleSearch();
    },

    clearSearch() {
      this.searchQuery = '';
      this.handleSearch();
    },

    clearAllFilters() {
      this.searchQuery = '';
      this.activeFilter = 'all';
      this.handleSearch();
      this.showFilterPanel = false;
    },

    toggleFilter() {
      this.showFilterPanel = !this.showFilterPanel;
    },

    applyFilters() {
      this.handleSearch();
      this.showFilterPanel = false;
    },

    handleOutsideClick(event) {
      if (this.$refs.filterContainer && !this.$refs.filterContainer.contains(event.target)) {
        this.showFilterPanel = false;
      }
    },

    handleKeyDown(event) {
      // Close on Escape key
      if (event.key === 'Escape' && this.showFilterPanel) {
        this.showFilterPanel = false;
      }
    },

    debouncedSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      this.searchTimeout = setTimeout(() => {
        this.handleSearch();
      }, 300);
    }
  },

  watch: {
    searchQuery() {
      // Debounce search to avoid too many API calls
      this.debouncedSearch();
    },
  },
};


