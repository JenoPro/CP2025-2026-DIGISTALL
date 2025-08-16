export default {
  name: 'SearchStall',
  data() {
    return {
      searchQuery: '',
      activeFilter: 'all',
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', {
        query: this.searchQuery,
        filter: this.activeFilter,
      })
    },

    setFilter(filter) {
      this.activeFilter = filter
      this.handleSearch()
    },

    clearSearch() {
      this.searchQuery = ''
      this.activeFilter = 'all'
      this.handleSearch()
    },
  },

  watch: {
    searchQuery() {
      // Debounce search to avoid too many API calls
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      this.searchTimeout = setTimeout(() => {
        this.handleSearch()
      }, 300)
    },
  },

  beforeDestroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  },
}
